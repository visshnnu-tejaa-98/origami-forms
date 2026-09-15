import { ANALYTICS_EVENT_TYPES, CREATED, SUBMITTED } from "@repo/database/constants"
import { z } from "zod"
import { isoDateSchema } from "../form/model";

export const pushActivityInputSchema = z.object({
    requesterId: z.string().uuid().describe("id of the user performing the activity"),
    formId: z.string().uuid().describe("id of the form"),
    activityType: z.enum([CREATED, SUBMITTED]).describe("type of activity"),
    metaData: z.record(z.string(), z.union([z.string(), z.number()])).optional().describe("optional metadata"),
})

export type PushActivityInputSchemaType = z.infer<typeof pushActivityInputSchema>;

export const pushActivityOutputSchema = z.object({
    id: z.string().uuid().describe("id of the activity"),
    formId: z.string().uuid().describe("id of the form"),
    creatorId: z.string().uuid().nullish().describe("id of the user who created the form"),
    respondeeId: z.string().uuid().nullish().describe("id of the user who submitted the form"),
    activityType: z.enum(ANALYTICS_EVENT_TYPES).describe("type of activity"),
    metaData: z.json().nullish().describe("optional metadata"),
    occuredAt: isoDateSchema.describe("timestamp of activity"),
    updatedAt: isoDateSchema.nullish().describe("timestamp of last update"),
})

export type PushActivityOutputSchema = z.infer<typeof pushActivityOutputSchema>;


export const getActivitiesInputSchema = z.object({
    requesterId: z.string().uuid().describe("id of the user performing the activity"),
})

export type GetActivitiesInputType = z.infer<typeof getActivitiesInputSchema>;

export const getActivitySchema = z.object({
    creatorId: z.string().uuid().nullish().describe("id of the user who created the form"),
    creatorName: z.string().nullish().describe("name of the form's creator"),
    respondeeId: z.string().uuid().nullish().describe("id of the user who submitted the form"),
    respondeeName: z.string().nullish().describe("name of the user who performed the activity"),
    creatorAvatarUrl: z.string().nullish().describe("avatar url of the form's creator"),
    respondeeAvatarUrl: z.string().nullish().describe("avatar url of the user who performed the activity"),
    activityType: z.enum(ANALYTICS_EVENT_TYPES).describe("type of activity"),
    formName: z.string().describe("name of the form"),
    formId: z.string().uuid().describe("id of the form"),
    occuredAt: isoDateSchema.describe("timestamp of activity"),
})

export type GetActivityType = z.infer<typeof getActivitySchema>;

export const getActivitiesOutputSchema = z.object({
    success: z.boolean().describe("true or false based on if request was successfull"),
    message: z.string().describe("Success or error message"),
    data: z.array(getActivitySchema).describe("Array of activities")
})

export type GetActivitiesOutputType = z.infer<typeof getActivitiesOutputSchema>;