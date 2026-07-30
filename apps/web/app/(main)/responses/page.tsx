"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Icon, type IconName } from "../components/icons";
import { ResponsesSkeleton } from "./skeletons";
import "./responses.css";

type Status = "completed" | "partial" | "flagged";

type Tint =
  | "accent"
  | "sakura"
  | "matcha"
  | "peach"
  | "lavender"
  | "indigo"
  | "coral"
  | "highlighter";

type Response = {
  id: string;
  name: string;
  email: string;
  initial: string;
  tint: Tint;
  status: Status;
  picked: string;
  /** set when the respondent couldn't make any offered date */
  pickedBadge?: string;
  headcount: number;
  hype: number; // 0..5
  hypeLabel: string;
  bring: string[];
  note: string;
  time: string; // human label
  rank: number; // sort key — lower is more recent
  duration: string;
  device: string;
  city: string;
  answered: string;
  pages: string;
};

const SEED: Response[] = [
  { id: "1", name: "Aiko Tanaka", email: "aiko@example.com", initial: "あ", tint: "sakura", status: "completed", picked: "April 13 · peak bloom", headcount: 4, hype: 4, hypeLabel: "very hyped", bring: ["snacks to share", "a polaroid camera"], note: "bringing my niece who is six and obsessed with paper boats — could we save a spot near the pond? domo arigato ✶", time: "2m ago", rank: 0, duration: "1m 32s", device: "iPhone · Mobile", city: "Kobe, Japan", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "2", name: "Kenji Mori", email: "kenji@example.com", initial: "k", tint: "matcha", status: "completed", picked: "April 20 · soft petals", headcount: 2, hype: 3, hypeLabel: "medium", bring: ["a picnic blanket"], note: "no allergies here. happy to help carry things from the car park.", time: "14m ago", rank: 1, duration: "2m 04s", device: "MacBook · Desktop", city: "Osaka, Japan", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "3", name: "Mira Patel", email: "mira@example.com", initial: "m", tint: "lavender", status: "flagged", picked: "April 6 · cherry blossoms", headcount: 6, hype: 5, hypeLabel: "overload", bring: ["snacks to share", "a bluetooth speaker", "extra cups"], note: "two of our six are vegetarian, and one is allergic to peanuts — flagging so the food list accounts for it.", time: "38m ago", rank: 2, duration: "3m 11s", device: "Pixel · Mobile", city: "Bengaluru, India", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "4", name: "Renta Suzuki", email: "renta@example.com", initial: "R", tint: "peach", status: "completed", picked: "April 13 · peak bloom", headcount: 2, hype: 4, hypeLabel: "very hyped", bring: ["a polaroid camera"], note: "we can arrive an hour early to fold place cards if that helps.", time: "1h ago", rank: 3, duration: "1m 48s", device: "iPad · Tablet", city: "Kyoto, Japan", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "5", name: "Sana Koyama", email: "sana@example.com", initial: "S", tint: "indigo", status: "completed", picked: "April 13 · peak bloom", headcount: 8, hype: 5, hypeLabel: "overload", bring: ["snacks to share", "a picnic blanket", "paper lanterns"], note: "eight of us — three kids under ten. a shaded patch would be lovely.", time: "2h ago", rank: 4, duration: "4m 22s", device: "Chrome · Desktop", city: "Nagoya, Japan", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "6", name: "Jamie Lin", email: "jamie@example.com", initial: "J", tint: "accent", status: "partial", picked: "can't make any date", pickedBadge: "can't · suggested april 27", headcount: 3, hype: 2, hypeLabel: "chill", bring: [], note: "away that whole month, but april 27 would work if the blossoms hold.", time: "3h ago", rank: 5, duration: "0m 41s", device: "Safari · Desktop", city: "Taipei, Taiwan", answered: "6 / 9", pages: "Page 1" },
  { id: "7", name: "Nora Park", email: "nora@example.com", initial: "N", tint: "coral", status: "completed", picked: "April 20 · soft petals", headcount: 2, hype: 4, hypeLabel: "very hyped", bring: ["snacks to share"], note: "gluten-free for one of us — we'll bring our own bread, no fuss.", time: "5h ago", rank: 6, duration: "2m 15s", device: "Galaxy · Mobile", city: "Seoul, South Korea", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "8", name: "Yuki Watanabe", email: "yuki@example.com", initial: "Y", tint: "highlighter", status: "completed", picked: "April 6 · cherry blossoms", headcount: 5, hype: 5, hypeLabel: "overload", bring: ["a bluetooth speaker", "paper lanterns"], note: "can we bring our dog? she is small, quiet, and very well behaved.", time: "yesterday", rank: 7, duration: "2m 58s", device: "iPhone · Mobile", city: "Tokyo, Japan", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "9", name: "Tomo Endo", email: "tomo@example.com", initial: "T", tint: "matcha", status: "completed", picked: "April 13 · peak bloom", headcount: 1, hype: 3, hypeLabel: "medium", bring: ["extra cups"], note: "just me. i'll take photos for whoever wants them afterwards.", time: "yesterday", rank: 8, duration: "1m 09s", device: "Firefox · Desktop", city: "Sapporo, Japan", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "10", name: "Ayumi Nakamura", email: "ayumi@example.com", initial: "A", tint: "sakura", status: "completed", picked: "April 6 · cherry blossoms", headcount: 2, hype: 4, hypeLabel: "very hyped", bring: ["snacks to share", "a picnic blanket"], note: "step-free access would help — my mother uses a walking frame.", time: "2 days ago", rank: 9, duration: "3m 40s", device: "iPhone · Mobile", city: "Fukuoka, Japan", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "11", name: "Dev Sharma", email: "dev@example.com", initial: "D", tint: "indigo", status: "partial", picked: "April 20 · soft petals", headcount: 2, hype: 3, hypeLabel: "medium", bring: [], note: "", time: "2 days ago", rank: 10, duration: "0m 27s", device: "Pixel · Mobile", city: "Pune, India", answered: "4 / 9", pages: "Page 1" },
  { id: "12", name: "Hana Kimura", email: "hana@example.com", initial: "H", tint: "peach", status: "flagged", picked: "April 13 · peak bloom", headcount: 3, hype: 5, hypeLabel: "overload", bring: ["snacks to share", "a polaroid camera"], note: "duplicate of my earlier entry — please keep this one, the first had a typo in the headcount.", time: "3 days ago", rank: 11, duration: "1m 55s", device: "MacBook · Desktop", city: "Yokohama, Japan", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "13", name: "Leo Fischer", email: "leo@example.com", initial: "L", tint: "lavender", status: "completed", picked: "April 20 · soft petals", headcount: 4, hype: 4, hypeLabel: "very hyped", bring: ["a bluetooth speaker"], note: "visiting from berlin that week — first hanami, very excited.", time: "4 days ago", rank: 12, duration: "5m 02s", device: "Chrome · Desktop", city: "Berlin, Germany", answered: "9 / 9", pages: "Page 1, 2" },
  { id: "14", name: "Emi Sato", email: "emi@example.com", initial: "E", tint: "coral", status: "completed", picked: "April 6 · cherry blossoms", headcount: 2, hype: 3, hypeLabel: "medium", bring: ["extra cups", "a picnic blanket"], note: "we'll stay behind to help pack up.", time: "5 days ago", rank: 13, duration: "2m 31s", device: "iPad · Tablet", city: "Kanazawa, Japan", answered: "9 / 9", pages: "Page 1, 2" },
];

