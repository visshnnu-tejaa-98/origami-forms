import type { IconName } from "../components/icons";
import type { BuilderField, Tint } from "../builder/types";
import { ZodObject } from "zod";

export type ForgeKind = "form" | "template";

export type ForgeStage = "compose" | "drafting" | "review";

export type InputRoleType = "user" | "system" | "assistant" | "tool";

export type AiHeaderProps = {
    stage: ForgeStage;
    startOver: () => void
}

export type PromptForgeProps = {
    prompt: string
    kind: ForgeKind
    onPromptChange: (prompt: string) => void
    onKindChange: (kind: ForgeKind) => void
    onGenerate: () => void
}

export type DraftReviewProps = {
    draft: DraftPreview
    onDiscard: () => void
    onRefine: () => void
    saveDraft: () => void
}

export type DraftField = {
    id: string;
    type: string;
    label: string;
    helpText?: string;
    required?: boolean;
    options?: string[];
};

export type DraftPreview = {
    title: string;
    description?: string;
    kind: ForgeKind;
    fields: BuilderField[]
};

export type RecentDraft = {
    id: string;
    title: string;
    kind: ForgeKind;
    questions: number;
    when: string;
};

export type Example = {
    id: string;
    title: string;
    blurb: string;
    prompt: string;
    icon: IconName;
    tint: Tint;
};

export type InputRole = {
    role: InputRoleType
    content: string
}

export type GenerateTemplateOrFormProps = {
    prompt: string;
    kind: ForgeKind;
    schema: ZodObject
    model?: string;
}