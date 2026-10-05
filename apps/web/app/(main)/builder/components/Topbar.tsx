import React from "react";
import { Icon } from "../../components/icons";
import { TopbarProps } from "../types";
import { useRouter, useSearchParams } from "next/navigation";

const Topbar = (props: TopbarProps) => {
  const { title, status, asTemplate, setTitle, saveAsDraft, archiveForm, saveAndPublish, preview, previewDraft } = props;

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get("from")
  const isFromList = redirectedFrom === "list";

  const backNavigationLabel = isFromList ? "Back to List" : "Dashboard";

  const showPublishButton = status !== "published";
  const showPreview = status !== "published" && !asTemplate;
  const showTemplatePreview = status !== "published" && asTemplate;

  return (
    <header className="b-top">
      <button className="back" onClick={() => router.back()}>
        <Icon name="arrow-left" size={16} />
        <span>{backNavigationLabel}</span>
      </button>

      <div className="title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label={asTemplate ? "Template title" : "Form title"}
          placeholder={asTemplate ? "Untitled template" : "Untitled form"}
        />
        {/* TODO: Add this only for edit form */}
        {/* <div className="sub">
          <span className="o-dot o-dot--success" /> {status}
          <span>· {slug}</span>
          <span>· {editedLabel}</span>
        </div> */}
      </div>

      <div className="right">
        {showPublishButton && < div className="save-state">
          <span className="dot"></span> auto-saved
        </div>}
        {showPreview && <button className="o-btn o-btn--sm" onClick={preview}>
          <Icon name="eye" size={14} /> Preview
        </button>}
        {/* <button className="o-btn o-btn--sm">
          <Icon name="share" size={14} /> Share
        </button> */}
        {showTemplatePreview && <button className="o-btn o-btn--sm" onClick={previewDraft}>
          <Icon name="eye" size={14} /> Preview
        </button>}
        {showPublishButton && <button className="o-btn o-btn--sm" onClick={saveAsDraft}>
          <Icon name="save" size={14} /> Save as draft
        </button>}
        {showPublishButton && <button className="o-btn o-btn--accent o-btn--sm" onClick={saveAndPublish}>
          <Icon name="publish" size={14} /> {asTemplate ? "Save and share" : "Save and publish"}
        </button>}
        {!showPublishButton && <button className="o-btn o-btn--sm" onClick={archiveForm}>
          <Icon name="archive" size={14} /> {asTemplate ? "Archive template" : "Archive Form"}
        </button>}
        {!showPublishButton && <button className="o-btn o-btn--accent o-btn--sm" onClick={saveAndPublish}>
          <Icon name="publish" size={14} /> {asTemplate ? "Update and share" : "Update and publish"}
        </button>}
      </div>
    </header >
  );
};

export default Topbar;
