"use client";
import React from "react";
import "./toolbar.css";
import { GRID, LIST } from "../constants";
import { Icon, IconName } from "./icons";
import type { SortField, SelectionAll, Status, ToolbarProps } from "../types";

export type ToolbarTab<TTab extends string> = {
    key: TTab;
    label: string;
    icon: IconName;
    count?: number;
};

export type ToolbarSort<TSort extends string> = {
    key: TSort;
    label: string;
};

export type ToolbarClassNames = {
    /** wrapper — e.g. "forms-toolbar", "rsp-toolbar" */
    toolbar?: string;
    /** tab row — e.g. "forms-tabs", "rsp-tabs" */
    tabs?: string;
    /** single tab — e.g. "forms-tab", "rsp-tab" */
    tab?: string;
};

type Props<TTab extends string, TSort extends string> = ToolbarProps<TTab, TSort> & {
    tabs: readonly ToolbarTab<TTab>[];
    sorts: readonly ToolbarSort<TSort>[];
    /** hide the grid/list switch on lists that only render one way */
    showViewToggle?: boolean;
    classNames?: ToolbarClassNames;
    /** what the toolbar filters, for screen readers: "forms", "responses" */
    itemsLabel?: string;
};

const Toolbar = <TTab extends string = Status | SelectionAll, TSort extends string = SortField>({
    tab,
    setTab,
    handleSort,
    sortOrder,
    sort,
    view,
    setView,
    tabs,
    sorts,
    showViewToggle = true,
    classNames,
    itemsLabel = "items",
}: Props<TTab, TSort>) => {
    const cls = {
        toolbar: classNames?.toolbar ?? "forms-toolbar",
        tabs: classNames?.tabs ?? "forms-tabs",
        tab: classNames?.tab ?? "forms-tab",
    };

    return (
        <div className={cls.toolbar}>
            <div className={cls.tabs}>
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        className={`${cls.tab}${tab === t.key ? " active" : ""}`}
                        onClick={() => setTab(t.key)}
                        aria-pressed={tab === t.key}
                    >
                        <Icon name={t.icon} size={14} />
                        {t.label}
                        {t.count !== undefined && <span className="tab-count">{t.count}</span>}
                    </button>
                ))}
            </div>

            <span className="spacer" />

            <div className="sort-group" role="group" aria-label={`Sort ${itemsLabel}`}>
                {sorts.map((s) => {
                    const active = sort === s.key;
                    return (
                        <button
                            key={s.key}
                            className={`sort-chip${active ? " active" : ""}`}
                            onClick={() => handleSort(s.key)}
                            aria-pressed={active}
                            title={
                                active
                                    ? `Sorted by ${s.label} — ${sortOrder === "asc" ? "ascending" : "descending"}`
                                    : `Sort by ${s.label}`
                            }
                        >
                            {s.label}
                            {active && (
                                <Icon name={sortOrder === "asc" ? "arrow-down" : "arrow-up"} size={13} />
                            )}
                        </button>
                    );
                })}
            </div>

            {showViewToggle && (
                <div className="view-toggle" role="group" aria-label="View mode">
                    <button
                        className={view === GRID ? "active" : ""}
                        onClick={() => setView({ view: GRID })}
                        aria-label="Grid view"
                        title="Grid view"
                    >
                        <Icon name="grid" size={16} />
                    </button>
                    <button
                        className={view === LIST ? "active" : ""}
                        onClick={() => setView({ view: LIST })}
                        aria-label="List view"
                        title="List view"
                    >
                        <Icon name="list" size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Toolbar;
