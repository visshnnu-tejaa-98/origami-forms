import React from "react";
import { Icon } from "../../components/icons";
import { BLOCK_META } from "../constants";
import { QuestionBlockProps } from "../types";
import FieldPreview from "./FieldPreview";

const QuestionBlock = (props: QuestionBlockProps) => {
  const { field, index, selected, onSelect, onDuplicate, onRemove } = props;
  const meta = BLOCK_META[field.type];

  return (
    <div
      className={`q-block${selected ? " selected" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <span className="drag" title="Drag to reorder">
        <Icon name="drag" size={14} />
      </span>

      <div className="body">
        <div className="meta">
          <span>{String(index).padStart(2, "0")}</span>
          <span className={`type-pill t-${meta?.tint ?? "accent"}`}>
            <Icon name={meta?.icon ?? "text"} size={10} />
            {meta?.label.toLowerCase() ?? field.type}
          </span>
          {field.required && <span className="req">required</span>}
          {selected && <span className="editing-note">← editing this one</span>}
        </div>

        <div className="q-title">{field.label || "Untitled question"}</div>
        {field.help !== "" && <div className="q-help">{field.help}</div>}

        <div className="field-preview">
          <FieldPreview field={field} />
        </div>
      </div>

      <div className="q-actions">
        <button
          type="button"
          className="more"
          title="Duplicate field"
          aria-label="Duplicate field"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <Icon name="copy" size={14} />
        </button>
        <button
          type="button"
          className="more more--danger"
          title="Delete field"
          aria-label="Delete field"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icon name="trash" size={14} />
        </button>
      </div>
    </div>
  );
};

export default QuestionBlock;
