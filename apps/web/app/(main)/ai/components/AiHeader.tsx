import React from 'react'
import { Icon } from '~/components/origami/icon'
import type { AiHeaderProps } from '../types'

const AiHeader = ({ stage, startOver }: AiHeaderProps) => {
    return (
        <header className="ai-head">
            <div className="ai-head-id">
                <h1>
                    AI Assist <span className="o-badge o-badge--matcha">beta</span>
                </h1>
                <div className="sub">
                    Describe a form in plain words · drafted in seconds, yours to edit
                </div>
            </div>

            {stage === 'review' && (
                <button type="button" className="o-btn o-btn--sm" onClick={startOver}>
                    <Icon name="plus" size={13} /> New prompt
                </button>
            )}
        </header>
    )
}

export default AiHeader