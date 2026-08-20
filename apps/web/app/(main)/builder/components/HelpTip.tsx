import React, { useId } from "react";
import { Icon } from "../../components/icons";
import "./HelpTip.css";

type HelpTipProps = {
  /** the note to unfold on hover — nothing renders when this is empty */
  text: string;
};

/**
 * An info nib that unfolds its help text as a sticky paper note.
 * Hover or keyboard focus opens it; no JS positioning, the note is
 * anchored to the nib and pinned above it.
 */
const HelpTip = ({ text }: HelpTipProps) => {
  const tipId = useId();

  if (!text) return null;

  return (
    <span className="help-tip">
      <button
        type="button"
        className="tip-nib"
        aria-label="Show help text"
        aria-describedby={tipId}
        onClick={(e) => e.stopPropagation()}
      >
        <Icon name="info" size={13} />
      </button>
      <span className="tip-note" id={tipId} role="tooltip">
        <span className="fold" aria-hidden />
        {text}
      </span>
    </span>
  );
};

export default HelpTip;
