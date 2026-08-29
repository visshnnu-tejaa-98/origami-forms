import { ListResponseOutputType } from "@repo/services/response/model";
import { ResponseSortField, ResponseTab } from "../constants";

export type ResponseHeaderProps = {
    totalItems: number;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onExportCsv: () => void;
    canExport: boolean;
};

export type ResponsesListProps = {
    responsesData?: ListResponseOutputType;
    listResponsesIsError: boolean;
    refetchResponses: () => void;
    selectedId: string | null;
    checked: Map<string, ListResponseOutputType["responses"][number]>;
    isFiltered: boolean;
    listResponsesIsFetching: boolean;
    setChecked: React.Dispatch<React.SetStateAction<Map<string, ListResponseOutputType["responses"][number]>>>;
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

export type ActionsBarProps = {
    checked: Map<string, ListResponseOutputType["responses"][number]>;
    setChecked: React.Dispatch<React.SetStateAction<Map<string, ListResponseOutputType["responses"][number]>>>;
}