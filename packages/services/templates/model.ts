import { TEMPLATE_FIELD_TYPES, TEMPLATE_STATUS_OPTIONS } from "@repo/database/constants";
import { z } from "zod"
import { createFieldSchema, updateFieldSchema } from "../form/model";
import { isoDateSchema, optionsSchema } from "../common/model";


// Create Template

export const createTemplateFieldsSchema = createFieldSchema

export const createTemplateInputModel = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Title must be atleast 2 characters long")
        .max(255, "Title cannot be longer than 255 characters")
        .describe("title of the template"),
    description: z.string().optional().describe("description of the template"),
    logoUrl: z.string().url("Invalid URL").optional().describe("logo url of the template"),
    status: z.enum(TEMPLATE_STATUS_OPTIONS).nullish().describe("status of the template"),
    fields: z.array(createTemplateFieldsSchema).min(1),
    creatorId: z.string().uuid().describe("id of the creator of the template"),
});

export type CreateTemplateInputModel = z.infer<typeof createTemplateInputModel>;


export const templateFieldOutputSchema = z.object({
    id: z.string().uuid(),
    templateId: z.string().uuid(),
    type: z.enum(TEMPLATE_FIELD_TYPES),
    label: z.string().describe("label of the field"),
    description: z.string().nullish().describe("description of the field"),

    placeholder: z.string().nullish().describe("placeholder of the field"),
    helpText: z.string().nullish().describe("help text of the field"),
    required: z.boolean().nullish().describe("required of the field"),
    order: z.number().describe("order of the field"),
    labelKey: z.string().describe("label key of the field"),
    validation: z.record(z.string(), z.unknown()).describe("validation of the field"),
    options: z.union([z.array(optionsSchema), z.object({}).strict()]),
    defaultValue: z.string().nullish().describe("default value of the field"), // can also have array of selected items in multi select

    createdAt: isoDateSchema.nullish(),
    updatedAt: isoDateSchema.nullish(),
});

export const createTemplateOutputSchema = z.object({
    id: z.string().uuid(),
    creatorId: z.string().uuid(),
    title: z.string().describe("title of the template"),
    description: z.string().nullable().describe("description of the template"),
    logoUrl: z.string().nullable().describe("logo url of the template"),
    slug: z.string().describe("slug of the template"),

    status: z.enum(TEMPLATE_STATUS_OPTIONS).describe("status of the template"),

    createdAt: isoDateSchema.nullable().describe("created at"),
    publishedAt: isoDateSchema.nullable().describe("published at"),
    archivedAt: isoDateSchema.nullable().describe("archived at"),
    updatedAt: isoDateSchema.nullable().describe("updated at"),
    deletedAt: isoDateSchema.nullable().describe("deleted at"),

    fields: z.array(templateFieldOutputSchema).describe("fields of the template"),
});

export type CreateTemplateOutputSchemaType = z.infer<typeof createTemplateOutputSchema>

// List Templates

export const LIST_TEMPLATES_SORT_FIELDS = [
    "createdAt",
    "updatedAt",
    "title",
    "status",
] as const;

export const listTemplatesInputSchema = z.object({
    requesterId: z.string().uuid().describe("id of the requesting user (admins see all templates)"),
    search: z.string().trim().min(1).max(255).optional().describe("search term matched against the title"),
    status: z.enum(TEMPLATE_STATUS_OPTIONS)
        .optional()
        .describe("filter by one or more statuses"),

    sortBy: z.enum(LIST_TEMPLATES_SORT_FIELDS).optional().default("updatedAt").describe("column to sort by"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc").describe("sort direction"),
    page: z.number().int().positive().optional().default(1).describe("page number"),
    pageSize: z.number().int().positive().max(100).optional().default(10).describe("page size"),
})

export type ListTemplatesProps = z.infer<typeof listTemplatesInputSchema>;
export type ListTemplatesInput = z.input<typeof listTemplatesInputSchema>;


export const listTemplatesOutputSchema = z.object({
    templates: z.array(
        createTemplateOutputSchema
            .omit({ fields: true, deletedAt: true })
            .extend({ views: z.number().int().nonnegative().describe("view count of the template") }),
    ),
    page: z.number().int().nonnegative().describe("current page number"),
    pageSize: z.number().int().nonnegative().describe("page size"),
    totalItems: z.number().int().nonnegative().describe("total number of matching templates"),
    totalPages: z.number().int().nonnegative().describe("total number of pages"),
    hasNextPage: z.boolean().describe("whether a next page exists"),
    hasPrevPage: z.boolean().describe("whether a previous page exists"),
});

export type ListTemplatesOutputSchemaType = z.infer<typeof listTemplatesOutputSchema>


// get template by Id

export const getTemplateByIdInputSchema = z.object({
    requesterId: z.string().uuid().describe("id of the requesting user"),
    templateId: z.string().uuid().describe("templateId of the template"),
});

export type GetTemplateByIdProps = z.infer<typeof getTemplateByIdInputSchema>;

export const getTemplateByIdOutputSchema = createTemplateOutputSchema.extend({
    likes: z.number().describe("like count of the template"),

});

export type GetTemplateByIdOutputSchemaType = z.infer<typeof getTemplateByIdOutputSchema>


// update Template

export const updateTemplateFieldsSchema = updateFieldSchema

export const updateTemplateInputSchema = z.object({
    templateId: z.string().uuid().describe("templateId of the template"),
    requesterId: z.string().uuid().describe("id of the requesting user"),
    title: z.string().min(2).max(255).optional().describe("title of the template"),
    description: z.string().nullable().optional().describe("description of the template (null to clear)"),
    logoUrl: z.string().url().nullable().optional().describe("logo url of the template (null to clear)"),
    status: z.enum(TEMPLATE_STATUS_OPTIONS).optional().describe("status of the template"),
    fields: z
        .array(updateFieldSchema)
        .min(1)
        .optional()
        .describe("the full field list; omit to leave the template's fields untouched"),
});

export type UpdateTemplateInputSchema = z.infer<typeof updateTemplateInputSchema>


export const updateTemplateOutputSchema = z.object({
    success: z.boolean().describe("true or false based on if update was successfull"),
    message: z.string().describe("Success or error message"),
    templateData: getTemplateByIdOutputSchema
        .nullable()
        .describe("updated template data, or null when no update was performed"),
});

export type UpdateTemplateOutputSchemaType = z.infer<typeof updateTemplateOutputSchema>;


// delete Template

export const deleteTemplateInputSchema = z.object({
    requesterId: z.string().uuid().describe("id of the requesting user"),
    templateId: z.string().uuid().describe("templateId of the template"),
});

export type DeleteTemplateProps = z.infer<typeof deleteTemplateInputSchema>;

export const deleteTemplateOutputSchema = z.object({
    success: z.boolean().describe("success status of the delete operation"),
    message: z.string().describe("success or error message"),
});

export type DeleteTemplateOutputSchemaType = z.infer<typeof deleteTemplateOutputSchema>;
