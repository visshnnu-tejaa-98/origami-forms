import React from "react";
import { Icon } from "../../components/icons";
import { BLOCK_META, hasOptions, isFieldBlock } from "../constants";
import { FieldOption, InspectorProps } from "../types";
import ValidationFields from "./ValidationFields";

const newOptionId = () => `o-${Math.random().toString(36).slice(2, 9)}`;

const Inspector = (props: InspectorProps) => {
  const { field, index, updateField, removeField, duplicateField } = props;

  if (!field) {
    return (
      <aside className="b-right">
        <div className="insp-empty">
          <Icon name="clip" size={30} />
          <p>Pick a question on the canvas to fold its settings open.</p>
        </div>
      </aside>
    );
  }

  const meta = BLOCK_META[field.type];


  if (!isFieldBlock(field)) {
    return (
      <aside className="b-right">
        <div className="insp-head">
          <span className={`iconbox t-${meta?.tint ?? "accent"}`}>
            <Icon name={meta?.icon ?? "layers"} size={18} />
          </span>
          <div>
            <h3>Layout settings</h3>
            <div className="insp-sub">{meta?.label.toLowerCase() ?? field.type}</div>
          </div>
        </div>

        <section className="insp-sec">
          <div className="sec-head">Content</div>
          <div className="insp-row">
            <label htmlFor="insp-layout-label">Label</label>
            <input
              id="insp-layout-label"
              className="insp-input"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
            />
          </div>
          <p className="sec-empty">
            This block only shapes the canvas — it is never sent with the form.
          </p>
        </section>

        <div className="insp-foot">
          <button
            type="button"
            className="o-btn o-btn--sm o-btn--ghost is-danger"
            onClick={() => removeField(field.id)}
          >
            <Icon name="trash" size={13} /> Delete block
          </button>
          <button
            type="button"
            className="o-btn o-btn--sm o-btn--ghost"
            onClick={() => duplicateField(field.id)}
          >
            <Icon name="copy" size={13} /> Duplicate
          </button>
        </div>
      </aside>
    );
  }

  // only some members of the field union carry an option list or a default value
  const optionField = hasOptions(field) ? field : null;
  const options: FieldOption[] = optionField?.options ?? [];

  // `in` narrows the union; Object.keys().includes() does not, and these keys
  // only exist on some members — choice fields carry no placeholder at all
  const hasPlaceholder = "placeholder" in field;
  const hasDefaultValue = "defaultValue" in field;
  const hasRating = "rating" in field;
  const placeholder = hasPlaceholder ? field.placeholder : undefined;
  const defaultValue = hasDefaultValue ? field.defaultValue : undefined;
  const rating = hasRating ? field.rating : undefined;

  const setOptions = (next: FieldOption[]) => updateField(field.id, { options: next });

  return (
    <aside className="b-right">
      <div className="insp-head">
        <span className={`iconbox t-${meta?.tint ?? "accent"}`}>
          <Icon name={meta?.icon ?? "text"} size={18} />
        </span>
        <div>
          <h3>Field settings</h3>
          <div className="insp-sub">
            Q{index} · {meta?.label.toLowerCase() ?? field.type}
          </div>
        </div>
      </div>

      {/* ====== CONTENT ====== */}
      <section className="insp-sec">
        <div className="sec-head">Content</div>

        <div className="insp-row">
          <label htmlFor="insp-label">
            Question label <span className="req-star">*</span>
          </label>
          <textarea
            id="insp-label"
            className="insp-textarea"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
          />
        </div>

        <div className="insp-row">
          <label htmlFor="insp-desc">Description</label>
          <textarea
            id="insp-desc"
            className="insp-input"
            value={field.description ?? ""}
            onChange={(e) => updateField(field.id, { description: e.target.value })}
          />
        </div>

        <div className="insp-row">
          <label htmlFor="insp-help">Helper text</label>
          <textarea
            id="insp-help"
            className="insp-input"
            value={field.helpText ?? ""}
            onChange={(e) => updateField(field.id, { helpText: e.target.value })}
          />
        </div>

        {hasPlaceholder && (
          <div className="insp-row">
            <label htmlFor="insp-placeholder">Placeholder</label>
            <input
              id="insp-placeholder"
              className="insp-input"
              value={placeholder ?? ""}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            />
          </div>
        )}

        {hasDefaultValue && (
          <div className="insp-row">
            <label htmlFor="insp-default">Default value</label>
            <input
              id="insp-default"
              className="insp-input"
              type={field.type === "date" ? "date" : "text"}
              value={typeof defaultValue === "string" ? defaultValue : ""}
              onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
            />
          </div>
        )}

      </section>

      {/* ====== OPTIONS ====== */}
      {optionField && (
        <section className="insp-sec">
          <div className="sec-head">
            Options <span className="sec-hint">drag to reorder</span>
          </div>

          <div className="options-list">
            {options.map((opt, i) => (
              <div className="opt-row" key={opt.id}>
                <span className="drag-mini" title="Drag to reorder">
                  <Icon name="drag" size={12} />
                </span>
                <input
                  value={opt.label}
                  placeholder={`Option`}
                  aria-label={`Option ${i + 1}`}
                  onChange={(e) =>
                    setOptions(
                      options.map((o) =>
                        o.id === opt.id
                          ? { ...o, label: e.target.value, value: e.target.value }
                          : o,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="x"
                  title="Remove option"
                  aria-label={`Remove option ${i + 1}`}
                  onClick={() => setOptions(options.filter((o) => o.id !== opt.id))}
                >
                  <Icon name="x" size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="add-opt"
            onClick={() => setOptions([...options, { id: newOptionId(), label: "", value: "" }])}
          >
            + add option
          </button>
        </section>
      )}

      {/* ====== VALIDATION ====== */}
      <section className="insp-sec">
        <div className="sec-head">
          Validation <span className="sec-hint">blank means no limit</span>
        </div>

        <label className="o-toggle insp-toggle">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => updateField(field.id, { required: e.target.checked })}
          />
          <span className="track" /> Required
        </label>

        <hr className="o-rule o-rule--dashed" />

        <ValidationFields field={field} updateField={updateField} />

        <hr className="o-rule o-rule--dashed" />

        {field.required && (
          <div className="valid-row">
            <span className="pip">
              <Icon name="check" size={10} />
            </span>
            Required · &ldquo;Please answer this one.&rdquo;
          </div>
        )}
        <div className="valid-row">
          <span className="pip">
            <Icon name="check" size={10} />
          </span>
          {meta?.label ?? "Value"} · enforced via Zod
        </div>
      </section>

      {/* ====== LOGIC ====== */}
      {/* TODO: will implement conditional logic in the next phase */}

      {/* <section className="insp-sec">
        <div className="sec-head">Conditional logic</div>
        {field.logic ? (
          <div className="logic-chip">↳ {field.logic}</div>
        ) : (
          <p className="sec-empty">No rules yet — this field always shows.</p>
        )}
        <button type="button" className="add-opt">
          + add a rule
        </button>
      </section> */}

      {/* ====== DANGER ====== */}
      <div className="insp-foot">
        <button
          type="button"
          className="o-btn o-btn--sm o-btn--ghost is-danger"
          onClick={() => removeField(field.id)}
        >
          <Icon name="trash" size={13} /> Delete field
        </button>
        <button
          type="button"
          className="o-btn o-btn--sm o-btn--ghost"
          onClick={() => duplicateField(field.id)}
        >
          <Icon name="copy" size={13} /> Duplicate
        </button>
      </div>
    </aside>
  );
};

export default Inspector;
