import React from "react";
import { Icon } from "../../components/icons";
import { BLOCK_META, OPTION_TYPES } from "../constants";
import { FieldOption, InspectorProps } from "../types";

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
  const hasOptions = OPTION_TYPES.includes(field.type);

  const setOptions = (options: FieldOption[]) => updateField(field.id, { options });

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
          <label htmlFor="insp-help">Helper text</label>
          <input
            id="insp-help"
            className="insp-input"
            value={field.help}
            onChange={(e) => updateField(field.id, { help: e.target.value })}
          />
        </div>

        <div className="insp-row">
          <label htmlFor="insp-placeholder">Placeholder</label>
          <input
            id="insp-placeholder"
            className="insp-input"
            value={field.placeholder}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
          />
        </div>
      </section>

      {/* ====== OPTIONS ====== */}
      {hasOptions && (
        <section className="insp-sec">
          <div className="sec-head">
            Options <span className="sec-hint">drag to reorder</span>
          </div>

          <div className="options-list">
            {field.options.map((opt, i) => (
              <div className="opt-row" key={opt.id}>
                <span className="drag-mini" title="Drag to reorder">
                  <Icon name="drag" size={12} />
                </span>
                <input
                  value={opt.label}
                  aria-label={`Option ${i + 1}`}
                  onChange={(e) =>
                    setOptions(
                      field.options.map((o) =>
                        o.id === opt.id ? { ...o, label: e.target.value } : o
                      )
                    )
                  }
                />
                <button
                  type="button"
                  className="x"
                  title="Remove option"
                  aria-label={`Remove option ${i + 1}`}
                  onClick={() => setOptions(field.options.filter((o) => o.id !== opt.id))}
                >
                  <Icon name="x" size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="add-opt"
            onClick={() =>
              setOptions([...field.options, { id: newOptionId(), label: "New option" }])
            }
          >
            + add option
          </button>
        </section>
      )}

      {/* ====== VALIDATION ====== */}
      <section className="insp-sec">
        <div className="sec-head">Validation</div>

        <label className="o-toggle insp-toggle">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => updateField(field.id, { required: e.target.checked })}
          />
          <span className="track" /> Required
        </label>

        {hasOptions && (
          <>
            <label className="o-toggle insp-toggle">
              <input type="checkbox" />
              <span className="track" /> Allow &ldquo;other&rdquo; input
            </label>
            <label className="o-toggle insp-toggle">
              <input type="checkbox" />
              <span className="track" /> Randomize order each visit
            </label>
          </>
        )}

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
      <section className="insp-sec">
        <div className="sec-head">Conditional logic</div>
        {field.logic ? (
          <div className="logic-chip">↳ {field.logic}</div>
        ) : (
          <p className="sec-empty">No rules yet — this field always shows.</p>
        )}
        <button type="button" className="add-opt">
          + add a rule
        </button>
      </section>

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
