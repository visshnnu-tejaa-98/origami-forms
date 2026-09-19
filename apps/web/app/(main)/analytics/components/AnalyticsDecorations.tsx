import React from "react";
import { Icon } from "../../components/icons";
import { PaperBoat, PaperCrane, PaperStar } from "../../components/origami-art";

/**
 * The paper menagerie drifting behind the page. Purely ornamental — it sits at
 * z-index 0 with pointer events off, and every piece bobs on the shared
 * `paperFloat` keyframes so the page reads as folded paper on a desk.
 */
const AnalyticsDecorations = () => (
    <div className="ana-deco" aria-hidden>
        <span className="ad ad-crane">
            <Icon name="crane" size={84} />
        </span>
        <span className="ad ad-plane">
            <Icon name="plane" size={46} />
        </span>
        <span className="ad ad-boat">
            <PaperBoat size={54} />
        </span>
        <span className="ad ad-sakura">
            <Icon name="sakura" size={34} />
        </span>
        <span className="ad ad-sakura2">
            <Icon name="sakura" size={20} />
        </span>
        <span className="ad ad-star">
            <PaperStar size={28} />
        </span>
        <span className="ad ad-crane2">
            <PaperCrane size={40} />
        </span>
    </div>
);

export default AnalyticsDecorations;
