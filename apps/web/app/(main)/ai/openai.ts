"use server";

import { zodTextFormat } from "openai/helpers/zod";
import { GenerateTemplateOrFormProps } from "./types";
import { systemBehaviour } from "./constants";
import { aiTemplateSchema } from "./schema";
import { checkOpenAI } from "~/app/config/openai";

const DEFAULT_MODEL = "gpt-4o-mini";

export const generateTemplateOrForm = async (props: GenerateTemplateOrFormProps) => {
    const { prompt, kind, model = DEFAULT_MODEL } = props;

    const openai = checkOpenAI();

    const response = await openai.responses.parse({
        model,
        input: [
            {
                role: "system",
                content: systemBehaviour,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        text: {
            format: zodTextFormat(aiTemplateSchema, kind),
        },
    });

    const promptResponse = response.output_parsed;

    if (!promptResponse) {
        throw new Error("Something went wrong to generate a form");
    }

    return promptResponse;
};
