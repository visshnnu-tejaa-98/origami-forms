import React from "react";
import { Icon } from "../../components/icons";
import { THEME_CHOICES, VIEW_CHOICES } from "../constants";
import { AppearancePanelProps } from "../types";

const AppearancePanel = ({ section, theme, view, onChange, onViewChange }: AppearancePanelProps) => {
    if (section !== "appearance") return null
    return <section className="set-panel" id="appearance">
        <span className="o-tape o-tape--left tape-lav" aria-hidden />
        <div className="set-panel__head">
            <h3>Appearance</h3>
            <span className="sub">the paper you work on</span>
        </div>

        <div className="set-row">
            <div className="label">
                Theme
                <span className="lhelp">applies to the workspace, not to your published forms</span>
            </div>
            <div className="control">
                <div className="set-themes" role="radiogroup" aria-label="Theme">
                    {THEME_CHOICES.map((choice) => (
                        <button
                            key={choice.value}
                            type="button"
                            role="radio"
                            aria-checked={theme === choice.value}
                            className={`set-theme set-theme--${choice.value}${theme === choice.value ? " active" : ""}`}
                            onClick={() => onChange(choice.value)}
                        >
                            <span className="swatch" aria-hidden="true">
                                <span className="bar" />
                                <span className="bar short" />
                                <span className="bar" />
                            </span>
                            <span className="meta">
                                <span className="nm">
                                    {choice.label}
                                    {theme === choice.value && <Icon name="check" size={13} />}
                                </span>
                                <span className="hint">{choice.hint}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="set-row">
            <div className="label">
                Forms view
                <span className="lhelp">how My forms lays out when you open it</span>
            </div>
            <div className="control">
                <div className="set-views" role="radiogroup" aria-label="Forms view">
                    {VIEW_CHOICES.map((choice) => (
                        <button
                            key={choice.value}
                            type="button"
                            role="radio"
                            aria-checked={view === choice.value}
                            className={`set-view${view === choice.value ? " active" : ""}`}
                            onClick={() => onViewChange(choice.value)}
                        >
                            <span className={`set-view__art set-view__art--${choice.value}`} aria-hidden="true">
                                <span />
                                <span />
                                <span />
                                <span />
                            </span>
                            <span className="meta">
                                <span className="nm">
                                    <Icon name={choice.value === "grid" ? "grid" : "list"} size={14} />
                                    {choice.label}
                                    {view === choice.value && <Icon name="check" size={13} />}
                                </span>
                                <span className="hint">{choice.hint}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </section>
}

export default AppearancePanel;
