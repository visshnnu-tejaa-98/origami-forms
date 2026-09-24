import { ANALYTICS_EVENT_TYPES, DRAFTED, FORM_ANALYTICS_SCOPE, FORM_STATUS_OPTIONS, PUBLISHED, SUBMITTED, VIEWED, WEEK } from "@repo/database/constants"
import { z } from "zod"
import { isoDateSchema, submitRealTimePublicResponseSchema } from "../form/model";

export const pushActivityInputSchema = z.object({
    requesterId: z.string().uuid().describe("id of the user performing the activity"),
    formId: z.string().uuid().describe("id of the form"),
    activityType: z.enum([DRAFTED, PUBLISHED, SUBMITTED, VIEWED]).describe("type of activity"),
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
    realTime: submitRealTimePublicResponseSchema
        .nullable()
        .describe("payload for the socket broadcast, null when there is nothing to announce"),
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


export const getAnalyticsInputSchema = z.object({
    requesterId: z.string().uuid().describe("id of the requesting user"),
    formId: z.string().uuid().optional().describe("id of the form"),
    scope: z.enum(FORM_ANALYTICS_SCOPE).optional().default(WEEK).describe("scope of the analytics"),
})

export type GetAnalyticsInputSchemaType = z.infer<typeof getAnalyticsInputSchema>;

export const getAnalyticsOutputSchema = z.object({
    success: z.boolean().describe("whether the analytics were retrieved successfully"),
    message: z.string().describe("success or error message"),
    analytics: z.object({
        form: z.object({
            id: z.string().uuid().describe("id of the form"),
            title: z.string().describe("title of the form"),
            status: z.enum(FORM_STATUS_OPTIONS).describe("status of the form"),
        }).nullish().describe("the form the report is scoped to, null when every form is folded together"),

        currentScope: z.enum(FORM_ANALYTICS_SCOPE).describe("scope of the analytics"),
        startDate: z.coerce.date().describe("start date of the analytics"),
        endDate: z.coerce.date().describe("end date of the analytics"),

        lastScope: z.enum(FORM_ANALYTICS_SCOPE).optional().describe("scope of the previous period"),
        lastScopeStartDate: z.coerce.date().optional().describe("start date of the previous period"),
        lastScopeEndDate: z.coerce.date().optional().describe("end date of the previous period"),

        totalForms: z.number().int().nonnegative().describe("total number of forms"),
        totalResponses: z.number().int().nonnegative().describe("total number of responses"),
        completedResponses: z.number().int().nonnegative().describe("total number of completed responses"),
        totalViews: z.number().int().nonnegative().describe("total number of views"),
        completionRate: z.number().int().nonnegative().describe("percentage of completed responses"),
        avgTimeCompletion: z.number().int().nonnegative().describe("average time to complete the form in seconds"),

        peakResponsesOnADay: z.object({
            count: z.number().int().nonnegative().describe("number of responses on the peak day"),
            date: z.coerce.date().describe("date of the peak responses"),
        }).nullable().optional().describe("peak responses on a day, null when there are no responses"),

        dailyAverage: z.number().int().nonnegative().describe("average number of responses per day"),

        deviceStats: z.array(
            z.object({
                deviceType: z.string().optional().nullable().describe("device type"),
                percentage: z.string().describe("percentage of responses from this device"),
            }).describe("device and percentage of responses")
        ).optional().nullable().describe("device and percentage of responses"),

        countryStats: z.array(
            z.object({
                country: z.string().describe("country name"),
                countryCode: z.string().url().nullish().describe("flag url of the country"),
                percentage: z.string().describe("percentage of responses from this country"),
            }).describe("number of responses from each country, ordered by count")
        ).optional().nullable().describe("number of responses from each country, ordered by count"),

        cityStats: z.array(
            z.object({
                city: z.string().describe("country name"),
                percentage: z.string().describe("percentage of responses from this country"),
            }).describe("number of responses from each country, ordered by count")
        ).optional().nullable().describe("number of responses from each country, ordered by count"),

        trend: z.array(
            z.object({
                date: z.string().describe("ISO timestamp of the bucket's start"),
                submissions: z.number().int().nonnegative().describe("responses submitted inside this bucket"),
                views: z.number().int().nonnegative().describe("views recorded inside this bucket"),
            }).describe("one time bucket of the trend line")
        ).describe("responses and views over the scope's window, one row per bucket, empty buckets included"),

        answerBreakdownAnalytics: z.array(
            z.object({
                questionTitle: z.string().describe("text of the question"),
                questionType: z.string().describe("type of the question"),
                answeredCount: z.number().int().nonnegative().describe("number of times this question was answered"),
                skippedCount: z.number().int().nonnegative().describe("number of times this question was skipped"),
                options: z.array(
                    z.object({
                        optionLabel: z.string().describe("text of the option"),
                        percentage: z.string().describe("percentage of responses for this option"),
                    })
                ).nullable().optional().describe("options and their answer percentages, nullish for non-option fields")
            }).nullish().describe("breakdown of answers for each question")
        )

    }).nullish().describe("analytics of the form, nullish when the form is empty")
})

export type GetAnalyticsOutputSchemaType = z.infer<typeof getAnalyticsOutputSchema>;
