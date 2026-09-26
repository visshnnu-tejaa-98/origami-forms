

import { createTemplateInputModel, createTemplateOutputSchema, deleteTemplateInputSchema, deleteTemplateOutputSchema, getTemplateByIdInputSchema, getTemplateByIdOutputSchema, listTemplatesInputSchema, listTemplatesOutputSchema, updateTemplateInputSchema, updateTemplateOutputSchema } from "@repo/services/templates/model";
import { createTemplateMeta, deleteTemplateMeta, getTemplateByIdMeta, listTemplatesMeta, updateTemplateMeta } from "@repo/services/templates/meta";
import { protectedProcedure, router } from "../../trpc";
import { templateService } from "../../services";

const TAGS = ["Templates"];


export const templatesRouter = router({
    createTemplate: protectedProcedure
        .meta(createTemplateMeta({
            getPathFn: () => "/create-template",
            tags: TAGS
        }))
        .input(createTemplateInputModel.omit({ creatorId: true }))
        .output(createTemplateOutputSchema).mutation(
            async ({ input, ctx }) => {
                const result = await templateService.createTemplate({ ...input, creatorId: ctx.userId });

                if (!result) {
                    throw new Error("Something went wrong while creating template");
                }

                return result;
            }
        ),
    getAllTemplates: protectedProcedure
        .meta(listTemplatesMeta({
            getPathFn: () => "/all-templates",
            tags: TAGS
        }))
        .input(listTemplatesInputSchema.omit({ requesterId: true }))
        .output(listTemplatesOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await templateService.listTemplates({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new Error("Something went wrong while fetching templates");
            }

            return result;
        }),

    getTemplateById: protectedProcedure
        .meta(getTemplateByIdMeta({
            getPathFn: () => "/template/:templateId",
            tags: TAGS,
        }))
        .input(getTemplateByIdInputSchema.omit({ requesterId: true }))
        .output(getTemplateByIdOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await templateService.getTemplateById({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new Error("Something went wrong while fetching template");
            }

            return result;
        }),

    updateTemplate: protectedProcedure
        .meta(updateTemplateMeta({
            getPathFn: () => "/template/update/:templateId",
            tags: TAGS,
        }))
        .input(updateTemplateInputSchema.omit({ requesterId: true }))
        .output(updateTemplateOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const result = await templateService.updateTemplate({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new Error("Something went wrong while updating template");
            }

            return result;
        }),

    deleteTemplate: protectedProcedure
        .meta(deleteTemplateMeta({
            getPathFn: () => "/template/delete/:templateId",
            tags: TAGS,
        }))
        .input(deleteTemplateInputSchema.omit({ requesterId: true }))
        .output(deleteTemplateOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const result = await templateService.deleteTemplate({ ...input, requesterId: ctx.userId });

            if (!result) {
                throw new Error("Something went wrong while deleting template");
            }

            return result;
        }),
});