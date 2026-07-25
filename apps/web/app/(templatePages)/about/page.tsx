import React from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import './about.css'

export const metadata = {
    title: 'About · Origami Forms',
    description:
        'The story behind Origami Forms — a form builder designed like a Japanese stationery set.',
}

const stats = [
    { num: '2 min', label: 'To fold a form' },
    { num: '11', label: 'Question types' },
    { num: '9', label: 'Paper themes' },
    { num: '100%', label: 'Quiet by default' },
]

const values = [
    {
        emoji: '🌸',
        title: 'Handmade feeling',
        body: 'Software should feel warm, tactile, and personal — never sterile. Every fold is designed with care.',
    },
    {
        emoji: '🤫',
        title: 'Quiet by default',
        body: 'Your data stays yours. Unlisted links, password protection, and privacy shaped the way it should be.',
    },
    {
        emoji: '✨',
        title: 'Delightfully simple',
        body: 'Powerful when you need it, invisible when you don’t. The joy is in how little it gets in your way.',
    },
]

const Page = () => {
    return (
        <>
            <Navbar />
            <main className="o-about o-page">
                <div className="o-about-shell">
                    {/* Hero */}
                    <header className="o-about-hero">
                        <p className="o-eyebrow">Our story, folded out</p>
                        <h1 className="o-about-title o-hand">
                            Forms that feel <span className="o-hl">handmade.</span>
                        </h1>
                        <p className="o-about-lede">
                            Origami is a form builder designed like a Japanese stationery set — a
                            quiet, tactile alternative to the sea of sterile SaaS tools. We believe
                            the software you use every day should feel like something you&rsquo;d
                            want to keep on your desk.
                        </p>
                    </header>

                    {/* Stats */}
                    <section className="o-about-stats">
                        {stats.map((s) => (
                            <div key={s.label} className="o-card o-card--paper o-about-stat">
                                <div className="o-about-stat-num">{s.num}</div>
                                <div className="o-about-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </section>

                    {/* Story */}
                    <section>
                        <div className="o-about-section-head">
                            <span className="o-badge o-badge--peach">Why we started</span>
                            <h2 className="o-about-h2">A little rebellion against boring tools.</h2>
                        </div>
                        <div className="o-about-story">
                            <p>
                                We were tired of forms that looked like tax paperwork. Beautiful
                                ideas deserve beautiful containers — a wedding RSVP, a startup
                                survey, a newsletter signup shouldn&rsquo;t feel like filing a
                                complaint.
                            </p>
                            <p>
                                So we built Origami: a form builder inspired by washi tape, sticky
                                notes, and the warm clutter of a creative desk. Sketch a form with a
                                single sentence, drag questions around like paper scraps, publish a
                                private link, and watch responses fall onto your desk.
                            </p>
                            <p>
                                It&rsquo;s still early — we&rsquo;re a small team folding this out in
                                the open. Every crease is intentional, and every bit of feedback
                                shapes where we fold next.
                            </p>
                        </div>
                    </section>

                    {/* Values */}
                    <section>
                        <div className="o-about-section-head">
                            <span className="o-badge o-badge--matcha">What we believe</span>
                            <h2 className="o-about-h2">The folds we won&rsquo;t compromise on.</h2>
                        </div>
                        <div className="o-about-values">
                            {values.map((v) => (
                                <div key={v.title} className="o-card o-about-value">
                                    <span className="o-about-value-emoji" aria-hidden>
                                        {v.emoji}
                                    </span>
                                    <h3>{v.title}</h3>
                                    <p>{v.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="o-about-cta">
                        <span className="o-tape o-tape--matcha" aria-hidden />
                        <h2>Come fold something with us.</h2>
                        <p>
                            Start with a blank sheet or a template — your first beautiful form is two
                            minutes away.
                        </p>
                        <div className="o-about-cta-actions">
                            <Link href="/dashboard" className="o-btn o-btn--accent o-btn--lg">
                                Start folding
                            </Link>
                            <Link href="/contact" className="o-btn o-btn--outline o-btn--lg">
                                Get in touch
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}

export default Page
