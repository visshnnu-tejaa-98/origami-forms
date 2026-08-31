import React from "react";
import { Icon } from "../../components/icons";
import { FORM_VISIBILITY } from "../constants";
import type { FormSettingsProps } from "../types";

/** <input type="datetime-local"> wants `YYYY-MM-DDTHH:mm` in local time */
const toLocalInput = (iso?: string | null) => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const fromLocalInput = (value: string) => {
    if (value === "") return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/** form-level rules, shown in the inspector: who may open it, how many replies it
 *  takes, and when it closes */
const FormSettings = ({ settings, updateSettings }: FormSettingsProps) => {
    const { visibility, maxSubmissions, expiresAt } = settings;

    const visibilityHelpMessage = () => {
        if (visibility === "public") {
            return "Anyone with the link can fill it in, and it may be listed."
        } else if (visibility === "unlisted") {
            return "Only people you hand the link to can reach it."
        } else {
            return "Only authenticated users can fill this form"
        }
    }

    return (
        <aside className="b-right">
            <div className="insp-head">
                <span className="iconbox t-accent">
                    <Icon name="settings" size={18} />
                </span>
                <div>
                    <h3>Form settings</h3>
                    <div className="insp-sub">the crease that shapes the rest</div>
                </div>
            </div>

            <section className="insp-sec">
                <div className="sec-head">Access</div>

                <div className="insp-row">
                    <label htmlFor="set-visibility">Visibility</label>
                    <select
                        id="set-visibility"
                        className="insp-input"
                        value={visibility}
                        onChange={(e) =>
                            updateSettings({
                                visibility: e.target.value as FormSettingsProps["settings"]["visibility"],
                            })
                        }
                    >
                        {FORM_VISIBILITY.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <p className="insp-hint">
                        {visibilityHelpMessage()}
                    </p>
                </div>
            </section>

            <section className="insp-sec">
                <div className="sec-head">Limits</div>

                <div className="insp-row">
                    <label htmlFor="set-max">Max submissions</label>
                    <input
                        id="set-max"
                        className="insp-input"
                        type="number"
                        min={1}
                        step={1}
                        inputMode="numeric"
                        placeholder="Eg. 100"
                        value={maxSubmissions ?? ""}
                        onChange={(e) => {
                            const next = Number(e.target.value);
                            updateSettings({
                                maxSubmissions:
                                    e.target.value === "" || next < 1 ? undefined : Math.floor(next),
                            });
                        }}
                    />
                    <p className="insp-hint">Leave empty to keep taking responses forever.</p>
                </div>

                <div className="insp-row">
                    <label htmlFor="set-expires">Closes at</label>
                    <input
                        id="set-expires"
                        className="insp-input"
                        type="datetime-local"
                        value={toLocalInput(expiresAt)}
                        onChange={(e) => updateSettings({ expiresAt: fromLocalInput(e.target.value) })}
                    />
                    {expiresAt ? (
                        <button
                            type="button"
                            className="insp-clear"
                            onClick={() => updateSettings({ expiresAt: null })}
                        >
                            <Icon name="x" size={11} /> clear closing date
                        </button>
                    ) : (
                        <p className="insp-hint">No closing date — the form stays open forever.</p>
                    )}
                </div>
            </section>
        </aside>
    );
};

export default FormSettings;
