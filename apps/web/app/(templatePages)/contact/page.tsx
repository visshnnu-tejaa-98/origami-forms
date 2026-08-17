'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { Icon, type IconName } from '../../(main)/components/icons'
import './contact.css'

const channels: {
    cls: string
    icon: IconName
    title: string
    desc: string
    addr: string
    ago: string
    pgp?: boolean
}[] = [
        {
            cls: '',
            icon: 'mail',
            title: 'General hello',
            desc: 'questions, suggestions, fan mail — we want all of it',
            addr: 'hello@origamiforms.com',
            ago: 'avg. reply · 4 hours',
        },
        {
            cls: 'sakura',
            icon: 'sparkles',
            title: 'Stuck on something?',
            desc: 'technical hiccups, account questions, billing',
            addr: 'support@origamiforms.com',
            ago: 'avg. reply · 2 hours · M–F · 24h Pro',
        },
        {
            cls: 'matcha',
            icon: 'mail',
            title: 'Press & partnerships',
            desc: 'stories, podcasts, integrations, co-marketing',
            addr: 'press@origamiforms.com',
            ago: 'avg. reply · 1 business day',
        },
        {
            cls: 'lav',
            icon: 'lock',
            title: 'Security & abuse',
            desc: 'found a bug? reporting bad content? please tell us',
            addr: 'security@origamiforms.com',
            ago: 'priority queue · avg. reply < 4h',
            pgp: true,
        },
    ]

const topics: { icon: IconName; label: string; defaultValue: string; placeholder: string }[] = [
    { icon: 'sparkles', label: 'Just saying hello', defaultValue: "I'm planning a sakura picnic in Kobe and have a question about conditional logic — when 'can't make it' is picked, can I jump to a totally different page?", placeholder: "I'm planning a sakura picnic in Kobe and have a question about conditional logic — when 'can't make it' is picked, can I jump to a totally different page?" },
    { icon: 'zap', label: "I'm stuck", defaultValue: "I'm having trouble with [specific feature/task]...", placeholder: "I'm having trouble with [specific feature/task]..." },
    { icon: 'mail', label: 'Press / partnership', defaultValue: "I'd like to feature Origami Forms in my publication/podcast/newsletter...", placeholder: "I'd like to feature Origami Forms in my publication/podcast/newsletter..." },
    { icon: 'zap', label: 'Feature wish', defaultValue: "I'd love to see [feature] in Origami Forms...", placeholder: "I'd love to see [feature] in Origami Forms..." },
    { icon: 'lock', label: 'Security report', defaultValue: "I've discovered a potential security vulnerability...", placeholder: "I've discovered a potential security vulnerability..." },
    { icon: 'trash', label: 'Data / account', defaultValue: "I have a question about my account or data...", placeholder: "I have a question about my account or data..." },
]

