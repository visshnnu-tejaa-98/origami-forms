import { z } from "zod";

type ValidateFormProps<T> = {
    schema: z.ZodType<T>;
    input: unknown;
}

type ParsedResult<T> = {
    data: T | undefined;
    error: string | undefined;
    errors: string[]
}

export const validateForm = async <T>(props: ValidateFormProps<T>): Promise<ParsedResult<T>> => {
    const result: ParsedResult<T> = {
        data: undefined,
        error: undefined,
        errors: []
    }

    try {

        if (!props || !props.schema) {
            const errorMessage = "Invalid validation configuration template provided"

            result.error = errorMessage
            result.errors.push(errorMessage)
            return result
        }

        const { schema, input } = props

        const sanitizedInput = typeof input === "object" && input !== null ? input : {};
        const parsedResult = await schema.safeParseAsync(sanitizedInput);
        const { error, data: parsedData } = parsedResult

        if (!parsedResult.success) {
            result.error = error?.issues[0]?.message || "Validation failed!"
            result.errors = error?.issues.map(issue => issue.message) as string[]
            result.data = undefined
        } else {
            result.data = parsedData as T
            result.error = undefined
            result.errors = []
        }
    } catch (error) {
        const errorMessage = "Something went wrong while validating the form, please try again later"
        console.error("Validation Runtime Crash Log:", error);
        result.error = errorMessage
        result.data = undefined
        result.errors = [errorMessage]
    }

    return result
};
