import type { RouterOutputs } from "@repo/trpc/client";

/** the form as the public endpoint hands it over */
export type PublicForm = RouterOutputs["forms"]["getPublicForm"];

export type PublicFormField = PublicForm["fields"][number];

export type PublicStateScreenProps = {
    icon: "crane" | "clip" | "lock" | "sparkles";
    title: string;
    description: string;
    action?: { label: string; onClick: () => void };
};