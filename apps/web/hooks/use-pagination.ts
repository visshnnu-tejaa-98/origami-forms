"use client";
import { useCallback } from "react";
import { updatePageOptions } from "~/app/(main)/utils";
import type { PageOptions } from "~/app/(main)/types";
import { useQueryParams } from "./use-query-params";

type UsePaginationOptions = {
    pageSize?: number;
};

export function usePagination({ pageSize = 10 }: UsePaginationOptions = {}) {
    const { searchParams, setParams } = useQueryParams();

    const parsed = Number(searchParams.get("page"));
    const page = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;

    const setPage = useCallback(
        (next: number | ((current: number) => number)) => {
            const value = typeof next === "function" ? next(page) : next;
            const safe = Math.max(1, value);
            setParams({ page: safe === 1 ? null : safe });
        },
        [page, setParams],
    );

    const getPaginationProps = useCallback(
        (data?: PageOptions) => ({
            data,
            pageOptions: data ? updatePageOptions(data) : null,
            setPage,
            showPagination: (data?.totalPages ?? 0) > 1,
        }),
        [setPage],
    );

    return { page, setPage, pageSize, getPaginationProps };
}
