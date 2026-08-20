"use client";

import React, { useMemo } from "react";
import { PreviewScreenProps } from "../../../types";
import type { FieldBlock } from "../../../types";
import PreviewCanvas from "./PreviewCanvas";
import PreviewSideRail from "./PreviewSideRail";
import FormFlowStage from "~/components/form-flow/FormFlowStage";
import { useFormFlow } from "~/components/form-flow/useFormFlow";
import { buildSteps } from "~/components/form-flow/flow";

const PreviewScreen = ({ form, status, onClose }: PreviewScreenProps) => {
  const steps = useMemo(
    () => buildSteps(form.fields, (block) => block as FieldBlock),
    [form.fields],
  );

  const flow = useFormFlow({ steps, mode: "preview", onClose });

  return (
    <div className="pv-screen pv-screen--page" aria-label="Form preview">
      <PreviewCanvas />

      {/* ===== SIDE RAIL ===== */}
      <PreviewSideRail
        form={form}
        onClose={onClose}
        go={flow.go}
        at={flow.at}
        steps={steps}
        questions={flow.questions}
      />

      {/* ===== STAGE ===== */}
      <FormFlowStage
        mode="preview"
        flow={flow}
        title={form.title}
        description={form.description}
        status={status}
      />
    </div>
  );
};

export default PreviewScreen;
