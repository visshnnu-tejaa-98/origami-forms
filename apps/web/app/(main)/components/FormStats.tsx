import React from 'react'
// the stats row carries its own styles, so it renders correctly on any page —
// without this it only looked right where something else had already pulled them in
import './stats.css'
import { Icon } from './icons'
import { FormStatsProps } from '../types'

const FormStats = ({ totalResponses, completionRate, formatCompletionTime, avgTimeCompletion, totalViews }: FormStatsProps) => {
    return (
        <section className="stats-row">
            <div className="stat-card">
                <div className="ic">
                    <Icon name="mail" size={18} />
                </div>
                <div className="num">{totalResponses}</div>
                <div className="lbl">total responses</div>
                {/* <div className="delta">
                        <Icon name="arrow" size={11} /> +312 this week
                    </div> */}
                <svg
                    className="mini-spark"
                    viewBox="0 0 60 20"
                    width="60"
                    height="20"
                    style={{ color: "var(--accent)" }}
                >
                    <path
                        d="M2,15 C12,8 18,12 28,5 C40,-2 48,8 58,3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            <div className="stat-card s2">
                <div className="ic">
                    <Icon name="check" size={18} />
                </div>
                <div className="num">{completionRate}%</div>
                <div className="lbl">completion rate</div>
                {/* <div className="delta">↑ 4% vs last form</div> */}
            </div>
            <div className="stat-card s3">
                <div className="ic">
                    <Icon name="clock" size={18} />
                </div>
                <div className="num">{formatCompletionTime(avgTimeCompletion)}</div>
                <div className="lbl">avg completion</div>
                {/* <div className="delta down">↑ slightly slower (3s)</div> */}
            </div>
            <div className="stat-card s4">
                <div className="ic">
                    <Icon name="eye" size={18} />
                </div>
                <div className="num">{totalViews}</div>
                <div className="lbl">form views · 7d</div>
                {/* <div className="delta">↑ 18%</div> */}
            </div>
        </section>
    )
}

export default FormStats