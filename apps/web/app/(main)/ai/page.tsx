"use client"

import React, { useState } from 'react'
import './ai.css'
import AiDecorations from './components/AiDecorations'
import PromptForge from './components/PromptForge'
import ExampleGallery from './components/ExampleGallery'
import AiSideRail from './components/AiSideRail'
import DraftingState from './components/DraftingState'
import DraftReview from './components/DraftReview'
import type { DraftPreview, ForgeKind, ForgeStage } from './types'
import AiHeader from './components/AiHeader'

const SAMPLE_DRAFT = (prompt: string, kind: ForgeKind): DraftPreview => ({
    kind,
    prompt,
    title: 'Pottery Weekend · Registration',
    description: 'Tell us who you are and which session you would like to throw in.',
    fields: [
        { id: 'f1', type: 'heading', label: 'About you' },
        { id: 'f2', type: 'short_text', label: 'Full name', required: true },
        { id: 'f3', type: 'email', label: 'Email address', required: true, helpText: 'We send the studio address here.' },
        { id: 'f4', type: 'phone', label: 'Phone number' },
        { id: 'f5', type: 'page_break', label: 'The session' },
        {
            id: 'f6',
            type: 'single_select',
            label: 'Which session suits you?',
            required: true,
            options: ['Saturday morning', 'Saturday afternoon', 'Sunday morning'],
        },
        {
            id: 'f7',
            type: 'radio',
            label: 'Have you thrown clay before?',
            required: true,
            options: ['Never', 'A little', 'Plenty'],
        },
        { id: 'f8', type: 'long_text', label: 'Anything we should know?', helpText: 'Allergies, access needs, anything at all.' },
        { id: 'f9', type: 'rating', label: 'How excited are you?' },
    ],
})

const AiPage = () => {
    const [stage, setStage] = useState<ForgeStage>('compose')
    const [prompt, setPrompt] = useState<string>("")
    const [kind, setKind] = useState<ForgeKind>('form')
    const [draft, setDraft] = useState<DraftPreview | null>(null)

    const generate = () => {
        const asked = prompt.trim()
        if (!asked) return
        setStage('drafting')
        window.setTimeout(() => {
            setDraft(SAMPLE_DRAFT(asked, kind))
            setStage('review')
        }, 1600)
    }

    const backToCompose = () => {
        setDraft(null)
        setStage('compose')
    }

    const startOver = () => {
        setPrompt('')
        backToCompose()
    }

    return (
        <div className="ai-page">
            <AiDecorations />

            <AiHeader stage={stage} startOver={startOver} />

            {stage === 'compose' && (
                <div className="ai-compose">
                    <div className="ai-main">
                        <PromptForge
                            prompt={prompt}
                            kind={kind}
                            onPromptChange={setPrompt}
                            onKindChange={setKind}
                            onGenerate={generate}
                        />
                        <ExampleGallery onPick={setPrompt} />
                    </div>
                    <AiSideRail />
                </div>
            )}

            {stage === 'drafting' && <DraftingState prompt={prompt} />}

            {stage === 'review' && draft && (
                <DraftReview draft={draft} onDiscard={startOver} onRefine={backToCompose} />
            )}
        </div>
    )
}

export default AiPage
