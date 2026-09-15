import { protectedProcedure, router } from "../../trpc";
import { getActivitiesInputSchema, getActivitiesOutputSchema, pushActivityInputSchema, pushActivityOutputSchema } from "@repo/services/analytics/model";
import { getActivitiesMeta, pushActivityMeta } from "@repo/services/analytics/meta";
import { analyticsService } from "../../services";
import { realtimeBus } from "@repo/services/socket/bus";
import { VIEWED } from "@repo/database/constants";

export const analyticsRouter = router({
    pushActivity: protectedProcedure
        .meta(pushActivityMeta({ getPathFn: () => "/push-activity", tags: ["Analytics"] }))
        .input(pushActivityInputSchema.omit({ requesterId: true }))
        .output(pushActivityOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const result = await analyticsService.pushActivity({
                ...input,
                requesterId: ctx.userId,
            });

            if (!result) {
                throw new Error("Failed to record activity");
            }

            if (result.realTime && result.realTime.activityType === VIEWED) {
                realtimeBus.formViewed(result.realTime.creatorId, result.realTime);
            }

            return result;
        }),
    getActivities: protectedProcedure
        .meta(getActivitiesMeta({ getPathFn: () => "/get-activities", tags: ["Analytics"] }))
        .input(getActivitiesInputSchema.omit({ requesterId: true }))
        .output(getActivitiesOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await analyticsService.getActivities({
                ...input,
                requesterId: ctx.userId,
            })

            if (!result) {
                throw new Error("Failed to fetch activities");
            }

            return result;
        })
})