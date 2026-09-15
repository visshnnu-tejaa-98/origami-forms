// import { SelectActivities } from "@repo/database";
// import { z } from "zod";

// export const baseFormSubmissionFieldsSchema = z.object({
//     formId: z.string().uuid().describe("id of the form"),
//     formTitle: z.string().describe("title of the form"),
//     logoUrl: z.string().nullish().describe("logo of the form"),
//     submittedAt: z.string().datetime().describe("time of the submission"),
//     completionTimeInSec: z.number().int().nonnegative().nullish().describe("time taken to complete the form in sec"),
//     submissionCount: z.number().int().nonnegative().describe("total submissions count"),
// })

// export const responseSubmittedEventSchema = baseFormSubmissionFieldsSchema.extend({
//     responseId: z.string().uuid().describe("id of the response"),
//     ...baseFormSubmissionFieldsSchema.shape
// });

// // export type ResponseSubmittedEvent = z.infer<typeof responseSubmittedEventSchema>

// export type realTimeSubmittedResponseTriggerPayload = Omit<SelectActivities, "updatedAt">