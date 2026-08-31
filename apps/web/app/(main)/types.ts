import type { Dispatch, SetStateAction } from "react";
import { IconName } from "./components/icons";
import {
    ALL,
    ARCHIVED,
    ASC,
    DESC,
    DRAFT,
    GRID,
    LIST,
    PUBLISHED,
    SUBMISSION_COUNT,
    TITLE_SORT,
    UPDATED_AT,
} from "./constants";
import { UserSettingsType } from "../store/user-store";

export type Status = typeof DRAFT | typeof PUBLISHED | typeof ARCHIVED;

export type Form = {
    id: string;
    title: string;
    slug: string;
    icon: IconName;
    tint: string; // k1..k6
    status: Status;
    responses: number;
    completion: number; // 0..100
    edited: string | null // human label
    editedRank: number; // for sorting (lower = more recent)
    pinned: boolean;
    description: string;
};

export type PageOptions = {
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    pageSize: number;
    totalItems: number;
};

export type SortField = typeof UPDATED_AT | typeof TITLE_SORT | typeof SUBMISSION_COUNT;
export type SelectionAll = typeof ALL;
export type SORT_ORDER = typeof ASC | typeof DESC;

export type ToolbarProps<
    TTab extends string = Status | SelectionAll,
    TSort extends string = SortField,
> = {
    tab: TTab;
    setTab: (tab: TTab) => void;
    handleSort: (sort: TSort) => void;
    sortOrder: SORT_ORDER;
    setView: (settings: Partial<UserSettingsType>) => void
    view: View;
    sort: TSort;
};


export type FormHeaderProps = {
    query: string
    setQuery: (query: string) => void
    totalResponses: number
}

export type View = typeof GRID | typeof LIST

export type PaginationOptions = PageOptions & {
    currentPage: number
    rangeStart: number
    rangeEnd: number
}

export type PaginationProps = {
    data?: PageOptions
    pageOptions: PaginationOptions | null
    setPage: Dispatch<SetStateAction<number>>
    showPagination: boolean
    className?: string
    itemLabel?: string
}

export type FormsContentProps = {
    loading: boolean
    selectedTab: Status | typeof ALL
    forms: Form[]
    view: View
    listFormsError: { message: string } | null | any;
    refetchForms: () => void
    pagination: PaginationProps
}

export type EmptyScreenProps = {
    title: string,
    description: string,
    icon: IconName,
    cta: string,
    onClick: () => void
}