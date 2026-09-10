import React from "react";

const Bar = ({ w, h = 10 }: { w: string; h?: number }) => (
  <span className="sk sk-shimmer" style={{ width: w, height: h }} />
);

const STAT_CARDS = [
  { cls: "", num: 76, lbl: "108px", spark: true },
  { cls: "s2", num: 68, lbl: "104px" },
  { cls: "s3", num: 84, lbl: "96px" },
  { cls: "s4", num: 72, lbl: "112px" },
];

export const StatsSkeleton = () => (
  <section className="stats-row" aria-hidden>
    {STAT_CARDS.map(({ cls, num, lbl, spark }) => (
      <div key={cls || "s1"} className={`stat-card sk-card ${cls}`.trim()}>
        <div className="ic">
          <span className="sk sk-shimmer" style={{ width: 18, height: 18, borderRadius: 5 }} />
        </div>
        <div className="num">
          <span className="sk sk-shimmer" style={{ width: num, height: 30 }} />
        </div>
        <div className="lbl">
          <Bar w={lbl} h={9} />
        </div>
        {spark && (
          <span
            className="sk sk-shimmer mini-spark"
            style={{ width: 60, height: 20, borderRadius: 4 }}
          />
        )}
      </div>
    ))}
  </section>
);

export const RecentFormsSkeleton =({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="form-row sk-row" aria-hidden>
        <span className="sk sk-shimmer sk-ic-sm" />
        <div style={{ flex: 1 }}>
          <Bar w="65%" h={12} />
          <div style={{ marginTop: 6 }}><Bar w="35%" h={8} /></div>
        </div>
        <div className="col">
          <span className="sk sk-shimmer" style={{ width: 40, height: 8, borderRadius: 999, marginBottom: 8 }} />

          <span className="sk sk-shimmer" style={{ width: 58, height: 18, borderRadius: 999 }} />
        </div>
        <div className="col">
          <span className="sk sk-shimmer" style={{ width: 40, height: 8, borderRadius: 999, marginBottom: 8 }} />

          <span className="sk sk-shimmer" style={{ width: 44, height: 16 }} />
        </div>
        <div className="col" style={{ minWidth: "120px" }}>
          <span className="sk sk-shimmer" style={{ width: 40, height: 8, borderRadius: 999, marginBottom: 8 }} />

          <div style={{ marginTop: 4 }}><Bar w="100%" h={7} /></div>
          <div style={{ marginTop: 5 }}><Bar w="40%" h={8} /></div>
        </div>
        <span className="ellipsis">
          <span className="sk sk-shimmer sk-dot" />
        </span>
      </div>
    ))}
  </>
);
