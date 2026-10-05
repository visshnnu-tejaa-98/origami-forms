"use client";

import React from "react";
import "./ai.css";
import AiDecorations from "./components/AiDecorations";
import PromptForge from "./components/PromptForge";
import ExampleGallery from "./components/ExampleGallery";
import AiSideRail from "./components/AiSideRail";
import DraftingState from "./components/DraftingState";
import DraftReview from "./components/DraftReview";
import AiHeader from "./components/AiHeader";
import { useAi } from "~/hooks/use-ai";

const AiPage = () => {
    const {
        stage,
        prompt,
        kind,
        draft,
        setKind,
        generateFormOrTemplate,
        saveDraft,
        backToCompose,
        startOver,
        setPrompt,
    } = useAi();
    return (
        <div className="ai-page">
            <AiDecorations />

            <AiHeader stage={stage} startOver={startOver} />

            {stage === "compose" && (
                <div className="ai-compose">
                    <div className="ai-main">
                        <PromptForge
                            prompt={prompt}
                            kind={kind}
                            onPromptChange={setPrompt}
                            onKindChange={setKind}
                            onGenerate={generateFormOrTemplate}
                        />
                        <ExampleGallery onPick={setPrompt} />
                    </div>
                    <AiSideRail />
                </div>
            )}

            {stage === "drafting" && <DraftingState prompt={prompt} />}

            {stage === "review" && draft && (
                <DraftReview
                    draft={draft}
                    onDiscard={startOver}
                    onRefine={backToCompose}
                    saveDraft={saveDraft}
                />
            )}
        </div>
    );
};

export default AiPage;
