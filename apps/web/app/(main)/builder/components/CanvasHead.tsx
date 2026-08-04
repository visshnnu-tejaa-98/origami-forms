import React from "react";
import { Icon } from "../../components/icons";

type CanvasHeadProps = {
  questions: number;
};

const CanvasHead = ({ questions }: CanvasHeadProps) => (
  <div className="canvas-head">
    <span className="lbl-pill">
      <Icon name="layers" size={12} /> {questions} questions
    </span>

    <div className="right">
      <button className="o-btn o-btn--sm o-btn--ghost" title="Duplicate form" aria-label="Duplicate form">
        <Icon name="copy" size={13} />
      </button>
      <button className="o-btn o-btn--sm o-btn--ghost">
        <Icon name="eye" size={13} /> Preview
      </button>
    </div>
  </div>
);

export default CanvasHead;
