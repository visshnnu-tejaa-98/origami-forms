"use client";
import { keepPreviousData } from "@tanstack/react-query";
import { trpc } from "~/trpc/client";
import { ListTemplatesInput } from "@repo/services/templates/model";

export function useCreateTemplate() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createTemplateAsync,
        mutate: createTemplate,
        data: createdTemplate,
        error: createTemplateError,
        isError: createTemplateIsError,
        isSuccess: createTemplateIsSuccess,
        isPending: createTemplateIsPending,
    } = trpc.templates.createTemplate.useMutation({
        onSuccess: () => {
            utils.templates.getAllTemplates.invalidate();
        },
    });

    return {
        createTemplateAsync,
        createTemplate,
        createdTemplate,
        createTemplateError,
        createTemplateIsError,
        createTemplateIsSuccess,
        createTemplateIsPending,
    };
}

export function useTemplateById(templateId: string) {
    const {
        data: templateData,
        error: getTemplateError,
        isError: getTemplateIsError,
        isSuccess: getTemplateIsSuccess,
        isPending: getTemplateIsPending,
        isFetching: getTemplateIsFetching,
        refetch: refetchTemplate,
    } = trpc.templates.getTemplateById.useQuery(
        { templateId },
        {
            enabled: Boolean(templateId),
            // staleTime: 60_000,
        },
    );

    return {
        templateData,
        getTemplateError,
        getTemplateIsError,
        getTemplateIsSuccess,
        getTemplateIsPending,
        getTemplateIsFetching,
        refetchTemplate,
    };
}

export function useListTemplates(
    props: Omit<ListTemplatesInput, "requesterId">,
    options?: { enabled?: boolean },
) {
    const queryProps = {} as Omit<ListTemplatesInput, "requesterId">;

    if (props.scope !== undefined) queryProps.scope = props.scope;
    if (props.search !== undefined) queryProps.search = props.search;
    if (props.status !== undefined) queryProps.status = props.status;
    if (props.page !== undefined) queryProps.page = props.page;
    if (props.pageSize !== undefined) queryProps.pageSize = props.pageSize;
    if (props.sortBy !== undefined) queryProps.sortBy = props.sortBy;
    if (props.sortOrder !== undefined) queryProps.sortOrder = props.sortOrder;

    const {
        refetch: refetchTemplates,
        data: templatesData,
        error: listTemplatesError,
        isError: listTemplatesIsError,
        isSuccess: listTemplatesIsSuccess,
        isPending: listTemplatesIsPending,
        isFetching: listTemplatesIsFetching,
    } = trpc.templates.getAllTemplates.useQuery(queryProps, {
        placeholderData: keepPreviousData,
        enabled: options?.enabled ?? true,
    });

    return {
        templatesData,
        listTemplatesError,
        listTemplatesIsError,
        listTemplatesIsSuccess,
        listTemplatesIsPending,
        listTemplatesIsFetching,
        refetchTemplates,
    };
}

export function useUpdateTemplate() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: updateTemplateAsync,
        mutate: updateTemplate,
        data: updatedTemplate,
        error: updateTemplateError,
        isError: updateTemplateIsError,
        isSuccess: updateTemplateIsSuccess,
        isPending: updateTemplateIsPending,
    } = trpc.templates.updateTemplate.useMutation({
        onSuccess: (_result, variables) => {
            utils.templates.getAllTemplates.invalidate();
            utils.templates.getTemplateById.invalidate({ templateId: variables.templateId });
        },
    });

    return {
        updateTemplateAsync,
        updateTemplate,
        updatedTemplate,
        updateTemplateError,
        updateTemplateIsError,
        updateTemplateIsSuccess,
        updateTemplateIsPending,
    };
}

export function useUseTemplate() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: useTemplateAsync,
        mutate: useTemplate,
        data: usedTemplate,
        error: useTemplateError,
        isError: useTemplateIsError,
        isSuccess: useTemplateIsSuccess,
        isPending: useTemplateIsPending,
        variables: useTemplateVariables,
    } = trpc.templates.useTemplate.useMutation({
        onSuccess: () => {
            utils.forms.getAllForms.invalidate();
            utils.forms.formsStats.invalidate();
        },
    });

    return {
        useTemplateAsync,
        useTemplate,
        usedTemplate,
        useTemplateError,
        useTemplateIsError,
        useTemplateIsSuccess,
        useTemplateIsPending,
        useTemplateVariables,
    };
}

export function useDeleteTemplate() {
    const utils = trpc.useUtils();

    const {
        mutateAsync: deleteTemplateAsync,
        mutate: deleteTemplate,
        data: deletedTemplate,
        error: deleteTemplateError,
        isError: deleteTemplateIsError,
        isSuccess: deleteTemplateIsSuccess,
        isPending: deleteTemplateIsPending,
    } = trpc.templates.deleteTemplate.useMutation({
        onSuccess: (_result, variables) => {
            utils.templates.getAllTemplates.invalidate();
            utils.templates.getTemplateById.invalidate({ templateId: variables.templateId });
        },
    });

    return {
        deleteTemplateAsync,
        deleteTemplate,
        deletedTemplate,
        deleteTemplateError,
        deleteTemplateIsError,
        deleteTemplateIsSuccess,
        deleteTemplateIsPending,
    };
}
