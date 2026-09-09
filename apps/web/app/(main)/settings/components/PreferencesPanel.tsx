import React from "react";
import { PAGE_SIZE_CHOICES } from "../constants";
import { PreferencesPanelProps, SizeRowProps } from "../types";

const SizeRow = ({ label, help, name, value, onPick }: SizeRowProps) => (
    <div className="set-row">
        <div className="label">
            {label}
            <span className="lhelp">{help}</span>
        </div>
        <div className="control">
            <div className="set-pills" role="radiogroup" aria-label={label}>
                {PAGE_SIZE_CHOICES.map((size) => (
                    <button
                        key={size}
                        type="button"
                        role="radio"
                        name={name}
                        aria-checked={value === size}
                        className={`set-pill${value === size ? " active" : ""}`}
                        onClick={() => onPick(size)}
                    >
                        {size}
                    </button>
                ))}
            </div>
            <span className="set-help">{value} rows before the pager appears</span>
        </div>
    </div>
);

const PreferencesPanel = ({ section, draft, onChange }: PreferencesPanelProps) => {
    if (section !== "preferences") return null

    return <section className="set-panel" id="preferences">
        <span className="o-tape o-tape--right tape-matcha" aria-hidden />
        <div className="set-panel__head">
            <h3>Preferences</h3>
            <span className="sub">how much fits on a page</span>
        </div>

        <SizeRow
            label="Forms per page"
            help="the drawer on My forms"
            name="formsPerPage"
            value={draft.formsPerPage}
            onPick={(formsPerPage) => onChange({ formsPerPage })}
        />
        <SizeRow
            label="Responses per page"
            help="the list on the Responses screen"
            name="responsesPerPage"
            value={draft.responsesPerPage}
            onPick={(responsesPerPage) => onChange({ responsesPerPage })}
        />
    </section>
};

export default PreferencesPanel;
