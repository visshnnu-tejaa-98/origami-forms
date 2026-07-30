"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Icon, type IconName } from "../components/icons";
import { FormsGridSkeleton, FormsTableSkeleton } from "./skeletons";
import "./forms.css";

type Status = "published" | "draft" | "unlisted" | "archived";

type Form = {
  id: string;
  title: string;
  icon: IconName;
  tint: string; // k1..k6
  status: Status;
  fields: number;
  responses: number;
  completion: number; // 0..100
  edited: string; // human label
  editedRank: number; // for sorting (lower = more recent)
  pinned: boolean;
  blurb: string;
};

const SEED: Form[] = [
  { id: "1", title: "Sakura Festival RSVP", icon: "sakura", tint: "k3", status: "published", fields: 9, responses: 218, completion: 89, edited: "2 hours ago", editedRank: 1, pinned: true, blurb: "Date, headcount, dietary, kid-friendly toggle." },
  { id: "2", title: "Quiet Newsletter Signup", icon: "mail", tint: "k1", status: "published", fields: 3, responses: 1402, completion: 94, edited: "2 weeks ago", editedRank: 6, pinned: true, blurb: "Email, name, three interests. That's it." },
  { id: "3", title: "Startup Feedback Survey", icon: "sparkles", tint: "k2", status: "published", fields: 12, responses: 86, completion: 72, edited: "4 days ago", editedRank: 4, pinned: false, blurb: "NPS, blockers, what'd you cut, what'd you add." },
  { id: "4", title: "Gaming Tournament Signup", icon: "zap", tint: "k4", status: "unlisted", fields: 11, responses: 34, completion: 64, edited: "yesterday", editedRank: 2, pinned: false, blurb: "Team, players, platform, skill tier." },
  { id: "5", title: "Hiring · Senior Designer", icon: "edit", tint: "k5", status: "draft", fields: 14, responses: 0, completion: 48, edited: "30 minutes ago", editedRank: 0, pinned: false, blurb: "Portfolio, availability, take-home brief." },
  { id: "6", title: "Wedding RSVP · Mira & Ken", icon: "users", tint: "k3", status: "published", fields: 7, responses: 143, completion: 91, edited: "3 days ago", editedRank: 3, pinned: false, blurb: "Attendance, plus-ones, song requests." },
  { id: "7", title: "Office Lunch Poll", icon: "calendar", tint: "k6", status: "draft", fields: 5, responses: 0, completion: 30, edited: "1 week ago", editedRank: 5, pinned: false, blurb: "Weekly cuisine vote, allergy notes." },
  { id: "8", title: "Beta Waitlist 2025", icon: "clock", tint: "k2", status: "archived", fields: 4, responses: 512, completion: 97, edited: "2 months ago", editedRank: 7, pinned: false, blurb: "Closed — kept for the record." },
  { id: "9", title: "Hiring · Senior Designer", icon: "edit", tint: "k5", status: "draft", fields: 14, responses: 0, completion: 48, edited: "30 minutes ago", editedRank: 0, pinned: false, blurb: "Portfolio, availability, take-home brief." },
  { id: "10", title: "Wedding RSVP · Mira & Ken", icon: "users", tint: "k3", status: "published", fields: 7, responses: 143, completion: 91, edited: "3 days ago", editedRank: 3, pinned: false, blurb: "Attendance, plus-ones, song requests." },
  { id: "11", title: "Office Lunch Poll", icon: "calendar", tint: "k6", status: "draft", fields: 5, responses: 0, completion: 30, edited: "1 week ago", editedRank: 5, pinned: false, blurb: "Weekly cuisine vote, allergy notes." },
  { id: "12", title: "Beta Waitlist 2025", icon: "clock", tint: "k2", status: "archived", fields: 4, responses: 512, completion: 97, edited: "2 months ago", editedRank: 7, pinned: false, blurb: "Closed — kept for the record." },
];

const TABS: { key: Status | "all"; label: string; icon: IconName }[] = [
  { key: "all", label: "All", icon: "forms" },
  { key: "published", label: "Live", icon: "eye" },
  { key: "draft", label: "Drafts", icon: "edit" },
  { key: "unlisted", label: "Unlisted", icon: "lock" },
  { key: "archived", label: "Archived", icon: "archive" },
];

const STATUS_BADGE: Record<Status, { cls: string; label: string }> = {
  published: { cls: "o-badge--matcha", label: "live" },
  draft: { cls: "o-badge--sakura", label: "draft" },
  unlisted: { cls: "o-badge--peach", label: "unlisted" },
  archived: { cls: "o-badge--ghost", label: "archived" },
};

const EMPTY_COPY: Record<Status | "all", { title: string; body: string }> = {
  all: { title: "Your drawer is empty.", body: "No forms match that search. Try a different word, or fold a fresh sheet to begin." },
  published: { title: "Nothing live yet.", body: "Publish a draft and it'll show up here, ready to collect its first response." },
  draft: { title: "No drafts on the desk.", body: "Every masterpiece starts as a rough fold. Begin a new one whenever inspiration strikes." },
  unlisted: { title: "No hidden forms.", body: "Unlisted forms live here — shareable by link, invisible to the world." },
  archived: { title: "The archive is spotless.", body: "Forms you retire will rest here, safe and out of the way." },
};

