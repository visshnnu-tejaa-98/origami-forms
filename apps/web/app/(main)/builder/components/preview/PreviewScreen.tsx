"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "../../../components/icons";
import { BLOCK_META, HEADING, PAGE_BREAK, isFieldBlock } from "../../constants";
import { BuilderForm, FieldBlock } from "../../types";
import { Clip, Crane, ScribbleArrow } from "~/components/origami/deco";
import HelpTip from "../HelpTip";
import PreviewCanvas from "./PreviewCanvas";
import PreviewInput, { AnswerValue } from "./PreviewInput";

type PreviewScreenProps = {
  form: BuilderForm;
  onClose: () => void;
};

/** a welcome cover, one step per question or heading, then the review */
type Step =
  | { kind: "cover" }
  | { kind: "heading"; id: string; label: string }
  | { kind: "page-break"; id: string; label: string; page: number }
  | { kind: "field"; id: string; field: FieldBlock }
  | { kind: "review" };

/** every sheet is taped down with a different colour from the washi drawer */
const TAPE_TONES = ["sakura", "matcha", "peach", "lavender", "indigo", "highlighter"];

const PreviewScreen = ({ form, onClose }: PreviewScreenProps) => {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [at, setAt] = useState(0);
  // which way the last move went, so the sheet animates with the travel
  const [back, setBack] = useState(false);

  // layout blocks get their own screens: a heading is a statement, a page break
  // is the turn of the page — one question per screen otherwise
  const steps = useMemo<Step[]>(() => {
    let page = 1;
    const middle: Step[] = form.fields.flatMap((block): Step[] => {
      if (block.type === HEADING) {
        return [{ kind: "heading", id: block.id, label: block.label }];
      }
      if (block.type === PAGE_BREAK) {
        page += 1;
        return [{ kind: "page-break", id: block.id, label: block.label, page }];
      }
      return isFieldBlock(block) ? [{ kind: "field", id: block.id, field: block }] : [];
    });
    return [{ kind: "cover" }, ...middle, { kind: "review" }];
  }, [form.fields]);

  const total = steps.length - 1;
  const step = steps[Math.min(at, total)]!;

  const go = useCallback(
    (to: number) =>
      setAt((current) => {
        const next = Math.max(0, Math.min(total, to));
        setBack(next < current);
        return next;
      }),
    [total]
  );

  // enter and the arrow keys walk the flow, exactly as the published form does
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.matches("input, textarea");

      if (e.key === "Escape") return onClose();
      if (typing && e.key !== "Enter") return;
      if (e.key === "Enter" && !(target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        go(at + 1);
      }
      if (!typing && e.key === "ArrowRight") go(at + 1);
      if (!typing && e.key === "ArrowLeft") go(at - 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [at, go, onClose]);

  const isAnswered = useCallback(
    (id: string) => {
      const value = answers[id];
      return Array.isArray(value) ? value.length > 0 : (value ?? "") !== "";
    },
    [answers]
  );

  /**
   * The pile thins as the form runs out: two sheets waiting behind the third-from-last
   * card, one behind the second-from-last, none behind the final one. Each step shifts
   * the remaining sheets a little, so the top card reads as having just been peeled off.
   */
  const stack = useMemo(() => {
    const under = Math.max(0, Math.min(2, total - at));
    return Array.from({ length: under }, (_, k) => {
      const depth = k + 1;
      // deterministic wobble — the pile is never squared up, but it is never random either
      const wobble = ((at * 13 + depth * 29) % 9) - 4;
      return {
        depth,
        rot: (depth % 2 === 0 ? 1.7 : -1.5) * depth + wobble * 0.2,
        x: wobble * 1.8 + depth * 2,
        y: depth * 7 + Math.abs(wobble) * 0.7,
      };
    });
  }, [at, total]);

  const questions = steps.filter((s) => s.kind === "field");
  const answered = questions.filter((s) => s.kind === "field" && isAnswered(s.id)).length;

  const stepLabel =
    step.kind === "field"
      ? (BLOCK_META[step.field.type]?.label ?? "Question")
      : step.kind === "cover"
        ? "Welcome"
        : step.kind === "heading"
          ? "Section"
          : step.kind === "page-break"
            ? `Page ${step.page}`
            : "Review";

  return (
    <div className="pv-screen" role="dialog" aria-modal="true" aria-label="Form preview">
      <PreviewCanvas />

      {/* ===== RAIL ===== */}
      <aside className="pv-rail">
        <div className="pv-rail-head">
          <span className="o-badge o-badge--matcha">▶ live preview</span>
          <button type="button" className="o-btn o-btn--sm o-btn--ghost" onClick={onClose}>
            <Icon name="arrow-left" size={13} /> builder
          </button>
        </div>

        <div className="pv-rail-title">The folds</div>
        {steps.map((s, i) => {
          if (s.kind === "cover" || s.kind === "review") return null;
          const meta =
            s.kind === "field"
              ? BLOCK_META[s.field.type]
              : BLOCK_META[s.kind === "page-break" ? PAGE_BREAK : HEADING];
          const label = s.kind === "field" ? s.field.label : s.label;
          return (
            <button
              key={s.id}
              type="button"
              className={`pv-item t-${meta?.tint ?? "accent"}${i === at ? " active" : ""}`}
              onClick={() => go(i)}
            >
              <span className="ic">
                <Icon name={meta?.icon ?? "text"} size={14} />
              </span>
              <span className="nm">{label || "Untitled question"}</span>
              {s.kind === "field" && isAnswered(s.id) ? (
                <span className="tick" title="folded">
                  <Icon name="check" size={12} />
                </span>
              ) : (
                <span className="num">{String(i).padStart(2, "0")}</span>
              )}
            </button>
          );
        })}

        {questions.length === 0 && (
          <p className="pv-rail-empty">No folds yet — add a field and it appears here.</p>
        )}

        <div className="pv-rail-foot">
          <div className="row">
            <span className="o-kbd">←</span>
            <span className="o-kbd">→</span> navigate
          </div>
          <div className="row">
            <span className="o-kbd">↵</span> next
          </div>
          <div className="row">
            <span className="o-kbd">esc</span> close
          </div>
        </div>
      </aside>

      {/* ===== STAGE ===== */}
      <section className="pv-stage">
        <header className="pv-top">
          <span className="pv-eyebrow">wet-fold preview · unpublished</span>
          <div className="pv-meta">
            <span className="pv-step-label">{stepLabel}</span>
            <div className="pv-progress">
              <span style={{ width: `${Math.max(4, (at / Math.max(1, total)) * 100)}%` }} />
            </div>
          </div>
        </header>

        <div className="pv-pages">
          {/* deepest sheet first, so the nearest one paints on top */}
          {[...stack].reverse().map((sheet) => (
            <span
              key={sheet.depth}
              className={`pv-stack pv-stack--${sheet.depth}`}
              aria-hidden
              style={
                {
                  "--sheet-r": `${sheet.rot}deg`,
                  "--sheet-x": `${sheet.x}px`,
                  "--sheet-y": `${sheet.y}px`,
                } as React.CSSProperties
              }
            />
          ))}

          <div className={`pv-card${back ? " is-back" : ""}`} key={at}>
            <span className="pv-grain-card" aria-hidden />
            <span className="pv-margin-rule" aria-hidden />
            <span className="pv-watermark" aria-hidden>
              <Crane size={190} />
            </span>
            <span className={`pv-tape pv-tape--${TAPE_TONES[at % TAPE_TONES.length]}`} aria-hidden />
            <span className="pv-clip" aria-hidden>
              <Clip size={34} />
            </span>
            <span className="pv-fold" aria-hidden />

            {step.kind === "cover" && (
              <div className="pv-centered">
                <span className="pv-mascot">
                  <Icon name="crane" size={72} />
                </span>
                <h1 className="pv-title">{form.title || "Untitled form"}</h1>
                {form.description && <p className="pv-help">{form.description}</p>}
                <div className="pv-actions pv-actions--center">
                  <button className="o-btn o-btn--accent o-btn--lg" onClick={() => go(at + 1)}>
                    Make the first fold <Icon name="arrow" size={16} />
                  </button>
                  <span className="ok-hint">
                    press <span className="o-kbd">↵</span>
                  </span>
                </div>
                <p className="pv-margin-note">↓ a few folds, about a minute</p>
                <div className="pv-facts">
                  <span>
                    <Icon name="layers" size={14} /> {questions.length} folds
                  </span>
                  <span>
                    <Icon name="lock" size={14} /> {form.visibility}
                  </span>
                </div>
              </div>
            )}

            {step.kind === "heading" && (
              <div className="pv-centered">
                <p className="pv-quote">{step.label}</p>
                <div className="pv-actions pv-actions--center">
                  <button className="o-btn o-btn--accent o-btn--lg" onClick={() => go(at + 1)}>
                    Continue <Icon name="arrow" size={16} />
                  </button>
                  <span className="ok-hint">nothing to fold here — read and carry on</span>
                </div>
              </div>
            )}

            {step.kind === "page-break" && (
              <div className="pv-centered">
                <div className="pv-page-turn">
                  <span className="rule" />
                  <span className="n">page {step.page}</span>
                  <span className="rule" />
                </div>
                <p className="pv-quote">{step.label || "halfway there"}</p>
                <div className="pv-actions pv-actions--center">
                  <button className="o-btn o-btn--accent o-btn--lg" onClick={() => go(at + 1)}>
                    Turn the leaf <Icon name="arrow" size={16} />
                  </button>
                </div>
              </div>
            )}

            {step.kind === "field" && (
              <>
                <div className="pv-num-row">
                  {String(at).padStart(2, "0")}
                  <span className="arrow">→</span>
                  <span className={`pv-type-pill t-${BLOCK_META[step.field.type]?.tint ?? "accent"}`}>
                    {BLOCK_META[step.field.type]?.label.toLowerCase() ?? step.field.type}
                  </span>
                  {step.field.required && <span className="pv-req">required</span>}
                </div>

                <h2 className="pv-title">
                  {step.field.label || "Untitled question"}
                  {step.field.helpText && (
                    <span className="pv-title-tip">
                      <HelpTip text={step.field.helpText} />
                    </span>
                  )}
                </h2>
                {step.field.description && <p className="pv-help">{step.field.description}</p>}

                <div className="pv-answer">
                  <span className="pv-scribble" aria-hidden>
                    <ScribbleArrow size={78} />
                  </span>
                  <PreviewInput
                    field={step.field}
                    value={answers[step.id]}
                    onChange={(value) => setAnswers((a) => ({ ...a, [step.id]: value }))}
                  />
                </div>

                <div className="pv-actions">
                  <button className="o-btn o-btn--accent o-btn--lg" onClick={() => go(at + 1)}>
                    Crease it <Icon name="check" size={16} />
                  </button>
                  <span className="ok-hint">
                    press <span className="o-kbd">↵</span>
                  </span>
                </div>
              </>
            )}

            {step.kind === "review" && (
              <div className="pv-centered">
                <span className="pv-mascot">
                  <Icon name="crane" size={64} />
                </span>
                <h2 className="pv-title">Ready to send the crane?</h2>
                <p className="pv-help">
                  {answered} of {questions.length} folds creased
                </p>

                <div className="pv-review">
                  {questions.map((s) => {
                    if (s.kind !== "field") return null;
                    const value = answers[s.id];
                    const shown = Array.isArray(value) ? value.join(", ") : value;
                    return (
                      <div className="row" key={s.id}>
                        <span className="q">{s.field.label || "Untitled"}</span>
                        <span className="a">{shown || "—"}</span>
                      </div>
                    );
                  })}
                  {questions.length === 0 && <p className="pv-rail-empty">Nothing creased yet.</p>}
                </div>

                <div className="pv-actions pv-actions--center">
                  <button className="o-btn o-btn--accent o-btn--lg" disabled>
                    <Icon name="sparkles" size={16} /> Send it flying
                  </button>
                  <span className="ok-hint">this crane stays on the desk — preview only</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="pv-bot">
          <div className="kbd-row">
            <span className="o-kbd">↵</span> next
            <span className="sep">·</span>
            <span className="o-kbd">←</span>
            <span className="o-kbd">→</span> nav
            <span className="sep">·</span>
            fold {at} of {total}
          </div>
          <div className="pv-arrows">
            <button type="button" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous">
              <Icon name="arrow-left" size={16} />
            </button>
            <button type="button" onClick={() => go(at + 1)} disabled={at === total} aria-label="Next">
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default PreviewScreen;
