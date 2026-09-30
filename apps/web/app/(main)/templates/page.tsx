"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isEqual } from "lodash";
import "./templates.css";

import { useListTemplates } from "~/hooks/use-template";
import { useDebounce } from "~/hooks/use-debounce";
import { useToolbar } from "~/hooks/use-toolbar";
import { usePagination } from "~/hooks/use-pagination";
import { useQueryParams } from "~/hooks/use-query-params";
import { useUserStore } from "~/app/store/user-store";

import {
    ALL,
    DESC,
    LIBRARY,
    LIKES_SORT,
    MINE,
    TEMPLATE,
    TEMPLATE_SCOPE_VALUES,
    TEMPLATE_SORT_VALUES,
    TEMPLATE_TAB_VALUES,
    UPDATED_AT,
} from "../constants";
import { Template, TemplateScope, TemplateSortField, TemplateTab } from "../types";
import { toUiTemplate } from "../utils";
import Pagination from "../components/Pagination";

import TemplateDecorations from "./components/TemplateDecorations";
import TemplatesHeader from "./components/TemplatesHeader";
import LibraryInvite from "./components/LibraryInvite";
import Toolbar from "./components/Toolbar";
import TemplatesTable from "./components/TemplatesTable";
import TemplateDetail from "./components/TemplateDetail";
import { TemplatesPageSkeleton } from "./skeletons";
import { TemplateFilterOptions } from "./types";

const SCOPE_PARAM = "scope";

const defaultFilters = (scope: TemplateScope): TemplateFilterOptions => ({
    scope,
    status: ALL,
    sortBy: scope === LIBRARY ? LIKES_SORT : UPDATED_AT,
    search: "",
});

const Templates = () => {
    const router = useRouter();
    const { getParam, setParams } = useQueryParams();

    const scope = getParam<TemplateScope>(SCOPE_PARAM, MINE, TEMPLATE_SCOPE_VALUES);
    const isLibrary = scope === LIBRARY;

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const debouncedQuery = useDebounce(searchQuery.trim(), 400);

    const { toolbarProps, tab, sort, sortOrder, status } = useToolbar<TemplateTab, TemplateSortField>(
        {
            tabs: TEMPLATE_TAB_VALUES,
            defaultTab: ALL,
            sorts: TEMPLATE_SORT_VALUES,
            defaultSort: isLibrary ? LIKES_SORT : UPDATED_AT,
            defaultOrder: DESC,
        },
    );

    const pageSizeFromStore = useUserStore((state) => state.settings.formsPerPage);
    const { page, pageSize, setPage, getPaginationProps } = usePagination({
        pageSize: pageSizeFromStore ?? 10,
    });

    const lastQuery = useRef(debouncedQuery);

    useEffect(() => {
        if (lastQuery.current === debouncedQuery) return;
        lastQuery.current = debouncedQuery;
        if (page !== 1) setPage(1);
    }, [debouncedQuery, page, setPage]);

    const {
        templatesData,
        listTemplatesIsError,
        listTemplatesIsPending,
        refetchTemplates,
    } = useListTemplates({
        scope,
        page,
        pageSize,
        status: isLibrary ? undefined : status,
        search: debouncedQuery !== "" ? debouncedQuery : undefined,
        sortBy: sort,
        sortOrder,
    });

    const libraryPeek = useListTemplates(
        { scope: LIBRARY, page: 1, pageSize: 1 },
        { enabled: !isLibrary },
    );

    const templates = useMemo<Template[]>(
        () => templatesData?.templates.map(toUiTemplate) ?? [],
        [templatesData],
    );

    const total = templatesData?.totalItems ?? 0;

    useEffect(() => {
        if (selectedId && !templates.some((t) => t.id === selectedId)) setSelectedId(null);
    }, [templates, selectedId]);

    const goToScope = useCallback(
        (next: TemplateScope) => {
            if (next === scope) return;
            setSelectedId(null);
            setSearchQuery("");
            setParams({
                [SCOPE_PARAM]: next === MINE ? null : next,
                tab: null,
                sort: null,
                order: null,
                page: null,
                search: null,
            });
        },
        [scope, setParams],
    );

    const exploreLibrary = useCallback(() => goToScope(LIBRARY), [goToScope]);
    const backToMine = useCallback(() => goToScope(MINE), [goToScope]);

    const filterOptions: TemplateFilterOptions = {
        scope,
        status: tab,
        sortBy: sort,
        search: debouncedQuery,
    };
    const isFiltered = !isEqual(filterOptions, defaultFilters(scope));

    const onClearFilters = useCallback(() => {
        setSearchQuery("");
        setParams({ tab: null, sort: null, order: null, page: null, search: null });
    }, [setParams]);

    const onCreate = useCallback(() => router.push(`/builder?type=${TEMPLATE}`), [router]);

    if (listTemplatesIsPending && !templatesData) {
        return (
            <div className="tpl-page">
                <TemplateDecorations />
                <TemplatesPageSkeleton scope={scope} />
            </div>
        );
    }

    const selected = templates.find((t) => t.id === selectedId) ?? null;
    const { pageOptions, showPagination } = getPaginationProps(templatesData);

    const shelfIsBare = !isLibrary && templates.length === 0 && !isFiltered;

    return (
        <div className={`tpl-page${isLibrary ? " tpl-page--library" : ""}`}>
            <TemplateDecorations />

            <section className="tpl-list-pane">
                <TemplatesHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    scope={scope}
                    total={total}
                    onCreate={onCreate}
                    onBack={backToMine}
                />

                <Toolbar {...toolbarProps} scope={scope} onRefresh={refetchTemplates} />

                {!isLibrary && (
                    <LibraryInvite
                        total={libraryPeek.templatesData?.totalItems}
                        loading={libraryPeek.listTemplatesIsPending}
                        primary={shelfIsBare}
                        onExplore={exploreLibrary}
                    />
                )}

                <TemplatesTable
                    templates={templates}
                    scope={scope}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    listTemplatesIsError={listTemplatesIsError}
                    refetchTemplates={refetchTemplates}
                    isFiltered={isFiltered}
                    isSearching={debouncedQuery !== ""}
                    selectedTab={tab}
                    onEmptyAction={isFiltered ? onClearFilters : onCreate}
                />

                {showPagination && (
                    <Pagination
                        data={templatesData}
                        pageOptions={pageOptions}
                        setPage={setPage}
                        className="tpl-pager"
                        itemLabel="template"
                    />
                )}
            </section>

            <TemplateDetail
                scope={scope}
                summary={selected}
                onClose={() => setSelectedId(null)}
                onCreate={onCreate}
            />
        </div>
    );
};

const TemplatesPage = () => (
    <Suspense
        fallback={
            <div className="tpl-page">
                <TemplatesPageSkeleton />
            </div>
        }
    >
        <Templates />
    </Suspense>
);

export default TemplatesPage;
