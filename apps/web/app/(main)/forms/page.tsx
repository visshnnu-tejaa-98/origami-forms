"use client";

import React, { useMemo, useState } from "react";
import { Icon } from "../components/icons";
import "./forms.css";
import { useUser } from "@clerk/nextjs";
import { useListForms } from "~/hooks/use-form";
import { useDebounce } from "~/hooks/use-debounce";
import { useToolbar } from "~/hooks/use-toolbar";
import { usePagination } from "~/hooks/use-pagination";
import { Form } from "../types";
import { toUiForm } from "../utils";
import Toolbar from "./components/Toolbar";
import FormsHeader from "./components/FormsHeader";
import FormsContent from "./components/FormsContent";
import FloatingOrigamiDecorations from "../components/FloatingOrigamiDecorations";


const Forms = () => {
  const [query, setQuery] = useState("");
  const { toolbarProps, tab, sort, sortOrder, view, status } = useToolbar();
  const { isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();

  const debouncedQuery = useDebounce(query.trim(), 400);

  const { page, pageSize, getPaginationProps } = usePagination({
    pageSize: 10,
    resetOn: [debouncedQuery, tab, sort, sortOrder],
  });

  const { formsData, listFormsIsPending, listFormsError, refetchForms } =
    useListForms({
      page,
      pageSize,
      status,
      search: debouncedQuery !== "" ? debouncedQuery : undefined,
      sortBy: sort,
      sortOrder,
    });


  const forms = useMemo<Form[]>(() => formsData?.forms.map(toUiForm) ?? [], [formsData]);

  const loading = !isUserLoaded || listFormsIsPending;

  const totalResponses = forms.reduce((s, f) => s + f.responses, 0);

  return (
    <div className="forms-page">=
      <FloatingOrigamiDecorations />
      <FormsHeader
        query={query}
        setQuery={setQuery}
        totalForms={formsData?.totalItems ?? 0}
        totalResponses={totalResponses}
      />
      <Toolbar {...toolbarProps} />
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

export default Forms;
