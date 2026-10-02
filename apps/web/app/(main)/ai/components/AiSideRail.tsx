"use client"

import React from 'react'
import { Icon } from '../../components/icons'
import { PROMPT_TIPS, RECENT_DRAFTS, STEPS } from '../constants'

const AiSideRail = () => (
    <aside className="ai-rail">
        <section className="ai-card ai-card--steps">
            <span className="o-tape o-tape--left o-tape--matcha" />
            <div className="ai-card-lbl">
                <span className="lbl-ic"><Icon name="layers" size={14} /></span>
                How it works
            </div>
            <ol className="steps">
                {STEPS.map((step) => (
                    <li key={step.n} className="step">
                        <span className="step-n">{step.n}</span>
                        <div>
                            <div className="step-title">{step.title}</div>
                            <p className="step-body">{step.body}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>

        <section className="ai-card ai-card--tips">
            <div className="ai-card-lbl">
                <span className="lbl-ic"><Icon name="edit" size={13} /></span>
                Writing a good prompt
            </div>
            <ul className="tips">
                {PROMPT_TIPS.map((tip) => (
                    <li key={tip} className="tip">
                        <span className="tip-tick"><Icon name="check" size={11} /></span>
                        {tip}
                    </li>
                ))}
            </ul>
        </section>

        <section className="ai-card ai-card--recent">
            <div className="ai-card-lbl">
                <span className="lbl-ic"><Icon name="clock" size={13} /></span>
                Recent drafts
            </div>

            {RECENT_DRAFTS.length === 0 ? (
                <div className="ai-empty">
                    <Icon name="empty-box" size={26} />
                    <p>Nothing drafted yet. What you generate will be listed here.</p>
                </div>
            ) : (
                <ul className="recents">
                    {RECENT_DRAFTS.map((draft) => {
                        const isTemplate = draft.kind === 'template'
                        return (
                            <li key={draft.id}>
                                <button type="button" className={`recent is-${draft.kind}`}>
                                    <span className="recent-ic">
                                        <Icon name={isTemplate ? 'templates' : 'forms'} size={15} />
                                    </span>
                                    <span className="recent-body">
                                        <span className="recent-title">{draft.title}</span>
                                        <span className="recent-sub">
                                            <span className={`o-badge o-badge--${isTemplate ? 'lavender' : 'indigo'}`}>
                                                {isTemplate ? 'Template' : 'Form'}
                                            </span>
                                            {draft.questions} questions · {draft.when}
                                        </span>
                                    </span>
                                    <span className="recent-chev">
                                        <Icon name="arrow" size={13} />
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
    </aside>
)

export default AiSideRail
