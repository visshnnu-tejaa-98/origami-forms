"use client";
import { isEqual } from "lodash"
import "./responses.css";
import FloatingResponseOrigamiDecorations from "./components/FloatingResponseOrigamiDecorations";
import { useEffect, useState } from "react";
import { useListResponses, useResponsesStats } from "~/hooks/use-response";
import ResponseHeader from "./components/ResponseHeader";
import { usePagination } from "~/hooks/use-pagination";
import ResponsesList from "./components/ResponsesList";
import Pagination from "../components/Pagination";
import { useToolbar } from "~/hooks/use-toolbar";
import {
  ALL,
  COMPLETED,
  DESC,
  PARTIAL,
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
import { useResponsesStore } from "~/app/store/responses.store";

const Responses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Map<string, ListResponseOutputType["responses"][number]>>(
    new Map<string, ListResponseOutputType["responses"][number]>(),
  );
  const [tabs, setTabs] = useState(RESPONSE_STATUS_TABS)

  const debouncedQuery = useDebounce(searchQuery.trim(), 400);
  const { page, pageSize, getPaginationProps } = usePagination({ pageSize: 10 });
  const { toolbarProps, tab, sort, sortOrder, setTab, } = useToolbar<ResponseTab, ResponseSortField>({
    tabs: RESPONSE_TAB_VALUES,
    defaultTab: ALL,
    sorts: RESPONSE_SORT_VALUES,
    defaultSort: SUBMITTED_AT,
    defaultOrder: DESC,
  });
  const { responsesData, listResponsesIsError, listResponsesIsPending, listResponsesIsFetching, refetchResponses } =
    useListResponses({
      sortBy: sort,
      sortOrder,
      status: tab,
      search: debouncedQuery !== "" ? debouncedQuery : undefined,
      page: page,
      pageSize: pageSize,
    });

  const { responsesStatsData } = useResponsesStats({})

  const router = useRouter()
  const setResponsesData = useResponsesStore(state => state.setResponsesData)

  useEffect(() => {
    if (responsesData) {
      setResponsesData(responsesData)
    }
  }, [responsesData])

  useEffect(() => {
    if (!responsesStatsData) return;

    const { completed, partial } = responsesStatsData;
    const counts: Record<string, number> = {
      [ALL]: completed + partial,
      [COMPLETED]: completed,
      [PARTIAL]: partial
    };

    setTabs((prev) =>
      prev.map((tab) => ({
        ...tab,
        count: counts[tab.key] ?? tab.count
      }))
    );
  }, [responsesStatsData]);

  useEffect(() => {
    console.log({ tabs })
  }, [tabs])

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

  const responses = responsesData?.responses ?? [];
  const totalItems = responsesData?.totalItems ?? 0;
  const selected = responses.find((response) => response.id === selectedId) ?? null;


  const { pageOptions, setPage } = getPaginationProps(responsesData)

  const handleExportCsv = () => {
    exportResponsesToCsv(Array.from(checked.values()))
    setChecked(new Map())
  }
  return (
    <div className="rsp-page">
      <FloatingResponseOrigamiDecorations />
      <section className="rsp-list-pane">

        <ResponseHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalItems={totalItems}
          onExportCsv={handleExportCsv}
          canExport={!!checked.size}
        />

        <GlobalToolar
          {...toolbarProps}
          tabs={tabs}
          sorts={RESPONSE_SORTS}
          showViewToggle={false}
          classNames={{ toolbar: "rsp-toolbar", tabs: "rsp-tabs", tab: "rsp-tab" }}
          itemsLabel="responses"
        />

        <ActionsBar checked={checked} setChecked={setChecked} />

        <ResponsesList
          responsesData={responsesData}
          listResponsesIsError={listResponsesIsError}
          refetchResponses={refetchResponses}
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
