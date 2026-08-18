import React from "react";
import { Icon } from "../../components/icons";

type CanvasHeadProps = {
  questions: number;
  saveAsDraft: () => void;
  onPreview: () => void;
};

const CanvasHead = ({ questions, saveAsDraft, onPreview }: CanvasHeadProps) => {
  const onClick = () => {
    saveAsDraft();
    onPreview();
  }
  return (
    <div className="canvas-head">
      <span className="lbl-pill">
        <Icon name="layers" size={12} /> {questions} questions
      </span>

      <div className="right">
        <button className="o-btn o-btn--sm o-btn--ghost" title="Duplicate form" aria-label="Duplicate form">
          <Icon name="copy" size={13} />
        </button>
        <button className="o-btn o-btn--sm o-btn--ghost" onClick={onClick}>
          <Icon name="eye" size={13} /> Save and preview
        </button>
      </div>
    </div>
  )
};

export default CanvasHead;
