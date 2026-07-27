import {
    CHECK_BOX,
    DATE,
    FIELD_TYPES,
    FILE_UPLOAD,
    FORM_STATUS_OPTIONS,
    FORM_VISIBILITY_OPTIONS,
    MULTI_SELECT,
    NUMBER_LIKE_FIELDS,
    RADIO,
    SINGLE_SELECT,
    TEXT_LIKE_FIELDS,
    UNLISTED,
} from "@repo/database/constants";
import { z } from "zod";
import { USER_ROLES } from "../constants";

export const slugSchema = z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be lowercase kebab-case, e.g. my-feedback-form");

export const optionsSchema = z.object({
    id: z.string().min(1).max(64),
    label: z.string().min(1).max(255).describe("label for the option"),
    value: z.string().min(1).max(255).describe("value for the option"),
});

export const baseField = z.object({
    label: z
        .string()
        .min(1, "Label must be atleast 1 character long")
        .max(255, "Label cannot be longer than 255 characters")
        .describe("label for the field"),
    placeholder: z
        .string()
        .min(1, "Placeholder must be atleast 1 character long")
        .max(255, "Placeholder cannot be longer than 255 characters")
        .optional()
        .describe("placeholder for the field"),
    description: z.string().optional().describe("description for the field"),
    helpText: z
        .string()
        .max(255, "Help text cannot be longer than 255 characters")
        .optional()
        .describe("help text for the field"),
    required: z.boolean().optional().default(false).describe("whether the field is required"),
    order: z.number().describe("order of the field"),
});

export const textLikeField = {
    ...baseField.shape,
    type: z.enum(TEXT_LIKE_FIELDS),

    defaultValue: z.string().optional(),
    validation: z
        .object({
            minLength: z.number().positive("Minimum length must be a positive number").optional(),
            maxLength: z.number().positive("Maximum length must be a positive number").optional(),
            regex: z.string().optional(),
        })
        .optional(),
};

export const numberLikeFields = {
    ...baseField.shape,
    type: z.enum(NUMBER_LIKE_FIELDS),
    defaultValue: z.coerce.string().optional(),
    validation: z
        .object({
            min: z.number().optional(),
            max: z.number().optional(),
            step: z.number().positive().optional().default(1),
        })
        .optional(),
};

export const singleSelectFields = {
    ...baseField.shape,
    type: z.enum([SINGLE_SELECT, RADIO]),
    options: z.array(optionsSchema).min(1, "Atleast 1 option is required"),
    defaultValue: z.string().optional().describe("default value for the field"),
    validation: z.object({}).optional(),
};

export const multiSelectFields = {
    ...baseField.shape,
    type: z.enum([MULTI_SELECT, CHECK_BOX]),
    options: z.array(optionsSchema).min(1, "Atleast 1 option is required"),
    defaultValue: z.array(z.string()).optional().describe("default value for the field"),
    validation: z
        .object({
            minSelections: z.number().int().min(0).optional(),
            maxSelections: z.number().int().min(1).optional(),
        })
        .optional(),
};

export const dateField = {
    ...baseField.shape,
    type: z.literal(DATE),
    defaultValue: z.string().optional().describe("default value for the field"),
    validation: z
        .object({
            min: z.coerce.date().optional().describe("minimum date"),
            max: z.coerce.date().optional().describe("maximum date"),
        })
        .optional(),
};

export const fileUploadField = {
    ...baseField.shape,
    type: z.literal(FILE_UPLOAD),
    validation: z
        .object({
            maxSizeMb: z.number().positive().max(100).default(10),
            allowedFileTypes: z.array(z.string()).min(1).optional(),
            maxFiles: z.number().int().positive().default(1),
        })
        .optional(),
};

export const createFieldSchema = z.discriminatedUnion("type", [
    z.object(textLikeField),
    z.object(numberLikeFields),
    z.object(singleSelectFields),
    z.object(multiSelectFields),
    z.object(dateField),
    z.object(fileUploadField),
]);

export const createFormInputModel = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Title must be atleast 2 characters long")
        .max(255, "Title cannot be longer than 255 characters")
        .describe("title of the form"),
    description: z.string().optional().describe("description of the form"),
    logoUrl: z.string().url("Invalid URL").optional().describe("logo url of the form"),
    visibility: z.enum(FORM_VISIBILITY_OPTIONS).default(UNLISTED).describe("visibility of the form"),
    maxSubmissions: z
        .number()
        .int("Max submissions must be an integer")
        .positive("Max submissions must be positive")
        .optional()
        .describe("max submissions for the form"),
    fields: z.array(createFieldSchema).min(1),
});

