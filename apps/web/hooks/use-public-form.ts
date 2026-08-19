"use client";
import { trpc } from "~/trpc/client";

/** the published form behind a public link — no session, both halves of the link required */
export function usePublicForm({ slug, formId }: { slug: string; formId: string }) {
    const {
        data: publicForm,
        error: publicFormError,
        isError: publicFormIsError,
        isSuccess: publicFormIsSuccess,
        isPending: publicFormIsPending,
        refetch: refetchPublicForm,
    } = trpc.forms.getPublicForm.useQuery(
        { slug, formId },
        {
            enabled: Boolean(slug && formId),
            // a respondent gets one shot at a bad link; don't hammer the api behind it
            retry: false,
        },
    );

    return {
        publicForm,
        publicFormError,
        publicFormIsError,
        publicFormIsSuccess,
        publicFormIsPending,
        refetchPublicForm,
    };
}

/** the answers are passed to `submitResponse(...)` at call time, not to the hook */
export function useSubmitPublicResponse() {
    const {
        mutateAsync: submitResponseAsync,
        mutate: submitResponse,
        data: submittedResponse,
        error: submitResponseError,
        isError: submitResponseIsError,
        isSuccess: submitResponseIsSuccess,
        isPending: submitResponseIsPending,
    } = trpc.forms.submitPublicResponse.useMutation();

    return {
        submitResponseAsync,
        submitResponse,
        submittedResponse,
        submitResponseError,
        submitResponseIsError,
        submitResponseIsSuccess,
        submitResponseIsPending,
    };
}
