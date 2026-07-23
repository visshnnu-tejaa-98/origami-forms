import React from 'react'
import Link from 'next/link'
import './policies.css'
import { currentDate } from '~/app/utils'

export const metadata = {
    title: 'Terms & Privacy · Origami Forms',
    description:
        'The Terms and Conditions and Privacy Policy that govern your use of Origami Forms.',
}

const LAST_UPDATED = currentDate

type Section = {
    id: string
    heading: string
    body: React.ReactNode
}

const termsSections: Section[] = [
    {
        id: 'acceptance',
        heading: 'Acceptance of terms',
        body: (
            <p>
                By accessing or using Origami Forms (the &ldquo;Service&rdquo;), you agree to be
                bound by these Terms and Conditions. If you do not agree with any part of these
                terms, please do not use the Service. They apply to every visitor, user, and account
                holder.
            </p>
        ),
    },
    {
        id: 'accounts',
        heading: 'Your account',
        body: (
            <p>
                When you create an account you must provide accurate, complete information. You are
                responsible for safeguarding your credentials and for all activity under your
                account. Tell us right away if you notice any unauthorized use or security breach.
            </p>
        ),
    },
    {
        id: 'use',
        heading: 'Acceptable use',
        body: (
            <>
                <p>You agree not to use the Service to:</p>
                <ul className="o-policy-list">
                    <li>Collect data in violation of applicable laws or third-party rights.</li>
                    <li>Distribute malware, spam, or unlawful, harmful, or fraudulent content.</li>
                    <li>Attempt to gain unauthorized access to the Service or its systems.</li>
                    <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'content',
        heading: 'Your content',
        body: (
            <p>
                You keep full ownership of the forms, responses, and data you create or collect
                (&ldquo;Your Content&rdquo;). You grant us a limited license to host, store, and
                process it solely to operate and improve the Service. You remain responsible for Your
                Content and how you collect it.
            </p>
        ),
    },
    {
        id: 'ip',
        heading: 'Intellectual property',
        body: (
            <p>
                The Service — its design, code, and branding — stays the exclusive property of
                Origami Forms and its licensors. These terms grant you no right to use our trademarks
                or intellectual property without prior written consent.
            </p>
        ),
    },
    {
        id: 'termination',
        heading: 'Termination',
        body: (
            <p>
                We may suspend or terminate access at any time if you breach these terms. On
                termination your right to use the Service ends immediately. You may stop using the
                Service and close your account whenever you like.
            </p>
        ),
    },
    {
        id: 'liability',
        heading: 'Limitation of liability',
        body: (
            <p>
                The Service is provided &ldquo;as is&rdquo; without warranties of any kind. To the
                fullest extent permitted by law, Origami Forms is not liable for any indirect,
                incidental, or consequential damages arising from your use of the Service.
            </p>
        ),
    },
    {
        id: 'changes',
        heading: 'Changes to these terms',
        body: (
            <p>
                We may revise these terms from time to time. We&rsquo;ll flag material changes in the
                Service or by email. Continuing to use Origami Forms after changes take effect means
                you accept the revised terms.
            </p>
        ),
    },
]

const privacySections: Section[] = [
    {
        id: 'collect',
        heading: 'Information we collect',
        body: (
            <>
                <p>We collect a few categories of information:</p>
                <ul className="o-policy-list">
                    <li>
                        <strong>Account information</strong> — your name and email when you register.
                    </li>
                    <li>
                        <strong>Form data</strong> — the forms and responses you and your
                        respondents create, submit, or store.
                    </li>
                    <li>
                        <strong>Usage data</strong> — device, browser, and interaction details
                        collected automatically.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: 'use-info',
        heading: 'How we use it',
        body: (
            <p>
                We use your information to provide, maintain, and improve the Service, to
                authenticate you, to send updates and support, and to protect against fraud and
                abuse. We never sell your personal information.
            </p>
        ),
    },
    {
        id: 'sharing',
        heading: 'Sharing & disclosure',
        body: (
            <p>
                We share information only with service providers who help us run the Service, when
                required by law, or to protect the rights and safety of Origami Forms and its users.
                Those providers are bound by confidentiality obligations.
            </p>
        ),
    },
    {
        id: 'security',
        heading: 'Data security',
        body: (
            <p>
                We use industry-standard technical and organizational measures — including encryption
                in transit and access controls — to protect your data. No method of transmission or
                storage is perfectly secure, so we can&rsquo;t guarantee absolute security.
            </p>
        ),
    },
    {
        id: 'retention',
        heading: 'Data retention',
        body: (
            <p>
                We keep your information for as long as your account is active or as needed to
                provide the Service. You can request deletion any time, subject to legal or
                legitimate business obligations to retain certain records.
            </p>
        ),
    },
    {
        id: 'rights',
        heading: 'Your rights',
        body: (
            <p>
                Depending on where you live, you may have the right to access, correct, export, or
                delete your personal information, and to object to or restrict certain processing. To
                exercise these rights, reach out using the details below.
            </p>
        ),
    },
    {
        id: 'cookies',
        heading: 'Cookies',
        body: (
            <p>
                We use cookies and similar technologies to keep you signed in, remember preferences,
                and understand usage. You can control cookies in your browser, though disabling them
                may affect some features.
            </p>
        ),
    },
    {
        id: 'contact',
        heading: 'Contact us',
        body: (
            <p>
                Questions about this policy or your data? Email us at{' '}
                <a href="mailto:privacy@origamiforms.com" className="o-policy-link">
                    privacy@origamiforms.com
                </a>
                .
            </p>
        ),
    },
]

const SectionCard = ({ index, section }: { index: number; section: Section }) => (
    <section id={section.id} className="o-card o-policy-card">
        <span className="o-policy-num o-mono" aria-hidden>
            {String(index).padStart(2, '0')}
        </span>
        <h3 className="o-policy-heading">{section.heading}</h3>
        <div className="o-policy-body">{section.body}</div>
    </section>
)

const TocLink = ({ section }: { section: Section }) => (
    <a href={`#${section.id}`} className="o-policy-toc-link">
        {section.heading}
    </a>
)

const Page = () => {
    return (
        <main className="o-page o-policy">
            <div className="o-policy-shell">
                {/* Hero */}
                <header className="o-policy-hero">
                    <p className="o-eyebrow">The fine print, folded neatly</p>
                    <h1 className="o-policy-title o-hand">
                        Terms &amp; <span className="o-hl">Privacy</span>
                    </h1>
                    <p className="o-policy-lede o-muted">
                        Everything that governs your use of Origami Forms, in two tidy sections.
                        Take a moment to read through both.
                    </p>

                    <div className="o-note o-note--sticky o-note--peach o-policy-sticky">
                        <span className="o-policy-sticky-label">Last updated</span>
                        {LAST_UPDATED}
                    </div>
                </header>

                <div className="o-policy-grid">
                    {/* Table of contents */}
                    <aside className="o-policy-toc">
                        <div className="o-card o-card--paper o-policy-toc-card">
                            <span className="o-eyebrow">On this page</span>
                            <p className="o-policy-toc-group">Terms &amp; Conditions</p>
                            <nav className="o-policy-toc-nav">
                                {termsSections.map((s) => (
                                    <TocLink key={s.id} section={s} />
                                ))}
                            </nav>
                            <hr className="o-rule o-rule--dashed" />
                            <p className="o-policy-toc-group">Privacy Policy</p>
                            <nav className="o-policy-toc-nav">
                                {privacySections.map((s) => (
                                    <TocLink key={s.id} section={s} />
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="o-policy-content">
                        <div className="o-policy-section-head">
                            <span className="o-badge o-badge--peach">Part one</span>
                            <h2 className="o-policy-h2 o-hand">Terms &amp; Conditions</h2>
                        </div>
                        <div className="o-policy-cards">
                            {termsSections.map((s, i) => (
                                <SectionCard key={s.id} index={i + 1} section={s} />
                            ))}
                        </div>

                        <div className="o-policy-section-head o-policy-section-head--gap">
                            <span className="o-badge o-badge--indigo">Part two</span>
                            <h2 className="o-policy-h2 o-hand">Privacy Policy</h2>
                        </div>
                        <div className="o-policy-cards">
                            {privacySections.map((s, i) => (
                                <SectionCard key={s.id} index={i + 1} section={s} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="o-policy-footer">
                    <span className="o-tape o-tape--pink" aria-hidden />
                    <p className="o-muted">
                        Still have questions? We&rsquo;re happy to help you fold things out.
                    </p>
                    <div className="o-policy-footer-actions">
                        <Link href="/" className="o-btn o-btn--outline">
                            Back home
                        </Link>
                        <a href="mailto:privacy@origamiforms.com" className="o-btn o-btn--accent">
                            Contact us
                        </a>
                    </div>
                    <p className="o-soft o-policy-copyright">
                        © {new Date().getFullYear()} Origami Forms · All rights reserved.
                    </p>
                </footer>
            </div>
        </main>
    )
}
export default Page
