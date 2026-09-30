"use client";

import React from "react";
import { Icon } from "../../components/icons";
import { LIBRARY } from "../../constants";
import { formatItemCount } from "~/app/utils";
import { TemplatesHeaderProps } from "../types";

const TemplatesHeader = ({
    searchQuery,
    setSearchQuery,
    scope,
    total,
    onCreate,
    onBack,
}: TemplatesHeaderProps) => {
    const isLibrary = scope === LIBRARY;

    return (
        <header className={`tpl-head${isLibrary ? " tpl-head--library" : ""}`}>
            <div className="tpl-head__id">
                <h1>
                    {isLibrary && <button type="button" className="tpl-back" onClick={onBack}>
                        <Icon name="arrow-left" size={15} />
                        Back
                    </button>}
                    {isLibrary ? "Library" : "Templates"}
                </h1>

                <div className="sub">
                    {isLibrary
                        ? `Every pattern other people have shared · ${formatItemCount(total)} to fold from`
                        : `A fold worth repeating · ${formatItemCount(total)} of your own`}
                </div>
            </div>

            <div className="head-actions">
                <div className="tpl-search">
                    <Icon name="search" size={16} />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isLibrary ? "Search the library…" : "Search your templates…"}
                        aria-label={isLibrary ? "Search the library" : "Search your templates"}
                    />
                    {searchQuery !== "" && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <Icon name="x" size={13} />
                        </button>
                    )}
                </div>

                <button type="button" className="o-btn o-btn--sm o-btn--accent" onClick={onCreate}>
                    <Icon name="plus" size={14} /> New template
                </button>
            </div>
        </header>
    );
};

export default TemplatesHeader;
