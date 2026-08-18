import React from "react";
import { LAYOUT_TYPES, PAGE_BREAK, isFieldBlock } from "../constants";
import { FormCanvasProps } from "../types";
import QuestionBlock from "./QuestionBlock";

const FormCanvas = (props: FormCanvasProps) => {
  const {
    form,
    setTitle,
    setDescription,
    selectedId,
    selectField,
    addField,
    removeField,
    duplicateField,
  } = props;

  // questions carry their own numbering; page breaks and headings sit outside it
  let questionNumber = 0;

  return (
    <div className="form-canvas">
      <div className="canvas-cover">
        <span className="o-eyebrow">Form cover</span>
        <input
          className="form-title-ipt"
          value={form.title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Form cover title"
          placeholder="Name this form"
        />
        <textarea
          className="form-desc"
          rows={2}
          value={form.description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Form description"
          placeholder="A line or two about what you're collecting…"
        />
      </div>

      {form.fields.map((field) => {
        if (field.type === PAGE_BREAK) {
          return (
            <div
              className="page-break cursor-pointer"
              key={field.id}
              onClick={() => selectField(field.id)}
            >
              <span>↓ page break · &ldquo;{field.label}&rdquo;</span>
            </div>
          );
        }

        if (field.type === "heading") {
          return (
            <h3
              className="canvas-heading cursor-pointer"
              key={field.id}
              onClick={() => selectField(field.id)}
            >
              {field.label}
            </h3>
          );
        }

        if (!isFieldBlock(field)) return null;

        questionNumber += 1;
        return (
          <QuestionBlock
            key={field.id}
            field={field}
            index={questionNumber}
            selected={selectedId === field.id}
            onSelect={() => selectField(field.id)}
            onDuplicate={() => duplicateField(field.id)}
            onRemove={() => removeField(field.id)}
          />
        );
      })}

      <button type="button" className="add-q" onClick={() => addField("short_text")}>
        + add a question
      </button>

      <div className="canvas-foot">
        <div className="kbd-row">
          <span className="o-kbd">N</span> new field
          <span className="sep">·</span>
          <span className="o-kbd">⌘D</span> duplicate
          <span className="sep">·</span>
          <span className="o-kbd">/</span> command palette
        </div>
        <span>
          {form.fields.filter((f) => !LAYOUT_TYPES.includes(f.type)).length} questions ·{" "}
          {form.fields.filter((f) => f.type === PAGE_BREAK).length + 1} pages
        </span>
      </div>
    </div>
  );
};

export default FormCanvas;
