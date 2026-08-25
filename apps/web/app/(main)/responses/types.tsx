import { ListResponseOutputType } from "@repo/services/response/model";

export type ResponseHeaderProps = {
    totalItems: number;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export type ResponsesListProps = {
    responsesData: ListResponseOutputType,
    selectedId: string | null,
    setSelectedId: (id: string | null) => void,
    checked: Set<string>
}