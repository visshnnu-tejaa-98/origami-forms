"use client";

import React, { useState } from "react";
import "./builder.css";
import "./preview.css";
import { useBuilder } from "~/hooks/use-builder";
import CanvasHead from "./components/CanvasHead";
import FieldPalette from "./components/FieldPalette";
import FormCanvas from "./components/FormCanvas";
import Inspector from "./components/Inspector";
import Topbar from "./components/Topbar";

const BuilderPage = () => {
  const [previewing, setPreviewing] = useState(false);

  const {
    form,
    stats,
    selectedId,
    selectedField,
    selectedIndex,
    selectField,
    setTitle,
    setDescription,
    addField,
    updateField,
    duplicateField,
    removeField,
    saveAsDraft,
    saveAndPublish,
    preview
  } = useBuilder();

  return (
    <div className="builder-studio">
      <Topbar
        title={form?.title}
        setTitle={setTitle}
        saveAsDraft={saveAsDraft}
        saveAndPublish={saveAndPublish}
        preview={preview}
      />

      <div className="b-main">
        <FieldPalette addField={addField} />

        <main className="b-center">
          <CanvasHead questions={stats.questions} />
          <FormCanvas
            form={form}
            setTitle={setTitle}
            setDescription={setDescription}
            selectedId={selectedId}
            selectField={selectField}
            addField={addField}
            removeField={removeField}
            duplicateField={duplicateField}
          />
        </main>

        <Inspector
          field={selectedField}
          index={selectedIndex}
          updateField={updateField}
          removeField={removeField}
          duplicateField={duplicateField}
        />
      </div>

    </div>
  );
};

export default BuilderPage;
