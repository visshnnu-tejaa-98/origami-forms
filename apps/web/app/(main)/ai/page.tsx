"use client"

import React, { useEffect, useState } from 'react'
import './ai.css'
import AiDecorations from './components/AiDecorations'
import PromptForge from './components/PromptForge'
import ExampleGallery from './components/ExampleGallery'
import AiSideRail from './components/AiSideRail'
import DraftingState from './components/DraftingState'
import DraftReview from './components/DraftReview'
import type { DraftPreview, ForgeKind, ForgeStage } from './types'
import AiHeader from './components/AiHeader'
import { useCreateTemplate } from '~/hooks/use-template'
import { toast } from '~/components/origami/toast'
import { BuilderForm } from '../builder/types'
import { dummyAPIData } from './constants'
import { toBuilderTemplateFromAIAssist } from '../utils'

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
    const [seed, setSeed] = useState<BuilderForm | undefined>(undefined)
    /** id of the saved draft, so the review stage can hand off to the builder */
    const [templateId, setTemplateId] = useState<string | null>(null)
    const { createTemplateAsync } = useCreateTemplate()
    const generate = async () => {
        setStage('drafting')
        try {
            const res = dummyAPIData

            if (!res) {
                throw new Error(`Something went wrong in generating the ${kind}. Please try again`)
            }

            const sanitisedSeed = toBuilderTemplateFromAIAssist(res)
            setSeed(sanitisedSeed)

            // the generated field ids are local `q-xxxx` ones; the server mints its own
            const saved = await createTemplateAsync({
                title: sanitisedSeed.title,
                description: sanitisedSeed.description,
                fields: sanitisedSeed.fields.map(({ id, ...field }) => field),
                status: 'draft',
            })

            setTemplateId(saved.id)
            setStage('review')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Could not generate the ${kind}.`)
            setStage('compose')
        }

        // window.setTimeout(() => {
        //     setDraft(SAMPLE_DRAFT(prompt.trim(), kind))

        // }, 1600)
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
