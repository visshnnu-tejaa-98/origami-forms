"use client";
import { trpc } from "~/trpc/client";
import { ListFormsInput } from "@repo/services/form/model";

export function useListForms(props: Omit<ListFormsInput, 'requesterId'>) {
    const queryProps = {} as Omit<ListFormsInput, 'requesterId'>

    if (props.search !== undefined) queryProps.search = props.search
    if (props.visibility !== undefined) queryProps.visibility = props.visibility
    if (props.page !== undefined) queryProps.page = props.page
    if (props.pageSize !== undefined) queryProps.pageSize = props.pageSize
    if (props.sortBy !== undefined) queryProps.sortBy = props.sortBy
    if (props.sortOrder !== undefined) queryProps.sortOrder = props.sortOrder
    if (props.status !== undefined) queryProps.status = props.status
    if (props.maxSubmissions !== undefined) queryProps.maxSubmissions = props.maxSubmissions

    const {
        refetch: refetchForms,
        data: formsData,
        error: listFormsError,
        failureCount: listFormsFailureCount,
        isError: listFormsIsError,
        isSuccess: listFormsIsSuccess,
        status: listFormsStatus,
        isPending: listFormsIsPending
    } = trpc.forms.getAllForms.useQuery(queryProps);
    return {
        listFormsError,
        listFormsFailureCount,
        listFormsIsError,
        listFormsIsSuccess,
        listFormsStatus,
        formsData,
        listFormsIsPending,
        refetchForms,
    };
}
