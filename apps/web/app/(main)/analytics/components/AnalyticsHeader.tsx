"use client";

import React from "react";
import { Icon } from "../../components/icons";
import { SCOPES } from "../constants";
import type { Scope } from "../types";

type Props = {
    scope: Scope
    setScope: (scope: Scope) => void;
    isGlobal: boolean;
    formName: string
};

const AnalyticsHeader = ({ scope, setScope, formName, isGlobal }: Props) => {

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
                        aria-haspopup="listbox"
                    >
                        <Icon name={"forms"} size={15} />
                        <span className="ana-picker__label">{formName}</span>
                        <Icon name="chevron" size={14} />
                    </button>
                </div>

                <div className="ana-seg" role="group" aria-label="Time range">
                    {SCOPES.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            className={option.key === scope.key ? "active" : ""}
                            aria-pressed={option.key === scope.key}
                            onClick={() => setScope(option)}
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
