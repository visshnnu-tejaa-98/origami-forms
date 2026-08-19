"use client";
import { useCallback, useMemo } from "react";
import {
    ALL,
    ASC,
    DESC,
    FORM_STATUS_OPTIONS,
    GRID,
    SORTS,
    UPDATED_AT,
} from "~/app/(main)/constants";
import type { SORT_ORDER, SelectionAll, SortField, Status, ToolbarProps } from "~/app/(main)/types";
import { useQueryParams } from "./use-query-params";
import { useUserStore } from "~/app/store/user-store";

const TAB_VALUES = [ALL, ...FORM_STATUS_OPTIONS] as readonly (Status | SelectionAll)[];
const SORT_VALUES = SORTS.map((s) => s.key) as readonly SortField[];
const ORDER_VALUES = [ASC, DESC] as readonly SORT_ORDER[];

export function useToolbar() {
    const { getParam, setParams } = useQueryParams();

    const tab = getParam("tab", ALL as Status | SelectionAll, TAB_VALUES);
    const sort = getParam("sort", UPDATED_AT as SortField, SORT_VALUES);
    const sortOrder = getParam("order", DESC as SORT_ORDER, ORDER_VALUES);
    const storedView = useUserStore(state => state.settings.view)
    const setView = useUserStore(state => state.updateSettings)
    const view = storedView ?? GRID;

    const setTab = useCallback(
        (next: Status | SelectionAll) => {
            setParams({ tab: next === ALL ? null : next, page: null });
        },
        [setParams],
    );

    // same field flips the direction, a new field starts ascending
    const handleSort = useCallback(
        (key: SortField) => {
            const nextOrder = key === sort ? (sortOrder === ASC ? DESC : ASC) : ASC;
            setParams({ sort: key, order: nextOrder, page: null });
        },
        [sort, sortOrder, setParams],
    );

    const toolbarProps: ToolbarProps = useMemo(
        () => ({
            tab,
            setTab,
            sort,
            sortOrder,
            handleSort,
            view,
            setView,
        }),
        [tab, setTab, sort, sortOrder, handleSort, view, setView],
    );

    return {
        toolbarProps,
        tab,
        sort,
        sortOrder,
        view,
        setTab,
        setView,
        handleSort,
        status: tab !== ALL ? (tab as Status) : undefined,
    };
}
