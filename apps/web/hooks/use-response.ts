import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "~/trpc/client";
import { FormResponsesStatsInputType, IsUserGaveResponseForFormInputType, ListResponsesInput } from "@repo/services/response/model";

export function useListResponses(props: Omit<ListResponsesInput, "requesterId">) {
    const {
        data: responsesData,
        error: listResponsesError,
        failureCount: listResponsesFailureCount,
        isError: listResponsesIsError,
        isSuccess: listResponsesIsSuccess,
        status: listResponsesStatus,
        isPending: listResponsesIsPending,
        isFetching: listResponsesIsFetching,
        refetch: refetchResponses,
    } = trpc.responses.listResponses.useQuery(props, {
        placeholderData: keepPreviousData,
    });
    return {
        responsesData,
        listResponsesError,
        listResponsesFailureCount,
        listResponsesIsError,
        listResponsesIsSuccess,
        listResponsesStatus,
        listResponsesIsPending,
        listResponsesIsFetching,
        refetchResponses,
    };
}

export function useResponsesStats(props: Omit<FormResponsesStatsInputType, "requesterId">) {
    const {
        data: responsesStatsData,
        error: responsesStatsError,
        failureCount: responsesStatsFailureCount,
        isError: responsesStatsIsError,
        isSuccess: responsesStatsIsSuccess,
        status: responsesStatsStatus,
        isPending: responsesStatsIsPending,
        isFetching: responsesStatsIsFetching,
        refetch: refetchResponsesStats,
    } = trpc.responses.responsesStats.useQuery(props)
    return {
        responsesStatsData,
        responsesStatsError,
        responsesStatsFailureCount,
        responsesStatsIsError,
        responsesStatsIsSuccess,
        responsesStatsStatus,
        responsesStatsIsPending,
        responsesStatsIsFetching,
        refetchResponsesStats,
    };
}

export function useIsUserGaveResponseForForm(
    props: Omit<IsUserGaveResponseForFormInputType, "requesterId">,
    options?: { enabled?: boolean },
) {
    const {
        data: isUserGaveResponseForFormData,
        error: isUserGaveResponseForFormError,
        failureCount: isUserGaveResponseForFormFailureCount,
        isError: isUserGaveResponseForFormIsError,
        isSuccess: isUserGaveResponseForFormIsSuccess,
        status: isUserGaveResponseForFormStatus,
        isPending: isUserGaveResponseForFormIsPending,
        isFetching: isUserGaveResponseForFormIsFetching,
        refetch: refetchIsUserGaveResponseForForm,
    } = trpc.responses.isUserGaveResponseForForm.useQuery(props, {
        enabled: options?.enabled ?? true,
    })
    return {
        isUserGaveResponseForFormData,
        isUserGaveResponseForFormError,
        isUserGaveResponseForFormFailureCount,
        isUserGaveResponseForFormIsError,
        isUserGaveResponseForFormIsSuccess,
        isUserGaveResponseForFormStatus,
        isUserGaveResponseForFormIsPending,
        isUserGaveResponseForFormIsFetching,
        refetchIsUserGaveResponseForForm,
    };
}