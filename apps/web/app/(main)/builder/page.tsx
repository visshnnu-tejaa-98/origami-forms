"use client";

import React from "react";
import "./builder.css";
import { useBuilder } from "~/hooks/use-builder";
import CanvasHead from "./components/CanvasHead";
import FieldPalette from "./components/FieldPalette";
import FormCanvas from "./components/FormCanvas";
import Inspector from "./components/Inspector";
import Topbar from "./components/Topbar";

const BuilderPage = () => {
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
  } = useBuilder();

  return (
    <div className="builder-studio">
      <Topbar
        title={form.title}
        setTitle={setTitle}
        slug={form.slug}
        status={form.status}
        editedLabel={form.editedLabel}
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
