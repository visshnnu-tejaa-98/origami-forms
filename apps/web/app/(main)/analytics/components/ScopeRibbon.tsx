"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "../../components/icons";

type Props = {
    formName: string;
    isGlobal: boolean;
};

const ScopeRibbon = ({ formName, isGlobal }: Props) => (
    <div className="ana-scope">
        <span className={`ana-scope__tag${isGlobal ? " is-global" : ""}`}>
            <span className="ana-scope__hole" aria-hidden />
            <Icon name={isGlobal ? "forms" : "sakura"} size={14} />
            <span className="ana-scope__name" title={formName}>
                {formName}
            </span>
        </span>

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

export default ScopeRibbon;
