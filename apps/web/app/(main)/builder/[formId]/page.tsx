"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import "../builder.css";
import "../preview.css";
import { useBuilder } from "~/hooks/use-builder";
import { useFormById } from "~/hooks/use-form";
import { useTemplateById } from "~/hooks/use-template";
import { toBuilderForm, toBuilderTemplate } from "../../utils";
import { BUILDER_TYPE_PARAM, TEMPLATE } from "../../constants";
import PreviewScreen from "./preview/components/PreviewScreen";
import type { Status } from "../../types";
import CanvasHead from "../components/CanvasHead";
import FieldPalette from "../components/FieldPalette";
import FormCanvas from "../components/FormCanvas";
import Inspector from "../components/Inspector";
import Topbar from "../components/Topbar";
import { Icon } from "../../components/icons";
import type { BuilderForm } from "../types";

const BuilderStudio = ({
  seed,
  id,
  asTemplate,
}: {
  seed: BuilderForm;
  id: string;
  asTemplate: boolean;
}) => {

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
    archiveForm,
    preview,
    previewing,
    previewDraft,
    closePreview,
  } = useBuilder(
    seed,
    asTemplate ? undefined : id,
    asTemplate ? { asTemplate, templateId: id } : undefined
  );

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
        archiveForm={archiveForm}
        preview={preview}
        previewDraft={previewDraft}
      />

      <div className="b-main">
        <FieldPalette addField={addField} openSettings={openSettings} settingsOpen={settingsOpen} />

        <main className="b-center">
          <CanvasHead
            questions={stats.questions}
          />
          <FormCanvas
            form={form}
            setTitle={setTitle}
            setDescription={setDescription}
            setIcon={setIcon}
            formId={id}
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

const EditBuilder = () => {
  const { formId } = useParams<{ formId: string }>();
  const searchParams = useSearchParams();
  const asTemplate = searchParams.get(BUILDER_TYPE_PARAM) === TEMPLATE;

  const { formData, getFormIsPending, getFormError } = useFormById(asTemplate ? "" : formId);
  const { templateData, getTemplateIsPending, getTemplateError } = useTemplateById(
    asTemplate ? formId : "",
  );

  const noun = asTemplate ? "template" : "form";
  const pending = asTemplate ? getTemplateIsPending : getFormIsPending;
  const error = asTemplate ? getTemplateError : getFormError;
  const seed = asTemplate
    ? templateData && toBuilderTemplate(templateData)
    : formData && toBuilderForm(formData);

  if (pending) {
    return (
      <div className="builder-studio">
        <div className="insp-empty">
          <Icon name="clip" size={30} />
          <p>Unfolding your {noun}…</p>
        </div>
      </div>
    );
  }

  if (error || !seed) {
    return (
      <div className="builder-studio">
        <div className="insp-empty">
          <Icon name="clip" size={30} />
          <p>{error?.message ?? `We couldn't find that ${noun}.`}</p>
        </div>
      </div>
    );
  }

  return <BuilderStudio seed={seed} id={formId} asTemplate={asTemplate} />;
};

/** useSearchParams needs a boundary above it */
const EditBuilderPage = () => (
  <Suspense fallback={<div className="builder-studio" />}>
    <EditBuilder />
  </Suspense>
);

export default EditBuilderPage;
