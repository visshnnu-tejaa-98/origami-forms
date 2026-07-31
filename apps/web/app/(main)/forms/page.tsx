"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Icon, type IconName } from "../components/icons";
import { FormsGridSkeleton, FormsTableSkeleton } from "./skeletons";
import "./forms.css";
import { useUser } from "@clerk/nextjs";
import { useListForms } from "~/hooks/use-form";
import { Form, Status } from "../types";
import { toUiForm, updatePageOptions } from "../utils";
import ErrorComponent from "./components/ErrorComponent";
import FromListView from "./components/FormListView";
import FormGridView from "./components/FormGridView";
import Pagination from "../components/Pagination";
import { ARCHIVED, DRAFT, PUBLISHED } from "../constants";

const TABS: { key: Status | "all"; label: string; icon: IconName }[] = [
  { key: "all", label: "All", icon: "forms" },
  { key: PUBLISHED, label: "Live", icon: "eye" },
  { key: DRAFT, label: "Drafts", icon: "edit" },
  { key: ARCHIVED, label: "Archived", icon: "archive" },
];

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
  const [tab, setTab] = useState<Status | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<
    "createdAt" | "updatedAt" | "title" | "status" | "maxSubmissions" | "submissionCount"
  >("createdAt");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [pageOptions, setPageOptions] = useState({});
  const { isLoaded: isUserLoaded, isSignedIn: isUserSignedIn } = useUser();

  // TODO: Add debounce effect for search input
  const { formsData, listFormsIsSuccess, listFormsIsPending, listFormsError, refetchForms } =
    useListForms({
      page,
      pageSize: 10,
      status: tab !== "all" ? tab : undefined,
      search: query !== "" ? query : undefined,
      sortBy: sort,
    });

  useEffect(() => {
    if (listFormsIsSuccess) {
      console.log({ formsData });
      setForms(formsData?.forms.map(toUiForm) || []);
      if (formsData) {
        const { page, pageSize, totalPages, hasNextPage, hasPrevPage, totalItems } = formsData;
        setPageOptions(
          updatePageOptions({
            page,
            pageSize,
            totalPages,
            hasNextPage,
            hasPrevPage,
            totalItems,
          }),
        );
      }
    }
  }, [formsData, tab, query, sort]);

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
            {forms.length} forms folded · {totalResponses} responses gathered so far
          </div>
        </div>
        <div className="head-actions">
          <div className="forms-search">
            <Icon name="search" size={16} />
            {/* TODO: Add clear search text for search box */}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your forms…"
            />
          </div>
          <Link href="#" className="o-btn o-btn--accent">
            <Icon name="plus" size={15} /> New form
          </Link>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className="forms-toolbar">
        <div className="forms-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`forms-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              {/* <span className="tab-count">{counts[t.key] ?? 0}</span> */}
            </button>
          ))}
        </div>

        <span className="spacer" />

        <select
          className="forms-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          aria-label="Sort forms"
        >
          <option value="createdAt">Recently updated</option>
          <option value="submissionCount">Most responses</option>
          <option value="title">Title (A–Z)</option>
        </select>

        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
            aria-label="Grid view"
            title="Grid view"
          >
            <Icon name="grid" size={16} />
          </button>
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
            aria-label="List view"
            title="List view"
          >
            <Icon name="list" size={16} />
          </button>
        </div>
      </div>

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
          {formsData && formsData?.totalPages > 1 && (
            <Pagination data={formsData} setPage={setPage} pageOptions={pageOptions} />
          )}
        </>
      )}
    </div>
  );
};

export default Forms;
