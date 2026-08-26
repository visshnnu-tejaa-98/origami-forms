import { ListResponseOutputType } from "@repo/services/response/model";
import { ResponseSortField, ResponseTab } from "../constants";

export type ResponseHeaderProps = {
    totalItems: number;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
};

export type ResponsesListProps = {
    responsesData: ListResponseOutputType;
    selectedId: string | null;
    checked: Set<string>;
    isFiltered: boolean;
    listResponsesIsFetching: boolean;
    setSelectedId: (id: string | null) => void;
    onClick: () => void;
};

export type ResponseAnswerDetailsProps = {
    selected: ListResponseOutputType["responses"][number] | null;
    setSelectedId: (id: string | null) => void;
};

export type DefaultFilterOptions = {
    sortBy: ResponseSortField;
    sortOrder: "asc" | "desc";
    status: ResponseTab;
    search: string;
};
