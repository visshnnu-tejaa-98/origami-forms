"use client";
import { useCallback, useMemo, useState } from "react";
import {
  LAYOUT_TYPES,
  PAGE_BREAK,
  SEED_FORM,
  hasOptions,
  isFieldBlock,
} from "~/app/(main)/builder/constants";
import type {
  BlockType,
  BuilderField,
  BuilderForm,
  FieldPatch,
} from "~/app/(main)/builder/types";
import type { CreateFormInputModel } from "@repo/services/form/model";
import { blankField, uid } from "~/app/(main)/utils";
import { toast } from "~/components/origami/toast";
import { useCreateForm } from "./use-form";


/**
 * Studio state for the form builder — the sheet, the selection and every
 * edit made to it. Local for now; wiring to the forms API comes later.
 */
export function useBuilder(seed: BuilderForm = SEED_FORM) {
  const [form, setForm] = useState<BuilderForm>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(
    seed.fields.find((f) => !LAYOUT_TYPES.includes(f.type))?.id ?? null
  );

  const { createFormAsync } = useCreateForm()

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

  /**
   * The canvas payload the API accepts: page breaks and headings are studio-only,
   * so they are dropped. The client-side `id` on each field is left for Zod to strip.
   */
  const toCreatePayload = useCallback(
    (): CreateFormInputModel => ({ ...form, fields: form.fields.filter(isFieldBlock) }),
    [form]
  );

  const saveAsDraft = useCallback(async () => {
    const payload = toCreatePayload();

    // the schema demands a title and at least one field — say so before the round trip
    if (payload.title.trim() === "") {
      toast.error("Give the form a title before saving.");
      return;
    }
    if (payload.fields.length === 0) {
      toast.error("Add at least one question before saving.");
      return;
    }

    try {
      // forms are created as drafts — the database defaults `status` to draft
      console.log(111, { payload })
      const saved = await createFormAsync(payload);
      console.log({ saved })
      toast.success("Draft saved.");
      return saved;
    } catch (error) {
      console.log({ error })

      toast.error(error instanceof Error ? error.message : "Could not save the draft.");
    }
  }, [createFormAsync, toCreatePayload]);

  // TODO: publishing needs an updateForm route — the create input carries no status,
  // so this saves the draft and the status flip has to follow once that route exists.
  const saveAndPublish = useCallback(async () => {
    await saveAsDraft();
  }, [saveAsDraft]);

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
