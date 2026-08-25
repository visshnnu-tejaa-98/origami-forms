"use client";
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
  type ResponseSortField,
  type ResponseTab,
} from "../constants";
import GlobalToolar from "../components/Toolbar";
import { useDebounce } from "~/hooks/use-debounce";
import ResponseAnswerDetails from "./components/ResponseAnswerDetails";

const Responses = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const debouncedQuery = useDebounce(searchQuery.trim(), 400);

  const { page, pageSize, getPaginationProps } = usePagination({ pageSize: 10 });
  const { toolbarProps, tab, sort, sortOrder, view } = useToolbar<ResponseTab, ResponseSortField>({
    tabs: RESPONSE_TAB_VALUES,
    defaultTab: ALL,
    sorts: RESPONSE_SORT_VALUES,
    defaultSort: SUBMITTED_AT,
    defaultOrder: DESC,
  });
  const { responsesData, listResponsesIsError, listResponsesIsPending, refetchResponses } =
    useListResponses({
      sortBy: sort,
      sortOrder,
      status: tab,
      search: debouncedQuery !== "" ? debouncedQuery : undefined,
      page: page,
      pageSize: pageSize,
    });




  console.log({ responsesData });

  if (listResponsesIsPending) {
    return <>Loading...</>;
  }

  if (listResponsesIsError || !responsesData) {
    return <>Error loading responses</>;
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
        />

        <GlobalToolar
          {...toolbarProps}
          tabs={RESPONSE_STATUS_TABS}
          sorts={RESPONSE_SORTS}
          showViewToggle={false}
          classNames={{ toolbar: "rsp-toolbar", tabs: "rsp-tabs", tab: "rsp-tab" }}
          itemsLabel="responses"
        />

        <ResponsesList
          responsesData={responsesData}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          checked={checked}
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
