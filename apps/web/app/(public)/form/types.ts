import type { RouterOutputs } from "@repo/trpc/client";
import type { AnswerValue, FieldBlock } from "../../(main)/builder/types";

/** the form as the public endpoint hands it over */
export type PublicForm = RouterOutputs["forms"]["getPublicForm"];

export type PublicFormField = PublicForm["fields"][number];

/** the flow a respondent walks: a cover, the blocks in order, then the review */
export type PublicStep =
    | { kind: "cover" }
    | { kind: "heading"; id: string; label: string; description?: string }
    | { kind: "page-break"; id: string; label: string; page: number }
    | { kind: "field"; id: string; field: FieldBlock }
    | { kind: "review" };

export type PublicQuestion = Extract<PublicStep, { kind: "field" }>;

export type Answers = Record<string, AnswerValue>;

export type PublicFormStageProps = {
    form: PublicForm;
    at: number;
    total: number;
    back: boolean;
    step: PublicStep;
    questions: PublicQuestion[];
    answers: Answers;
    setAnswer: (id: string, value: AnswerValue) => void;
    go: (to: number) => void;
    /** walks to the sheet a given question lives on — headings and page breaks sit in
     *  the same run of steps, so a question's place in the flow is not its place in the list */
    goToQuestion: (question: PublicQuestion) => void;
    advance: () => void;
    error: string | null;
    submit: () => void;
    submitting: boolean;
};

export type PublicStateScreenProps = {
    icon: "crane" | "clip" | "lock" | "sparkles";
    title: string;
    description: string;
    /** an optional action shown under the copy */
    action?: { label: string; onClick: () => void };
};
