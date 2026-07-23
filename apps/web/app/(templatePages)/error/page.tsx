'use client'

import React from 'react'
import Link from 'next/link'
import '../status.css'

const CrumpledPaper = () => (
    <svg viewBox="0 0 240 180" fill="none" role="img" aria-label="A crumpled sheet of paper">
        <ellipse className="o-art-shadow" cx="120" cy="158" rx="66" ry="10" />
        {/* crumpled ball outline */}
        <path
            className="o-art-paper o-art-ink"
            strokeWidth="2.5"
            strokeLinejoin="round"
            d="M60 96 C 48 70, 70 44, 104 40 C 128 22, 176 34, 184 62 C 210 74, 206 116, 178 128 C 168 152, 118 156, 100 138 C 66 138, 54 118, 60 96 Z"
        />
        {/* crumple creases */}
        <g className="o-art-ink" strokeWidth="2" strokeLinecap="round" opacity="0.55" fill="none">
            <path d="M96 58 L118 78 L104 96 L126 108" />
            <path d="M150 56 L138 82 L160 92" />
            <path d="M78 108 L102 116" />
            <path d="M150 118 L166 100" />
            <path d="M118 78 L150 70" />
        </g>
        {/* little accent spark */}
        <path className="o-art-dash" strokeWidth="2.5" strokeLinecap="round"
            d="M204 40 L214 30 M210 52 L224 50 M196 26 L200 14" opacity="0.8" />
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
                    <CrumpledPaper />
                </div>

                <p className="o-status-code">
                    5<span className="o-hl">0</span>0
                </p>

                <h1 className="o-status-title">A crease we didn&rsquo;t plan for.</h1>
                <p className="o-status-lede">
                    Something went wrong on our end and this page got crumpled up. Try smoothing it
                    out again, or head back to your desk.
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
