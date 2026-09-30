"use client";

import React from "react";
import { Ink, Slab, ToolbarSkeleton } from "../forms/skeletons";
import { LIBRARY, MINE } from "../constants";
import type { TemplateScope } from "../types";

const Bar = ({ w, h = 10 }: { w: string | number; h?: number }) => (
    <span className="sk sk-shimmer" style={{ width: w, height: h }} />
);

/* HEADER · title, subtitle, search and the one action. The library's also has the
   way back above its title, so the block below it does not jump on arrival. */
export const TemplatesHeaderSkeleton = ({ scope = MINE }: { scope?: TemplateScope }) => {
    const isLibrary = scope === LIBRARY;

    return (
        <header className={`tpl-head${isLibrary ? " tpl-head--library" : ""}`} aria-hidden>
            <div className="tpl-head__id">
                {isLibrary && (
                    <span className="tpl-back">
                        <Ink w={170} h="0.8em" />
                    </span>
                )}
                <h1>
                    <Ink w={isLibrary ? 150 : 230} h="0.66em" />
                </h1>
                <div className="sub">
                    <Ink w={300} />
                </div>
            </div>
            <div className="head-actions">
                <Slab w={240} h={38} r={12} />
                <Slab w={140} h={38} r={12} />
            </div>
        </header>
    );
};

/* TOOLBAR · four status pills and three sort chips, no view toggle. */
export const TemplatesToolbarSkeleton = ({ showTabs = true }: { showTabs?: boolean }) => (
    <ToolbarSkeleton
        classNames={{ toolbar: "tpl-toolbar", tabs: "tpl-tabs" }}
        tabWidths={showTabs ? [72, 96, 88, 104] : []}
        sortWidth={240}
        showViewToggle={false}
    />
);

/* TABLE · rows that mirror the real template columns. */
export const TemplatesTableSkeleton = ({ count = 8 }: { count?: number }) => (
    <div className="tpl-table" aria-hidden>
        <div className="tpl-th">
            <span>Pattern</span>
            <span className="col-by">Status</span>
            <span className="col-likes">Likes</span>
            <span className="col-updated">Updated</span>
            <span />
        </div>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="tpl-tr sk-row">
                <div className="c-pattern">
                    <span className="sk sk-shimmer sk-ic-sm" />
                    <div className="txt" style={{ flex: 1 }}>
                        <Bar w="54%" h={11} />
                        <div style={{ marginTop: 6 }}>
                            <Bar w="76%" h={8} />
                        </div>
                    </div>
                </div>
                <div className="cell col-by">
                    <span className="sk sk-shimmer" style={{ width: 58, height: 18, borderRadius: 999 }} />
                </div>

                <div className="cell col-likes">
                    <Bar w={30} h={12} />
                </div>
                <div className="cell col-updated">
                    <Bar w="70%" h={9} />
                </div>
                <div className="chev" />
            </div>
        ))}
    </div>
);

/* PAGER · the info line and a short run of page buttons. */
export const TemplatesPagerSkeleton = () => (
    <nav className="tpl-pager" aria-hidden>
        <span className="pager-info">
            <Ink w={170} />
        </span>
        <div className="pager-controls">
            {[32, 32, 32].map((w, i) => (
                <Slab key={i} w={w} h={32} r={9} />
            ))}
            <Slab w={72} h={32} r={9} />
        </div>
    </nav>
);

/* DETAIL · the question list waiting on its fetch. Used inside the real panel, so it
   draws the questions alone — the head and the meta grid are already on screen. */
export const TemplateDetailSkeleton = ({ count = 5 }: { count?: number }) => (
    <div aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
            <div className="tpl-q" key={i}>
                <div className="tpl-q__lbl">
                    <Slab w={92} h={17} r={5} />
                </div>
                <div className="tpl-q__q">
                    <Ink w={i % 2 === 0 ? "84%" : "62%"} h="0.8em" />
                </div>
                {i % 3 === 0 && (
                    <div className="tpl-q__opts">
                        <Slab w={66} h={22} r={999} />
                        <Slab w={82} h={22} r={999} />
                    </div>
                )}
            </div>
        ))}
    </div>
);

/* DETAIL PANE · the whole right pane on the page's first paint. */
export const TemplateDetailPaneSkeleton = () => (
    <aside className="tpl-detail-pane" aria-hidden>
        <header className="tpl-detail-head">
            <span className="sk sk-shimmer sk-ic" />
            <div className="id-block">
                <div className="nm">
                    <Ink w={150} h="0.7em" />
                </div>
                <div className="meta">
                    <Ink w={120} h="0.7em" />
                </div>
            </div>
        </header>
        <div className="tpl-detail-body">
            <div className="tpl-meta">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div className="item" key={i}>
                        <b>
                            <Ink w="66%" h="0.8em" />
                        </b>
                        <Ink w="48%" h="0.7em" />
                    </div>
                ))}
            </div>
            <div className="tpl-qs-rule">
                <span className="lbl">
                    <Ink w={90} h="0.7em" />
                </span>
                <span className="line" />
            </div>
            <TemplateDetailSkeleton count={3} />
        </div>
    </aside>
);

/* The whole page while the first fetch is in flight. The library's view has no status
   pills and no invite, so its skeleton does not promise either. */
export const TemplatesPageSkeleton = ({ scope = MINE }: { scope?: TemplateScope }) => (
    <>
        <section className="tpl-list-pane">
            <TemplatesHeaderSkeleton scope={scope} />
            <TemplatesToolbarSkeleton showTabs={scope !== LIBRARY} />
            <TemplatesTableSkeleton />
            <TemplatesPagerSkeleton />
        </section>
        <TemplateDetailPaneSkeleton />
    </>
);
