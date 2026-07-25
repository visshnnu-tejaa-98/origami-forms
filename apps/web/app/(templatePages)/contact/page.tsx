'use client'

import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import './contact.css'

const channels = [
    {
        emoji: '✉️',
        title: 'Email us',
        body: (
            <>
                We usually reply within a day.
                <br />
                <a href="mailto:hello@origamiforms.com">hello@origamiforms.com</a>
            </>
        ),
    },
    {
        emoji: '🐦',
        title: 'Say hi on socials',
        body: (
            <>
                Follow along as we fold in the open at{' '}
                <a href="#" >@origamiforms</a>.
            </>
        ),
    },
    {
        emoji: '💬',
        title: 'Support',
        body: (
            <>
                Stuck on a fold? Reach the team at{' '}
                <a href="mailto:support@origamiforms.com">support@origamiforms.com</a>.
            </>
        ),
    },
]

const Page = () => {
    const [sent, setSent] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Wire this up to your API / email service.
        setSent(true)
    }

    return (
        <>
            <Navbar />
            <main className="o-contact o-page">
                <div className="o-contact-shell">
                    <header className="o-contact-hero">
                        <p className="o-eyebrow">We&rsquo;d love to hear from you</p>
                        <h1 className="o-contact-title">
                            Drop us a <span className="o-hl">note.</span>
                        </h1>
                        <p className="o-contact-lede">
                            Questions, feedback, or just want to say hello? Leave a note on our desk
                            and we&rsquo;ll fold a reply back to you.
                        </p>
                    </header>

                    <div className="o-contact-grid">
                        {/* Form */}
                        <div className="o-card o-card--paper o-contact-form-card">
                            {sent ? (
                                <div className="o-contact-success">
                                    <span className="o-contact-success-emoji" aria-hidden>
                                        🕊️
                                    </span>
                                    <h3>Your note is on its way!</h3>
                                    <p>
                                        Thanks for reaching out — we&rsquo;ll get back to you at the
                                        email you shared. Talk soon.
                                    </p>
                                    <button
                                        type="button"
                                        className="o-btn o-btn--outline"
                                        onClick={() => setSent(false)}
                                    >
                                        Send another
                                    </button>
                                </div>
                            ) : (
                                <form className="o-contact-form" onSubmit={handleSubmit}>
                                    <div className="o-contact-row">
                                        <div className="o-field">
                                            <label className="o-field-label" htmlFor="name">
                                                Name <span className="req">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                className="o-input"
                                                placeholder="Ayumi Nakamura"
                                                required
                                            />
                                        </div>
                                        <div className="o-field">
                                            <label className="o-field-label" htmlFor="email">
                                                Email <span className="req">*</span>
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                className="o-input"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="o-field">
                                        <label className="o-field-label" htmlFor="subject">
                                            Subject
                                        </label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            className="o-input"
                                            placeholder="What&rsquo;s on your mind?"
                                        />
                                    </div>

                                    <div className="o-field">
                                        <label className="o-field-label" htmlFor="message">
                                            Message <span className="req">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            className="o-textarea"
                                            rows={5}
                                            placeholder="Tell us everything…"
                                            required
                                        />
                                        <span className="o-field-help">
                                            We&rsquo;ll only use this to reply to you.
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="o-btn o-btn--accent o-btn--lg o-btn--block"
                                    >
                                        Send note
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Channels */}
                        <aside className="o-contact-side">
                            {channels.map((c) => (
                                <div key={c.title} className="o-card o-contact-channel">
                                    <span className="o-contact-channel-emoji" aria-hidden>
                                        {c.emoji}
                                    </span>
                                    <div>
                                        <h3>{c.title}</h3>
                                        <p>{c.body}</p>
                                    </div>
                                </div>
                            ))}
                        </aside>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Page
