import db, { formFields, forms } from "@repo/database";
import { CreateFormInputModel } from "./model";
import { CHECK_BOX, MULTI_SELECT, RADIO, SINGLE_SELECT } from "@repo/database/constants";
import crypto from "node:crypto"


export function slugify(input: string): string {
    const cleanSlug = input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const suffix = crypto.randomBytes(6).toString('hex');

    return `${cleanSlug}-${suffix}`;
}

function generateLabelKey() {
    return crypto.randomUUID()
}

export default class FormService {
    public async createForm(creatorId: string, formData: CreateFormInputModel) {
        return db.transaction(async (tx) => {
            const [form] = await tx.insert(forms).values({
                creatorId,
                title: formData.title,
                description: formData.description,
                logoUrl: formData.logoUrl,
                slug: slugify(formData.title),
                visibility: formData.visibility,
                maxSubmissions: formData.maxSubmissions,
            }).returning()

            if (!form) {
                return tx.rollback()
            }


            const fieldValues = formData.fields.map((field, i) => {
                const uniqueLabelKey = generateLabelKey()

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
                }

                const selectTypeFields = [SINGLE_SELECT, MULTI_SELECT, RADIO, CHECK_BOX]

                if (selectTypeFields.includes(field.type) && "options" in field) {
                    row.options = field.options as {}
                }

                if ("defaultValue" in field && field.defaultValue !== undefined) {
                    row.defaultValue = field.defaultValue as string
                }

                return row

            })

            const fieldRows = await tx.insert(formFields).values(fieldValues).returning()
            return { form, fields: fieldRows }
        })
    }
}