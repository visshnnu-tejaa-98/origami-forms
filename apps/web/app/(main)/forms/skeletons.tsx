import React from "react";
import { PaperBoat, PaperFlower, PaperFrog, PaperCrane, PaperStar } from "../components/origami-art";

/* A little parade of origami folds that bob while data loads. */
export const OrigamiLoader = ({ caption = "Folding your forms…" }: { caption?: string }) => (
  <div className="ori-loader" role="status" aria-live="polite">
    <div className="ori-loader-row" aria-hidden>
      <span className="ori-piece p1"><PaperBoat size={38} /></span>
      <span className="ori-piece p2"><PaperFlower size={38} /></span>
      <span className="ori-piece p3"><PaperFrog size={38} /></span>
      <span className="ori-piece p4"><PaperCrane size={38} /></span>
      <span className="ori-piece p5"><PaperStar size={38} /></span>
    </div>
    <p className="ori-loader-cap">{caption}</p>
  </div>
);

const Bar = ({ w, h = 10 }: { w: string; h?: number }) => (
  <span className="sk sk-shimmer" style={{ width: w, height: h }} />
);

/* GRID · skeleton paper cards (mirrors the real card layout). */
export const FormsGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <>
    {/* <OrigamiLoader /> */}
    <div className="forms-grid" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="form-card sk-card">
          <span className="o-tape card-tape tape-matcha" />
          <span className="fold" />
          <div className="card-top">
            <span className="sk sk-shimmer sk-ic" />
            <div className="ct-txt">
              <Bar w="72%" h={13} />
              <div style={{ marginTop: 8 }}><Bar w="90%" h={9} /></div>
            </div>
          </div>
          <Bar w="100%" h={9} />
          <div className="sk-stats">
            <span className="sk sk-shimmer" style={{ width: 54, height: 26 }} />
            <span className="sk sk-shimmer" style={{ width: 54, height: 26 }} />
          </div>
          <Bar w="100%" h={7} />
          <div className="sk-foot">
            <span className="sk sk-shimmer" style={{ width: 74, height: 30 }} />
            <span className="sk-foot-spacer" />
            <span className="sk sk-shimmer sk-dot" />
            <span className="sk sk-shimmer sk-dot" />
            <span className="sk sk-shimmer sk-dot" />
          </div>
        </article>
      ))}
    </div>
  </>
);

/* LIST · skeleton table rows (mirrors the real table columns). */
export const FormsTableSkeleton = ({ count = 8 }: { count?: number }) => (
  <>
    {/* <OrigamiLoader /> */}
    <div className="otable" aria-hidden>
      <div className="otable-head">
        <span>Form</span>
        <span>Status</span>
        <span className="ta-end">Responses</span>
        <span className="col-comp">Completion</span>
        <span className="col-updated">Updated</span>
        <span className="ta-end">Actions</span>
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="otable-row sk-row">
          <div className="c-form">
            <span className="sk sk-shimmer sk-ic-sm" />
            <div className="txt" style={{ flex: 1 }}>
              <Bar w="60%" h={11} />
              <div style={{ marginTop: 6 }}><Bar w="34%" h={8} /></div>
            </div>
          </div>
          <div className="c-status"><span className="sk sk-shimmer" style={{ width: 58, height: 18, borderRadius: 999 }} /></div>
          <div className="c-resp"><span className="sk sk-shimmer" style={{ width: 44, height: 16, marginLeft: "auto" }} /></div>
          <div className="c-comp"><Bar w="100%" h={7} /></div>
          <div className="c-updated"><Bar w="70%" h={9} /></div>
          <div className="c-actions">
            <span className="sk sk-shimmer sk-dot" />
            <span className="sk sk-shimmer sk-dot" />
          </div>
        </div>
      ))}
    </div>
  </>
);
