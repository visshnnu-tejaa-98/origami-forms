"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./builder.css";
import "./preview.css";
import { useBuilder } from "~/hooks/use-builder";
import { BUILDER_TYPE_PARAM, TEMPLATE } from "../constants";
import CanvasHead from "./components/CanvasHead";
import FieldPalette from "./components/FieldPalette";
import FormCanvas from "./components/FormCanvas";
import Inspector from "./components/Inspector";
import Topbar from "./components/Topbar";
import PreviewScreen from "./[formId]/preview/components/PreviewScreen";
import type { Status } from "../types";

const Builder = () => {
  const searchParams = useSearchParams();

  const asTemplate = searchParams.get(BUILDER_TYPE_PARAM) === TEMPLATE;

  const {
    form,
    stats,
    selectedId,
    selectedField,
    selectedIndex,
    settingsOpen,
    selectField,
    setTitle,
    setDescription,
    setIcon,
    updateSettings,
    openSettings,
    addField,
    updateField,
    duplicateField,
    moveField,
    removeField,
    saveAsDraft,
    saveAndPublish,
    preview,
    previewing,
    previewDraft,
    closePreview,
  } = useBuilder(undefined, undefined, { asTemplate });

  const formSettings = {
    visibility: form.visibility,
    maxSubmissions: form.maxSubmissions,
    expiresAt: form.expiresAt,
  }

  return (
    <div className="builder-studio">
      <Topbar
        title={form?.title}
        status={form?.status}
        asTemplate={asTemplate}
        setTitle={setTitle}
        saveAsDraft={saveAsDraft}
        saveAndPublish={saveAndPublish}
        preview={preview}
        previewDraft={previewDraft}
      />

      <div className="b-main">

        <FieldPalette addField={addField} openSettings={openSettings} settingsOpen={settingsOpen} />

        <main className="b-center">
          <CanvasHead questions={stats.questions} />
          <FormCanvas
            form={form}
            setTitle={setTitle}
            setDescription={setDescription}
            setIcon={setIcon}
            selectedId={selectedId}
            selectField={selectField}
            addField={addField}
            removeField={removeField}
            duplicateField={duplicateField}
            moveField={moveField}
          />
        </main>

        <Inspector
          field={selectedField}
          index={selectedIndex}
          settingsOpen={settingsOpen}
          settings={formSettings}
          updateSettings={updateSettings}
          updateField={updateField}
          removeField={removeField}
          duplicateField={duplicateField}
        />
      </div>

      {previewing && (
        <PreviewScreen form={form} status={form.status as Status} onClose={closePreview} />
      )}
    </div>
  );
};

const BuilderPage = () => (
  <Suspense fallback={<div className="builder-studio" />}>
    <Builder />
  </Suspense>
);

export default BuilderPage;
