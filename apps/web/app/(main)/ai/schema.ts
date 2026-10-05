import { FORM_FIELD_TYPES, TEMPLATE_FIELD_TYPES } from "@repo/database/constants";
import { z } from "zod";

const aiOptionSchema = z.object({
    id: z.string().describe("stable key for the option, e.g. a slug"),
    label: z.string().describe("label for the option"),
    value: z.string().describe("value for the option"),
});

const aiValidationSchema = z.object({
    minLength: z.number().nullable(),
    maxLength: z.number().nullable(),
    regex: z.string().nullable(),
    min: z.number().nullable(),
    max: z.number().nullable(),
    step: z.number().nullable(),
    minSelections: z.number().nullable(),
    maxSelections: z.number().nullable(),
    maxSizeMb: z.number().nullable(),
    allowedFileTypes: z.array(z.string()).nullable(),
    maxFiles: z.number().nullable(),
    minDateIso: z.string().nullable().describe("minimum date in ISO string format"),
    maxDateIso: z.string().nullable().describe("maximum date in ISO string format"),
});

export const aiTemplateFieldSchema = z.object({
    type: z.enum(TEMPLATE_FIELD_TYPES).describe("type of the field"),
    label: z.string().describe("label for the field"),
    description: z.string().nullable().describe("description for the field"),
    helpText: z.string().nullable().describe("help text for the field"),
    required: z.boolean().describe("whether the field is required"),
    order: z.number().describe("order of the field, starting at 1"),
    placeholder: z.string().nullable().describe("placeholder for the field"),
    defaultValue: z.string().nullable().describe("default value for the field"),
    validation: aiValidationSchema.nullable(),
    options: z
        .array(aiOptionSchema)
        .nullable()
        .describe("at least 1 option required if the field type is selection based, otherwise null"),
});

export const aiTemplateSchema = z.object({
    title: z.string().describe("title of the template"),
    description: z.string().nullable().describe("description of the template"),
    fields: z.array(aiTemplateFieldSchema).describe("fields of the template"),
});

export type AiTemplate = z.infer<typeof aiTemplateSchema>;
