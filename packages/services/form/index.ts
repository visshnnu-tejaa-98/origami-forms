import db, { and, asc, desc, eq, formFields, forms, isNull } from "@repo/database";
import { CreateFormInputModel, GetAllFormsByCreatorIdProps, GetFormByIdOutputSchemaType, GetFormByIdProps } from "./model";
import { ADMIN, CHECK_BOX, MULTI_SELECT, RADIO, SINGLE_SELECT } from "@repo/database/constants";
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

            const fieldValues = formData.fields.map((field, i) => {
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

    public async getFormById(props: GetFormByIdProps) {
        const { formId } = props;

        return await db.query.forms.findFirst({
            where: and(eq(forms.id, formId), isNull(forms.deletedAt)),
            with: {
                fields: {
                    where: isNull(formFields.deletedAt),
                    orderBy: asc(formFields.order),
                },
            },
        });
    }

    public async getAllFormsByCreatorId(props: GetAllFormsByCreatorIdProps) {
        const { creatorId, role, limit = 10, offset = 0 } = props;

        const condition =
            role !== ADMIN
                ? and(eq(forms.creatorId, creatorId), isNull(forms.deletedAt))
                : isNull(forms.deletedAt);

        return await db.query.forms.findMany({
            where: condition,
            with: {
                fields: {
                    where: isNull(formFields.deletedAt),
                    orderBy: asc(formFields.order),
                },
            },
            orderBy: desc(forms.createdAt),
            limit,
            offset,
        });
    }
}
