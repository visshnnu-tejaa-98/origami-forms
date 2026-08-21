import type { AnswerValue, FieldBlock } from "~/app/(main)/builder/types";

/** who is walking the flow — a respondent whose answers are kept, or an author looking at
 *  their own form. the two render the same sheets; only the ending differs. */
export type FlowMode = "live" | "preview";

/** the flow anyone walks: a cover, the blocks in order, then the review */
export type FlowStep =
    | { kind: "cover" }
    | { kind: "heading"; id: string; label: string; description?: string }
    | { kind: "page-break"; id: string; label: string; page: number }
    | { kind: "field"; id: string; field: FieldBlock }
    | { kind: "review" };

export type FlowQuestion = Extract<FlowStep, { kind: "field" }>;

export type Answers = Record<string, AnswerValue>;

/** the shape both sources of a form share: the builder's live draft and the published
 *  row the public endpoint hands back */
export type FlowBlock = {
    id: string;
    type: string;
    label: string;
    description?: string | null;
};

export type FormFlow = {
    at: number;
    total: number;
    back: boolean;
    step: FlowStep;
    questions: FlowQuestion[];
    answers: Answers;
    error: string | null;
    setAnswer: (id: string, value: AnswerValue) => void;
    go: (to: number, keepError?: boolean) => void;
    goToQuestion: (question: FlowQuestion, keepError?: boolean) => void;
    goToReview: () => void;
    advance: () => void;
    submit: () => void;
};

export type FormFlowStageProps = {
    mode: FlowMode;
    flow: FormFlow;
    title: string;
    description?: string | null;
    submitting?: boolean;
    status?: string;
    brand?: React.ReactNode;
};

export type FieldCardProps = {
    at: number;
    total: number;
    back?: boolean;
    children: React.ReactNode;
};

export type PublicFormHeaderProps = {
    isPreview: boolean;
    at: number;
    total: number;
    progress: number;
    status: string | undefined;
    brand?: React.ReactNode;
}

export type CoverTypeProps = {
    title: string;
    description?: string | null;
    questions: FlowQuestion[];
    estimatedTime: string;
    mode: FlowMode;
    flow: FormFlow;
    next: () => void
}

export type HeadingTypeProps = {
    step: Extract<FlowStep, { kind: "heading" }>;
    next: () => void;
}

export type PageBreakTypeProps = {
    step: Extract<FlowStep, { kind: "page-break" }>;
    next: () => void;
}

export type InputFieldTypeProps = {
    at: number,
    step: Extract<FlowStep, { kind: "field" }>,
    answers: Answers,
    error: string | null,
    showError: string | boolean | null,
    visitedReviewPage: boolean
    goToReview: () => void,
    setAnswer: (id: string, value: AnswerValue) => void;
    next: () => void,
}

export type ReviewTypeProps = {
    answered: number,
    questions: FlowQuestion[],
    answers: Answers,
    error: string | null,
    isPreview: boolean,
    submitting: boolean,
    setVisitedReviewPage: (visited: boolean) => void,
    goToQuestion: (question: FlowQuestion, keepError?: boolean) => void,
    submit: () => void,
}

export type PublicFormFooterProps = {
    isPreview: boolean
    at: number,
    total: number,
    go: (to: number, keepError?: boolean) => void,
    next: () => void,
}

export type goToQuestionProps = {
    question: FlowQuestion
    from?: string,
    keepError?: boolean
}