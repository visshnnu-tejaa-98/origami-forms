"use client";

import { useRouter } from "next/navigation";
import { useUseTemplate } from "~/hooks/use-template";
import { toast } from "~/components/origami/toast";
import { Template } from "../types";

export function useTemplateAsForm() {
    const router = useRouter();
    const { useTemplateAsync, useTemplateIsPending, useTemplateVariables } = useUseTemplate();

    const toForm = async (template: Template) => {
        const result = await useTemplateAsync({ templateId: template.id }).catch((error) => {
            toast.error(error instanceof Error ? error.message : "Could not use this pattern.");
            return null;
        });

        if (!result) return;

        if (!result.success || !result.formId) {
            toast.error(result.message);
            return;
        }

        toast.success(`Folded "${template.title}" into a new draft.`);
        router.push(`/builder/${result.formId}?from=list`);
    };

    const isLoading = (templateId: string) =>
        useTemplateIsPending && useTemplateVariables?.templateId === templateId;

    return { toForm, isLoading };
}