const PAGE_SIZE = 10;

// washi-tape variants cycled across cards
const TAPE = ["tape-pink", "tape-matcha", "tape-yellow", "tape-lav"];

const Forms = () => {
  const [forms, setForms] = useState<Form[]>(SEED);
  const [tab, setTab] = useState<Status | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "responses" | "name">("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setPage(1);
  }, [tab, query, sort]);

  // Simulate a server fetch on mount / tab / sort / page / view change.
  // Swap this effect for your real data-fetching (React Query, tRPC, etc.).
  // NOTE: `view` is here so toggling grid/list previews its skeleton — a real
  // backend wouldn't need to refetch on a client-only view switch.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, [tab, sort, page, view]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: forms.length };
    for (const f of forms) c[f.status] = (c[f.status] ?? 0) + 1;
    return c;
  }, [forms]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = forms.filter((f) => (tab === "all" ? true : f.status === tab));
    if (q) list = list.filter((f) => f.title.toLowerCase().includes(q) || f.blurb.toLowerCase().includes(q));
    list = [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sort === "responses") return b.responses - a.responses;
      if (sort === "name") return a.title.localeCompare(b.title);
      return a.editedRank - b.editedRank;
    });
    return list;
  }, [forms, tab, query, sort]);

  const togglePin = (id: string) =>
    setForms((prev) => prev.map((f) => (f.id === id ? { ...f, pinned: !f.pinned } : f)));

  const totalResponses = forms.reduce((s, f) => s + f.responses, 0).toLocaleString();
  const empty = EMPTY_COPY[tab] ?? {
    title: "Nothing here yet.",
    body: "No forms match — try a different filter, or fold a fresh sheet to begin.",
  };

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paged = visible.slice(start, start + PAGE_SIZE);
  const rangeStart = visible.length === 0 ? 0 : start + 1;
  const rangeEnd = Math.min(start + PAGE_SIZE, visible.length);

  return (
    <div className="forms-page">
      {/* floating origami decorations */}
      <div className="forms-deco" aria-hidden>
        <span className="fd fd-crane"><Icon name="crane" size={78} /></span>
        <span className="fd fd-plane"><Icon name="plane" size={48} /></span>
        <span className="fd fd-sakura"><Icon name="sakura" size={36} /></span>
        <span className="fd fd-sakura2"><Icon name="sakura" size={22} /></span>
      </div>

      {/* HEADER */}
      <header className="forms-head">
        <div>
          <h1>Your paper drawer</h1>
          <div className="sub">
            {forms.length} forms folded · {totalResponses} responses gathered so far
          </div>
        </div>
        <div className="head-actions">
          <div className="forms-search">
            <Icon name="search" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your forms…"
            />
          </div>
          <Link href="#" className="o-btn o-btn--accent">
            <Icon name="plus" size={15} /> New form
          </Link>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className="forms-toolbar">
        <div className="forms-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`forms-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              <span className="tab-count">{counts[t.key] ?? 0}</span>
            </button>
          ))}
        </div>

        <span className="spacer" />

        <select
          className="forms-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          aria-label="Sort forms"
        >
          <option value="recent">Recently edited</option>
          <option value="responses">Most responses</option>
          <option value="name">Name (A–Z)</option>
        </select>

        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
            aria-label="Grid view"
            title="Grid view"
          >
            <Icon name="grid" size={16} />
          </button>
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
            aria-label="List view"
            title="List view"
          >
            <Icon name="list" size={16} />
          </button>
        </div>
      </div>

      {/* GRID / LIST */}
      {loading ? (
        view === "list" ? <FormsTableSkeleton /> : <FormsGridSkeleton />
      ) : visible.length === 0 ? (
        <div className="forms-empty">
          <span className="art"><Icon name="crane" size={72} /></span>
          <h3>{empty.title}</h3>
          <p>{empty.body}</p>
          <Link href="#" className="o-btn o-btn--accent o-btn--lg">
            <Icon name="plus" size={15} /> Fold a new form
          </Link>
        </div>
      ) : (
        <>
          {view === "list" ? (
            /* ---------- LIST · data table ---------- */
            <div className="otable" role="table" aria-label="Your forms">
              <span className="o-tape table-tape tape-matcha" aria-hidden />
              <div className="otable-head" role="row" aria-hidden>
                <span>Form</span>
                <span>Status</span>
                <span className="ta-end">Responses</span>
                <span className="col-comp">Completion</span>
                <span className="col-updated">Updated</span>
                <span className="ta-end">Actions</span>
              </div>
              {paged.map((f) => {
                const badge = STATUS_BADGE[f.status];
                const isDraft = f.status === "draft";
                return (
                  <div key={f.id} className={`otable-row ${f.tint}${f.pinned ? " is-pinned" : ""}`} role="row">
                    <div className="c-form">
                      <span className="ic tint-ic"><Icon name={f.icon} size={20} /></span>
                      <div className="txt">
                        <span className="title" title={f.title}>{f.title}</span>
                        <span className="sub">{f.fields} fields</span>
                      </div>
                    </div>

                    <div className="c-status">
                      <span className={`o-badge ${badge.cls}`}>{badge.label}</span>
                    </div>

                    <div className="c-resp">
                      {f.responses ? (
                        <span className="n">{f.responses.toLocaleString()}</span>
                      ) : (
                        <span className="dash">—</span>
                      )}
                    </div>

                    <div className="c-comp">
                      <div className="o-progress">
                        <div className="bar" style={{ "--p": `${f.completion}%` } as React.CSSProperties} />
                      </div>
                      <span className="pct">{f.completion}%</span>
                    </div>

                    <div className="c-updated">{f.edited}</div>

                    <div className="c-actions">
                      <button
                        className={`pin${f.pinned ? " pinned" : ""}`}
                        onClick={() => togglePin(f.id)}
                        title={f.pinned ? "Unpin" : "Pin to top"}
                        aria-label={f.pinned ? "Unpin form" : "Pin form"}
                      >
                        <Icon name="star" size={15} />
                      </button>
                      <span className="row-tools">
                        <button className="tool" title={isDraft ? "Continue editing" : "Edit"} aria-label="Edit"><Icon name="edit" size={15} /></button>
                        <button className="tool" title="Preview" aria-label="Preview"><Icon name="eye" size={15} /></button>
                        <button className="tool" title="Share link" aria-label="Share"><Icon name="share" size={15} /></button>
                        <button className="tool" title="More" aria-label="More"><Icon name="more" size={15} /></button>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ---------- GRID · cards ---------- */
            <div className="forms-grid">
              {paged.map((f) => {
                const badge = STATUS_BADGE[f.status];
                const isDraft = f.status === "draft";
                return (
                  <article key={f.id} className={`form-card ${f.tint}${isDraft ? " is-draft" : ""}`}>
                    {/* washi tape holding the sheet + a folded dog-ear corner */}
                    <span className={`o-tape card-tape ${TAPE[Number(f.id) % TAPE.length]}`} aria-hidden />
                    <span className="fold" aria-hidden />

                    {/* identity */}
                    <div className="card-top">
                      <span className="ic tint-ic"><Icon name={f.icon} size={22} /></span>
                      <div className="ct-txt">
                        <div className="title-row">
                          <span className="title" title={f.title}>{f.title}</span>
                          <button
                            className={`pin${f.pinned ? " pinned" : ""}`}
                            onClick={() => togglePin(f.id)}
                            title={f.pinned ? "Unpin" : "Pin to top"}
                            aria-label={f.pinned ? "Unpin form" : "Pin form"}
                          >
                            <Icon name="star" size={16} />
                          </button>
                        </div>
                        <div className="meta">
                          <span className={`o-badge ${badge.cls}`}>{badge.label}</span>
                          <span className="dot-sep">·</span>
                          <span className="meta-txt">{f.fields} fields · updated {f.edited}</span>
                        </div>
                      </div>
                    </div>

                    <p className="blurb">{f.blurb}</p>

                    {/* two handwritten stats */}
                    <div className="card-stats">
                      <div className="st">
                        <div className="n">{f.responses ? f.responses.toLocaleString() : "—"}</div>
                        <div className="l">responses</div>
                      </div>
                      <div className="st">
                        <div className="n">{f.completion}%</div>
                        <div className="l">{isDraft ? "built" : "complete"}</div>
                      </div>
                    </div>

                    {/* stitched progress line */}
                    <div className="o-progress">
                      <div className="bar" style={{ "--p": `${f.completion}%` } as React.CSSProperties} />
                    </div>

                    {/* actions */}
                    <div className="card-foot">
                      <Link className="o-btn o-btn--sm" href="#">
                        <Icon name="edit" size={13} /> {isDraft ? "Continue folding" : "Edit"}
                      </Link>
                      <span className="foot-spacer" />
                      <button className="icon-act" title="Preview" aria-label="Preview"><Icon name="eye" size={15} /></button>
                      <button className="icon-act" title="Share link" aria-label="Share"><Icon name="share" size={15} /></button>
                      <button className="icon-act" title="More" aria-label="More"><Icon name="more" size={15} /></button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* PAGINATION — only when the filtered result set exceeds one page */}
          {visible.length > PAGE_SIZE && <nav className="forms-pager" aria-label="Forms pagination">
            <span className="pager-info">
              Showing <strong>{rangeStart}–{rangeEnd}</strong> of {visible.length}
              {visible.length === 1 ? " form" : " forms"}
            </span>
            <div className="pager-controls">
              <button
                className="pager-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                <Icon name="chevron" size={15} className="flip" /> Prev
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
                Next <Icon name="chevron" size={15} />
              </button>
            </div>
          </nav>}
        </>
      )}
    </div>
  );
};

export default Forms;
