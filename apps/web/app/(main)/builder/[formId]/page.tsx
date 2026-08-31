"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import "../builder.css";
import { useBuilder } from "~/hooks/use-builder";
import { useFormById } from "~/hooks/use-form";
import { toBuilderForm } from "../../utils";
import CanvasHead from "../components/CanvasHead";
import FieldPalette from "../components/FieldPalette";
import FormCanvas from "../components/FormCanvas";
import Inspector from "../components/Inspector";
import Topbar from "../components/Topbar";
import { Icon } from "../../components/icons";
import type { BuilderForm } from "../types";

const BuilderStudio = ({ seed, formId }: { seed: BuilderForm; formId: string }) => {
  const router = useRouter();

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
    updateSettings,
    openSettings,
    addField,
    updateField,
    duplicateField,
    removeField,
    saveAsDraft,
    saveAndPublish,
    preview,
  } = useBuilder(seed, formId);

  const formSettings = {
    visibility: form.visibility,
    maxSubmissions: form.maxSubmissions,
    expiresAt: form.expiresAt,
  }

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
        <FieldPalette addField={addField} openSettings={openSettings} settingsOpen={settingsOpen} />

        <main className="b-center">
          <CanvasHead
            questions={stats.questions}
          />
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
          settingsOpen={settingsOpen}
          settings={formSettings}
          updateSettings={updateSettings}
          updateField={updateField}
          removeField={removeField}
          duplicateField={duplicateField}
        />
      </div>
    </div>
  );
};

const EditBuilderPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const { formData, getFormIsPending, getFormError } = useFormById(formId);

  if (getFormIsPending) {
    return (
      <div className="builder-studio">
        <div className="insp-empty">
          <Icon name="clip" size={30} />
          <p>Unfolding your form…</p>
        </div>
      </div>
    );
  }

  if (getFormError || !formData) {
    return (
      <div className="builder-studio">
        <div className="insp-empty">
          <Icon name="clip" size={30} />
          <p>{getFormError?.message ?? "We couldn't find that form."}</p>
        </div>
      </div>
    );
  }

  return <BuilderStudio seed={toBuilderForm(formData)} formId={formId} />;
};

export default EditBuilderPage;
