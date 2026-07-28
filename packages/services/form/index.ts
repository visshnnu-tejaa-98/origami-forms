import db, {
    and,
    asc,
    desc,
    eq,
    formFields,
    forms,
    ilike,
    isNull,
    lte,
    users,
} from "@repo/database";
import {
    CreateFormInputModel,
    GetFormByIdProps,
    listFormsOutputSchema,
    ListFormsOutputSchemaType,
    ListFormsProps,
    UpdateFormStatusInputProps,
} from "./model";
import {
    ADMIN,
    CHECK_BOX,
    DRAFT,
    MULTI_SELECT,
    PUBLISHED,
    RADIO,
    SINGLE_SELECT,
} from "@repo/database/constants";
import crypto from "node:crypto";

export function slugify(input: string): string {
    const cleanSlug = input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const suffix = crypto.randomBytes(6).toString("hex");

    return `${cleanSlug}-${suffix}`;
}

function generateLabelKey() {
    return crypto.randomUUID();
}

export default class FormService {
    private async isAdmin(userId: string) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                role: true,
            },
        });

        if (!user) throw new Error("User not found");

        return user.role === ADMIN;
    }

    public async createForm(creatorId: string, formData: CreateFormInputModel) {
        return db.transaction(async (tx) => {
            const [form] = await tx
                .insert(forms)
                .values({
                    creatorId,
                    title: formData.title,
                    description: formData.description,
                    logoUrl: formData.logoUrl,
                    slug: slugify(formData.title),
                    visibility: formData.visibility,
                    maxSubmissions: formData.maxSubmissions,
                })
                .returning();

            if (!form) {
                return tx.rollback();
            }

            const fieldValues = formData.fields.map((field) => {
                const uniqueLabelKey = generateLabelKey();

                const row: typeof formFields.$inferInsert = {
                    formId: form.id,
                    type: field.type,
                    label: field.label,
                    placeholder: field.placeholder,
                    description: field.description,
                    helpText: field.helpText,
                    required: field.required,
                    order: field.order,
                    labelKey: uniqueLabelKey,
                    validation: field.validation ?? {},
                };

                const selectTypeFields = [SINGLE_SELECT, MULTI_SELECT, RADIO, CHECK_BOX];

                if (selectTypeFields.includes(field.type) && "options" in field) {
                    row.options = field.options as {};
                }

                if ("defaultValue" in field && field.defaultValue !== undefined) {
                    row.defaultValue = field.defaultValue as string;
                }

                return row;
            });

            const fieldRows = await tx.insert(formFields).values(fieldValues).returning();
            return { form, fields: fieldRows };
        });
    }

    public async getFormById(payload: GetFormByIdProps) {
        const { formId, creatorId } = payload;

        const isAdmin = await this.isAdmin(creatorId);

        const condition = !isAdmin
            ? and(eq(forms.id, formId), eq(forms.creatorId, creatorId), isNull(forms.deletedAt))
            : and(eq(forms.id, formId), isNull(forms.deletedAt));

        return await db.query.forms.findFirst({
            where: condition,
            with: {
                fields: {
                    where: isNull(formFields.deletedAt),
                    orderBy: asc(formFields.order),
                },
            },
        });
    }

    public async listForms(payload: ListFormsProps) {
        const {
            creatorId,
            search,
            status,
            visibility,
            maxSubmissions,
            sortBy,
            sortOrder,
            page,
            pageSize,
        } = payload;

        const isAdmin = await this.isAdmin(creatorId);

        const conditions = [isNull(forms.deletedAt)];

        if (!isAdmin) conditions.push(eq(forms.creatorId, creatorId));

        if (search) conditions.push(ilike(forms.title, `%${search}%`));

        if (status) conditions.push(eq(forms.status, status));

        if (visibility) conditions.push(eq(forms.visibility, visibility));

        if (maxSubmissions !== undefined) conditions.push(lte(forms.submissionCount, maxSubmissions));
        const condition = and(...conditions);

        const sortColumns = {
            createdAt: forms.createdAt,
            updatedAt: forms.updatedAt,
            title: forms.title,
            submissionCount: forms.submissionCount,
            maxSubmissions: forms.maxSubmissions,
            status: forms.status,
        } as const;
        const sortColumn = sortColumns[sortBy];
        const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

        const [rows, totalItems] = await Promise.all([
            db.query.forms.findMany({
                where: condition,
                orderBy,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            }),
            db.$count(forms, condition),
        ]);

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            forms: rows,
            page,
            pageSize,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }

    public async updateFormStatus(payload: UpdateFormStatusInputProps) {
        const { formId, creatorId, status } = payload;

        const form = await this.getFormById({ formId, creatorId });

        if (!form) throw new Error("Form not found");

        if (form.status === status)
            return {
                success: false,
                message: `Form already ${status}${status === DRAFT ? "ed" : ""}`,
            };

        if (status === PUBLISHED && form.status == DRAFT && form.submissionCount > 0) {
            return {
                success: false,
                message: "Cannot move published form to draft when there are submissions",
            }
        }

        const isAdmin = await this.isAdmin(creatorId);
        const condition = !isAdmin
            ? and(eq(forms.id, formId), eq(forms.creatorId, creatorId), isNull(forms.deletedAt))
            : and(eq(forms.id, formId), isNull(forms.deletedAt));

        await db.update(forms).set({ status }).where(condition);

        return {
            success: true,
            message: `Form updated to ${status}`,
        };
    }
}
