"use client";
import { useCallback, useMemo, useState } from "react";
import { ALL, ASC, DESC, UPDATED_AT } from "~/app/(main)/constants";
import type { SORT_ORDER, SelectionAll, SortField, Status, ToolbarProps } from "~/app/(main)/types";

type ViewMode = ToolbarProps["view"];

type UseToolbarOptions = {
    initialTab?: Status | SelectionAll;
    initialSort?: SortField;
    initialSortOrder?: SORT_ORDER;
    initialView?: ViewMode;
};

/**
 * Owns the state behind <Toolbar /> (status tab, sort field + direction, view mode)
 * so any listing page can drop the toolbar in with `<Toolbar {...toolbarProps} />`.
 */
export function useToolbar(options: UseToolbarOptions = {}) {
    const {
        initialTab = ALL,
        initialSort = UPDATED_AT,
        initialSortOrder = DESC,
        initialView = "grid",
    } = options;

    const [tab, setTab] = useState<Status | SelectionAll>(initialTab);
    const [sort, setSort] = useState<SortField>(initialSort);
    const [sortOrder, setSortOrder] = useState<SORT_ORDER>(initialSortOrder);
    const [view, setView] = useState<ViewMode>(initialView);

    // same field flips the direction, a new field starts ascending
    const handleSort = useCallback(
        (key: SortField) => {
            if (key === sort) {
                setSortOrder((o) => (o === ASC ? DESC : ASC));
            } else {
                setSort(key);
                setSortOrder(ASC);
            }
        },
        [sort],
    );

    const toolbarProps: ToolbarProps = useMemo(
        () => ({
            tab,
            setTab,
            sort,
            sortOrder,
            handleSort,
            view,
            setView
        }),
        [tab, sort, sortOrder, handleSort, view],
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
        /** ready to spread into useListForms — `status` is undefined on the "all" tab */
        status: tab !== ALL ? (tab as Status) : undefined,
    };
}
