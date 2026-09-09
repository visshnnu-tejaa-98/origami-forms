import React from "react";
import { Icon } from "../../components/icons";
import { DangerPanelProps } from "../types";


const DangerPanel = ({ section, onDeleteAccount }: DangerPanelProps) => {
    if (section !== "danger") return null

    return <section className="set-panel set-panel--danger" id="danger">
        <span className="o-tape o-tape--left tape-coral" aria-hidden />
        <div className="set-panel__head">
            <h3>Danger zone</h3>
            <span className="sub">this one cannot be unfolded</span>
        </div>

        <div className="set-danger-row">
            <div className="body">
                <div className="ttl">Delete my account</div>
                <div className="desc">
                    Your forms, responses and uploads go with it. We hold everything for 30 days
                    before it is erased for good.
                </div>
            </div>
            <button type="button" className="o-btn o-btn--sm set-btn--danger" onClick={onDeleteAccount}>
                <Icon name="trash" size={13} /> Delete account
            </button>
        </div>
    </section>
};

export default DangerPanel;
