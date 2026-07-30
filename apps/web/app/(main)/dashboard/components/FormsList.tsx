import React from 'react'
import { Icon } from '../../components/icons'
import Link from 'next/link'

const FormsList = () => {
    return (
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

    )
}

export default FormsList