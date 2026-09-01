import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";
import { isUserGaveResponseForFormMeta, listResponsesMeta, responsesStatsMeta } from "@repo/services/response/meta"
import { formResponsesStatsListInputSchema, formResponsesStatsOutputSchema, isUserGaveResponseForFormInputSchema, isUserGaveResponseForFormOutputSchema, listResponsesInputSchema, listResponsesOutputSchema } from "@repo/services/response/model"
import { responseService } from "../../services";

const TAGS = ["Response"];

export const responseRouter = router({
    listResponses: protectedProcedure
        .meta(listResponsesMeta({ getPathFn: () => "/responses", tags: TAGS }))
        .input(listResponsesInputSchema.omit({ requesterId: true }))
        .output(listResponsesOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await responseService.listResponses({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong while fetching responses" });
            }

            return result;
        }),
    responsesStats: protectedProcedure
        .meta(responsesStatsMeta({ getPathFn: () => "/responses/stats", tags: TAGS }))
        .input(formResponsesStatsListInputSchema.omit({ requesterId: true }))
        .output(formResponsesStatsOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await responseService.responsesStats({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong while fetching response stats" });
            }

            return result;
        }),
    isUserGaveResponseForForm: protectedProcedure
        .meta(isUserGaveResponseForFormMeta({ getPathFn: () => "/responses/is-user-gave-response-for-form", tags: TAGS }))
        .input(isUserGaveResponseForFormInputSchema.omit({ requesterId: true }))
        .output(isUserGaveResponseForFormOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await responseService.isUserGaveResponseForForm({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong while checking if user has submitted response for form" });
            }

            return result;
        }),

});
