"use client";

import React, { useState } from "react";
import { Icon } from "../../components/icons";
import { CardIcon } from "../../forms/components/FormsContent";
import { PaperStar } from "../../components/origami-art";
import { useDeleteTemplate, useTemplateById } from "~/hooks/use-template";
import { TEMPLATE_STATUS_BADGE, estimatedTimeToCompleteForm, hash } from "../../utils";
import { PUBLISHED, TINTS } from "../../constants";
import { BLOCK_META, LAYOUT_TYPES, OPTION_TYPES } from "../../builder/constants";
import { TemplateDetailProps, TemplateField } from "../types";
import { TemplateDetailSkeleton } from "../skeletons";
import { useTemplateAsForm } from "../useTemplaateAsForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Template } from "../../types";
import { toast } from "~/components/origami/toast-store";
import { DRAFT } from "@repo/database/constants";
import { useRouter } from "next/navigation";

/** the options column is loose jsonb — an unset list arrives as `{}` rather than `[]` */
const optionsOf = (field: TemplateField) =>
    Array.isArray(field.options) ? field.options : [];

const MAX_OPTIONS_SHOWN = 4;

const Question = ({ field, index }: { field: TemplateField; index: number }) => {
    const meta = BLOCK_META[field.type];
    const tint = TINTS[hash(field.id) % TINTS.length]!;
    const options = optionsOf(field);
    const hidden = Math.max(0, options.length - MAX_OPTIONS_SHOWN);

    return (
        <div className="tpl-q">
            <div className="tpl-q__lbl">
                {String(index).padStart(2, "0")} ·{" "}
                <span className={`type-pill t-${tint}`}>
                    <Icon name={meta?.icon ?? "text"} size={11} />
                    {meta?.label ?? field.type}
                </span>
                {field.required && (
                    <span className="tpl-q__req" title="A required question">
                        required
                    </span>
                )}
            </div>

            <div className="tpl-q__q">{field.label}</div>

            {field.description && <p className="tpl-q__desc">{field.description}</p>}

            {options.length > 0 && (
                <div className="tpl-q__opts">
                    {options.slice(0, MAX_OPTIONS_SHOWN).map((o) => (
                        <span key={o.id}>{o.label}</span>
                    ))}
                    {hidden > 0 && <span className="is-more">+{hidden} more</span>}
                </div>
            )}

            {options.length === 0 && field.placeholder && (
                <span className="tpl-q__ph">{field.placeholder}</span>
            )}
        </div>
    );
};

const LayoutMark = ({ field }: { field: TemplateField }) => (
    <div className={`tpl-mark tpl-mark--${field.type.replace("_", "-")}`}>
        <Icon name={field.type === "heading" ? "text" : "layers"} size={13} />
        <span>{field.label}</span>
        <span className="tpl-mark__rule" aria-hidden />
    </div>
);

