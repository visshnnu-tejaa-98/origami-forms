"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SCOPES } from "../constants";
import ScopeRibbon from "./ScopeRibbon";
import { Icon } from "../../components/icons";
import type { Scope } from "../types";

type Props = {
    scope: Scope;
    setScope: (scope: Scope) => void;
    isGlobal: boolean;
    formName: string;
};

const AnalyticsHeader = ({ scope, setScope, formName, isGlobal }: Props) => {
    const router = useRouter();

    return (
        <header className="ana-head">
            <div className="ana-head__title">
                {!isGlobal && (
                    <button type="button" className="ana-back" onClick={() => router.back()}>
                        <Icon name="arrow-left" size={15} />
                        <span>Back</span>
                    </button>
                )}
                <h1>Analytics</h1>
                <ScopeRibbon formName={formName} isGlobal={isGlobal} />
            </div>

            <div className="ana-head__controls">
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
