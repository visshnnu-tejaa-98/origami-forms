import db, {
    and,
    asc,
    count,
    desc,
    eq,
    ilike,
    inArray,
    InsertTemplateField,
    isNull,
    likes,
    templateFields,
    templates,
} from "@repo/database";
import UserService from "../user";
import {
    CreateTemplateInputModel,
    DeleteTemplateProps,
    GetTemplateByIdProps,
    ListTemplatesProps,
    UpdateTemplateInputSchema,
} from "./model";
import FormService, { generateLabelKey, slugify } from "../form";
import {
    ARCHIVED,
    CHECK_BOX,
    DRAFT,
    MULTI_SELECT,
    PUBLISHED,
    RADIO,
    SINGLE_SELECT,
} from "@repo/database/constants";

export default class TemplateService {
    private readonly userService = new UserService();

    private formService = new FormService();

    public async createTemplate(templateData: CreateTemplateInputModel) {
        return db.transaction(async (tx) => {
            const [template] = await tx
                .insert(templates)
                .values({
                    creatorId: templateData.creatorId,
                    title: templateData.title,
                    description: templateData.description,
                    logoUrl: templateData.logoUrl,
                    slug: slugify(templateData.title),
                    status: templateData.status ?? DRAFT,
                    publishedAt: templateData.status === PUBLISHED ? new Date() : null,
                })
                .returning();

            if (!template) {
                return tx.rollback();
            }

            // the array's position is the ordering — the client's `order` is a second
            // copy of that fact and can disagree with it
            const fieldValues = templateData.fields.map((field, index) => ({
                ...this.formService.buildFieldRow(field, template.id, index),
                templateId: template.id,
                labelKey: generateLabelKey(),
            }));

            const insertedFields = await tx.insert(templateFields).values(fieldValues).returning();

            return {
                ...template,
                fields: insertedFields,
            };
        });
    }

