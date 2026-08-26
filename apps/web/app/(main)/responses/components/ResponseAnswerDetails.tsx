import React from "react";
import { ResponseAnswerDetailsProps } from "../types";
import { Icon } from "../../components/icons";
import { TINTS } from "../../constants";
import { hash } from "../../utils";
import { formatCompletionTime } from "~/app/utils";

const PLAIN_TEXT_FIELD_TYPES = [
    "short_text",
    "email",
    "number",
    "single_select",
    "radio",
    "drop_down",
    "phone",
    "url",
];

const ResponseAnswerDetails = (props: ResponseAnswerDetailsProps) => {
    const { selected, setSelectedId } = props;

    if (!selected) {
        return (
            <aside className="rsp-detail-pane">
                <div className="rsp-detail-empty">
                    <span className="art">
                        <Icon name="plane" size={54} />
                    </span>
                    <h3>Nothing open</h3>
                    <p>Pick a response on the left and every answer unfolds here.</p>
                </div>
            </aside>
        );
    }

    const { answers } = selected;
    const tint = TINTS[hash(selected.id) % TINTS.length]!;
    const initial = selected.name
        ? selected.name[0]?.toUpperCase()
        : (selected.email?.[0]?.toUpperCase() ?? "A");
    const name = selected.name ?? selected.email ?? "Anonymous User";
    const email = selected.email || "";
    const time = selected.submittedAt || "--";
    const duration = selected.completionTimeInSec || undefined;
    const { device = "", city = "", country = "", browser = "" } = selected?.metaData || {};

    const deviceInfo =
        [device, browser].filter(Boolean).join(", ") !== ""
            ? [device, browser].filter(Boolean).join(", ")
            : "--";
    const location =
        [city, country].filter(Boolean).join(", ") !== ""
            ? [city, country].filter(Boolean).join(", ")
            : "--";

    const questionsAnswered = answers.reduce((acc, answer) => {
        if (answer.value !== "") {
            return acc + 1;
        }
        return acc;
    }, 0);

    const statuss = (
        <span className="val">
            <span className={`o-badge o-badge--${selected?.status === "partial" ? "peach" : "matcha"}`}>
                {selected?.status}
            </span>
        </span>
    );

    return (
        <aside className="rsp-detail-pane">
            <>
                <header className="rsp-detail-head">
                    <span className={`rsp-av lg t-${tint}`}>{initial}</span>
                    <div className="who-block">
                        <div className="nm">{name}</div>
                        {email && <div className="em">{email}</div>}
                    </div>
                    <div className="actions">
                        {/* TODO: Only admin can delete the response */}
                        {/* <button title="Discard" aria-label="Discard response" onClick={() => discard([selected.id])}>
                            <Icon name="trash" size={14} />
                        </button> */}
                        <button title="Close" aria-label="Close detail" onClick={() => setSelectedId(null)}>
                            <Icon name="x" size={14} />
                        </button>
                    </div>
                </header>

                <div className="rsp-detail-body">
                    <div className="rsp-meta">
                        <div className="item">
                            <b>{time}</b>Submitted
                        </div>
                        {duration && (
                            <div className="item">
                                <b>{formatCompletionTime(duration)}</b>duration
                            </div>
                        )}
                        <div className="item">
                            <b>{deviceInfo}</b>Device
                        </div>
                        <div className="item">
                            <b>{location}</b>Location
                        </div>
                        <div className="item">
                            <b>{questionsAnswered}</b>Questions answered
                        </div>
                        <div className="item">
                            <b>{statuss}</b>Status
                        </div>
                    </div>

                    {answers.map((answer, idx) => {
                        const questionLabelTint = TINTS[hash(answer.fieldId) % TINTS.length]!;

                        const renderAnswerValue = (fieldType: string, value: string | null) => {
                            if (!value || value.trim() === "") {
                                return <span className="a">skipped</span>;
                            }

                            if (PLAIN_TEXT_FIELD_TYPES.includes(fieldType)) {
                                if (fieldType === "email" || fieldType === "short_text")
                                    return <span className="a plain">{value}</span>;
                                return <span className="a">{value}</span>;
                            }

                            if (fieldType === "long_text") {
                                return <p className="a-long">“{value}”</p>;
                            }

                            if (fieldType === "multi_select" || fieldType === "check_box") {
                                return (
                                    <div className="a-chips">
                                        {value
                                            .split(",")
                                            .filter(Boolean)
                                            .map((chip) => (
                                                <span key={chip}>{chip}</span>
                                            ))}
                                    </div>
                                );
                            }

                            if (fieldType === "rating") {
                                const ratingValue = Number(value) || 0;
                                return (
                                    <span className="a stars">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Icon
                                                key={i}
                                                name="star"
                                                size={18}
                                                className={i < ratingValue ? "on" : "off"}
                                            />
                                        ))}
                                        <span className="stars-label">{value}</span>
                                    </span>
                                );
                            }

                            return null;
                        };

                        if (answer.fieldType === "heading" || answer.fieldType === "page_break") {
                            return;
                        }

                        return (
                            <div className="rsp-ans" key={answer.fieldId}>
                                <div className="q-lbl">
                                    {String(idx + 1).padStart(2, "0")} ·{" "}
                                    <span className={`type-pill t-${questionLabelTint}`}>{answer.fieldType}</span>
                                </div>
                                <div className="q">{answer.fieldLabel}</div>

                                {renderAnswerValue(answer.fieldType, answer.value)}
                            </div>
                        );
                    })}

                    <hr className="o-rule o-rule--dashed" />

                    <div className="o-note o-note--sticky o-note--green rsp-sticky">
                        ⓘ Folded and delivered — every crease accounted for.
                    </div>

                    <div className="rsp-detail-foot">
                        <a className="o-btn o-btn--sm" href={`mailto:${selected.email}`}>
                            <Icon name="mail" size={13} /> Reply
                        </a>
                        <button className="o-btn o-btn--sm">
                            <Icon name={"download"} size={13} /> Export
                        </button>
                    </div>
                </div>
            </>
        </aside>
    );
};

export default ResponseAnswerDetails;
