import React, { useEffect, useState } from 'react'
import { SORTS, STATUS_TABS } from '../../constants';
import { Icon, IconName } from '../../components/icons';
import { SortField, Status, ToolbarProps } from '../../types';
import { useFormStore } from '~/app/store/form-store';
import { ToolbarSkeleton } from '../skeletons';


const Toolbar = (props: ToolbarProps) => {
    const { tab, setTab, handleSort, sortOrder, setView, view, sort } = props
    const formStats = useFormStore((state) => state.formsStats)
    const { published, draft, archived, total } = formStats

    const [tabs, setTabs] = useState(STATUS_TABS)

    useEffect(() => {
        setTabs(prev => prev.map((t) => {
            if (t.key === "published") {
                return { ...t, count: published }
            }
            if (t.key === "draft") {
                return { ...t, count: draft }
            }
            if (t.key === "archived") {
                return { ...t, count: archived }
            }
            if (t.key === "all") {
                return { ...t, count: total }
            }
            return t
        }))
    }, [published, draft, archived])

    return (
        <div className="forms-toolbar">
            <div className="forms-tabs">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        className={`forms-tab${tab === t.key ? " active" : ""}`}
                        onClick={() => setTab(t.key as Status)}
                    >
                        <Icon name={t.icon as IconName} size={14} />
                        {t.label}
                        <span className="tab-count">{t.count}</span>
                    </button>
                ))}
            </div>

            <span className="spacer" />

            <div className="sort-group" role="group" aria-label="Sort forms">
                {SORTS.map((s) => {
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
    )
}

export default Toolbar