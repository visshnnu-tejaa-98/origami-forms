
import { getImageUploadParamsMeta } from "@repo/services/files/meta";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { getImageUploadParamsInputSchema, getImageUploadParamsOutputSchema } from "@repo/services/files/model";
import { fileService } from "../../services";

export const fileRouter = router({
    getImageUploadParams: protectedProcedure
        .meta(
            getImageUploadParamsMeta({ getPathFn: () => "/get-file-upload-params", tags: ["Files"] }),
        )
        .input(getImageUploadParamsInputSchema)
        .output(getImageUploadParamsOutputSchema)
        .query(async () => {
            const result = await fileService.getFileUploadParams();

            if (!result) {
                throw new Error("Something went wrong while fetching file upload params");
            }

            return result;
        }),
});