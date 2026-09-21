"use client";

import React from "react";
import ShareRings from "./ShareRings";
import { BlankSheet } from "../../components/origami-art";
import type { ShareRow } from "../types";

const DeviceBreakdown = ({ devices }: { devices?: ShareRow[] | null }) => (
    <section className="ana-panel">
        <div className="ana-panel__head">
            <h3>Devices</h3>
            <span className="sub">share of responses</span>
        </div>

        {devices && devices.length > 0 ? (
            <ShareRings rows={devices} />
        ) : (
            <div className="ana-panel__empty">
                <span className="art" aria-hidden>
                    <BlankSheet size={44} />
                </span>
                <h4>Nothing folded yet</h4>
                <p>No responses over this window, so no device split.</p>
            </div>
        )}
    </section>
);

export default DeviceBreakdown;
