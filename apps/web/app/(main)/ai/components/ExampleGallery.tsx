"use client"

import React from 'react'
import { Icon } from '../../components/icons'
import { PROMPT_EXAMPLES } from '../constants'

const ExampleGallery = ({ onPick }: { onPick: (prompt: string) => void }) => (
    <section className="ex" aria-labelledby="ex-title">
        <div className="ex-head">
            <h3 id="ex-title">Start from an example</h3>
            <span className="sub">Pick one, then make it yours</span>
        </div>

        <div className="ex-grid">
            {PROMPT_EXAMPLES.map((example) => (
                <button
                    key={example.id}
                    type="button"
                    className={`ex-card tint-${example.tint}`}
                    onClick={() => onPick(example.prompt)}
                >
                    <span className="ex-card-ic">
                        <Icon name={example.icon} size={17} />
                    </span>
                    <span className="ex-card-title">{example.title}</span>
                    <span className="ex-card-blurb">{example.blurb}</span>
                    <span className="ex-card-use">
                        Use this <Icon name="arrow" size={12} />
                    </span>
                </button>
            ))}
        </div>
    </section>
)

export default ExampleGallery
