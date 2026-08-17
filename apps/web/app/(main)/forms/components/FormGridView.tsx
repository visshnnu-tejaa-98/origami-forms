import Link from "next/link";
import React from "react";
import { STATUS_BADGE, TAPE } from "../../utils";
import { Icon } from "../../components/icons";
import { Form } from "../../types";

const FormGridView = ({ forms }: { forms: Form[] }) => {
    return (
        <div className="forms-grid">
            {forms.map((f, idx) => {
                const badge = STATUS_BADGE[f.status];
                const isDraft = f.status === "draft";
                return (
                    <article key={f.id} className={`form-card ${f.tint}${isDraft ? " is-draft" : ""}`}>
                        {/* washi tape holding the sheet + a folded dog-ear corner */}
                        <span className={`o-tape card-tape ${TAPE[Number(idx) % TAPE.length]}`} aria-hidden />
                        <span className="fold" aria-hidden />

                        {/* identity */}
                        <div className="card-top">
                            <span className="ic tint-ic">
                                <Icon name={f.icon} size={22} />
                            </span>
                            <div className="ct-txt">
                                <div className="title-row">
                                    <span className="title" title={f.title}>
                                        {f.title}
                                    </span>
                                </div>
                                <div className="meta">
                                    <span className={`o-badge ${badge.cls}`}>{badge.label}</span>
                                    <span className="dot-sep">·</span>
                                    <span className="meta-txt">{f.edited}</span>
                                </div>
                            </div>
                        </div>

                        <p className="blurb">{f.description}</p>

                        {/* two handwritten stats */}
                        <div className="card-stats">
                            <div className="st">
                                <div className="n">{f.responses ? f.responses.toLocaleString() : "—"}</div>
                                <div className="l">responses</div>
                            </div>
                            <div className="st">
                                <div className="n">{f.completion}%</div>
                                <div className="l">{isDraft ? "built" : "complete"}</div>
                            </div>
                        </div>

                        {/* stitched progress line */}
                        <div className="o-progress">
                            <div className="bar" style={{ "--p": `${f.completion}%` } as React.CSSProperties} />
                        </div>

                        {/* actions */}
                        <div className="card-foot">
                            <Link className="o-btn o-btn--sm" href={`/builder/${f.id}`}>
                                <Icon name="edit" size={13} /> {isDraft ? "Continue folding" : "Edit"}
                            </Link>
                            <span className="foot-spacer" />
                            <button className="icon-act" title="Preview" aria-label="Preview">
                                <Icon name="eye" size={15} />
                            </button>
                            <button className="icon-act" title="Share link" aria-label="Share">
                                <Icon name="share" size={15} />
                            </button>
                            <button className="icon-act" title="More" aria-label="More">
                                <Icon name="more" size={15} />
                            </button>
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

export default FormGridView;
