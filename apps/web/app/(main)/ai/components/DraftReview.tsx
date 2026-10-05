"use client"

import React from 'react'
import { Icon } from '../../components/icons'
import { BLOCK_META, hasOptions, isFieldBlock } from '../../builder/constants'
import type { DraftReviewProps } from '../types'


const DraftReview = ({ draft, onDiscard, onRefine, saveDraft }: DraftReviewProps) => {

    const questions = draft.fields.filter(isFieldBlock)

    return (
        <section className="draft" aria-labelledby="draft-title">
            <header className="draft-head">
                <div className="draft-head-id">
                    <span className="o-eyebrow">
                        <Icon name="sparkles" size={12} /> draft {draft.kind}
                    </span>
                    <h2 id="draft-title">{draft.title}</h2>
                    {draft.description && <p className="draft-desc">{draft.description}</p>}
                    <div className="draft-meta">
                        <span><Icon name="layers" size={13} /> {questions.length} questions</span>
                        <span><Icon name="clock" size={13} /> about a minute to fill</span>
                    </div>
                </div>

                <div className="draft-head-actions">
                    <button type="button" className="o-btn o-btn--sm" onClick={onRefine}>
                        <Icon name="refresh" size={13} /> Try again
                    </button>
                    <button type="button" className="o-btn o-btn--sm" onClick={onDiscard}>
                        <Icon name="x" size={13} /> Discard
                    </button>
                </div>
            </header>

            <ol className="draft-fields">
                {questions.map((field, index) => {
                    const meta = BLOCK_META[field.type]
                    return (
                        <li key={field.id + index} className={`draft-field tint-${meta?.tint ?? 'accent'}`}>
                            <span className="draft-field-ic">
                                <Icon name={meta?.icon ?? 'text'} size={15} />
                            </span>

                            <div className="draft-field-body">
                                <div className="draft-field-label">
                                    <span className="draft-field-n">{String(index + 1).padStart(2, '0')}</span>
                                    {field.label}
                                    {field.required && <span className="draft-req" title="Required">*</span>}
                                </div>
                                {field.helpText && <p className="draft-field-help">{field.helpText}</p>}
                                {hasOptions(field) && (
                                    <div className="draft-opts">
                                        {field.options.map((option) => (
                                            <span key={option.id} className="draft-opt">{option.label}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <span className="draft-field-type">{meta?.label ?? field.type}</span>
                        </li>
                    )
                })}
            </ol>

            <footer className="draft-foot">
                <p className="draft-foot-note">
                    <Icon name="info" size={13} /> Everything here is editable once you open it in
                    the builder.
                </p>
                <div className="draft-foot-actions">
                    <button type="button" className="o-btn o-btn--accent o-btn--sm" onClick={saveDraft}>
                        <Icon name="save" size={13} /> Save as draft
                    </button>
                </div>
            </footer>
        </section>
    )
}

export default DraftReview
