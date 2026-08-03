import React from "react";
import { Icon } from "../../components/icons";
import { STATUS_BADGE } from "../../utils";
import { Form } from "../../types";

const FromListView = ({ forms }: { forms: Form[] }) => {
    return (
        <div className="otable" role="table" aria-label="Your forms">
            <span className="o-tape table-tape tape-matcha" aria-hidden />
            <div className="otable-head" role="row" aria-hidden>
                <span>Form</span>
                <span>Status</span>
                <span className="ta-end">Responses</span>
                <span className="col-comp">Completion</span>
                <span className="col-updated">Updated</span>
                <span className="ta-end">Actions</span>
            </div>
            {forms.map((f: Form) => {
                const badge = STATUS_BADGE[f.status];
                const isDraft = f.status === "draft";
                return (
                    <div
                        key={f.id}
                        className={`otable-row ${f.tint}${f.pinned ? " is-pinned" : ""}`}
                        role="row"
                    >
                        <div className="c-form">
                            <span className="ic tint-ic">
                                <Icon name={f.icon} size={20} />
                            </span>
                            <div className="txt">
                                <span className="title" title={f.title}>
                                    {f.title}
                                </span>
                                <span className="sub">{f.description}</span>
                            </div>
                        </div>

                        <div className="c-status">
                            <span className={`o-badge ${badge.cls}`}>{badge.label}</span>
                        </div>

                        <div className="c-resp">
                            {f.responses ? (
                                <span className="n">{f.responses.toLocaleString()}</span>
                            ) : (
                                <span className="dash">—</span>
                            )}
                        </div>

                        <div className="c-comp">
                            <div className="o-progress">
                                <div className="bar" style={{ "--p": `${f.completion}%` } as React.CSSProperties} />
                            </div>
                            <span className="pct">{f.completion}%</span>
                        </div>

                        <div className="c-updated">{f.edited}</div>

                        <div className="c-actions">
                            <span className="row-tools">
                                <button
                                    className="tool"
                                    title={isDraft ? "Continue editing" : "Edit"}
                                    aria-label="Edit"
                                >
                                    <Icon name="edit" size={15} />
                                </button>
                                <button className="tool" title="Preview" aria-label="Preview">
                                    <Icon name="eye" size={15} />
                                </button>
                                <button className="tool" title="Share link" aria-label="Share">
                                    <Icon name="share" size={15} />
                                </button>
                                <button className="tool" title="More" aria-label="More">
                                    <Icon name="more" size={15} />
                                </button>
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FromListView;
