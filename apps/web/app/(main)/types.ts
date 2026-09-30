import type { Dispatch, SetStateAction } from "react";
import { IconName } from "./components/icons";
import {
    ALL,
    ARCHIVED,
    ASC,
    CREATED_AT,
    DESC,
    DRAFT,
    EXPIRED,
    GRID,
    LIBRARY,
    LIKES_SORT,
    LIST,
    MINE,
    PUBLISHED,
    SUBMISSION_COUNT,
    TITLE_SORT,
    UPDATED_AT,
} from "./constants";
import { UserSettingsType } from "../store/user-store";

export type Status = typeof DRAFT | typeof PUBLISHED | typeof ARCHIVED | typeof EXPIRED

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
    logoUrl: string
};

export type TemplateStatus = typeof DRAFT | typeof PUBLISHED | typeof ARCHIVED;

export type TemplateTab = TemplateStatus | SelectionAll;

export type TemplateSortField =
    | typeof UPDATED_AT
    | typeof TITLE_SORT
    | typeof CREATED_AT
    | typeof LIKES_SORT;

export type TemplateScope = typeof MINE | typeof LIBRARY;

export type TemplateCreator = {
    id: string;
    firstName: string;
    lastName?: string | null;
    avatarUrl?: string | null;
};

export type Template = {
    id: string;
    title: string;
    slug: string;
    icon: IconName;
    tint: string; // k1..k6
    status: TemplateStatus;
    likes: number;
    isOwn: boolean;
    author: string | null;
    authorAvatarUrl: string | null;
    description: string;
    logoUrl: string;
    edited: string | null;
    created: string | null;
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
    onRefresh?: () => void;
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
    ctaIcon?: IconName,
    onClick: () => void
}

export type ZustandLocalStorageType = {
    state: {
        settings: UserSettingsType;
    };
};

export type ActivityContentProps = {
    creatorId: string,
    respondeeId: string,
    creatorName: string,
    respondeeName: string;
    creatorAvatarUrl: string;
    respondeeAvatarUrl: string;
    activityType: string;
    formName: string;
    occuredAt: string;
};

export type FormStatsProps = {
    totalResponses: string,
    completionRate: number,
    formatCompletionTime: (time: number) => string,
    avgTimeCompletion: number,
    totalViews: string,
}