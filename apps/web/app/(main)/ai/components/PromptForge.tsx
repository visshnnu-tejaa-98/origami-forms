"use client"

import React from 'react'
import { Icon } from '../../components/icons'
import type { PromptForgeProps } from '../types'

const PromptForge = ({
    prompt,
    kind,
    onPromptChange,
    onKindChange,
    onGenerate,
}: PromptForgeProps) => {
    const ready = prompt.trim().length > 0

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && ready) onGenerate()
    }

    return (
        <section className="forge" aria-labelledby="forge-title">
            <span className="forge-crane" aria-hidden="true">
                <Icon name="crane" size={78} />
            </span>

            <div className="forge-head">
                <span className="o-eyebrow">
                    <Icon name="sparkles" size={12} /> ai assist
                </span>
                <h2 id="forge-title">
                    Describe it. <span className="o-underline">We&rsquo;ll fold it.</span>
                </h2>
                <p className="forge-lede">
                    Write the form you have in mind in plain words. Origami drafts the questions,
                    picks the field types and sets the validation — you land in the builder with
                    everything ready to edit.
                </p>
            </div>

            <div className="forge-sheet">
                <textarea
                    aria-label={`Describe the ${kind} you want to generate`}
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="A registration form for a weekend pottery class — name, email, which session, and whether they've thrown clay before…"
                    rows={4}
                />
                <div className="forge-sheet-foot">
                    <span className="forge-hint">
                        <Icon name="info" size={12} /> ⌘ + Enter to generate
                    </span>
                    <div className="forge-actions">
                        <div className="seg" role="group" aria-label="What to generate">
                            <button
                                type="button"
                                className={kind === 'form' ? 'active' : ''}
                                aria-pressed={kind === 'form'}
                                onClick={() => onKindChange('form')}
                            >
                                Form
                            </button>
                            <button
                                type="button"
                                className={kind === 'template' ? 'active' : ''}
                                aria-pressed={kind === 'template'}
                                onClick={() => onKindChange('template')}
                            >
                                Template
                            </button>
                        </div>
                        <button
                            type="button"
                            className="o-btn o-btn--accent o-btn--sm"
                            onClick={onGenerate}
                            disabled={!ready}
                        >
                            <Icon name="sparkles" size={14} /> Generate
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PromptForge
