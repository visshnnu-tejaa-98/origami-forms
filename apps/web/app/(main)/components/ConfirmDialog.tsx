"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./confirm-dialog.css";
import { Icon, IconName } from "./icons";

export type ConfirmTone = "danger" | "accent" | "matcha";

export type ConfirmDialogProps = {
    open: boolean;
    icon?: IconName;
    title: string;
    description?: React.ReactNode;
    tone?: ConfirmTone;
    confirmLabel?: string;
    cancelLabel?: string;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};


const ConfirmDialog = ({
    open,
    icon = "info",
    title,
    description,
    tone = "danger",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    busy = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    const [mounted, setMounted] = React.useState(false);
    const confirmRef = useRef<HTMLButtonElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !busy) onCancel();
        };

        document.addEventListener("keydown", onKeyDown);
        confirmRef.current?.focus();

        // the page behind must not scroll while the sheet is up
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = overflow;
        };
    }, [open, busy, onCancel]);

    if (!mounted || !open) return null;

    return createPortal(
        <div
            className="o-confirm-veil"
            role="presentation"
            onClick={() => {
                if (!busy) onCancel();
            }}
        >
            <div
                className={`o-confirm t-${tone}`}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="o-confirm-title"
                aria-describedby={description ? "o-confirm-desc" : undefined}
                onClick={(event) => event.stopPropagation()}
            >
                <span className="o-tape o-confirm-tape" aria-hidden />

                <span className="o-confirm-ic" aria-hidden>
                    <Icon name={icon} size={26} />
                </span>

                <h3 id="o-confirm-title">{title}</h3>
                {description && (
                    <p id="o-confirm-desc" className="o-confirm-desc">
                        {description}
                    </p>
                )}

                <div className="o-confirm-foot">
                    <button
                        type="button"
                        className="o-btn o-btn--sm o-btn--ghost"
                        onClick={onCancel}
                        disabled={busy}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        type="button"
                        className="o-btn o-btn--sm o-confirm-go"
                        onClick={onConfirm}
                        disabled={busy}
                    >
                        {busy ? "Working…" : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default ConfirmDialog;
