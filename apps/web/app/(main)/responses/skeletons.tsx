import React from "react";
import { OrigamiLoader } from "../forms/skeletons";

const Bar = ({ w, h = 10 }: { w: string; h?: number }) => (
  <span className="sk sk-shimmer" style={{ width: w, height: h }} />
);

/* TABLE · skeleton rows that mirror the real response columns. */
export const ResponsesSkeleton = ({ count = 8 }: { count?: number }) => (
  <>
    {/* <OrigamiLoader caption="Collecting your responses…" /> */}
    <div className="rsp-table" aria-hidden>
      <div className="rsp-th">
        <span />
        <span>respondent</span>
        <span className="col-picked">picked date</span>
        <span className="col-head">headcount</span>
        <span className="col-hype">hype</span>
        <span>time</span>
        <span />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rsp-tr sk-row">
          <span className="sk sk-shimmer" style={{ width: 18, height: 18, borderRadius: 4 }} />
          <div className="who">
            <span className="sk sk-shimmer sk-av" />
            <div className="txt" style={{ flex: 1 }}>
              <Bar w="58%" h={11} />
              <div style={{ marginTop: 6 }}>
                <Bar w="40%" h={8} />
              </div>
            </div>
          </div>
          <div className="cell col-picked"><Bar w="80%" h={9} /></div>
          <div className="cell col-head"><Bar w="55%" h={9} /></div>
          <div className="cell col-hype"><Bar w="70%" h={9} /></div>
          <div className="time"><Bar w="60%" h={9} /></div>
          <div className="chev" />
        </div>
      ))}
    </div>
  </>
);
