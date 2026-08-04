import React from "react";
import Link from "next/link";
import { Icon } from "../../components/icons";
import { TopbarProps } from "../types";

const Topbar = (props: TopbarProps) => {
  const { title, setTitle, slug, status, editedLabel } = props;

  return (
    <header className="b-top">
      <Link href="/dashboard" className="back">
        <Icon name="arrow-left" size={16} />
        <span>Dashboard</span>
      </Link>

      <div className="title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Form title"
          placeholder="Untitled form"
        />
        <div className="sub">
          <span className="o-dot o-dot--success" /> {status}
          <span>· {slug}</span>
          <span>· {editedLabel}</span>
        </div>
      </div>

      <div className="right">
        <div className="save-state">
          <span className="dot" /> auto-saved
        </div>
        <button className="o-btn o-btn--sm">
          <Icon name="eye" size={14} /> Preview
        </button>
        <button className="o-btn o-btn--sm">
          <Icon name="share" size={14} /> Share
        </button>
        <button className="o-btn o-btn--accent o-btn--sm">
          <Icon name="sparkles" size={14} /> Publish changes
        </button>
      </div>
    </header>
  );
};

export default Topbar;
