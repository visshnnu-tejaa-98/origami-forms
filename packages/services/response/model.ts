import { ALL, RESPONSE_STATUS } from "@repo/database/constants";
import z from "zod";


export const LIST_RESPONSES_SORT_FIELDS = [
    "submittedAt",
    "completionTimeInSec",
] as const;

export const listResponsesInputSchema = z.object({
    requesterId: z.string().uuid().describe("id of the requesting user (admins see all forms)"),
    formId: z.string().uuid().optional().describe("id of the form to filter responses by"),
    // only if we have name or email as a form field in the form
    search: z.string().trim().min(1).max(255).optional().describe("search term matched against the email field in form if it exists"),
    sortBy: z.enum(LIST_RESPONSES_SORT_FIELDS).optional().default("submittedAt").describe("column to sort by"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc").describe("sort direction"),
    status: z.enum(RESPONSE_STATUS).default(ALL).describe("status of the form response"),
    page: z.number().int().positive().optional().default(1).describe("page number"),
    pageSize: z.number().int().positive().max(100).optional().default(10).describe("page size"),
})

export type ListResponsesInputType = z.infer<typeof listResponsesInputSchema>
export type ListResponsesInput = z.input<typeof listResponsesInputSchema>

export const responseAnswersSchema = z.object({
    fieldId: z.string().uuid().describe("id of the answer"),
    fieldType: z.string().describe("type of the field"),
    fieldLabel: z.string().describe("label for for field"),
    value: z.string().nullable().describe("value of the answer"),
    order: z.number().describe("order of the field"),
})

export const metaDataSchema = z.object({
    city: z.string().nullish().describe("city of the response"),
    device: z.string().nullish().describe("device used to submit the response"),
    browser: z.string().nullish().describe("browser used to submit the response"),
    country: z.string().nullish().describe("country of the response"),
})

export const responseSchema = z.object({
    id: z.string().uuid().describe("id of the response"),
    name: z.string().nullish().describe("name of the user who submitted the response"),
    email: z.string().email().nullish().describe("email of the user who submitted the response"),
    status: z.enum(RESPONSE_STATUS).describe("status of the response"),
    logoUrl: z.string().url().nullish().describe("logo of the form"),
    formTitle: z.string().describe("title of the form to which this response belongs"),
    submittedAt: z.string().datetime().nullish().describe("date and time of when the response was submitted"),
    completionTimeInSec: z.number().int().nonnegative().nullish().describe("time in seconds it took to complete the response"),
    answers: z.array(responseAnswersSchema).describe("array of answers submitted in this response"),
    metaData: metaDataSchema.nullish().describe("metadata of the response"),

})

export const listResponsesOutputSchema = z.object({
    responses: z.array(responseSchema).describe("list of responses"),
    page: z.number().int().nonnegative().describe("current page number"),
    pageSize: z.number().int().nonnegative().describe("page size"),
    totalItems: z.number().int().nonnegative().describe("total number of matching forms"),
    totalPages: z.number().int().nonnegative().describe("total number of pages"),
    hasNextPage: z.boolean().describe("whether a next page exists"),
    hasPrevPage: z.boolean().describe("whether a previous page exists"),
})

export type ListResponseOutputType = z.infer<typeof listResponsesOutputSchema>