const TABS: { key: Status | "all"; label: string; icon: IconName }[] = [
  { key: "all", label: "All", icon: "mail" },
  { key: "completed", label: "Completed", icon: "check" },
  { key: "partial", label: "Partial", icon: "clock" },
  { key: "flagged", label: "Flagged", icon: "star" },
];

const PAGE_SIZE = 10;

type Answer = {
  n: string;
  type: string;
  tint: Tint;
  q: string;
  /** how the answer renders: plain ink, handwritten highlight, chips, stars, or a paragraph */
  kind: "plain" | "hand" | "chips" | "stars" | "long";
  value?: string;
  chips?: string[];
  stars?: number;
};

/* The nine RSVP questions, filled in from a single response. */
const buildAnswers = (r: Response): Answer[] => [
  { n: "01", type: "short text", tint: "accent", q: "What name should we list at the gate?", kind: "plain", value: r.name },
  { n: "02", type: "email", tint: "indigo", q: "Where shall we send the picnic map?", kind: "plain", value: r.email },
  {
    n: "03",
    type: "single select",
    tint: "matcha",
    q: "Pick a Saturday — we have three to offer.",
    kind: "hand",
    value: r.pickedBadge ?? r.picked,
  },
  {
    n: "04",
    type: "number",
    tint: "peach",
    q: "Headcount — how many cranes?",
    kind: "hand",
    value: `${r.headcount} ${r.headcount === 1 ? "crane" : "cranes"}`,
  },
  {
    n: "05",
    type: "multi select",
    tint: "lavender",
    q: "Anything to bring?",
    kind: "chips",
    chips: r.bring,
  },
  { n: "06", type: "rating", tint: "highlighter", q: "How hyped are you?", kind: "stars", stars: r.hype, value: r.hypeLabel },
  { n: "07", type: "long text", tint: "sakura", q: "Allergies, accessibility, or notes?", kind: "long", value: r.note },
];

