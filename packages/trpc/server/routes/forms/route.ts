import {
    createFormInputModel,
    createFormOutputSchema,
    formStatusListInputSchema,
    formStatusListOutputSchema,
    getFormByIdInputSchema,
    getFormByIdOutputSchema,
    listFormsInputSchema,
    listFormsOutputSchema,
    updateFormInputSchema,
    updateFormOutputSchema,
} from "@repo/services/form/model";
import { createFormMeta, formStatsMeta, getFormByIdMeta, listFormsMeta, updateFormMeta } from "@repo/services/form/meta";
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
    ),
    getFormById: protectedProcedure
        // the placeholder has to match the input key exactly for trpc-to-openapi to
        // bind it, so it is `{formId}` rather than `{id}`
        .meta(getFormByIdMeta({ getPathFn: () => "/form/{formId}", tags: TAGS }))
        .input(getFormByIdInputSchema.omit({ requesterId: true }))
        .output(getFormByIdOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await formService.getFormById({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new Error("Form not found");
            }

            return result;
        }),
    updateForm: protectedProcedure
        .meta(updateFormMeta({ getPathFn: () => "/form/update/{formId}", tags: TAGS }))
        .input(updateFormInputSchema.omit({ requesterId: true }))
        .output(updateFormOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const result = await formService.updateForm({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new Error("Something went wrong while updating form");
            }

            return result;
        }),
    formsStats: protectedProcedure
        .meta(formStatsMeta({ getPathFn: () => "/forms/stats", tags: TAGS }))
        .input(formStatusListInputSchema.omit({ requesterId: true }))
        .output(formStatusListOutputSchema)
        .query(async ({ input, ctx }) => {
            console.log({ input })
            const result = await formService.formStats({ ...input, requesterId: ctx.userId });
            console.log({ result });

            if (!result) {
                throw new Error("Something went wrong while fetching form stats");
            }

            return result;
        }),

});
