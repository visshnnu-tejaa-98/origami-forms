"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import "./forms.css";
import { FormsGridSkeleton, FormsHeaderSkeleton, ToolbarSkeleton } from "./skeletons";
import { useUser } from "@clerk/nextjs";
import { useListForms } from "~/hooks/use-form";
import { useDebounce } from "~/hooks/use-debounce";
import { useToolbar } from "~/hooks/use-toolbar";
import { usePagination } from "~/hooks/use-pagination";
import { useQueryParams } from "~/hooks/use-query-params";
import { Form, SelectionAll, SortField, Status } from "../types";
import { ALL, DESC, FORM_SORT_VALUES, FORM_TAB_VALUES, UPDATED_AT } from "../constants";
import { toUiForm } from "../utils";
import Toolbar from "./components/Toolbar";
import FormsHeader from "./components/FormsHeader";
import FormsContent from "./components/FormsContent";
import FloatingOrigamiDecorations from "../components/FloatingOrigamiDecorations";
import { useFormStore } from "~/app/store/form-store";

const Forms = () => {
  const { searchParams, setParams } = useQueryParams();
  const { toolbarProps, tab, sort, sortOrder, view, status } = useToolbar<
    Status | SelectionAll,
    SortField
  >({
    tabs: FORM_TAB_VALUES,
    defaultTab: ALL,
    sorts: FORM_SORT_VALUES,
    defaultSort: UPDATED_AT,
    defaultOrder: DESC,
  });
  const { isLoaded: isUserLoaded } = useUser();

  const urlSearch = searchParams.get("search") ?? "";

  const [query, setQuery] = useState(urlSearch);
  const debouncedQuery = useDebounce(query.trim(), 400);

  useEffect(() => {
    if (debouncedQuery === urlSearch) return;
    setParams({ search: debouncedQuery || null, page: null });
  }, [debouncedQuery, urlSearch, setParams]);

  const { page, pageSize, getPaginationProps } = usePagination({ pageSize: 10 });

  const { formsData, listFormsIsPending, listFormsError, refetchForms } = useListForms({
    page,
    pageSize,
    status,
    search: debouncedQuery !== "" ? debouncedQuery : undefined,
    sortBy: sort,
    sortOrder,
  });

  const setFormsToRedux = useFormStore(state => state.setForms)
  useEffect(() => {
    if (!formsData) return;
    setFormsToRedux(formsData);
  }, [formsData, setFormsToRedux]);

  const forms = useMemo<Form[]>(() => formsData?.forms.map(toUiForm) ?? [], [formsData]);

  const loading = !isUserLoaded || listFormsIsPending;

  const firstLoad = loading && !formsData;

  const totalResponses = forms.reduce((s, f) => s + f.responses, 0);

  return (
    <div className="forms-page">
      <FloatingOrigamiDecorations />
      {firstLoad ? (
        <>
          <FormsHeaderSkeleton />
          <ToolbarSkeleton />
        </>
      ) : (
        <>
          <FormsHeader query={query} setQuery={setQuery} totalResponses={totalResponses} />
          <Toolbar {...toolbarProps} onRefresh={refetchForms} />
        </>
      )}
      <FormsContent
        loading={loading}
        selectedTab={tab}
        forms={forms}
        view={view}
        listFormsError={listFormsError}
        refetchForms={refetchForms}
        pagination={getPaginationProps(formsData)}
      />
    </div>
  );
};

const FormsPage = () => (
  <Suspense
    fallback={
      <div className="forms-page">
        <FormsHeaderSkeleton />
        <ToolbarSkeleton />
        <FormsGridSkeleton />
      </div>
    }
  >
    <Forms />
  </Suspense>
);

export default FormsPage;
