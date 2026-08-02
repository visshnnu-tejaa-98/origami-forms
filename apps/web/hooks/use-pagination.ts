"use client";
import { useCallback, useEffect, useState } from "react";
import { updatePageOptions } from "~/app/(main)/utils";
import type { PageOptions } from "~/app/(main)/types";

type UsePaginationOptions = {
    pageSize?: number;
    resetOn?: unknown[];
};

/**
 * Owns the page number and derives everything <Pagination /> needs.
 *
 * `page`/`pageSize` feed the list query; once the query has returned, call
 * `getPaginationProps(data)` to get the props to spread into <Pagination />.
 */
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
            /** render <Pagination /> only when there's more than one page to move between */
            showPagination: (data?.totalPages ?? 0) > 1,
        }),
        [],
    );

    return { page, setPage, pageSize, getPaginationProps };
}