const Page = () => {
    const [activeTopic, setActiveTopic] = useState(0)
    const [emailBody, setEmailBody] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Wire this up to your API / email service.
    }

    const handleContactMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEmailBody(e.target.value)
    }

    useEffect(() => {
        setEmailBody(topics[activeTopic]?.defaultValue || "")
    }, [activeTopic])

    return (
        <>
            <Navbar />

            <main className="contact-page">
                <span className="float-deco crane">
                    <Icon name="crane" size={80} />
                </span>
                <span className="float-deco plane">
                    <Icon name="plane" size={56} />
                </span>
                <span className="float-deco sakura1">
                    <Icon name="sakura" size={38} />
                </span>

                {/* LEFT: channels */}
                <div className="c-left">
                    <span className="eyebrow">★ say hello ✶</span>
                    <h1>
                        We read every
                        <br />
                        paper letter.
                    </h1>
                    <p className="lede">
                        A small team in Kobe and Brooklyn, mostly. We answer within a workday — usually
                        faster. Pick a paper trail below or send a note over there →
                    </p>

                    {channels.map((c) => (
                        <a key={c.addr} className={`channel ${c.cls}`} href={`mailto:${c.addr}`}>
                            <span className="ic">
                                <Icon name={c.icon} size={20} />
                            </span>
                            <div className="body">
                                <div className="ttl">{c.title}</div>
                                <p className="desc">{c.desc}</p>
                                <div className="addr">
                                    {c.addr}
                                    {c.pgp && <span className="pgp">PGP</span>}
                                </div>
                                <div className="ago">{c.ago}</div>
                            </div>
                        </a>
                    ))}

                    {/* studio card */}
                    <div className="studio-card">
                        <span className="clip">
                            <Icon name="clip" size={28} />
                        </span>
                        <h3>The paper desk</h3>
                        <p>
                            Origami Stationery, Co.
                            <br />
                            3-12-1 Kita-Aoyama, Minato-ku
                            <br />
                            Tokyo 107-0061 · Japan
                        </p>
                        <p style={{ marginTop: "6px" }}>
                            &amp; a co-working spot in Brooklyn,
                            <br />
                            61 Greenpoint Ave, NY 11222 · USA
                        </p>
                        <div className="hours">
                            <span className="o-dot o-dot--success" />
                            Open · Mon–Fri 09:00–18:00 JST · async always
                        </div>
                    </div>
                </div>

                {/* RIGHT: contact form sheet */}
                <aside className="form-sheet">
                    <span className="tape" />
                    <span className="clip-top">
                        <Icon name="clip" size={30} />
                    </span>

                    <span className="o-badge o-badge--matcha" style={{ marginBottom: "14px" }}>
                        ★ folded by origami ↗
                    </span>
                    <h2>Send a paper.</h2>
                    <p className="intro">We&rsquo;ll fold an answer back, usually within a few hours.</p>

                    <form className="form-stack" onSubmit={handleSubmit}>
                        <div className="row-2">
                            <div className="o-field">
                                <label className="o-field-label">Name</label>
                                <input className="o-input" placeholder="Aiko Tanaka" />
                            </div>
                            <div className="o-field">
                                <label className="o-field-label">
                                    Email <span className="req">*</span>
                                </label>
                                <input className="o-input" type="email" placeholder="you@studio.dev" required />
                            </div>
                        </div>

                        <div className="o-field">
                            <label className="o-field-label">What&rsquo;s this about?</label>
                            <div className="topic-grid">
                                {topics.map((t, i) => (
                                    <button
                                        type="button"
                                        key={t.label}
                                        className={`topic-tile${i === activeTopic ? ' active' : ''}`}
                                        onClick={() => setActiveTopic(i)}
                                    >
                                        <span className="ic">
                                            <Icon name={t.icon} size={14} />
                                        </span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="o-field">
                            <label className="o-field-label">
                                Your message <span className="req">*</span>
                            </label>
                            <textarea
                                className="o-textarea"
                                rows={5}
                                required
                                placeholder="tell us about the form you're trying to fold, what you wish worked differently, or just say hi…"
                                value={emailBody !== null ? emailBody : topics[activeTopic]?.defaultValue ?? ""}
                                onChange={(e) => handleContactMessageChange(e)}
                            />
                            <div className="o-field-help">no formatting needed — plain words are perfect</div>
                        </div>

                        <label className="o-check">
                            <input type="checkbox" defaultChecked />
                            <span className="box" /> Send me a confirmation receipt
                        </label>

                        <div className="sla-note">
                            <span className="iconbox">
                                <Icon name="clock" size={14} />
                            </span>
                            <div>
                                <strong>Expected reply · within 4 hours </strong>· Mon–Fri · faster on Pro
                            </div>
                        </div>

                        <button type="submit" className="o-btn o-btn--accent o-btn--lg o-btn--block">
                            <Icon name="mail" size={16} />
                            Send the paper
                        </button>

                        <p className="form-note">
                            we&rsquo;ll never sell your address · <Link href="/policies">privacy policy</Link>
                        </p>
                    </form>
                </aside>
            </main>

            {/* footer note */}
            <section className="contact-footer">
                <div className="o-note o-note--sticky o-note--green">
                    <strong>★ a small confession</strong>
                    <br />
                    this contact form was built with origami. of course it was.{" "}
                    <a href="#">make one too →</a>
                </div>
            </section>
        </>
    );
}

export default Page
