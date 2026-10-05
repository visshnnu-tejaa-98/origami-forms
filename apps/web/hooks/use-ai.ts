"use client";

import { DRAFT } from "@repo/database/constants";
import { useState } from "react";
import { DraftPreview, ForgeKind, ForgeStage } from "~/app/(main)/ai/types";
import { toast } from "~/components/origami/toast-store";
import { useCreateTemplate } from "./use-template";
import { useCreateForm } from "./use-form";
import { dummyAPIData } from "~/app/(main)/ai/constants";
import { TEMPLATE } from "~/app/(main)/constants";
import { toBuilderFormFromAIAssist, toBuilderTemplateFromAIAssist } from "~/app/(main)/utils";
import { generateTemplateOrForm } from "~/app/(main)/ai/openai";
import { aiFormSchema, aiTemplateSchema } from "~/app/(main)/ai/schema";
import { useRouter } from "next/navigation";

export function useAi() {
    const [stage, setStage] = useState<ForgeStage>("compose");
    const [prompt, setPrompt] = useState<string>("");
    const [kind, setKind] = useState<ForgeKind>("form");
    const [draft, setDraft] = useState<DraftPreview | null>(null);
    const { createTemplateAsync } = useCreateTemplate();
    const { createFormAsync } = useCreateForm();
    const router = useRouter()

    const saveDraft = async () => {
        if (!draft) return;

        const asTemplate = draft.kind === TEMPLATE;
        const fields = draft.fields.map(({ id, ...field }) => field);

        try {
            if (asTemplate) {
                await createTemplateAsync({
                    title: draft.title,
                    description: draft.description,
                    fields,
                    status: DRAFT,
                });
            } else {
                await createFormAsync({
                    title: draft.title,
                    description: draft.description,
                    fields,
                    status: DRAFT,
                });
            }

            router.push(asTemplate ? "/templates" : "/forms");
        } catch (err) {
            console.error("Could not save form", err);
            toast.error("Could not save draft");
        }
    };

    const generateFormOrTemplate = async () => {
        setStage("drafting");
        try {
            const schema = kind === "form" ? aiFormSchema : aiTemplateSchema;
            const res = process.env.NODE_ENV === "production" ? await generateTemplateOrForm({ prompt, kind, schema }) : dummyAPIData;

            if (!res) {
                throw new Error(`Something went wrong in generating the ${kind}. Please try again`);
            }

            const asTemplate = kind === TEMPLATE;
            const sanitisedSeed = asTemplate
                ? toBuilderTemplateFromAIAssist(res)
                : toBuilderFormFromAIAssist(res);

            // the review stage renders the seed as-is; saveDraft drops the ids
            setDraft({
                title: sanitisedSeed.title,
                description: sanitisedSeed.description,
                kind,
                fields: sanitisedSeed.fields,
            });
            setStage("review");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Could not generate the ${kind}.`);
            setStage("compose");
        }
    };

    const backToCompose = () => {
        setDraft(null);
        setStage("compose");
    };

    const startOver = () => {
        setPrompt("");
        backToCompose();
    };

    return {
        prompt,
        stage,
        kind,
        draft,
        setKind,
        generateFormOrTemplate,
        saveDraft,
        backToCompose,
        startOver,
        setPrompt,
    };
}
