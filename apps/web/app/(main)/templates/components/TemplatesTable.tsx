"use client";

import React from "react";
import { Icon } from "../../components/icons";
import { CardIcon } from "../../forms/components/FormsContent";
import EmptyTemplate from "../../forms/components/EmptyTemplate";
import { ARCHIVED, LIBRARY, LIBRARY_EMPTY_COPY, TEMPLATE_EMPTY_COPY } from "../../constants";
import { TEMPLATE_STATUS_BADGE } from "../../utils";
import { Template, TemplateScope } from "../../types";
import { TemplatesTableProps } from "../types";

const TemplatesTable = (props: TemplatesTableProps) => {
    const {
        templates,
        scope,
        selectedId,
        listTemplatesIsError,
        isFiltered,
        isSearching,
        selectedTab,
        refetchTemplates,
        onEmptyAction,
        setSelectedId,
    } = props;

    const isLibrary = scope === LIBRARY;

    const emptyCopy = isLibrary
        ? isSearching
            ? LIBRARY_EMPTY_COPY.search
            : LIBRARY_EMPTY_COPY.idle
        : (TEMPLATE_EMPTY_COPY[selectedTab] ?? TEMPLATE_EMPTY_COPY.all);

    const renderTemplateMeta = ({
        scope,
        template,
        badge,
    }: {
        scope: TemplateScope;
        template: Template;
        badge: {
            cls: string;
            label: string;
        };
    }) => {
        if (scope === LIBRARY) {
            const author = template.isOwn ? "you" : (template.author ?? "—");
            return (
                <span className="tpl-by">
                    {template.authorAvatarUrl ? (
                        <img className="tpl-by__av" src={template.authorAvatarUrl} alt="" loading="lazy" />
                    ) : (
                        <span className={`tpl-by__av tpl-by__av--initial t-${template.tint}`} aria-hidden>
                            {author?.charAt(0).toUpperCase()}
                        </span>
                    )}
                    <span className="tpl-by__txt">{author}</span>
                </span>
            );
        }
        return <span className={`o-badge ${badge.cls}`}>{badge.label}</span>;
    };

    return (
        <>
            <div
                className={`tpl-table`}
                role="table"
                aria-label={isLibrary ? "The shared library" : "Your templates"}
            >
                <span className="o-tape tpl-table-tape" aria-hidden />

                <div className="tpl-th" role="row">
                    <span>Pattern</span>
                    <span className="col-by">{isLibrary ? "Folded by" : "Status"}</span>
                    <span className="col-likes">Likes</span>
                    <span className="col-updated">Updated</span>
                    <span />
                </div>

                {listTemplatesIsError ? (
                    <EmptyTemplate
                        icon="error"
                        title="That shelf came apart."
                        description="We couldn't reach your templates just now. Nothing is lost — give it another go."
                        cta="Try again"
                        ctaIcon="refresh"
                        onClick={refetchTemplates}
                    />
                ) : (
                    templates.length === 0 && (
                        <EmptyTemplate
                            icon={isLibrary ? "layers" : "templates"}
                            title={emptyCopy.title}
                            description={emptyCopy.description}
                            cta={isFiltered ? "Clear filters" : "New template"}
                            ctaIcon={isFiltered ? "filter" : "plus"}
                            onClick={onEmptyAction}
                        />
                    )
                )}

                {templates.map((t) => {
                    const badge = TEMPLATE_STATUS_BADGE[t.status];
                    const isArchived = t.status === ARCHIVED;
                    const title = t.title || "Untitled template";
                    const likes = t.likes !== 0 ? t.likes : "—";
                    const lastUpdated = t.edited ? t.edited : "—";
                    const description = t.description || "";
                    return (
                        <div
                            key={t.id}
                            className={`tpl-tr ${t.tint}${t.id === selectedId ? " selected" : ""}${isArchived ? " is-archived" : ""}`}
                            role="row"
                            tabIndex={0}
                            aria-selected={t.id === selectedId}
                            onClick={() => setSelectedId(t.id)}
                        >
                            <div className="c-pattern">
                                <CardIcon logoUrl={t.logoUrl} icon={t.icon} isLogoExists={!!t.logoUrl} />
                                <div className="txt">
                                    <span className="title" title={title}>
                                        {title}
                                    </span>
                                    <span className="sub">{description}</span>
                                </div>
                            </div>

                            <div className="cell col-by">{renderTemplateMeta({ template: t, scope, badge })}</div>

                            <div className="cell col-likes">
                                <span className="n">{likes}</span>
                            </div>

                            <div className="cell col-updated">
                                <span className="when">{lastUpdated}</span>
                            </div>

                            <div className="chev" aria-hidden>
                                <Icon name="chevron" size={14} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TemplatesTable;
