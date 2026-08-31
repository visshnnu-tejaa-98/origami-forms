import {
    createFormInputModel,
    createFormOutputSchema,
    deleteFormInputSchema,
    deleteFormOutputSchema,
    formStatusListInputSchema,
    formStatusListOutputSchema,
    getFormByIdInputSchema,
    getFormByIdOutputSchema,
    getPublicFormInputSchema,
    getPublicFormOutputSchema,
    listFormsInputSchema,
    listFormsOutputSchema,
    submitPublicResponseInputSchema,
    submitPublicResponseOutputSchema,
    updateFormInputSchema,
    updateFormOutputSchema,
} from "@repo/services/form/model";
import {
    createFormMeta,
    deleteFormMeta,
    formStatsMeta,
    getFormByIdMeta,
    getPublicFormMeta,
    listFormsMeta,
    submitPublicResponseMeta,
    updateFormMeta,
} from "@repo/services/form/meta";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { formService } from "../../services";

const TAGS = ["Forms"];

export const formsRouter = router({
    getAllForms: protectedProcedure
        .meta(listFormsMeta({ getPathFn: () => "/all-forms", tags: TAGS }))
        .input(listFormsInputSchema.omit({ requesterId: true }))
        .output(listFormsOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await formService.listForms({ ...input, requesterId: ctx.userId });

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

    deleteForm: protectedProcedure
        .meta(deleteFormMeta({ getPathFn: () => "/form/delete/{formId}", tags: TAGS }))
        .input(deleteFormInputSchema.omit({ requesterId: true }))
        .output(deleteFormOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const result = await formService.deleteForm({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new Error("Something went wrong while deleting form");
            }

            return result;
        }),

    formsStats: protectedProcedure
        .meta(formStatsMeta({ getPathFn: () => "/forms/stats", tags: TAGS }))
        .input(formStatusListInputSchema.omit({ requesterId: true }))
        .output(formStatusListOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await formService.formStats({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new Error("Something went wrong while fetching form stats");
            }

            return result;
        }),

    getPublicForm: publicProcedure
        .meta(getPublicFormMeta({ getPathFn: () => "/public/form/{formId}", tags: TAGS }))
        .input(getPublicFormInputSchema)
        .output(getPublicFormOutputSchema)
        .query(async ({ input }) => {
            const result = await formService.getPublicForm(input);

            if (!result) {
                throw new TRPCError({ code: "NOT_FOUND", message: "This form isn't available" });
            }

            return result;
        }),

    submitPublicResponse: publicProcedure
        .meta(submitPublicResponseMeta({ getPathFn: () => "/public/form/submit", tags: TAGS }))
        .input(submitPublicResponseInputSchema)
        .output(submitPublicResponseOutputSchema)
        .mutation(async ({ input }) => {
            const result = await formService.submitPublicResponse(input);

            if (!result) {
                throw new Error("Something went wrong while recording your response");
            }

            return result;
        }),

});
