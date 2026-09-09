import React from "react";
import { Icon } from "../../components/icons";
import { SETTINGS_TABS } from "../constants";
import { SettingsSection } from "../types";

type SettingsNavProps = {
    active: SettingsSection;
    onSelect: (id: SettingsSection) => void;
    isAdmin: boolean;
};

const SettingsNav = ({ active, onSelect, isAdmin }: SettingsNavProps) => (
    <nav className="set-tabs" aria-label="Settings sections">
        {SETTINGS_TABS.filter((tab) => !tab.adminOnly || isAdmin).map((tab) => (
            <button
                key={tab.id}
                type="button"
                className={`set-tab${active === tab.id ? " active" : ""}${tab.tone === "danger" ? " set-tab--danger" : ""}`}
                aria-current={active === tab.id ? "page" : undefined}
                onClick={() => onSelect(tab.id)}
            >
                <span className="ic">
                    <Icon name={tab.icon} size={16} />
                </span>
                <span>{tab.label}</span>
            </button>
        ))}
    </nav>
);

export default SettingsNav;
