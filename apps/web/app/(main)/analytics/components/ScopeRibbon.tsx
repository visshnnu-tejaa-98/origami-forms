"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "../../components/icons";
import { STATUS_BADGE } from "../../utils";
import type { Status } from "../../types";

type Props = {
    formName: string;
    isGlobal: boolean;
    formStatus?: Status | null;
};

const ScopeRibbon = ({ formName, isGlobal, formStatus }: Props) => {
    const badge = !isGlobal && formStatus ? STATUS_BADGE[formStatus] : undefined;

    return (
        <div className="ana-scope">
            <span className={`ana-scope__tag${isGlobal ? " is-global" : ""}`}>
                <span className="ana-scope__hole" aria-hidden />
                <Icon name={isGlobal ? "forms" : "sakura"} size={14} />
                <span className="ana-scope__name" title={formName}>
                    {formName}
                </span>
            </span>

            {badge && <span className={`o-badge ${badge.cls}`}>{badge.label}</span>}

            {isGlobal ? (
                <span className="ana-scope__note">every form in your workspace</span>
            ) : (
                <Link className="ana-scope__back" href="/analytics">
                    <Icon name="arrow-left" size={13} />
                    All forms
                </Link>
            )}
        </div>
    );
};

export default ScopeRibbon;
