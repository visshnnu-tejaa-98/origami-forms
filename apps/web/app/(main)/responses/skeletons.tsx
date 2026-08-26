import React from "react";
import { Ink, Slab, ToolbarSkeleton } from "../forms/skeletons";

const Bar = ({ w, h = 10 }: { w: string; h?: number }) => (
  <span className="sk sk-shimmer" style={{ width: w, height: h }} />
);

/* HEADER · title, subtitle, search and the two actions. */
export const ResponseHeaderSkeleton = () => (
  <header className="rsp-head" aria-hidden>
    <div>
      <h1><Ink w={200} h="0.66em" /></h1>
      <div className="sub"><Ink w={320} /></div>
    </div>
    <div className="head-actions">
      <Slab w={240} h={38} r={12} />
      <Slab w={124} h={38} r={12} />
      <Slab w={118} h={38} r={12} />
    </div>
  </header>
);

/* TOOLBAR · three tabs, two sort chips, no view toggle — mirrors the real one. */
export const ResponsesToolbarSkeleton = () => (
  <ToolbarSkeleton
    classNames={{ toolbar: "rsp-toolbar", tabs: "rsp-tabs" }}
    tabWidths={[72, 108, 92]}
    sortWidth={190}
    showViewToggle={false}
  />
);

/* TABLE · skeleton rows that mirror the real response columns. */
export const ResponsesSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="rsp-table" aria-hidden>
    <div className="rsp-th">
      <span />
      <span>respondent</span>
      <span className="col-picked">Form Title</span>
      <span className="col-head">Status</span>
      <span className="col-hype">Time Taken</span>
      <span>Submitted at</span>
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
        <div className="cell col-head">
          <span className="sk sk-shimmer" style={{ width: 62, height: 18, borderRadius: 999 }} />
        </div>
        <div className="cell col-hype"><Bar w="55%" h={9} /></div>
        <div className="time"><Bar w="60%" h={9} /></div>
        <div className="chev" />
      </div>
    ))}
  </div>
);

/* PAGER · the info line and a short run of page buttons. */
export const ResponsesPagerSkeleton = () => (
  <nav className="rsp-pager" aria-hidden>
    <span className="pager-info"><Ink w={170} /></span>
    <div className="pager-controls">
      {[32, 32, 32].map((w, i) => (
        <Slab key={i} w={w} h={32} r={9} />
      ))}
      <Slab w={72} h={32} r={9} />
    </div>
  </nav>
);

/* DETAIL PANE · avatar, meta grid, and a few unfolded answers. */
export const ResponseDetailSkeleton = ({ count = 4 }: { count?: number }) => (
  <aside className="rsp-detail-pane" aria-hidden>
    <header className="rsp-detail-head">
      <span className="sk sk-shimmer" style={{ width: 44, height: 44, borderRadius: 12, flex: "none" }} />
      <div className="who-block">
        <div className="nm"><Ink w={150} h="0.7em" /></div>
        <div className="em"><Ink w={190} /></div>
      </div>
      <div className="actions">
        <Slab w={30} h={30} r={9} />
      </div>
    </header>

    <div className="rsp-detail-body">
      <div className="rsp-meta">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="item" key={i}>
            <b><Ink w="70%" h="0.8em" /></b>
            <Ink w="50%" h="0.7em" />
          </div>
        ))}
      </div>

      {Array.from({ length: count }).map((_, i) => (
        <div className="rsp-ans" key={i}>
          <div className="q-lbl">
            <Slab w={78} h={18} r={999} />
          </div>
          <div className="q"><Ink w="82%" h="0.8em" /></div>
          <Bar w={i % 3 === 0 ? "92%" : "56%"} h={11} />
        </div>
      ))}
    </div>
  </aside>
);

/* The whole page while the first fetch is in flight. */
export const ResponsesPageSkeleton = () => (
  <>
    <section className="rsp-list-pane">
      <ResponseHeaderSkeleton />
      <ResponsesToolbarSkeleton />
      <ResponsesSkeleton />
      <ResponsesPagerSkeleton />
    </section>
    <ResponseDetailSkeleton />
  </>
);
