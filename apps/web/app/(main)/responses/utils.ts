import type { ListResponseOutputType } from "@repo/services/response/model";
import { formatCompletionTime } from "~/app/utils";

type ResponseRow = ListResponseOutputType["responses"][number];

/** columns that every response has, before its answers */
const META_COLUMNS = [
    "Response ID",
    "Name",
    "Email",
    "Form",
    "Status",
    "Submitted at",
    "Completion time",
] as const;

/** layout-only fields carry no answer, so they earn no column */
const NON_ANSWER_FIELD_TYPES = new Set(["heading", "page_break"]);

/** RFC-4180 quoting — wraps every cell and doubles any quote inside it */
const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

const metaCells = (response: ResponseRow): string[] => [
    response.id,
    response.name ?? "",
    response.email ?? "",
    response.formTitle ?? "",
    response.status,
    response.submittedAt ?? "",
    response.completionTimeInSec != null ? formatCompletionTime(response.completionTimeInSec) : "",
];

/**
 * Question columns across the whole selection, in the order the fields appear
 * in a form. Responses can come from different forms, so the header is the
 * union of their questions and a response simply leaves the others blank.
 */
const questionColumns = (responses: ResponseRow[]): string[] => {
    const seen = new Map<string, number>();

    for (const response of responses) {
        for (const answer of response.answers ?? []) {
            if (NON_ANSWER_FIELD_TYPES.has(answer.fieldType)) continue;
            const label = answer.fieldLabel?.trim() || answer.fieldId;
            if (!seen.has(label)) seen.set(label, answer.order ?? seen.size);
        }
    }

    return [...seen.entries()].sort((a, b) => a[1] - b[1]).map(([label]) => label);
};

/** one CSV document for the given responses — meta columns, then every question */
export const responsesToCsv = (responses: ResponseRow[]): string => {
    const questions = questionColumns(responses);
    const header = [...META_COLUMNS, ...questions];

    const rows = responses.map((response) => {
        const answers = new Map(
            (response.answers ?? []).map((answer) => [
                answer.fieldLabel?.trim() || answer.fieldId,
                answer.value ?? "",
            ]),
        );

        return [...metaCells(response), ...questions.map((label) => answers.get(label) ?? "")];
    });

    // the BOM keeps Excel from mangling non-ASCII (names, 日本語 answers)
    return "﻿" + [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
};

/** hand the browser a file to save — no-op outside the browser */
export const downloadCsv = (csv: string, fileName: string) => {
    if (typeof window === "undefined") return;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

/** `responses-2026-08-26.csv`, or `responses-selected-2026-08-26.csv` */
export const csvFileName = (prefix = "responses") =>
    `${prefix}-${new Date().toISOString().slice(0, 10)}.csv`;

export const exportResponsesToCsv = (responses: ResponseRow[], fileName = csvFileName()) => {
    if (responses.length === 0) return 0;

    downloadCsv(responsesToCsv(responses), fileName);
    return responses.length;
};
