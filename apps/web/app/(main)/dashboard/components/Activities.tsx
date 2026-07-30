import React from 'react'
import { Icon } from '../../components/icons'

const Activities = () => {
    const activities = [{
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
    }]
    return (
        <div className="panel" style={{ marginBottom: "22px" }}>
            <div className="panel-head">
                <h3>Activity</h3>
                <span className="sub">live</span>
                <span className="o-dot o-dot--success pulse" style={{ marginLeft: "auto" }} />
            </div>
            <div className="activity">
                {activities.map((a, i) => (
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
    )
}

export default Activities