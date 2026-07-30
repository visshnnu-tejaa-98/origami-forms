import Link from 'next/link'
import React from 'react'
import { Icon } from '../../components/icons'

const Greeting = () => {
    return (
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
                        New form
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
    )
}

export default Greeting