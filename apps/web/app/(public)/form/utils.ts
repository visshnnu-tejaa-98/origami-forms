import { FlowStep } from "~/components/form-flow/types";
import { OPTION_TYPES } from "../../(main)/builder/constants";
import type { FieldBlock } from "../../(main)/builder/types";
import type { PublicForm, PublicFormField } from "./types";
import { buildSteps } from "~/components/form-flow/flow";

export const toFieldBlock = (field: PublicFormField): FieldBlock => {
    const question = {
        id: field.id,
        type: field.type,
        label: field.label,
        description: field.description ?? "",
        order: field.order,
        helpText: field.helpText ?? "",
        required: field.required ?? false,
        // the column is loose jsonb; each field type narrows it back to its own shape
        validation: field.validation ?? {},
    };

    if (OPTION_TYPES.includes(field.type)) {
        return {
            ...question,
            options: Array.isArray(field.options) ? field.options : [],
        } as FieldBlock;
    }

    return {
        ...question,
        placeholder: field.placeholder ?? undefined,
        defaultValue: field.defaultValue ?? "",
    } as FieldBlock;
};

export const toSteps = (form: PublicForm): FlowStep[] => buildSteps(form.fields, toFieldBlock);
