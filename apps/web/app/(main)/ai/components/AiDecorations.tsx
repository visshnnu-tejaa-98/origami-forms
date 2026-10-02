import React from "react";
import { PaperBoat, PaperCrane, PaperFlower, PaperStar } from "../../components/origami-art";

/* The page's own floating folds — a crane leading, a boat and a flower trailing off,
   so the page reads as paper being folded rather than a tool being operated. They sit
   behind the content and thin out as the layout narrows. */
const AiDecorations = () => (
    <div className="ai-deco" aria-hidden>
        <span className="ad ad-crane">
            <PaperCrane size={88} />
        </span>
        <span className="ad ad-star">
            <PaperStar size={34} />
        </span>
        <span className="ad ad-boat">
            <PaperBoat size={58} />
        </span>
        <span className="ad ad-flower">
            <PaperFlower size={46} />
        </span>
    </div>
);

export default AiDecorations;
