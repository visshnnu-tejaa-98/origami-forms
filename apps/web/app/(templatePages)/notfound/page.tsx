import React from 'react'
import Link from 'next/link'
import '../status.css'

export const metadata = {
    title: 'Page not found · Origami Forms',
    description: 'This page took a wrong fold — the page you were looking for does not exist.',
}

const PaperPlane = () => (
    <svg viewBox="0 0 240 180" fill="none" role="img" aria-label="A paper airplane off course">
        {/* dashed flight path */}
        <path
            className="o-art-dash"
            d="M12 160 C 60 150, 70 90, 120 96 C 150 100, 150 60, 196 52"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 10"
            opacity="0.7"
        />
        {/* soft shadow */}
        <ellipse className="o-art-shadow" cx="196" cy="118" rx="42" ry="8" />
        {/* plane body */}
        <g transform="rotate(-8 196 66)">
            <path className="o-art-accent-soft o-art-ink" strokeWidth="2.5" strokeLinejoin="round"
                d="M150 34 L238 44 L182 96 Z" />
            <path className="o-art-paper o-art-ink" strokeWidth="2.5" strokeLinejoin="round"
                d="M150 34 L182 96 L192 66 Z" />
            <path className="o-art-accent o-art-ink" strokeWidth="2.5" strokeLinejoin="round"
                d="M150 34 L192 66 L238 44 Z" />
        </g>
    </svg>
)

const Page = () => {
    return (
        <main className="o-status o-page">
            <div className="o-status-inner">
                <span className="o-status-scrap o-status-scrap--1" aria-hidden />
                <span className="o-status-scrap o-status-scrap--2" aria-hidden />
                <span className="o-status-scrap o-status-scrap--3" aria-hidden />
                <span className="o-status-scrap o-status-scrap--4" aria-hidden />

                <div className="o-status-art o-status-art--float">
                    <PaperPlane />
                </div>

                <p className="o-status-code">
                    4<span className="o-hl">0</span>4
                </p>

                <h1 className="o-status-title">This page took a wrong fold.</h1>
                <p className="o-status-lede">
                    The page you&rsquo;re looking for flew off the desk — it may have been moved,
                    renamed, or never folded at all.
                </p>

                <div className="o-status-actions">
                    <Link href="/" className="o-btn o-btn--accent o-btn--lg">
                        Back home
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default Page
