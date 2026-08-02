"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "../components/icons";
import { FormsGridSkeleton, FormsTableSkeleton } from "./skeletons";
import "./forms.css";
import { useUser } from "@clerk/nextjs";
import { useListForms } from "~/hooks/use-form";
import { useDebounce } from "~/hooks/use-debounce";
import { useToolbar } from "~/hooks/use-toolbar";
import { usePagination } from "~/hooks/use-pagination";
import { Form, Status } from "../types";
import { toUiForm } from "../utils";
import ErrorComponent from "./components/ErrorComponent";
import FromListView from "./components/FormListView";
import FormGridView from "./components/FormGridView";
import Pagination from "../components/Pagination";
import Toolbar from "./components/Toolbar";

const EMPTY_COPY: Record<Status | "all", { title: string; body: string }> = {
  all: {
    title: "Your drawer is empty.",
    body: "No forms match that search. Try a different word, or fold a fresh sheet to begin.",
  },
  published: {
    title: "Nothing live yet.",
    body: "Publish a draft and it'll show up here, ready to collect its first response.",
  },
  draft: {
    title: "No drafts on the desk.",
    body: "Every masterpiece starts as a rough fold. Begin a new one whenever inspiration strikes.",
  },
  archived: {
    title: "The archive is spotless.",
    body: "Forms you retire will rest here, safe and out of the way.",
  },
};

const Forms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [query, setQuery] = useState("");
  const { toolbarProps, tab, sort, sortOrder, view, status } = useToolbar();
  const { isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();

  const debouncedQuery = useDebounce(query.trim(), 400);

  const { page, pageSize, setPage, getPaginationProps } = usePagination({
    pageSize: 10,
    resetOn: [debouncedQuery, tab, sort, sortOrder],
  });

  const { formsData, listFormsIsSuccess, listFormsIsPending, listFormsError, refetchForms } =
    useListForms({
      page,
      pageSize,
      status,
      search: debouncedQuery !== "" ? debouncedQuery : undefined,
      sortBy: sort,
      sortOrder,
    });

  const { pageOptions, showPagination } = getPaginationProps(formsData);

  useEffect(() => {
    if (listFormsIsSuccess) {
      setForms(formsData?.forms.map(toUiForm) || []);
    }
  }, [formsData, listFormsIsSuccess]);

  const loading = !isUserLoaded || listFormsIsPending;

  const togglePin = (id: string) =>
    setForms((prev) => prev.map((f) => (f.id === id ? { ...f, pinned: !f.pinned } : f)));

  const totalResponses = forms.reduce((s, f) => s + f.responses, 0).toLocaleString();
  const empty = EMPTY_COPY[tab] ?? {
    title: "Nothing here yet.",
    body: "No forms match — try a different filter, or fold a fresh sheet to begin.",
  };

  return (
    <div className="forms-page">
      {/* floating origami decorations */}
      <div className="forms-deco" aria-hidden>
        <span className="fd fd-crane">
          <Icon name="crane" size={78} />
        </span>
        <span className="fd fd-plane">
          <Icon name="plane" size={48} />
        </span>
        <span className="fd fd-sakura">
          <Icon name="sakura" size={36} />
        </span>
        <span className="fd fd-sakura2">
          <Icon name="sakura" size={22} />
        </span>
      </div>

      {/* HEADER */}
      <header className="forms-head">
        <div>
          <h1>Your paper drawer</h1>
          <div className="sub">
            {/* TODO: This length comes ander analytics, need to work on this, this data changes wrt to teh filter based on status */}
            {formsData?.totalItems} forms folded · {totalResponses} responses gathered so far
          </div>
        </div>
        <div className="head-actions">
          <div className="forms-search">
            <Icon name="search" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your forms…"
            />
            {query !== "" && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                title="Clear search"
              >
                <Icon name="x" size={13} />
              </button>
            )}
          </div>
          <Link href="#" className="o-btn o-btn--accent">
            <Icon name="plus" size={15} /> New form
          </Link>
        </div>
      </header>

      {/* TOOLBAR */}
      <Toolbar {...toolbarProps} />

      {/* GRID / LIST */}
      {loading ? (
        view === "list" ? (
          <FormsTableSkeleton />
        ) : (
          <FormsGridSkeleton />
        )
      ) : listFormsError ? (
        <ErrorComponent
          onClick={refetchForms}
          message={listFormsError.message || "Failed to load forms"}
        />
      ) : forms.length === 0 ? (
        <div className="forms-empty">
          <span className="art">
            <Icon name="crane" size={72} />
          </span>
          <h3>{empty.title}</h3>
          <p>{empty.body}</p>
          <Link href="#" className="o-btn o-btn--accent o-btn--lg">
            <Icon name="plus" size={15} /> Fold a new form
          </Link>
        </div>
      ) : (
        <>
          {view === "list" ? (
            <FromListView forms={forms} togglePin={togglePin} />
          ) : (
            <FormGridView forms={forms} togglePin={togglePin} />
          )}

          {/* PAGINATION — only when the filtered result set exceeds one page */}
          {showPagination && (
            <Pagination data={formsData} setPage={setPage} pageOptions={pageOptions} />
          )}
        </>
      )}
    </div>
  );
};

export default Forms;
