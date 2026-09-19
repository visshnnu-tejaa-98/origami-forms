"use client";

import React, { useState } from "react";
import { Icon } from "../../components/icons";
import { ALL_FORMS, RANGES } from "../constants";
import type { FormOption, RangeKey, ScopeKey } from "../types";

type Props = {
    forms: FormOption[];
    scope: ScopeKey;
    setScope: (scope: ScopeKey) => void;
    range: RangeKey;
    setRange: (range: RangeKey) => void;
};

const AnalyticsHeader = ({ forms, scope, setScope, range, setRange }: Props) => {
    const [pickerOpen, setPickerOpen] = useState(false);
    const selected = forms.find((form) => form.id === scope) ?? forms[0]!;
    const isGlobal = scope === ALL_FORMS;

    const pick = (id: ScopeKey) => {
        setScope(id);
        setPickerOpen(false);
    };

    return (
        <header className="ana-head">
            <div className="ana-head__title">
                <h1>Analytics</h1>
                <p className="sub">
                    {isGlobal
                        ? "Every form in your workspace, folded into one view."
                        : "One form, question by question."}
                </p>
            </div>

            <div className="ana-head__controls">
                <div className="ana-picker">
                    <button
                        type="button"
                        className="ana-picker__trigger"
                        onClick={() => setPickerOpen((open) => !open)}
                        aria-expanded={pickerOpen}
                        aria-haspopup="listbox"
                    >
                        <Icon name={isGlobal ? "forms" : "sakura"} size={15} />
                        <span className="ana-picker__label">{selected.title}</span>
                        <Icon name="chevron" size={14} />
                    </button>

                    {pickerOpen && (
                        <ul className="ana-picker__menu" role="listbox">
                            {forms.map((form) => (
                                <li key={form.id}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={form.id === scope}
                                        className={`ana-picker__item${form.id === scope ? " active" : ""}`}
                                        onClick={() => pick(form.id)}
                                    >
                                        <Icon name={form.id === ALL_FORMS ? "forms" : "sakura"} size={15} />
                                        <span>{form.title}</span>
                                        {form.id !== ALL_FORMS && (
                                            <span
                                                className={`o-badge ${form.status === "published" ? "o-badge--matcha" : "o-badge--ghost"}`}
                                            >
                                                {form.status}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="ana-seg" role="group" aria-label="Time range">
                    {RANGES.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            className={option.key === range ? "active" : ""}
                            aria-pressed={option.key === range}
                            onClick={() => setRange(option.key)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default AnalyticsHeader;