export type CreateFormInputModel = z.infer<typeof createFormInputModel>;

export const formFieldOutputSchema = z.object({
    id: z.string().uuid(),
    formId: z.string().uuid(),
    type: z.enum(FIELD_TYPES),
    label: z.string().describe("label of the field"),
    description: z.string().describe("description of the field"),

    placeholder: z.string().describe("placeholder of the field"),
    helpText: z.string().describe("help text of the field"),
    required: z.boolean().describe("required of the field"),
    order: z.number().describe("order of the field"),
    labelKey: z.string().describe("label key of the field"),
    validation: z.json().describe("validation of the field"),
    options: z.union([z.array(optionsSchema), z.object({}).strict()]),
    defaultValue: z.string().describe("default value of the field"), // can also have array of selected items in multi select

    createdAt: z.string().describe("created at"),
    updatedAt: z.string().describe("updated at"),
});

export type FormFieldOutputSchemaType = z.infer<typeof formFieldOutputSchema>;

export const createFormOutputSchema = z.object({
    id: z.string().uuid(),
    creatorId: z.string().uuid(),
    title: z.string().describe("title of the form"),
    description: z.string().describe("description of the form"),
    logoUrl: z.string().nullable().describe("logo url of the form"),
    slug: z.string().describe("slug of the form"),

    status: z.enum(FORM_STATUS_OPTIONS).describe("status of the form"),
    visibility: z.enum(FORM_VISIBILITY_OPTIONS).describe("visibility of the form"),

    maxSubmissions: z.number().describe("max submissions for the form"),
    submissionCount: z.number().describe("submission count of the form"),

    createdAt: z.coerce
        .date()
        .transform((d) => d.toISOString())
        .describe("created at"),
    expiresAt: z.coerce
        .date()
        .transform((d) => d.toISOString())
        .nullable()
        .describe("expires at"),
    publishedAt: z.coerce
        .date()
        .transform((d) => d.toISOString())
        .nullable()
        .describe("published at"),
    archivedAt: z.coerce
        .date()
        .transform((d) => d.toISOString())
        .nullable()
        .describe("archived at"),
    updatedAt: z.coerce
        .date()
        .transform((d) => d.toISOString())
        .describe("updated at"),
    deletedAt: z.coerce
        .date()
        .transform((d) => d.toISOString())
        .nullable()
        .describe("deleted at"),

    fields: z.array(formFieldOutputSchema).describe("fields of the form"),
});

export type CreateFormOutputSchemaType = z.infer<typeof createFormOutputSchema>;


export const getFormByIdInputSchema = z.object({
    creatorId: z.string().uuid().describe("creatorId of the user"),
    role: z.enum(USER_ROLES).describe("role of the user"),
    formId: z.string().uuid().describe("formId of the form"),
});

export type GetFormByIdProps = z.infer<typeof getFormByIdInputSchema>;

export const getFormByIdOutputSchema = createFormOutputSchema;
export type GetFormByIdOutputSchemaType = z.infer<typeof getFormByIdOutputSchema>;

export const getAllFormsByCreatorIdInputSchema = z.object({
    creatorId: z.string().uuid().describe("creatorId of the user"),
    role: z.enum(USER_ROLES).describe("role of the user"),
    limit: z.number().int().positive().optional().default(10).describe("limit of the forms"),
    offset: z.number().int().positive().optional().default(0).describe("offset of the forms"),
});

export type GetAllFormsByCreatorIdProps = z.infer<typeof getAllFormsByCreatorIdInputSchema>;

export const getAllFormsByCreatorIdOutputSchema = z.object({
    forms: z.array(createFormOutputSchema),
    totalCount: z.number(),
    page: z.number(),
    limit: z.number(),

    // * Need to check this - which pagination approach will be approaching
    // hasNextPage: z.boolean(),
    // hasPrevPage: z.boolean()
});

export type GetAllFormsByCreatorIdOutputSchemaType = z.infer<typeof getAllFormsByCreatorIdOutputSchema>;
