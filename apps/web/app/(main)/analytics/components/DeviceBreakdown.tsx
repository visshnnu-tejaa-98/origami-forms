"use client";

import React from "react";
import ShareRings from "./ShareRings";
import type { ShareRow } from "../types";

/**
 * Device split as a row of dials. Three named categories, so hues are assigned in
 * fixed order and each is directly labelled — the ring is never the only way to
 * tell them apart.
 */
const DeviceBreakdown = ({ devices }: { devices: ShareRow[] }) => (
    <section className="ana-panel">
        <div className="ana-panel__head">
            <h3>Devices</h3>
            <span className="sub">share of responses</span>
        </div>

        <ShareRings rows={devices} emptyLabel="No device data for this period yet." />
    </section>
);

export default DeviceBreakdown;
