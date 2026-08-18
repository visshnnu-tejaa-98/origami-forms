"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HEADING, PAGE_BREAK, isFieldBlock } from "../../../constants";
import { PreviewScreenProps, Step } from "../../../types";
import PreviewCanvas from "./PreviewCanvas";
import PreviewSideRail from "./PreviewSideRail";
import PreviewSlides from "./PreviewSlides";

const PreviewScreen = ({ form, status, onClose }: PreviewScreenProps) => {

  const [at, setAt] = useState(0);
  // which way the last move went, so the sheet animates with the travel
  const [back, setBack] = useState(false);

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
    [total],
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
      if (!typing && e.key === "ArrowLeft" && at > 0) go(at - 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [at, go, onClose]);


  const questions = steps.filter((s) => s.kind === "field");

  return (
    <div className={`pv-screen pv-screen--page`} {...{ "aria-label": "Form preview" }}>
      <PreviewCanvas />

      {/* ===== SIDE RAIL ===== */}
      <PreviewSideRail
        form={form}
        onClose={onClose}
        go={go}
        at={at}
        steps={steps}
        questions={questions}
      />

      {/* ===== STAGE ===== */}
      <PreviewSlides
        at={at}
        total={total}
        back={back}
        step={step}
        form={form}
        questions={questions}
        go={go}
        status={status}
      />
    </div>
  );
};

export default PreviewScreen;
