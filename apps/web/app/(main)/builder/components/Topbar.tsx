import React from "react";
import { Icon } from "../../components/icons";
import { TopbarProps } from "../types";
import { useRouter, useSearchParams } from "next/navigation";

const Topbar = (props: TopbarProps) => {
  const { title, status, setTitle, saveAsDraft, archiveForm, saveAndPublish, preview } = props;

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get("from")
  const isFromList = redirectedFrom === "list";

  const backNavigationLabel = isFromList ? "Back to List" : "Dashboard";

  const showPublishButton = status !== "published";
  const showPreview = status !== "published"
  console.log({ status })

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
          aria-label="Form title"
          placeholder="Untitled form"
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
        {showPublishButton && <button className="o-btn o-btn--sm" onClick={preview}>
          <Icon name="eye" size={14} /> Preview
        </button>}
        {/* <button className="o-btn o-btn--sm">
          <Icon name="share" size={14} /> Share
        </button> */}
        {showPublishButton && <button className="o-btn o-btn--sm" onClick={saveAsDraft}>
          <Icon name="save" size={14} /> Save as draft
        </button>}
        {showPublishButton && <button className="o-btn o-btn--accent o-btn--sm" onClick={saveAndPublish}>
          <Icon name="publish" size={14} /> Save and publish
        </button>}
        {!showPublishButton && <button className="o-btn o-btn--accent o-btn--sm" onClick={archiveForm}>
          <Icon name="archive" size={14} /> Archive Form
        </button>}
      </div>
    </header >
  );
};

export default Topbar;