    public async listTemplates(payload: ListTemplatesProps) {
        const { requesterId, search, status, sortBy, sortOrder, page, pageSize } = payload;

        const isAdmin = await this.userService.isAdmin(requesterId);

        const conditions = [isNull(templates.deletedAt)];

        if (!isAdmin) conditions.push(eq(templates.creatorId, requesterId));

        if (search) conditions.push(ilike(templates.title, `%${search}%`));

        if (status) {
            switch (status) {
                case "published":
                    conditions.push(eq(templates.status, "published"));
                    break;

                case "draft":
                case "archived":
                    conditions.push(eq(templates.status, status));
                    break;

                default:
                    break;
            }
        }

        const condition = and(...conditions);

        const sortColumns = {
            createdAt: templates.createdAt,
            updatedAt: templates.updatedAt,
            title: templates.title,
            status: templates.status,
        } as const;

        const sortColumn = sortColumns[sortBy];
        const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

        const [rows, totalItems] = await Promise.all([
            db.query.templates.findMany({
                where: condition,
                orderBy,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            }),
            db.$count(templates, condition),
        ]);

        const likeCounts = rows.length
            ? await db
                .select({ templateId: likes.templateId, total: count() })
                .from(likes)
                .where(
                    and(
                        inArray(
                            likes.templateId,
                            rows.map((form) => form.id),
                        ),
                        isNull(likes.deletedAt),
                    ),
                )
                .groupBy(likes.templateId)
            : [];

        const likesByTemplates = new Map(likeCounts.map((row) => [row.templateId, Number(row.total)]));
        const totalPages = Math.ceil(totalItems / pageSize);
        return {
            templates: rows.map((template) => ({
                ...template,
                likes: likesByTemplates.get(template.id) ?? 0,
            })),
            page,
            pageSize,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }

    public async getTemplateById(payload: GetTemplateByIdProps) {
        const { templateId, requesterId } = payload;

        const isAdmin = await this.userService.isAdmin(requesterId);

        const condition = !isAdmin
            ? and(
                eq(templates.id, templateId),
                eq(templates.creatorId, requesterId),
                isNull(templates.deletedAt),
            )
            : and(eq(templates.id, templateId), isNull(templates.deletedAt));

        const template = await db.query.templates.findFirst({
            where: condition,
            with: {
                fields: {
                    where: isNull(templateFields.deletedAt),
                    orderBy: asc(templateFields.order),
                },
            },
        });

        if (!template) return null;

        const likesCount = await db.$count(
            likes,
            and(eq(likes.templateId, templateId), isNull(likes.deletedAt)),
        );

        return { ...template, likes: likesCount };
    }

    public async deleteTemplate(payload: DeleteTemplateProps) {
        const { requesterId, templateId } = payload;

        const template = await this.getTemplateById({ templateId, requesterId });

        if (!template) throw new Error("Template not found");

        const isAdmin = await this.userService.isAdmin(requesterId);

        if (!isAdmin && template.creatorId !== requesterId) {
            return {
                success: false,
                message: "You are not authorized to delete this template",
            };
        }

        await db.transaction(async (tx) => {
            const now = new Date();
            const deleted = await tx
                .update(templates)
                .set({ deletedAt: now })
                .where(eq(templates.id, templateId))
                .returning({ id: templates.id });
            if (deleted.length === 0) {
                return tx.rollback();
            }
            await tx
                .update(templateFields)
                .set({ deletedAt: now })
                .where(and(eq(templateFields.templateId, templateId), isNull(templateFields.deletedAt)));

            await tx
                .update(likes)
                .set({ deletedAt: now })
                .where(and(eq(likes.templateId, templateId), isNull(likes.deletedAt)));
        });

        return {
            success: true,
            message: "Template deleted successfully",
        };
    }

    public buildFieldRow(
        field: CreateTemplateInputModel["fields"][number],
        templateId: string,
        order: number,
    ): Omit<InsertTemplateField, "labelKey"> {
        const row: Omit<InsertTemplateField, "labelKey"> = {
            templateId: templateId,
            type: field.type,
            label: field.label,
            description: field.description,
            order: order,
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
    }

    public async updateTemplate(payload: UpdateTemplateInputSchema) {
        const { templateId, requesterId, title, description, logoUrl, status, fields } = payload;

        const template = await this.getTemplateById({ templateId, requesterId });

        if (!template) throw new Error("Template not found");

        if (status && status !== template.status) {
            if (template.status === PUBLISHED && status === DRAFT) {
                return {
                    success: false,
                    message: "Cannot move published form to draft when there are submissions",
                    templateData: null,
                };
            }
        }

        const now = new Date();

        const updatedValues: Partial<typeof templates.$inferInsert> = {};

        if (title !== undefined) updatedValues.title = title;
        if (description !== undefined) updatedValues.description = description;
        if (logoUrl !== undefined) updatedValues.logoUrl = logoUrl;

        if (status !== undefined && status !== template.status) {
            updatedValues.status = status;
            if (status === PUBLISHED && !template.publishedAt) updatedValues.publishedAt = now;
            if (status === ARCHIVED) updatedValues.archivedAt = now;
        }

        if (Object.keys(updatedValues).length === 0 && fields === undefined) {
            return {
                success: false,
                message: "No changes to update",
                templateData: null,
            };
        }

        await db.transaction(async (tx) => {
            if (Object.keys(updatedValues).length > 0) {
                await tx.update(templates).set(updatedValues).where(eq(templates.id, templateId));
            }

            if (fields === undefined) return;

            const existing = new Map(template.fields.map((field) => [field.id, field]));
            const keptIds = new Set<string>();

            const toInsert: InsertTemplateField[] = [];
            const toUpdate: { id: string; values: Omit<InsertTemplateField, "labelKey"> }[] = [];

            fields.forEach((field, index) => {
                const row = this.buildFieldRow(field, templateId, index);

                const current = field.id ? existing.get(field.id) : undefined;

                if (!current) {
                    toInsert.push({ ...row, labelKey: generateLabelKey() });
                    return;
                }

                keptIds.add(current.id);
                toUpdate.push({ id: current.id, values: row });
            });

            const removedIds = [...existing.keys()].filter((id) => !keptIds.has(id));

            if (toInsert.length > 0) {
                await tx.insert(templateFields).values(toInsert);
            }

            for (const { id, values } of toUpdate) {
                await tx
                    .update(templateFields)
                    .set(values)
                    .where(and(eq(templateFields.id, id), eq(templateFields.templateId, templateId)));
            }

            if (removedIds.length > 0) {
                await tx
                    .update(templateFields)
                    .set({ deletedAt: new Date() })
                    .where(
                        and(eq(templateFields.templateId, templateId), inArray(templateFields.id, removedIds)),
                    );
            }
        });

        const updatedTemplate = await this.getTemplateById({ templateId, requesterId });

        if (!updatedTemplate) throw new Error("Failed to update template");

        return {
            success: true,
            message: "Template updated successfully",
            templateData: updatedTemplate,
        };
    }
}

// const templateService = new TemplateService();

// templateService.deleteTemplate({
//     requesterId: "477c6c48-ae0c-4bd5-8f36-9c5687e74be6",
//     templateId: "daaa653d-f938-4321-8dae-f4e736f89644"
// }).then(data => console.log(JSON.stringify(data, null, 2))).catch(err => console.log(err))

// templateService.getTemplateById({
//     requesterId: "477c6c48-ae0c-4bd5-8f36-9c5687e74be6",
//     templateId: "daaa653d-f938-4321-8dae-f4e736f89644"
// }).then(data => console.log(JSON.stringify(data, null, 2))).catch(err => console.log(err))

// templateService.listTemplates({
//     requesterId: "477c6c48-ae0c-4bd5-8f36-9c5687e74be6",
//     search: "",
//     status: "draft",
//     sortBy: "updatedAt",
//     sortOrder: "desc",
//     page: 1,
//     pageSize: 10,
// }).then(data => console.log(data)).catch(err => console.log(err))

// templateService.createTemplate({
//     creatorId: "477c6c48-ae0c-4bd5-8f36-9c5687e74be6",
//     title: "Test Template 2",
//     description: "Test Template 2 Description",
//     logoUrl: "https://ik.imagekit.io/visshnnu/users/avatars/avatar-477c6c48-ae0c-4bd5-8f36-9c5687e74be6",
//     status: "draft",
//     fields: [
//         {
//             type: "short_text",
//             label: "Test Text Field 3",
//             description: "Test Text Field Description 3",
//             helpText: "Test Text Field Help Text 3",
//             placeholder: "Test Text Field Placeholder 3",
//             required: true,
//             order: 1,
//             validation: {
//                 minLength: 1,
//                 maxLength: 100,
//             },
//         }, {
//             type: "number",
//             label: "Test Number Field 3",
//             description: "Test Number Field Description 3",
//             helpText: "Test Number Field Help Text 3",
//             placeholder: "Test Number Field Placeholder 3",
//             required: true,
//             order: 3,
//             validation: {
//                 min: 1,
//                 max: 100,
//                 step: 1
//             },
//         }, {
//             type: "rating",
//             label: "Test Rating Field 3",
//             description: "Test Rating Field Description 3",
//             helpText: "Test Rating Field Help Text 3",
//             placeholder: "Test Rating Field Placeholder 3",
//             required: true,
//             order: 3,
//             validation: {
//                 min: 1,
//                 max: 5,
//                 step: 1
//             },
//         },
//     ],
// }).then(data => console.log(data)).catch(err => console.log(err))

// templateService.updateForm({
//     requesterId: "477c6c48-ae0c-4bd5-8f36-9c5687e74be6",
//     templateId: "734a8c5e-1df0-41b6-a6d6-686b9a963840",
//     status: "published"
// }).then(data => console.log(data)).catch(err => console.log(err))
