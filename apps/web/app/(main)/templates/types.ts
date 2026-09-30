import type { RouterOutputs } from "@repo/trpc/client";
import type {
    PaginationProps,
    Template,
    TemplateScope,
    TemplateSortField,
    TemplateTab,
} from "../types";

export type TemplateDetailData = RouterOutputs["templates"]["getTemplateById"];
export type TemplateField = TemplateDetailData["fields"][number];

export type TemplatesHeaderProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    scope: TemplateScope;
    total: number;
    onCreate: () => void;
    onBack: () => void;
};

export type LibraryInviteProps = {
    total: number | undefined;
    loading: boolean;
    primary: boolean;
    onExplore: () => void;
};

export type TemplatesTableProps = {
    templates: Template[];
    scope: TemplateScope;
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    listTemplatesIsError: boolean;
    refetchTemplates: () => void;
    isFiltered: boolean;
    isSearching: boolean;
    selectedTab: TemplateTab;
    onEmptyAction: () => void;
};

export type TemplateDetailProps = {
    summary: Template | null;
    scope: TemplateScope;
    onClose: () => void;
    onCreate: () => void;
};

export type TemplateFilterOptions = {
    scope: TemplateScope;
    status: TemplateTab;
    sortBy: TemplateSortField;
    search: string;
};

export type TemplatesPagerProps = Omit<PaginationProps, "showPagination">;
