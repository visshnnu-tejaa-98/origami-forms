"use client";

import React from "react";
import { Icon } from "../../components/icons";
import { PaperStar } from "../../components/origami-art";
import { LibraryInviteProps } from "../types";

const LibraryInvite = ({ total, loading, primary, onExplore }: LibraryInviteProps) => {
    if (!loading && total === 0) return null;

    const count = loading || total === undefined ? null : total;

    return (
        <section className={`tpl-invite${primary ? " tpl-invite--primary" : ""}`}>
            <span className="tpl-invite__art" aria-hidden>
                <PaperStar size={primary ? 40 : 30} />
            </span>

            <div className="tpl-invite__txt">
                <strong>Want to use a template from others?</strong>
                <span>
                    {count === null
                        ? "Patterns shared across the workspace, ready to fold from."
                        : `${count.toLocaleString()} ${count === 1 ? "pattern" : "patterns"} shared across the workspace, ready to fold from.`}
                </span>
            </div>

            <button
                type="button"
                className={`o-btn ${primary ? "o-btn--accent" : "o-btn--sm"} tpl-invite__cta`}
                onClick={onExplore}
            >
                <Icon name="layers" size={14} /> Explore library
                <Icon name="arrow" size={13} />
            </button>
        </section>
    );
};

export default LibraryInvite;
