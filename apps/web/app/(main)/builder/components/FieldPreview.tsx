import React from "react";
import { Icon } from "../../components/icons";
import { PREVIEW_PLACEHOLDER } from "../constants";
import { BuilderField } from "../types";

const OPTION_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * A non-interactive sketch of how the field will look to a respondent.
 * Inputs are disabled — the canvas edits structure, the preview tab edits nothing.
 */
const FieldPreview = ({ field }: { field: BuilderField }) => {
  const placeholder = field.placeholder || PREVIEW_PLACEHOLDER[field.type] || "";

  switch (field.type) {
    case "long-text":
      return (
        <textarea className="preview-input preview-textarea" placeholder={placeholder} disabled />
      );

    case "single-select":
      return (
        <div className="preview-row">
          {field.options.map((opt, i) => (
            <span key={opt.id} className={`preview-pill${i === 1 ? " is-picked" : ""}`}>
              <span className="kbd-mini">{OPTION_KEYS[i] ?? i + 1}</span>
              {opt.label}
            </span>
          ))}
        </div>
      );

    case "multi-select":
      return (
        <div className="preview-checks">
          {field.options.map((opt, i) => (
            <label key={opt.id} className="o-check">
              <input type="checkbox" checked={i % 2 === 0} disabled readOnly />
              <span className="box" />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case "rating":
      return (
        <div className="preview-stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={n <= (field.rating ?? 0) ? "on" : ""}>
              <Icon name="star" size={22} />
            </span>
          ))}
        </div>
      );

    case "boolean":
      return (
        <div className="preview-row">
          <span className="preview-pill is-picked">Yes</span>
          <span className="preview-pill">No</span>
        </div>
      );

    case "file":
      return (
        <div className="preview-drop">
          <Icon name="upload" size={16} />
          {placeholder}
        </div>
      );

    case "number":
      return (
        <div className="preview-inline">
          <input className="preview-input preview-input--short" placeholder={placeholder} disabled />
          <span className="preview-note">min 1 · max 12</span>
        </div>
      );

    case "date":
      return (
        <div className="preview-inline">
          <input className="preview-input preview-input--mid" placeholder={placeholder} disabled />
        </div>
      );

    default:
      return <input className="preview-input" placeholder={placeholder} disabled />;
  }
};

export default FieldPreview;
