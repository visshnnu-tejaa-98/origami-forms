"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import "../../builder.css";
import "../../preview.css";
import { useFormById } from "~/hooks/use-form";
import { toBuilderForm } from "../../../utils";
import { Icon } from "../../../components/icons";
import PreviewScreen from "./components/PreviewScreen";

const FormPreviewPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const router = useRouter();
  const { formData, getFormIsPending, getFormError } = useFormById(formId);

  const backToBuilder = () => router.push(`/builder/${formId}`);

  if (getFormIsPending) {
    return (
      <div className="pv-screen pv-screen--page pv-screen--state">
        <div className="insp-empty">
          <Icon name="clip" size={30} />
          <p>Unfolding your form…</p>
        </div>
      </div>
    );
  }

  if (getFormError || !formData) {
    return (
      <div className="pv-screen pv-screen--page pv-screen--state">
        <div className="insp-empty">
          <Icon name="clip" size={30} />
          <p>{getFormError?.message ?? "We couldn't find that form."}</p>
          <button className="o-btn o-btn--sm" onClick={backToBuilder}>
            <Icon name="arrow-left" size={13} /> Back to builder
          </button>
        </div>
      </div>
    );
  }

  return <PreviewScreen form={toBuilderForm(formData)} status={formData.status} onClose={backToBuilder} />;
};

export default FormPreviewPage;
