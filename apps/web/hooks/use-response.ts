import { trpc } from "~/trpc/client";
import { ListResponsesInput } from "@repo/services/response/model";

export function useListResponses(props: Omit<ListResponsesInput, "requesterId">) {
    const {
        data: responsesData,
        error: listResponsesError,
        failureCount: listResponsesFailureCount,
        isError: listResponsesIsError,
        isSuccess: listResponsesIsSuccess,
        status: listResponsesStatus,
        isPending: listResponsesIsPending,
        refetch: refetchResponses,
    } = trpc.responses.listResponses.useQuery(props);
    return {
        responsesData,
        listResponsesError,
        listResponsesFailureCount,
        listResponsesIsError,
        listResponsesIsSuccess,
        listResponsesStatus,
        listResponsesIsPending,
        refetchResponses,
    };
}
