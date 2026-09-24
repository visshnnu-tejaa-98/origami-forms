import React, { useState } from "react";
import { LAYOUT_TYPES, PAGE_BREAK, isFieldBlock } from "../constants";
import { BlockDragProps, DropEdge, FormCanvasProps } from "../types";
import QuestionBlock from "./QuestionBlock";
import FormIconPicker from "./FormIconPicker";

const FormCanvas = (props: FormCanvasProps) => {
  const {
    form,
    formId,
    selectedId,
    setTitle,
    setDescription,
    setIcon,
    selectField,
    addField,
    removeField,
    duplicateField,
    moveField,
  } = props;

  // questions carry their own numbering; page breaks and headings sit outside it
  let questionNumber = 0;

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropAt, setDropAt] = useState<{ id: string; edge: DropEdge } | null>(null);

  const endDrag = () => {
    setDraggedId(null);
    setDropAt(null);
  };

  /** the drag wiring for one block, keyed by its id — the canvas holds the state so a
   *  block only has to say which one it is */
  const dragPropsFor = (id: string, className: string): BlockDragProps => {
    const isDragging = draggedId === id;
    const marker = dropAt?.id === id && !isDragging ? ` drop-${dropAt.edge}` : "";

    return {
      draggable: true,
      className: `${className}${isDragging ? " is-dragging" : ""}${marker}`,
      onDragStart: (e) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id);
      },
      onDragOver: (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (!draggedId || draggedId === id) return;

        const box = e.currentTarget.getBoundingClientRect();
        const edge: DropEdge = e.clientY < box.top + box.height / 2 ? "before" : "after";

        setDropAt((current) =>
          current?.id === id && current.edge === edge ? current : { id, edge }
        );
      },
      onDrop: (e) => {
        e.preventDefault();
        if (draggedId && draggedId !== id) {
          moveField(draggedId, id, dropAt?.id === id ? dropAt.edge : "before");
        }
        endDrag();
      },
      onDragEnd: endDrag,
    };
  };

  return (
    <div className="form-canvas">
      <div className="canvas-cover">
        <span className="o-eyebrow">Form cover</span>

        <div className="cover-row">
          <FormIconPicker logoUrl={form.logoUrl} setIcon={setIcon} formId={formId} />
          <div className="cover-text">
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
        </div>
      </div>

      {form.fields.map((field) => {
        if (field.type === PAGE_BREAK) {
          return (
            <div
              key={field.id}
              onClick={() => selectField(field.id)}
              {...dragPropsFor(field.id, "page-break cursor-pointer")}
            >
              <span>↓ page break · &ldquo;{field.label}&rdquo;</span>
            </div>
          );
        }

        if (field.type === "heading") {
          return (
            <h3
              key={field.id}
              onClick={() => selectField(field.id)}
              {...dragPropsFor(field.id, "canvas-heading cursor-pointer")}
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
            drag={dragPropsFor(field.id, `q-block${selectedId === field.id ? " selected" : ""}`)}
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