const TemplateDetail = ({ summary, scope, onClose, onCreate }: TemplateDetailProps) => {
    const router = useRouter()
    const { toForm, isLoading } = useTemplateAsForm();
    const { deleteTemplateAsync } = useDeleteTemplate()
    const [pendingDelete, setPendingDelete] = useState<Template | null>(null)
    const { templateData, getTemplateIsFetching, getTemplateIsError, refetchTemplate } =
        useTemplateById(summary?.id ?? "");

    if (!summary) {
        return (
            <aside className="tpl-detail-pane">
                <div className="tpl-detail-empty">
                    <span className="art">
                        <PaperStar size={56} />
                    </span>
                    <h3>Nothing open</h3>
                    <p>Pick a pattern on the left and every question it holds unfolds here.</p>
                </div>
            </aside>
        );
    }

    const isLibrary = scope === "library"
    const badge = TEMPLATE_STATUS_BADGE[summary.status];
    const folding = isLoading(summary.id);

    // the fetched copy is authoritative, but the row already knows the headline figures
    const fields = templateData?.fields ?? [];
    const questions = fields.filter((f) => !LAYOUT_TYPES.includes(f.type));
    const fieldCount = templateData ? questions.length : 0;
    const likes = templateData?.likes ?? summary.likes;
    const author = summary.isOwn ? "you" : (summary.author ?? "—");
    const requiredCount = questions.filter((f) => f.required).length;
    const optionQuestions = questions.filter((f) => OPTION_TYPES.includes(f.type)).length;

    // a pattern with nothing on it has nothing to copy, and the service refuses the fold
    const usable = fieldCount > 0;

    const onDelete = () => {
        setPendingDelete(summary)
    }

    const confirmDelete = async () => {
        try {
            await deleteTemplateAsync({ templateId: pendingDelete?.id ?? "" })
            toast.success("Template deleted successfully");
        } catch (error) {
            toast.error("Could not able to delete the template. Try again.");
        } finally {
            setPendingDelete(null);
            onClose();
        }
    }

    return (
        <aside className="tpl-detail-pane">
            <header className={`tpl-detail-head ${summary.tint}`}>
                <CardIcon
                    logoUrl={summary.logoUrl}
                    icon={summary.icon}
                    isLogoExists={!!summary.logoUrl}
                />
                <div className="id-block">
                    <div className="nm" title={summary.title}>
                        {summary.title}
                    </div>
                    <div className="meta">
                        <span className={`o-badge ${badge.cls}`}>{badge.label}</span>
                        <span className="dot-sep">·</span>
                        <span>folded by {author}</span>
                    </div>
                </div>
                <div className="actions">
                    {!isLibrary && <button type="button" title="Delete" aria-label="Delete template" onClick={onDelete}>
                        <Icon name="trash" size={14} />
                    </button>}
                    <button type="button" title="Close" aria-label="Close detail" onClick={onClose}>
                        <Icon name="x" size={14} />
                    </button>
                </div>
            </header>

            <div className="tpl-detail-body">
                {summary.description && <p className="tpl-detail-blurb">{summary.description}</p>}

                <div className="tpl-meta">
                    <div className="item">
                        <b>{fieldCount}</b>
                        {fieldCount === 1 ? "question" : "questions"}
                    </div>
                    <div className="item">
                        <b>{requiredCount}</b>required
                    </div>
                    <div className="item">
                        <b>{likes.toLocaleString()}</b>
                        {likes === 1 ? "like" : "likes"}
                    </div>
                    <div className="item">
                        <b>{optionQuestions}</b>with choices
                    </div>
                    <div className="item">
                        <b>{summary.edited}</b>updated
                    </div>
                    <div className="item">
                        <b>{estimatedTimeToCompleteForm(fieldCount)}</b>to fill in
                    </div>
                </div>

                <div className="tpl-qs-rule">
                    <span className="lbl">
                        <Icon name="list" size={12} /> The {fieldCount === 1 ? "question" : "questions"}
                    </span>
                    <span className="line" aria-hidden />
                </div>

                {fields.map((field, idx) =>
                    LAYOUT_TYPES.includes(field.type) ? (
                        <LayoutMark key={field.id} field={field} />
                    ) : (
                        <Question key={field.id} field={field} index={idx + 1} />
                    ),
                )}
            </div>

            <div className="tpl-detail-foot">
                {summary.status === PUBLISHED && <button
                    type="button"
                    className="o-btn o-btn--accent o-btn--block"
                    disabled={folding || !usable}
                    onClick={() => toForm(summary)}
                >
                    <Icon name={folding ? "refresh" : "crane"} size={14} />
                    {folding ? "Folding…" : "Use this template"}
                </button>}
                {summary.isOwn && summary.status === DRAFT && <button
                    type="button"
                    className="o-btn o-btn--accent o-btn--block"
                    onClick={() => router.push(`/builder/${summary.id}?type=template`)}
                >
                    <Icon name="edit" size={14} />
                    Edit
                </button>}
                <span className="tpl-detail-foot__note">
                    Copies these {fieldCount === 1 ? "question" : `${fieldCount} questions`} into a
                    new draft form and opens the builder.
                </span>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                icon="trash"
                tone="danger"
                title="Unfold this one for good?"
                description={
                    <>
                        <strong>{pendingDelete?.title}</strong> will be
                        thrown away. This cannot be smoothed back out.
                    </>
                }
                confirmLabel="Delete form"
                cancelLabel="Keep it"
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />

        </aside>
    );
};

export default TemplateDetail;
