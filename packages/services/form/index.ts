import db, { and, asc, desc, eq, formFields, forms, isNull, users } from "@repo/database";
import {
    CreateFormInputModel,
    FilterFormsProps,
    GetAllFormsByCreatorIdProps,
    GetFormByIdProps,
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

    public async getAllFormsByCreatorId(payload: GetAllFormsByCreatorIdProps) {
        const { creatorId, pageSize = 10, page = 1 } = payload;

        const isAdmin = await this.isAdmin(creatorId);

        const condition = !isAdmin
            ? and(eq(forms.creatorId, creatorId), isNull(forms.deletedAt))
            : isNull(forms.deletedAt);

        const orderBy = desc(forms.updatedAt);
        const limit = pageSize;
        const offset = (page - 1) * pageSize;

        const result = await db.query.forms.findMany({
            where: condition,
            orderBy,
            limit,
            offset,
        });

        const totalCount = await db.$count(forms, condition)

        const totalPages = Math.ceil(totalCount / pageSize);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            forms: result,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPrevPage,
        };
    }

    public async filterForms(payload: FilterFormsProps) {
        const { creatorId, status, page = 1, pageSize = 10 } = payload;

        const isAdmin = await this.isAdmin(creatorId);

        const condition = !isAdmin
            ? and(eq(forms.creatorId, creatorId), eq(forms.status, status), isNull(forms.deletedAt))
            : and(eq(forms.status, status), isNull(forms.deletedAt));

        const orderBy = desc(forms.updatedAt);
        const limit = pageSize;
        const offset = (page - 1) * pageSize;

        const result = await db.query.forms.findMany({
            where: condition,
            orderBy,
            limit,
            offset,
        });

        const totalCount = await db.$count(forms, condition);

        const totalPages = Math.ceil(totalCount / pageSize);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            forms: result,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPrevPage,
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
