import React from 'react'

const ChartPanel = () => {
    return (
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
    )
}

export default ChartPanel