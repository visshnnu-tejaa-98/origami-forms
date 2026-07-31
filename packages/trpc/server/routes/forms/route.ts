import { listFormsInputSchema, listFormsOutputSchema } from "@repo/services/form/model"
import { listFormsMeta } from "@repo/services/form/meta";
import { protectedProcedure, router } from "../../trpc";
import { formService } from "../../services"

const TAGS = ["Forms"];

export const formsRouter = router({
    getAllForms: protectedProcedure
        .meta(listFormsMeta({ getPathFn: () => "/all-forms", tags: TAGS }))
        .input(listFormsInputSchema.omit({ requesterId: true }))
        .output(listFormsOutputSchema)
        .query(async ({ input, ctx }) => {
            const result = await formService.listForms({ ...input, requesterId: ctx.userId });
            console.log({ result })

            if (!result) {
                throw new Error("Something went wrong while fetching forms");
            }

            const sanitizedForms = result.forms.map((form) => ({
                ...form,
                description: form.description ?? "",
                maxSubmissions: form.maxSubmissions ?? 0,
            }));

            return {
                ...result,
                forms: sanitizedForms,
            };
        })
});
