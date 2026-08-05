import db, {
    and,
    asc,
    desc,
    eq,
    formFields,
    forms,
    ilike,
    InsertFormField,
    isNull,
    lte,
} from "@repo/database";
import {
    CloneFormInputProps,
    CreateFormInputModel,
    DeleteFormFieldInputProps,
    DeleteFormProps,
    GetFormByIdProps,
    ListFormsProps,
    UpdateFormProps,
    UpSertFormFieldsInputProps,
} from "./model";
import {
    ADMIN,
    ARCHIVED,
    CHECK_BOX,
    DRAFT,
    MULTI_SELECT,
    PUBLISHED,
    RADIO,
    SINGLE_SELECT,
} from "@repo/database/constants";
import crypto from "node:crypto";
import UserService from "../user";

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

    private readonly userService = new UserService();

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
                    description: field.description,
                    order: field.order,
                    labelKey: uniqueLabelKey,
                    helpText: "helpText" in field ? field.helpText : undefined,
                    required: "required" in field ? field.required : false,
                    validation: ("validation" in field ? field.validation : undefined) ?? {},
                };

                const selectTypeFields = [SINGLE_SELECT, MULTI_SELECT, RADIO, CHECK_BOX];

                if (selectTypeFields.includes(field.type) && "options" in field) {
                    row.options = field.options as {};
                }

                if ("placeholder" in field && field.placeholder !== undefined) {
                    row.placeholder = field.placeholder;
                }

                if ("defaultValue" in field && field.defaultValue !== undefined) {
                    row.defaultValue = field.defaultValue as string;
                }

                return row;
            });

            const insertedFields = await tx.insert(formFields).values(fieldValues).returning();

            return {
                ...form,
                submissionCount: 0,
                fields: insertedFields,
            };
        });
    }

    public async getFormById(payload: GetFormByIdProps) {
        const { formId, requesterId } = payload;

        const isAdmin = await this.userService.isAdmin(requesterId);

        const condition = !isAdmin
            ? and(eq(forms.id, formId), eq(forms.creatorId, requesterId), isNull(forms.deletedAt))
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
            requesterId,
            search,
            status,
            visibility,
            maxSubmissions,
            sortBy,
            sortOrder,
            page,
            pageSize,
        } = payload;

        const isAdmin = await this.userService.isAdmin(requesterId);

        const conditions = [isNull(forms.deletedAt)];

        if (!isAdmin) conditions.push(eq(forms.creatorId, requesterId));

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
        console.log({ rows })

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

    public async updateForm(payload: UpdateFormProps) {
        const {
            formId,
            requesterId,
            title,
            description,
            logoUrl,
            status,
            visibility,
            maxSubmissions,
            expiresAt,
        } = payload;

        const form = await this.getFormById({ formId, requesterId });

        if (!form) throw new Error("Form not found");

        if (status && status !== form.status) {
            if (form.status === PUBLISHED && status === DRAFT && form.submissionCount > 0) {
                return {
                    success: false,
                    message: "Cannot move published form to draft when there are submissions",
                    formData: null,
                };
            }
        }

        const now = new Date();

        const updatedValues: Partial<typeof forms.$inferInsert> = {};

        if (title !== undefined) updatedValues.title = title;
        if (description !== undefined) updatedValues.description = description;
        if (logoUrl !== undefined) updatedValues.logoUrl = logoUrl;
        if (visibility !== undefined) updatedValues.visibility = visibility;
        if (maxSubmissions !== undefined) updatedValues.maxSubmissions = maxSubmissions;
        if (expiresAt !== undefined) updatedValues.expiresAt = expiresAt;

        if (status !== undefined && status !== form.status) {
            updatedValues.status = status;
            if (status === PUBLISHED && !form.publishedAt) updatedValues.publishedAt = now;
            if (status === ARCHIVED) updatedValues.archivedAt = now;
        }

        if (Object.keys(updatedValues).length === 0) {
            return {
                success: false,
                message: "No changes to update",
                formData: null,
            };
        }

        const isAdmin = await this.userService.isAdmin(requesterId);
        const condition = !isAdmin
            ? and(eq(forms.id, formId), eq(forms.creatorId, requesterId), isNull(forms.deletedAt))
            : and(eq(forms.id, formId), isNull(forms.deletedAt));

        const [updatedForm] = await db.update(forms).set(updatedValues).where(condition).returning();

        if (!updatedForm) throw new Error("Failed to update form");

        return {
            success: true,
            message: "Form updated successfully",
            formData: {
                formId: updatedForm.id,
                creatorId: updatedForm.creatorId,
                title: updatedForm.title,
                description: updatedForm.description,
                logoUrl: updatedForm.logoUrl,
                slug: updatedForm.slug,
                status: updatedForm.status,
                visibility: updatedForm.visibility,
                maxSubmissions: updatedForm.maxSubmissions,
                expiresAt: updatedForm.expiresAt,
            },
        };
    }

    public async deleteForm(payload: DeleteFormProps) {
        const { requesterId, formId } = payload;

        const form = await this.getFormById({ formId, requesterId });

        if (!form) throw new Error("Form not found");

        if (form.status === PUBLISHED && form.submissionCount > 0) {
            return {
                success: false,
                message: "Cannot delete published form when there are submissions",
            };
        }

        await db.transaction(async (tx) => {
            const now = new Date();
            const deleted = await tx
                .update(forms)
                .set({ deletedAt: now })
                .where(eq(forms.id, formId))
                .returning({ id: forms.id });
            if (deleted.length === 0) {
                return tx.rollback();
            }
            await tx
                .update(formFields)
                .set({ deletedAt: now })
                .where(and(eq(formFields.formId, formId), isNull(formFields.deletedAt)));
        });

        return {
            success: true,
            message: "Form deleted successfully",
        };
    }

    public async cloneForm(payload: CloneFormInputProps) {
        const { formId, requesterId } = payload;

        const form = await this.getFormById({ formId, requesterId });

        if (!form) throw new Error("Form not found");

        const isAdmin = await this.userService.isAdmin(requesterId);

        if (!isAdmin && form.creatorId !== requesterId)
            throw new Error("You are not authorized to clone this form");

        const clonedFormTitle = `${form.title} - cloned from ${form.id}`;

        const formFields = form.fields.map((field) => {
            const uniqueLabelKey = generateLabelKey();
            return {
                type: field.type,
                label: field.label,
                placeholder: field.placeholder,
                description: field.description,
                helpText: field.helpText,
                required: field.required,
                order: field.order,
                labelKey: uniqueLabelKey,
                validation: field.validation,
                options: field.options,
                defaultValue: field.defaultValue,
            };
        });

        const formData = {
            creatorId: requesterId,
            title: clonedFormTitle,
            description: form.description,
            logoUrl: form.logoUrl,
            visibility: form.visibility,
            slug: slugify(clonedFormTitle),
            maxSubmissions: form.maxSubmissions,
            fields: formFields,
        } as CreateFormInputModel;

        return await this.createForm(requesterId, formData);
    }

    public async upsertFormField(payload: UpSertFormFieldsInputProps) {
        const {
            id,
            formId,
            requesterId,
            type,
            label,
            description,
            placeholder,
            helpText,
            required,
            order,
            validation,
            options,
            defaultValue,
        } = payload;

        const form = await this.getFormById({ formId, requesterId });

        if (!form) throw new Error("Form not found");

        const labelKey = generateLabelKey();

        if (id) {
            const updates: Partial<typeof formFields.$inferInsert> = {};
            if (formId !== undefined) updates.formId = formId;
            if (type !== undefined) updates.type = type;
            if (label !== undefined) updates.label = label;
            if (description !== undefined) updates.description = description;
            if (placeholder !== undefined) updates.placeholder = placeholder;
            if (helpText !== undefined) updates.helpText = helpText;
            if (required !== undefined) updates.required = required;
            if (order !== undefined) updates.order = order;
            if (validation !== undefined) updates.validation = validation;
            if (options !== undefined) updates.options = options;
            if (defaultValue !== undefined) updates.defaultValue = defaultValue;
            if (labelKey !== undefined) updates.labelKey = labelKey;

            const [formField] = await db
                .update(formFields)
                .set(updates)
                .where(and(eq(formFields.id, id), eq(formFields.formId, formId)))
                .returning();

            return { success: true, message: "Form field updated successfully", fieldData: formField };
        }

        if (type === undefined || label === undefined || order === undefined) {
            throw new Error("type, label and order are required to create a form field");
        }

        const values: InsertFormField = {
            formId,
            type,
            label,
            description,
            placeholder,
            helpText,
            required,
            order,
            validation,
            options,
            defaultValue,
            labelKey: generateLabelKey(),
        };

        const [formField] = await db.insert(formFields).values(values).returning();
        return { success: true, message: "Form field created successfully", fieldData: formField };
    }

    public async deleteFormField(payload: DeleteFormFieldInputProps) {
        const { id, requesterId } = payload;

        const field = await db.query.formFields.findFirst({
            where: and(eq(formFields.id, id), isNull(formFields.deletedAt)),
        });

        if (!field) throw new Error("Form field not found");

        const form = await this.getFormById({ formId: field.formId, requesterId });

        if (!form) throw new Error("You are not authorized to delete this form field");

        const [deleted] = await db
            .update(formFields)
            .set({ deletedAt: new Date() })
            .where(and(eq(formFields.id, id), isNull(formFields.deletedAt)))
            .returning({ id: formFields.id });

        if (!deleted) throw new Error("Failed to delete form field");

        return { success: true, message: "Form field deleted successfully" };
    }
}

// const formService = new FormService();

// formService.getFormById({
//     formId: "c8b007a6-6b00-4530-8b95-f88ba017dae6",
//     requesterId: "1f93d930-8e07-4154-93a3-ed380302570e",
// }).then(data => console.log(data)).catch(err => console.log(err))