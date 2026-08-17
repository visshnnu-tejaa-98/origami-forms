import React from "react";
import { Icon } from "../../../../components/icons";
import { hasOptions } from "../../../constants";
import { FieldBlock } from "../../../types";

/** the answer a respondent has given — shape depends on the field type */
export type AnswerValue = string | string[];

type PreviewInputProps = {
  field: FieldBlock;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

const OPTION_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

/**
 * The real, working control a respondent would fill in. Everything here is
 * live — the preview is the published form, rendered from builder state.
 */
const PreviewInput = ({ field, value, onChange }: PreviewInputProps) => {
  const text = typeof value === "string" ? value : "";
  const picked = Array.isArray(value) ? value : [];

  // single/multi select, radio and checkbox all read from the same option list
  if (hasOptions(field)) {
    const multiple = field.type === "multi_select" || field.type === "check_box";
    const choices = field.options.filter((opt) => opt.label.trim() !== "");

    const toggle = (optValue: string) => {
      if (!multiple) return onChange(optValue);
      return onChange(
        picked.includes(optValue)
          ? picked.filter((v) => v !== optValue)
          : [...picked, optValue]
      );
    };

    return (
      <div className={`pv-pills${multiple ? " pv-pills--two" : ""}`}>
        {choices.map((opt, i) => {
          const selected = multiple ? picked.includes(opt.value) : text === opt.value;
          return (
            <button
              key={opt.id}
              type="button"
              className={`pv-pill${selected ? " selected" : ""}${multiple ? " multi" : ""}`}
              onClick={() => toggle(opt.value)}
              aria-pressed={selected}
            >
              <span className="key">{multiple ? i + 1 : OPTION_KEYS[i] ?? i + 1}</span>
              <span className="txt">{opt.label}</span>
              <span className="mark">{selected && <Icon name="check" size={13} />}</span>
            </button>
          );
        })}
      </div>
    );
  }

  switch (field.type) {
    case "long_text":
      return (
        <textarea
          className="pv-textarea"
          placeholder={field.placeholder ?? "anything we should know…"}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          maxLength={field.validation?.maxLength}
        />
      );

    case "number": {
      const min = field.validation?.min ?? 0;
      const max = field.validation?.max ?? 99;
      const step = field.validation?.step ?? 1;
      const current = Number(text) || min;
      const bump = (by: number) => onChange(String(Math.min(max, Math.max(min, current + by))));

      return (
        <div className="pv-num">
          <div className="stepper">
            <button type="button" onClick={() => bump(-step)} aria-label="Decrease">
              −
            </button>
            <input
              inputMode="numeric"
              value={text}
              onChange={(e) => onChange(e.target.value.replace(/[^\d-]/g, ""))}
              aria-label={field.label}
            />
            <button type="button" onClick={() => bump(step)} aria-label="Increase">
              +
            </button>
          </div>
          <span className="unit">
            min {min} · max {max}
          </span>
        </div>
      );
    }

    case "rating": {
      const scale = Math.max(1, Math.min(10, field.validation?.max ?? 5));
      const current = Number(text) || 0;
      return (
        <div className="pv-stars" role="radiogroup" aria-label={field.label}>
          {Array.from({ length: scale }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`s${n <= current ? " on" : ""}`}
              onClick={() => onChange(String(n))}
              aria-label={`${n} of ${scale}`}
              aria-checked={n === current}
              role="radio"
            >
              <Icon name="star" size={38} />
            </button>
          ))}
        </div>
      );
    }

    case "date":
      return (
        <input
          className="pv-input pv-input--date"
          type="date"
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "file_upload":
      return (
        <label className="pv-drop">
          <input
            type="file"
            hidden
            onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
          />
          <Icon name="upload" size={30} />
          <h4>Drop a paper here</h4>
          <p>
            {text !== ""
              ? text
              : `or browse — max ${field.validation?.maxSizeMb ?? 10}MB`}
          </p>
        </label>
      );

    case "url":
      return (
        <div className="pv-prefix">
          <span className="prefix">https://</span>
          <input
            value={text}
            placeholder={field.placeholder ?? "your-site.com"}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    default:
      return (
        <input
          className="pv-input"
          type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
          placeholder={field.placeholder ?? "Type your answer…"}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          maxLength={field.validation?.maxLength}
        />
      );
  }
};

export default PreviewInput;