const stars = (n: number) => "★".repeat(n);

const Responses = () => {
  const [responses, setResponses] = useState<Response[]>(SEED);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(SEED[0]!.id);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  // Simulate a server fetch. Swap this effect for your real data-fetching
  // (React Query, tRPC, etc.) when the responses endpoint lands.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, [filter, page]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: responses.length };
    for (const r of responses) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [responses]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = responses.filter((r) => (filter === "all" ? true : r.status === filter));
    if (q) {
      list = list.filter((r) =>
        [r.name, r.email, r.picked, r.pickedBadge ?? "", r.hypeLabel, r.note, ...r.bring]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    return [...list].sort((a, b) => a.rank - b.rank);
  }, [responses, filter, query]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paged = visible.slice(start, start + PAGE_SIZE);
  const rangeStart = visible.length === 0 ? 0 : start + 1;
  const rangeEnd = Math.min(start + PAGE_SIZE, visible.length);

  const selected = responses.find((r) => r.id === selectedId) ?? null;
  const answers = selected ? buildAnswers(selected) : [];

  const allOnPageChecked = paged.length > 0 && paged.every((r) => checked.has(r.id));

  const toggleCheck = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleCheckAll = () =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (allOnPageChecked) paged.forEach((r) => next.delete(r.id));
      else paged.forEach((r) => next.add(r.id));
      return next;
    });

  const toggleFlag = (id: string) =>
    setResponses((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "flagged" ? "completed" : "flagged" } : r,
      ),
    );

  const discard = (ids: string[]) => {
    const drop = new Set(ids);
    setResponses((prev) => prev.filter((r) => !drop.has(r.id)));
    setChecked((prev) => new Set([...prev].filter((id) => !drop.has(id))));
    if (selectedId && drop.has(selectedId)) setSelectedId(null);
  };

  /* Client-side CSV of whatever is currently in view (or checked). */
  const exportCsv = (rows: Response[]) => {
    const head = ["Name", "Email", "Status", "Picked date", "Headcount", "Hype", "Submitted", "Notes"];
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const body = rows.map((r) =>
      [
        r.name,
        r.email,
        r.status,
        r.pickedBadge ?? r.picked,
        String(r.headcount),
        `${r.hype}/5 ${r.hypeLabel}`,
        r.time,
        r.note,
      ]
        .map(esc)
        .join(","),
    );
    const blob = new Blob([[head.join(","), ...body].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "responses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAnswers = async () => {
    if (!selected) return;
    const text = buildAnswers(selected)
      .map((a) => {
        const v = a.kind === "chips" ? (a.chips ?? []).join(", ") : a.kind === "stars" ? `${stars(a.stars ?? 0)} ${a.value ?? ""}` : a.value ?? "";
        return `${a.n}. ${a.q}\n    ${v || "—"}`;
      })
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — nothing to do but leave the button alone */
    }
  };

  return (
    <div className="rsp-page">
      {/* floating origami decorations */}
      <div className="rsp-deco" aria-hidden>
        <span className="rd rd-crane"><Icon name="crane" size={70} /></span>
        <span className="rd rd-sakura"><Icon name="sakura" size={30} /></span>
      </div>

      {/* ---------- LIST PANE ---------- */}
      <section className="rsp-list-pane">
        <header className="rsp-head">
          <div>
            <h1>Responses</h1>
            <div className="sub">
              Cherry Blossom Festival RSVP · {visible.length} of {responses.length}
            </div>
          </div>
          <div className="head-actions">
            <div className="rsp-search">
              <Icon name="search" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search responses…"
              />
            </div>
            <button className="o-btn o-btn--sm" onClick={() => exportCsv(visible)}>
              <Icon name="download" size={14} /> Export CSV
            </button>
            <button className="o-btn o-btn--sm o-btn--accent">
              <Icon name="share" size={14} /> Share view
            </button>
          </div>
        </header>

        {/* TOOLBAR — same tab pills as the forms page */}
        <div className="rsp-toolbar">
          <div className="rsp-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`rsp-tab${filter === t.key ? " active" : ""}`}
                onClick={() => setFilter(t.key)}
              >
                <Icon name={t.icon} size={14} />
                {t.label}
                <span className="tab-count">{counts[t.key] ?? 0}</span>
              </button>
            ))}
          </div>

          <span className="spacer" />

          <button className="o-btn o-btn--sm o-btn--ghost">
            <Icon name="filter" size={14} /> Filters
          </button>
        </div>

        {/* BULK BAR — only while rows are checked */}
        {checked.size > 0 && (
          <div className="rsp-bulk">
            <span className="cnt">
              <strong>{checked.size}</strong> selected
            </span>
            <button
              className="o-btn o-btn--sm"
              onClick={() => exportCsv(responses.filter((r) => checked.has(r.id)))}
            >
              <Icon name="download" size={13} /> Export selected
            </button>
            <button className="o-btn o-btn--sm o-btn--ghost" onClick={() => discard([...checked])}>
              <Icon name="trash" size={13} /> Discard
            </button>
            <button className="bulk-clear" onClick={() => setChecked(new Set())}>
              clear
            </button>
          </div>
        )}

        {loading ? (
          <ResponsesSkeleton />
        ) : visible.length === 0 ? (
          <div className="rsp-empty">
            <span className="art"><Icon name="mail" size={64} /></span>
            <h3>No responses match.</h3>
            <p>
              Nothing came back for that search or filter. Try a different word, or open the gates to
              everyone with <em>all</em>.
            </p>
          </div>
        ) : (
          <>
            <div className="rsp-table" role="table" aria-label="Form responses">
              <span className="o-tape rsp-table-tape" aria-hidden />

              <div className="rsp-th" role="row">
                <button
                  className={`rsp-check${allOnPageChecked ? " on" : ""}`}
                  onClick={toggleCheckAll}
                  aria-label={allOnPageChecked ? "Deselect all on page" : "Select all on page"}
                  aria-pressed={allOnPageChecked}
                >
                  {allOnPageChecked && <Icon name="check" size={12} />}
                </button>
                <span>respondent</span>
                <span className="col-picked">picked date</span>
                <span className="col-head">headcount</span>
                <span className="col-hype">hype</span>
                <span>time</span>
                <span />
              </div>

              {paged.map((r) => (
                <div
                  key={r.id}
                  className={`rsp-tr${r.id === selectedId ? " selected" : ""}`}
                  role="row"
                  tabIndex={0}
                  onClick={() => setSelectedId(r.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(r.id);
                    }
                  }}
                >
                  <button
                    className={`rsp-check${checked.has(r.id) ? " on" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheck(r.id);
                    }}
                    aria-label={`Select ${r.name}`}
                    aria-pressed={checked.has(r.id)}
                  >
                    {checked.has(r.id) && <Icon name="check" size={12} />}
                  </button>

                  <div className="who">
                    <span className={`rsp-av t-${r.tint}`}>{r.initial}</span>
                    <div className="txt">
                      <span className="nm" title={r.name}>
                        {r.name}
                        {r.status === "flagged" && (
                          <span className="flag" title="Flagged">
                            <Icon name="star" size={12} />
                          </span>
                        )}
                      </span>
                      <span className="em">{r.email}</span>
                    </div>
                  </div>

                  <div className="cell col-picked">
                    {r.pickedBadge ? (
                      <span className="o-badge o-badge--peach">{r.pickedBadge}</span>
                    ) : (
                      <span className="val">{r.picked}</span>
                    )}
                  </div>

                  <div className="cell col-head">
                    <span className="val">
                      {r.headcount} {r.headcount === 1 ? "crane" : "cranes"}
                    </span>
                  </div>

                  <div className="cell col-hype">
                    <span className="val">
                      <span className="st">{stars(r.hype)}</span> {r.hypeLabel}
                    </span>
                  </div>

                  <div className="time">{r.time}</div>

                  <div className="chev" aria-hidden>
                    <Icon name="chevron" size={14} />
                  </div>
                </div>
              ))}
            </div>

            {visible.length > PAGE_SIZE && (
              <nav className="rsp-pager" aria-label="Responses pagination">
                <span className="pager-info">
                  Showing <strong>{rangeStart}–{rangeEnd}</strong> of {visible.length}
                </span>
                <div className="pager-controls">
                  <button
                    className="pager-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    aria-label="Previous page"
                  >
                    <Icon name="chevron" size={15} className="flip" /> prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`pager-num${n === safePage ? " active" : ""}`}
                      onClick={() => setPage(n)}
                      aria-current={n === safePage ? "page" : undefined}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="pager-btn"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    aria-label="Next page"
                  >
                    next <Icon name="chevron" size={15} />
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </section>

      {/* ---------- DETAIL PANE ---------- */}
      <aside className="rsp-detail-pane">
        {!selected ? (
          <div className="rsp-detail-empty">
            <span className="art"><Icon name="plane" size={54} /></span>
            <h3>Nothing open</h3>
            <p>Pick a response on the left and every answer unfolds here.</p>
          </div>
        ) : (
          <>
            <header className="rsp-detail-head">
              <span className={`rsp-av lg t-${selected.tint}`}>{selected.initial}</span>
              <div className="who-block">
                <div className="nm">{selected.name}</div>
                <div className="em">
                  {selected.email} · {selected.time}
                </div>
              </div>
              <div className="actions">
                <button
                  className={selected.status === "flagged" ? "on" : ""}
                  title={selected.status === "flagged" ? "Unflag" : "Flag"}
                  aria-label={selected.status === "flagged" ? "Unflag response" : "Flag response"}
                  onClick={() => toggleFlag(selected.id)}
                >
                  <Icon name="star" size={14} />
                </button>
                <button title="Discard" aria-label="Discard response" onClick={() => discard([selected.id])}>
                  <Icon name="trash" size={14} />
                </button>
                <button title="Close" aria-label="Close detail" onClick={() => setSelectedId(null)}>
                  <Icon name="x" size={14} />
                </button>
              </div>
            </header>

            <div className="rsp-detail-body">
              <div className="rsp-meta">
                <div className="item"><b>{selected.time}</b>Submitted</div>
                <div className="item"><b>{selected.duration}</b>Completion time</div>
                <div className="item"><b>{selected.device}</b>Device</div>
                <div className="item"><b>{selected.city}</b>City</div>
                <div className="item"><b>{selected.answered}</b>Questions answered</div>
                <div className="item"><b>{selected.pages}</b>Reached</div>
              </div>

              {answers.map((a) => (
                <div className="rsp-ans" key={a.n}>
                  <div className="q-lbl">
                    {a.n} · <span className={`type-pill t-${a.tint}`}>{a.type}</span>
                  </div>
                  <div className="q">{a.q}</div>

                  {a.kind === "chips" ? (
                    (a.chips ?? []).length > 0 ? (
                      <div className="a-chips">
                        {(a.chips ?? []).map((c) => (
                          <span key={c}>{c}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="a skipped">skipped</span>
                    )
                  ) : a.kind === "stars" ? (
                    <span className="a stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Icon key={i} name="star" size={18} className={i < (a.stars ?? 0) ? "on" : "off"} />
                      ))}
                      <span className="stars-label">{a.value}</span>
                    </span>
                  ) : a.kind === "long" ? (
                    a.value ? (
                      <p className="a-long">“{a.value}”</p>
                    ) : (
                      <span className="a skipped">skipped</span>
                    )
                  ) : (
                    <span className={`a${a.kind === "plain" ? " plain" : ""}`}>{a.value}</span>
                  )}
                </div>
              ))}

              <hr className="o-rule o-rule--dashed" />

              <div className="o-note o-note--sticky o-note--green rsp-sticky">
                ⓘ {selected.note ? "note this for Saturday setup" : "follow up — they stopped part-way through"}
              </div>

              <div className="rsp-detail-foot">
                <a className="o-btn o-btn--sm" href={`mailto:${selected.email}`}>
                  <Icon name="mail" size={13} /> Reply
                </a>
                <button className="o-btn o-btn--sm" onClick={copyAnswers}>
                  <Icon name={copied ? "check" : "copy"} size={13} /> {copied ? "Copied" : "Copy answers"}
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default Responses;
