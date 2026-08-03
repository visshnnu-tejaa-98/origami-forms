import React from "react";
import { Icon } from "../../components/icons";

type CanvasHeadProps = {
  pages: number;
  questions: number;
  rules: number;
};

const CanvasHead = ({ pages, questions, rules }: CanvasHeadProps) => (
  <div className="canvas-head">
    <span className="lbl-pill">
      <span className="o-dot o-dot--success" /> Page 1 of {pages}
    </span>
    <span className="lbl-pill">
      <Icon name="layers" size={12} /> {questions} questions
    </span>
    <span className="lbl-pill">
      <Icon name="zap" size={12} /> {rules} conditional {rules === 1 ? "rule" : "rules"}
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
