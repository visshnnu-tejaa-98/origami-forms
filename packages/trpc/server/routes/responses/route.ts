import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";
import { listResponsesMeta } from "@repo/services/response/meta"
import { listResponsesInputSchema, listResponsesOutputSchema } from "@repo/services/response/model"
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
});
