import React from "react";
import { Icon } from "../../components/icons";
import { PREVIEW_PLACEHOLDER, hasOptions } from "../constants";
import { FieldBlock } from "../types";

/**
 * A non-interactive sketch of how the field will look to a respondent.
 * Inputs are disabled — the canvas edits structure, the preview tab edits nothing.
 */
const FieldPreview = ({ field }: { field: FieldBlock }) => {
  const ownPlaceholder = "placeholder" in field ? field.placeholder : undefined;
  const placeholder = ownPlaceholder || PREVIEW_PLACEHOLDER[field.type] || "";

  if (hasOptions(field)) {
    const choices = field.options.filter((opt) => opt.label.trim() !== "");

    if (field.type === "radio") {
      return (
        <div className="preview-choices">
          {choices.map((opt, i) => (
            <label key={opt.id} className="o-radio preview-choice">
              <input type="radio" checked={i === 0} disabled readOnly />
              <span className="stamp" />
              {opt.label}
            </label>
          ))}
        </div>
      );
    }

    if (field.type === "check_box") {
      return (
        <div className="preview-choices">
          {choices.map((opt, i) => (
            <label key={opt.id} className="o-check preview-choice">
              <input type="checkbox" checked={i % 2 === 0} disabled readOnly />
              <span className="box" />
              {opt.label}
            </label>
          ))}
        </div>
      );
    }

    if (field.type === "single_select") {
      <div className="preview-row">
        {choices.map((opt, i) => (
          <span key={opt.id} className={`preview-pill${i === 1 ? " is-picked" : ""}`}>
            {opt.label}
          </span>
        ))}
      </div>
    }

    return (
      <div className="preview-row">
        {choices.map((opt, i) => (
          <span key={opt.id} className={`preview-pill${i % 2 === 0 ? " is-picked" : ""}`}>
            {opt.label}
          </span>
        ))}
      </div>
    );
  }

  switch (field.type) {
    case "long_text":
      return (
        <textarea className="preview-input preview-textarea" placeholder={placeholder} disabled />
      );

    case "rating": {
      // the scale is whatever the max validation says — rating carries no default
      const scale = Math.max(1, Math.min(10, field.validation?.max ?? 5));
      return (
        <div className="preview-stars">
          {Array.from({ length: scale }, (_, i) => i + 1).map((n) => (
            <span key={n}>
              <Icon name="star" size={22} />
            </span>
          ))}
        </div>
      );
    }

    case "file_upload":
      return (
        <div className="preview-drop">
          <Icon name="upload" size={16} />
          {placeholder}
        </div>
      );

    case "number":
      return (
        <div className="preview-inline">
          <input
            className="preview-input preview-input--short"
            placeholder={placeholder}
            disabled
          />
          <span className="preview-note">
            {field.validation?.min != null && field.validation?.min != 0 && (
              <span>min {field.validation.min}</span>
            )}{" "}
            . {field.validation?.max != null && <span>max {field.validation.max}</span>} {" "}
            {field.validation?.step != null && field.validation?.step != 1 && (
              <span>. step {field.validation.step}</span>
            )}
          </span>
        </div>
      );

    case "date":
      return (
        <div className="preview-inline">
          <input type="date" className="preview-input preview-input--mid" placeholder={placeholder} disabled />
        </div>
      );

    default:
      return <input className="preview-input" placeholder={placeholder} disabled />;
  }
};

export default FieldPreview;
