"use client";
import { useCallback, useMemo } from "react";
import { ASC, DESC, GRID } from "~/app/(main)/constants";
import type { SORT_ORDER, SelectionAll, ToolbarProps } from "~/app/(main)/types";
import { useQueryParams } from "./use-query-params";
import { useUserStore } from "~/app/store/user-store";

const ORDER_VALUES = [ASC, DESC] as readonly SORT_ORDER[];

const TAB_PARAM = "tab";
const SORT_PARAM = "sort";
const ORDER_PARAM = "order";

export type UseToolbarOptions<TTab extends string, TSort extends string> = {
    tabs: readonly TTab[];
    defaultTab: TTab;
    sorts: readonly TSort[];
    defaultSort: TSort;
    defaultOrder: SORT_ORDER;
};


export function useToolbar<TTab extends string, TSort extends string>({
    tabs,
    defaultTab,
    sorts,
    defaultSort,
    defaultOrder,
}: UseToolbarOptions<TTab, TSort>) {
    const { getParam, setParams } = useQueryParams();

    const tab = getParam<TTab>(TAB_PARAM, defaultTab, tabs);
    const sort = getParam<TSort>(SORT_PARAM, defaultSort, sorts);
    const sortOrder = getParam<SORT_ORDER>(ORDER_PARAM, defaultOrder, ORDER_VALUES);
    const storedView = useUserStore((state) => state.settings.view);
    const setView = useUserStore((state) => state.updateSettings);
    const view = storedView ?? GRID;

    const setTab = useCallback(
        (next: TTab) => {
            setParams({ [TAB_PARAM]: next === defaultTab ? null : next, page: null });
        },
        [setParams, defaultTab],
    );

    // same field flips the direction, a new field starts ascending
    const handleSort = useCallback(
        (key: TSort) => {
            const nextOrder = key === sort ? (sortOrder === ASC ? DESC : ASC) : ASC;
            setParams({ [SORT_PARAM]: key, [ORDER_PARAM]: nextOrder, page: null });
        },
        [sort, sortOrder, setParams],
    );

    const toolbarProps: ToolbarProps<TTab, TSort> = useMemo(
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
        status: (tab !== defaultTab ? tab : undefined) as Exclude<TTab, SelectionAll> | undefined,
    };
}
