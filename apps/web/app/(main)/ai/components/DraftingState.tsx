"use client"

import React from 'react'
import FoldingCrane from './FoldingCrane'

const DraftingState = ({ prompt }: { prompt: string }) => (
    <section className="draft-wait" aria-live="polite" aria-busy="true">
        <div className="draft-wait-stage" aria-hidden="true">
            <span className="draft-wait-halo" />
            <FoldingCrane size={104} />
        </div>

        <span className="o-eyebrow">folding</span>
        <h2>Drafting your form…</h2>
        <p className="draft-wait-echo">&ldquo;{prompt}&rdquo;</p>

    </section>
)

export default DraftingState
