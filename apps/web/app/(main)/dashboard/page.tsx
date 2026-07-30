"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Icon } from "../components/icons";
import "./dashboard.css";
import Cookies from "js-cookie";

const Dashboard = () => {
  const { user } = useUser();
  const firstName = user?.firstName ?? "there";

  const setUserCookie = async () => {
    const authData = useAuth()
    const token = await authData.getToken()
    if (token) {
      Cookies.set("user_session_token", token, {
        path: "/",
        httpOnly: true,
        expires: 7,
        secure: true,
        sameSite: "strict",
        maxAge: 13 * 30 * 24 * 60 * 60 // 1 year
      });
    }
  }
  setUserCookie()



  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <h1>
          <span className="smaller">Tuesday morning ·</span>
          Good morning, {firstName}.
        </h1>
        <div className="search">
          <Icon name="search" size={16} />
          <input placeholder="Search forms, responses, themes…" />
          <span className="o-kbd">⌘K</span>
        </div>
        <button className="icon-btn" title="Notifications">
          <Icon name="bell" size={18} />
          <span className="badge-dot" />
        </button>
        <button className="icon-btn" title="Help">
          <Icon name="sparkles" size={18} />
        </button>
      </header>

      {/* GREETING */}
      <section className="greet">
        <div className="greet-card">
          <span className="crane">
            <Icon name="crane" size={92} />
          </span>
          <span className="o-eyebrow">Welcome back</span>
          <h2>
            Three drafts. Two live forms.
            <br />
            <span className="o-underline">A good week</span> to fold.
          </h2>
          <p className="lede">
            Your <strong>Sakura Festival RSVP</strong> picked up 42 new responses overnight —
            completion rate jumped 4 points. Worth a sticker.
          </p>
          <div className="actions">
            <Link className="o-btn o-btn--accent" href="#">
              <Icon name="plus" size={14} /> New form
            </Link>
            <Link className="o-btn" href="#">
              <Icon name="analytics" size={14} /> See analytics
            </Link>
          </div>
        </div>
        <div className="focus-card">
          <span className="o-tape o-tape--matcha" />
          <div className="lbl">today&rsquo;s focus</div>
          <h3>Sakura Festival RSVP</h3>
          <div className="row">
            <span className="o-dot" /> 218 responses · 89% complete
          </div>
          <div className="row warn">
            <span className="o-dot" /> 2 fields without validation rules
          </div>
          <div className="row">
            <span className="o-dot o-dot--info" /> Avg time · 1m 47s
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
            <Link className="o-btn o-btn--sm" href="#">
              <Icon name="edit" size={13} /> Edit
            </Link>
            <Link className="o-btn o-btn--sm o-btn--accent" href="#">
              <Icon name="eye" size={13} /> Preview
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-row">
        <div className="stat-card">
          <div className="ic">
            <Icon name="mail" size={18} />
          </div>
          <div className="num">2,418</div>
          <div className="lbl">total responses</div>
          <div className="delta">
            <Icon name="arrow" size={11} /> +312 this week
          </div>
          <svg
            className="mini-spark"
            viewBox="0 0 60 20"
            width="60"
            height="20"
            style={{ color: "var(--accent)" }}
          >
            <path
              d="M2,15 C12,8 18,12 28,5 C40,-2 48,8 58,3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="stat-card s2">
          <div className="ic">
            <Icon name="check" size={18} />
          </div>
          <div className="num">89%</div>
          <div className="lbl">completion rate</div>
          <div className="delta">↑ 4% vs last form</div>
        </div>
        <div className="stat-card s3">
          <div className="ic">
            <Icon name="clock" size={18} />
          </div>
          <div className="num">1m 47s</div>
          <div className="lbl">avg completion</div>
          <div className="delta down">↑ slightly slower (3s)</div>
        </div>
        <div className="stat-card s4">
          <div className="ic">
            <Icon name="eye" size={18} />
          </div>
          <div className="num">5,612</div>
          <div className="lbl">form views · 7d</div>
          <div className="delta">↑ 18%</div>
        </div>
      </section>

      {/* TWO COLUMN */}
      <section className="grid-cols">
        <div>
          {/* FORMS LIST */}
          <div className="panel">
            <div className="panel-head">
              <h3>Recent forms</h3>
              <span className="sub">last week · pinned + edited</span>
              <div className="head-actions">
                <button className="o-btn o-btn--sm o-btn--ghost">
                  <Icon name="filter" size={13} /> Filter
                </button>
                <Link className="o-btn o-btn--sm" href="#">
                  See all <Icon name="arrow" size={13} />
                </Link>
              </div>
            </div>

            {[
              {
                k: "k1",
                icon: "sakura",
                name: "Sakura Festival RSVP",
                sub: "9 fields · last edited 2h ago by you",
                badge: "o-badge--matcha",
                status: "published",
                resp: "218",
                col: "complete",
                p: "89%",
                note: "89%",
              },
              {
                k: "k2",
                icon: "sparkles",
                name: "Startup Feedback Survey",
                sub: "12 fields · 4 days ago",
                badge: "o-badge--matcha",
                status: "published",
                resp: "86",
                col: "complete",
                p: "72%",
                note: "72%",
              },
              {
                k: "k3",
                icon: "zap",
                name: "Gaming Tournament Signup",
                sub: "11 fields · last edited yesterday",
                badge: "o-badge--peach",
                status: "unlisted",
                resp: "34",
                col: "complete",
                p: "64%",
                note: "64%",
              },
              {
                k: "k4",
                icon: "mail",
                name: "Quiet Newsletter Signup",
                sub: "3 fields · published 2 weeks ago",
                badge: "o-badge--matcha",
                status: "published",
                resp: "1,402",
                col: "complete",
                p: "94%",
                note: "94%",
              },
              {
                k: "k5",
                icon: "edit",
                name: "Hiring · Senior Designer (draft)",
                sub: "14 fields · saved 30m ago",
                badge: "o-badge--sakura",
                status: "draft",
                resp: "—",
                col: "progress",
                p: "48%",
                note: "build 48%",
              },
            ].map((f) => (
              <div key={f.name} className={`form-row ${f.k}`}>
                <span className="ic">
                  <Icon name={f.icon as any} size={20} />
                </span>
                <div>
                  <div className="name">{f.name}</div>
                  <div className="sub">{f.sub}</div>
                </div>
                <div className="col">
                  <div className="lbl">status</div>
                  <span className={`o-badge ${f.badge}`}>{f.status}</span>
                </div>
                <div className="col">
                  <div className="lbl">responses</div>
                  <div className="num">{f.resp}</div>
                </div>
                <div className="col" style={{ minWidth: "120px" }}>
                  <div className="lbl">{f.col}</div>
                  <div className="o-progress" style={{ marginTop: "4px" }}>
                    <div className="bar" style={{ "--p": f.p } as React.CSSProperties} />
                  </div>
                  <div className="sub" style={{ marginTop: "3px" }}>
                    {f.note}
                  </div>
                </div>
                <span className="ellipsis">
                  <Icon name="chevron" size={16} />
                </span>
              </div>
            ))}
          </div>

          {/* CHART PANEL */}
          <div className="panel">
            <div className="panel-head">
              <h3>Responses · last 30 days</h3>
              <span className="sub">across all forms</span>
              <div className="head-actions">
                <div className="seg">
                  <button>7d</button>
                  <button className="active">30d</button>
                  <button>90d</button>
                </div>
              </div>
            </div>
            <div className="chart-meta">
              <div>
                <div className="lbl">total</div>
                <div className="big">2,418</div>
              </div>
              <div>
                <div className="lbl">peak day</div>
                <div className="big">312</div>
              </div>
              <div className="pos">↑ 14% vs prior 30 days</div>
            </div>
            <div className="chart-wrap">
              <svg viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradA" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.36" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="var(--rule-line)" strokeDasharray="3 6">
                  <line x1="0" y1="40" x2="600" y2="40" />
                  <line x1="0" y1="90" x2="600" y2="90" />
                  <line x1="0" y1="140" x2="600" y2="140" />
                </g>
                <path
                  d="M0,150 C40,130 70,140 110,110 C150,80 190,120 230,90 C270,60 310,100 350,70 C390,40 430,80 470,50 C510,30 550,40 600,20 L600,200 L0,200 Z"
                  fill="url(#gradA)"
                />
                <path
                  d="M0,150 C40,130 70,140 110,110 C150,80 190,120 230,90 C270,60 310,100 350,70 C390,40 430,80 470,50 C510,30 550,40 600,20"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <circle cx="110" cy="110" r="3.4" fill="var(--accent-deep)" />
                <circle cx="230" cy="90" r="3.4" fill="var(--accent-deep)" />
                <circle cx="350" cy="70" r="3.4" fill="var(--accent-deep)" />
                <circle cx="470" cy="50" r="3.4" fill="var(--accent-deep)" />
                <circle cx="600" cy="20" r="4.2" fill="var(--accent-deep)" />
                <text
                  x="510"
                  y="14"
                  fontFamily="Caveat, cursive"
                  fontSize="14"
                  fill="var(--matcha-deep)"
                >
                  ↗ all-time high
                </text>
              </svg>
            </div>
          </div>
        </div>

        <aside>
          {/* ACTIVITY */}
          <div className="panel" style={{ marginBottom: "22px" }}>
            <div className="panel-head">
              <h3>Activity</h3>
              <span className="sub">live</span>
              <span className="o-dot o-dot--success pulse" style={{ marginLeft: "auto" }} />
            </div>
            <div className="activity">
              {[
                {
                  k: "",
                  av: "a",
                  body: (
                    <>
                      <strong>aiko</strong> submitted <strong>Sakura Festival RSVP</strong>
                    </>
                  ),
                  time: "2 minutes ago",
                  pip: true,
                },
                {
                  k: "k2",
                  av: "k",
                  body: (
                    <>
                      <strong>kenji</strong> started <strong>Sakura Festival RSVP</strong> · 4/9
                      questions
                    </>
                  ),
                  time: "14 minutes ago",
                },
                {
                  k: "k3",
                  av: "m",
                  body: (
                    <>
                      <strong>mira</strong> shared <strong>Startup Feedback</strong> · 3 new views
                    </>
                  ),
                  time: "38 minutes ago",
                },
                {
                  k: "k4",
                  av: "n",
                  body: (
                    <>
                      <strong>You</strong> edited <strong>Sakura Festival</strong> · added field
                      &ldquo;headcount&rdquo;
                    </>
                  ),
                  time: "2 hours ago",
                },
                {
                  k: "k5",
                  av: "r",
                  body: (
                    <>
                      <strong>renta</strong> submitted <strong>Gaming Tournament</strong>
                    </>
                  ),
                  time: "3 hours ago",
                },
                {
                  k: "",
                  av: "s",
                  body: (
                    <>
                      <strong>sana</strong> completed <strong>Newsletter</strong>
                    </>
                  ),
                  time: "yesterday",
                },
              ].map((a, i) => (
                <div key={i} className={`row ${a.k}`}>
                  <span className="av">{a.av}</span>
                  <div className="body">
                    {a.body}
                    <div className="time">{a.time}</div>
                  </div>
                  {a.pip && <span className="pip" />}
                </div>
              ))}
            </div>
            <button
              className="o-btn o-btn--ghost o-btn--block o-btn--sm"
              style={{ marginTop: "10px" }}
            >
              See all activity <Icon name="arrow" size={12} />
            </button>
          </div>

          {/* STICKY NOTES */}
          <div className="notes-panel">
            <div className="notes-panel-head">
              <h3>Pinned notes</h3>
              <button className="o-btn o-btn--ghost o-btn--sm">
                <Icon name="plus" size={13} /> Pin
              </button>
            </div>
            <div className="note-wall">
              <div className="o-note o-note--sticky" style={{ transform: "rotate(-2deg)" }}>
                ★ check copy on Q5 — too long
              </div>
              <div
                className="o-note o-note--sticky o-note--green"
                style={{ transform: "rotate(3deg)" }}
              >
                ship public theme
                <br />
                before Friday
              </div>
              <div
                className="o-note o-note--sticky o-note--pink"
                style={{ transform: "rotate(-3deg)" }}
              >
                add CSV export to
                <br />
                responses page
              </div>
              <div
                className="o-note o-note--sticky o-note--lavender"
                style={{ transform: "rotate(2deg)" }}
              >
                try cyberpunk theme
                <br />
                on gaming form ★
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
