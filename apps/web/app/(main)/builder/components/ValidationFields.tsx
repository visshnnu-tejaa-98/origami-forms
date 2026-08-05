import React from "react";
import { FieldBlock, FieldPatch } from "../types";

type ValidationFieldsProps = {
  field: FieldBlock;
  updateField: (id: string, patch: FieldPatch) => void;
};

/** "" → undefined, so clearing a box removes the rule instead of writing 0 */
const toNum = (raw: string) => (raw.trim() === "" ? undefined : Number(raw));
const toStr = (raw: string) => (raw.trim() === "" ? undefined : raw);

/** the schema coerces dates, so the picker round-trips through yyyy-mm-dd */
const toDateInput = (d?: Date) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const fromDateInput = (raw: string) => (raw === "" ? undefined : new Date(raw));

type RowProps = {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
};

const Row = ({ id, label, hint, children }: RowProps) => (
  <div className="insp-row">
    <label htmlFor={id}>
      {label}
      {hint && <span className="row-hint">{hint}</span>}
    </label>
    {children}
  </div>
);

/**
 * The rules editor for the selected field. Each branch reads the `validation`
 * shape the create-form schema defines for that member of the field union, so
 * what you can type here is exactly what the API will accept.
 */
const ValidationFields = ({ field, updateField }: ValidationFieldsProps) => {
  switch (field.type) {
    /* ---- text-like: length bounds and a pattern ---- */
    case "short_text":
    case "long_text":
    case "email":
    case "phone":
    case "url": {
      const v = field.validation;
      const patch = (next: Partial<NonNullable<typeof v>>) =>
        updateField(field.id, { validation: { ...v, ...next } });

      return (
        <>
          <div className="insp-grid">
            <Row id="v-minlen" label="Min length">
              <input
                id="v-minlen"
                className="insp-input"
                type="number"
                min={1}
                placeholder="none"
                value={v?.minLength ?? ""}
                onChange={(e) => patch({ minLength: toNum(e.target.value) })}
              />
            </Row>
            <Row id="v-maxlen" label="Max length">
              <input
                id="v-maxlen"
                className="insp-input"
                type="number"
                min={1}
                placeholder="none"
                value={v?.maxLength ?? ""}
                onChange={(e) => patch({ maxLength: toNum(e.target.value) })}
              />
            </Row>
          </div>

          <Row id="v-regex" label="Pattern" hint="regex">
            <input
              id="v-regex"
              className="insp-input"
              placeholder="^[A-Za-z ]+$"
              value={v?.regex ?? ""}
              onChange={(e) => patch({ regex: toStr(e.target.value) })}
            />
          </Row>
        </>
      );
    }

    /* ---- number-like: range and step ---- */
    case "number":
    case "rating": {
      const v = field.validation;
      // step carries a schema default, so it is always written back
      const patch = (next: Partial<NonNullable<typeof v>>) =>
        updateField(field.id, { validation: { step: 1, ...v, ...next } });

      return (
        <div className="insp-grid insp-grid--three">
          <Row id="v-min" label="Min">
            <input
              id="v-min"
              className="insp-input"
              type="number"
              placeholder="none"
              value={v?.min ?? ""}
              onChange={(e) => patch({ min: toNum(e.target.value) })}
            />
          </Row>
          <Row id="v-max" label="Max">
            <input
              id="v-max"
              className="insp-input"
              type="number"
              placeholder="none"
              value={v?.max ?? ""}
              onChange={(e) => patch({ max: toNum(e.target.value) })}
            />
          </Row>
          <Row id="v-step" label="Step">
            <input
              id="v-step"
              className="insp-input"
              type="number"
              min={1}
              value={v?.step ?? 1}
              onChange={(e) => patch({ step: toNum(e.target.value) ?? 1 })}
            />
          </Row>
        </div>
      );
    }

    /* ---- multi-choice: how many may be picked ---- */
    case "multi_select":
    case "check_box": {
      const v = field.validation;
      const patch = (next: Partial<NonNullable<typeof v>>) =>
        updateField(field.id, { validation: { ...v, ...next } });

      return (
        <div className="insp-grid">
          <Row id="v-minsel" label="Min picks">
            <input
              id="v-minsel"
              className="insp-input"
              type="number"
              min={0}
              placeholder="none"
              value={v?.minSelections ?? ""}
              onChange={(e) => patch({ minSelections: toNum(e.target.value) })}
            />
          </Row>
          <Row id="v-maxsel" label="Max picks">
            <input
              id="v-maxsel"
              className="insp-input"
              type="number"
              min={1}
              placeholder="none"
              value={v?.maxSelections ?? ""}
              onChange={(e) => patch({ maxSelections: toNum(e.target.value) })}
            />
          </Row>
        </div>
      );
    }

    /* ---- date: the window that may be chosen ---- */
    case "date": {
      const v = field.validation;
      const patch = (next: Partial<NonNullable<typeof v>>) =>
        updateField(field.id, { validation: { ...v, ...next } });

      return (
        <div className="insp-grid insp-grid--stack">
          <Row id="v-datemin" label="Earliest">
            <input
              id="v-datemin"
              className="insp-input"
              type="date"
              value={toDateInput(v?.min)}
              onChange={(e) => patch({ min: fromDateInput(e.target.value) })}
            />
          </Row>
          <Row id="v-datemax" label="Latest">
            <input
              id="v-datemax"
              className="insp-input"
              type="date"
              value={toDateInput(v?.max)}
              onChange={(e) => patch({ max: fromDateInput(e.target.value) })}
            />
          </Row>
        </div>
      );
    }

    /* ---- uploads: size, count and accepted extensions ---- */
    case "file_upload": {
      const v = field.validation;
      // both bounds carry schema defaults, so they are always written back
      const patch = (next: Partial<NonNullable<typeof v>>) =>
        updateField(field.id, { validation: { maxSizeMb: 10, maxFiles: 1, ...v, ...next } });

      return (
        <>
          <div className="insp-grid">
            <Row id="v-size" label="Max size" hint="MB">
              <input
                id="v-size"
                className="insp-input"
                type="number"
                min={1}
                max={100}
                value={v?.maxSizeMb ?? 10}
                onChange={(e) => patch({ maxSizeMb: toNum(e.target.value) ?? 10 })}
              />
            </Row>
            <Row id="v-files" label="Max files">
              <input
                id="v-files"
                className="insp-input"
                type="number"
                min={1}
                value={v?.maxFiles ?? 1}
                onChange={(e) => patch({ maxFiles: toNum(e.target.value) ?? 1 })}
              />
            </Row>
          </div>

          <Row id="v-types" label="Accepted types" hint="comma separated">
            <input
              id="v-types"
              className="insp-input"
              placeholder="pdf, png, jpg"
              value={v?.allowedFileTypes?.join(", ") ?? ""}
              onChange={(e) => {
                const list = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                patch({ allowedFileTypes: list.length > 0 ? list : undefined });
              }}
            />
          </Row>
        </>
      );
    }

    /* single_select and radio take no rules beyond `required` */
    default:
      return <p className="sec-empty">Nothing to bound here — one pick is one pick.</p>;
  }
};

export default ValidationFields;
