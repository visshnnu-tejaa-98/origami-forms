import React from "react";
import { Icon } from "../../components/icons";

type CanvasHeadProps = {
  questions: number;
};

const CanvasHead = ({ questions }: CanvasHeadProps) => {
  const labelText = questions === 1 ? `1 question` : `${questions} questions`
  return (
    <div className="canvas-head">
      <span className="lbl-pill">
        <Icon name="layers" size={12} /> {labelText}
      </span>

      <div className="right">
        <button className="o-btn o-btn--sm o-btn--ghost" title="Duplicate form" aria-label="Duplicate form">
          <Icon name="copy" size={13} />
        </button>
      </div>
    </div>
  )
};

export default CanvasHead;
