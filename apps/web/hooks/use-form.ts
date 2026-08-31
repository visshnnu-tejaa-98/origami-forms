"use client";
import { trpc } from "~/trpc/client";
import { FormStatsListInputProps, ListFormsInput } from "@repo/services/form/model";

/** the form payload is passed to `createForm(...)` at call time, not to the hook */
export function useCreateForm() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        data: createdForm,
        error: createFormError,
        failureCount: createFormFailureCount,
        isError: createFormIsError,
        isSuccess: createFormIsSuccess,
        status: createFormStatus,
        isPending: createFormIsPending,
    } = trpc.forms.createForm.useMutation({
        onSuccess: () => {
            utils.forms.getAllForms.invalidate();
        },
    });

    return {
        createFormAsync,
        createForm,
        createdForm,
        createFormError,
        createFormFailureCount,
        createFormIsError,
        createFormIsSuccess,
        createFormStatus,
        createFormIsPending,
    };
}

/** the form the builder edits — fields included, ordered by `order` */
export function useFormById(formId: string) {
    const {
        data: formData,
        error: getFormError,
        isError: getFormIsError,
        isSuccess: getFormIsSuccess,
        isPending: getFormIsPending,
        refetch: refetchForm,
    } = trpc.forms.getFormById.useQuery({ formId }, { enabled: Boolean(formId) });

    return { formData, getFormError, getFormIsError, getFormIsSuccess, getFormIsPending, refetchForm };
}

/** the payload is passed to `updateForm(...)` at call time, not to the hook */
export function useUpdateForm() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: updateFormAsync,
        mutate: updateForm,
        data: updatedForm,
        error: updateFormError,
        isError: updateFormIsError,
        isSuccess: updateFormIsSuccess,
        isPending: updateFormIsPending,
    } = trpc.forms.updateForm.useMutation({
        onSuccess: (_result, variables) => {
            utils.forms.getAllForms.invalidate();
            utils.forms.getFormById.invalidate({ formId: variables.formId });
        },
    });

    return {
        updateFormAsync,
        updateForm,
        updatedForm,
        updateFormError,
        updateFormIsError,
        updateFormIsSuccess,
        updateFormIsPending,
    };
}

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

export function useFormsStats(props: Omit<FormStatsListInputProps, 'requesterId'>) {
    const {
        data: formsStatsData,
        error: formsStatsError,
        isError: formsStatsIsError,
        isSuccess: formsStatsIsSuccess,
        isPending: formsStatsIsPending,
        refetch: refetchFormsStats,
    } = trpc.forms.formsStats.useQuery(props)

    return { formsStatsData, formsStatsError, formsStatsIsError, formsStatsIsSuccess, formsStatsIsPending, refetchFormsStats };
}

export function useDeleteForm() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: deleteFormAsync,
        mutate: deleteForm,
        data: deletedForm,
        error: deleteFormError,
        isError: deleteFormIsError,
        isSuccess: deleteFormIsSuccess,
        isPending: deleteFormIsPending,
    } = trpc.forms.deleteForm.useMutation({
        onSuccess: (_result, variables) => {
            utils.forms.getAllForms.invalidate();
            utils.forms.getFormById.invalidate({ formId: variables.formId });
        },
    });

    return {
        deleteFormAsync,
        deleteForm,
        deletedForm,
        deleteFormError,
        deleteFormIsError,
        deleteFormIsSuccess,
        deleteFormIsPending,
    };
}