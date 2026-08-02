"use client";
import { useCallback, useEffect, useState } from "react";
import { updatePageOptions } from "~/app/(main)/utils";
import type { PageOptions } from "~/app/(main)/types";

type UsePaginationOptions = {
    pageSize?: number;
    resetOn?: unknown[];
};

export function usePagination({ pageSize = 10, resetOn = [] }: UsePaginationOptions = {}) {
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, resetOn);

    const getPaginationProps = useCallback(
        (data?: PageOptions) => ({
            data,
            pageOptions: data ? updatePageOptions(data) : null,
            setPage,
            showPagination: (data?.totalPages ?? 0) > 1,
        }),
        [],
    );

    return { page, setPage, pageSize, getPaginationProps };
}
