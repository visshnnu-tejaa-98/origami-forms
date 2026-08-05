import { createFormInputModel, createFormOutputSchema, listFormsInputSchema, listFormsOutputSchema } from "@repo/services/form/model";
import { createFormMeta, listFormsMeta } from "@repo/services/form/meta";
import { protectedProcedure, router } from "../../trpc";
import { formService } from "../../services";

const TAGS = ["Forms"];

export const formsRouter = router({
    getAllForms: protectedProcedure
        .meta(listFormsMeta({ getPathFn: () => "/all-forms", tags: TAGS }))
        .input(listFormsInputSchema.omit({ requesterId: true }))
        .output(listFormsOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await formService.listForms({ ...input, requesterId: ctx.userId });
            console.log({ result });

            if (!result) {
                throw new Error("Something went wrong while fetching forms");
            }

            return result;
        }),
    createForm: protectedProcedure.meta(createFormMeta({
        getPathFn: () => "/create-form",
        tags: TAGS
    })).input(createFormInputModel).output(createFormOutputSchema).mutation(
        async ({ input, ctx }) => {
            const result = await formService.createForm(ctx.userId, input);
            console.log({ result });

            if (!result) {
                throw new Error("Something went wrong while creating form");
            }

            return result;
        }
    )
});
