"use client";
import { useCallback, useMemo, useState } from "react";
import {
  BLOCK_META,
  DEFAULT_OPTIONS,
  HEADING,
  LAYOUT_TYPES,
  OPTION_TYPES,
  PAGE_BREAK,
  isFieldBlock,
  PREVIEW_PLACEHOLDER,
  SEED_FORM,
  hasOptions,
} from "~/app/(main)/builder/constants";
import type {
  BlockType,
  BuilderField,
  BuilderForm,
  FieldBlock,
  FieldPatch,
  LayoutType,
} from "~/app/(main)/builder/types";
import { blankField, uid } from "~/app/(main)/utils";


let nextFieldOrder = 1
const getOrder = () => {
  return nextFieldOrder++
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

  const updateField = useCallback((id: string, patch: FieldPatch) => {
    setForm((f) => ({
      ...f,
      fields: f.fields.map((field) =>
        field.id === id ? ({ ...field, ...patch } as BuilderField) : field
      ),
    }));
  }, []);

  const duplicateField = useCallback((id: string) => {
    setForm((f) => {
      const at = f.fields.findIndex((field) => field.id === id);
      if (at === -1) return f;

      const source = f.fields[at]!;
      const copy: BuilderField = hasOptions(source)
        ? {
          ...source,
          id: uid("q"),
          options: source.options.map((o) => ({ ...o, id: uid("o") })),
        }
        : { ...source, id: uid("q") };

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

  const selectedField = useMemo(() => {
    const found = form.fields.find((f) => f.id === selectedId);
    return found
  }, [form.fields, selectedId]);

  /** questions are numbered ignoring layout blocks — page breaks aren't Q4 */
  const selectedIndex = useMemo(() => {
    if (!selectedField) return 0;
    return form.fields.filter((f) => !LAYOUT_TYPES.includes(f.type)).indexOf(selectedField) + 1;
  }, [form.fields, selectedField]);

  const stats = useMemo(() => {
    const questions = form.fields.filter((f) => !LAYOUT_TYPES.includes(f.type));
    return {
      questions: questions.length,
      pages: form.fields.filter((f) => f.type === PAGE_BREAK).length + 1,
      validations: questions.filter((f) => isFieldBlock(f) && f.required).length,
    };
  }, [form.fields]);

  const saveAsDraft = () => {
    console.log({ form })
  };

  const saveAndPublish = () => {
    console.log({ form })
  };

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
    saveAsDraft,
    saveAndPublish,
  };
}
