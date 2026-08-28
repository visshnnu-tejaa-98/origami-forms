"use client";
import { isEqual } from "lodash"
import "./responses.css";
import FloatingResponseOrigamiDecorations from "./components/FloatingResponseOrigamiDecorations";
import { useState } from "react";
import { useListResponses } from "~/hooks/use-response";
import ResponseHeader from "./components/ResponseHeader";
import { usePagination } from "~/hooks/use-pagination";
import ResponsesList from "./components/ResponsesList";
import Pagination from "../components/Pagination";
import { useToolbar } from "~/hooks/use-toolbar";
import {
  ALL,
  DESC,
  RESPONSE_SORTS,
  RESPONSE_SORT_VALUES,
  RESPONSE_STATUS_TABS,
  RESPONSE_TAB_VALUES,
  SUBMITTED_AT,
  defaultResponsesFilterOptions,
  type ResponseSortField,
  type ResponseTab,
} from "../constants";
import GlobalToolar from "../components/Toolbar";
import { useDebounce } from "~/hooks/use-debounce";
import ResponseAnswerDetails from "./components/ResponseAnswerDetails";
import { ResponsesPageSkeleton } from "./skeletons";
import { DefaultFilterOptions } from "./types";
import { useRouter } from "next/navigation";
import { ListResponseOutputType } from "@repo/services/response/model";
import { exportResponsesToCsv } from "./utils";
import ActionsBar from "./components/ActionBar";
import EmptyComponent from "../components/EmptyComponent";

const Responses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Map<string, ListResponseOutputType["responses"][number]>>(
    new Map<string, ListResponseOutputType["responses"][number]>(),
  );

  const debouncedQuery = useDebounce(searchQuery.trim(), 400);
  const { page, pageSize, getPaginationProps } = usePagination({ pageSize: 10 });
  const { toolbarProps, tab, sort, sortOrder, setTab, } = useToolbar<ResponseTab, ResponseSortField>({
    tabs: RESPONSE_TAB_VALUES,
    defaultTab: ALL,
    sorts: RESPONSE_SORT_VALUES,
    defaultSort: SUBMITTED_AT,
    defaultOrder: DESC,
  });
  const { responsesData, listResponsesIsError, listResponsesIsPending, listResponsesIsFetching } =
    useListResponses({
      sortBy: sort,
      sortOrder,
      status: tab,
      search: debouncedQuery !== "" ? debouncedQuery : undefined,
      page: page,
      pageSize: pageSize,
    });

  const router = useRouter()

  const filterOptions: DefaultFilterOptions = {
    sortBy: sort,
    sortOrder,
    status: tab,
    search: debouncedQuery,
  };
  const isFiltered = !isEqual(filterOptions, defaultResponsesFilterOptions);

  const onClearFilters = () => {
    setSearchQuery("");
    setTab(ALL);
  };

  const onClickCreateForm = () => router.push("/builder");

  const firstLoad = listResponsesIsPending && !responsesData;

  if (firstLoad) {
    return (
      <div className="rsp-page">
        <FloatingResponseOrigamiDecorations />
        <ResponsesPageSkeleton />
      </div>
    );
  }

  if (listResponsesIsError || !responsesData) {
    return <EmptyComponent title="Failed to load responses"
      message=""
      onClick={() => { }} />;
  }

  const { totalItems, responses } = responsesData;
  const selected = responses!.find((response) => response.id === selectedId) ?? null;


  const { pageOptions, setPage } = getPaginationProps(responsesData)

  return (
    <div className="rsp-page">
      <FloatingResponseOrigamiDecorations />
      <section className="rsp-list-pane">

        <ResponseHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalItems={totalItems}
          onExportCsv={() => exportResponsesToCsv(responses)}
          canExport={!!checked.size}
        />

        <GlobalToolar
          {...toolbarProps}
          tabs={RESPONSE_STATUS_TABS}
          sorts={RESPONSE_SORTS}
          showViewToggle={false}
          classNames={{ toolbar: "rsp-toolbar", tabs: "rsp-tabs", tab: "rsp-tab" }}
          itemsLabel="responses"
        />

        <ActionsBar checked={checked} setChecked={setChecked} />

        <ResponsesList
          responsesData={responsesData}
          selectedId={selectedId}
          checked={checked}
          isFiltered={isFiltered}
          listResponsesIsFetching={listResponsesIsFetching}
          setSelectedId={setSelectedId}
          setChecked={setChecked}
          onClick={isFiltered ? onClearFilters : onClickCreateForm}
        />

        <Pagination
          data={responsesData}
          pageOptions={pageOptions}
          setPage={setPage}
          className="rsp-pager"
          itemLabel="response"
        />

      </section>

      <ResponseAnswerDetails
        selected={selected}
        setSelectedId={setSelectedId}
      />
    </div>
  );
};

export default Responses;
