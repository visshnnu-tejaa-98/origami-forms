import React from "react";
import { BlankSheet, PaperStar } from "../../components/origami-art";

/* The page's own floating folds — a blank sheet and a star, so the page reads as patterns
   waiting to be used rather than forms already out collecting. They sit behind both panes
   and are hidden once the layout stacks. */
const TemplateDecorations = () => (
    <div className="tpl-deco" aria-hidden>
        <span className="td td-sheet">
            <BlankSheet size={72} />
        </span>
        <span className="td td-star">
            <PaperStar size={40} />
        </span>
    </div>
);

export default TemplateDecorations;
