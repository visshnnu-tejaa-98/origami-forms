"use client";
import { useCallback, useMemo, useState } from "react";
import {
  BLOCK_META,
  DEFAULT_OPTIONS,
  LAYOUT_TYPES,
  OPTION_TYPES,
  PREVIEW_PLACEHOLDER,
  SEED_FORM,
} from "~/app/(main)/builder/constants";
import type { BlockType, BuilderField, BuilderForm } from "~/app/(main)/builder/types";

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

/** a fresh block, pre-filled with sensible copy for its type */
function blankField(type: BlockType): BuilderField {
  const meta = BLOCK_META[type];
  const isLayout = LAYOUT_TYPES.includes(type);

  return {
    id: uid("q"),
    type,
    label: isLayout ? (type === "heading" ? "A new section" : "page break") : `Untitled ${meta?.label.toLowerCase() ?? "question"}`,
    help: "",
    placeholder: PREVIEW_PLACEHOLDER[type] ?? "",
    required: false,
    options: OPTION_TYPES.includes(type)
      ? DEFAULT_OPTIONS.map((label) => ({ id: uid("o"), label }))
      : [],
    ...(type === "rating" ? { rating: 0 } : {}),
  };
}

/**
 * Studio state for the form builder — the sheet, the selection and every
 * edit made to it. Local for now; wiring to the forms API comes later.
 */
export function useBuilder(seed: BuilderForm = SEED_FORM) {
  const [form, setForm] = useState<BuilderForm>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(
    seed.fields.find((f) => !LAYOUT_TYPES.includes(f.type))?.id ?? null
  );

  const setTitle = useCallback((title: string) => setForm((f) => ({ ...f, title })), []);
  const setDescription = useCallback(
    (description: string) => setForm((f) => ({ ...f, description })),
    []
  );

  const addField = useCallback((type: BlockType) => {
    const field = blankField(type);
    setForm((f) => ({ ...f, fields: [...f.fields, field] }));
    setSelectedId(field.id);
  }, []);

  const updateField = useCallback((id: string, patch: Partial<BuilderField>) => {
    setForm((f) => ({
      ...f,
      fields: f.fields.map((field) => (field.id === id ? { ...field, ...patch } : field)),
    }));
  }, []);

  const duplicateField = useCallback((id: string) => {
    setForm((f) => {
      const at = f.fields.findIndex((field) => field.id === id);
      if (at === -1) return f;

      const copy: BuilderField = {
        ...f.fields[at]!,
        id: uid("q"),
        options: f.fields[at]!.options.map((o) => ({ ...o, id: uid("o") })),
      };
      const fields = [...f.fields];
      fields.splice(at + 1, 0, copy);
      setSelectedId(copy.id);
      return { ...f, fields };
    });
  }, []);

  const removeField = useCallback((id: string) => {
    setForm((f) => {
      const fields = f.fields.filter((field) => field.id !== id);
      setSelectedId((current) =>
        current === id ? (fields.find((x) => !LAYOUT_TYPES.includes(x.type))?.id ?? null) : current
      );
      return { ...f, fields };
    });
  }, []);

  const selectedField = useMemo(
    () => form.fields.find((f) => f.id === selectedId) ?? null,
    [form.fields, selectedId]
  );

  /** questions are numbered ignoring layout blocks — page breaks aren't Q4 */
  const selectedIndex = useMemo(() => {
    if (!selectedField) return 0;
    return form.fields.filter((f) => !LAYOUT_TYPES.includes(f.type)).indexOf(selectedField) + 1;
  }, [form.fields, selectedField]);

  const stats = useMemo(() => {
    const questions = form.fields.filter((f) => !LAYOUT_TYPES.includes(f.type));
    return {
      questions: questions.length,
      pages: form.fields.filter((f) => f.type === "page-break").length + 1,
      rules: form.fields.filter((f) => f.logic).length,
      validations: questions.filter((f) => f.required).length,
    };
  }, [form.fields]);

  return {
    form,
    stats,
    selectedId,
    selectedField,
    selectedIndex,
    selectField: setSelectedId,
    setTitle,
    setDescription,
    addField,
    updateField,
    duplicateField,
    removeField,
  };
}
