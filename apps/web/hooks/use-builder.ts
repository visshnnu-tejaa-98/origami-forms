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
import { useCreateForm, useUpdateForm } from "./use-form";
import { useRouter } from "next/navigation";

/** a saved field carries its database id; a block added in this session carries a local
 *  `q-xxxx` one. only the former identifies a row the server should update */
const SAVED_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PUBLISHED = "published" as const;

export function useBuilder(seed: BuilderForm = SEED_FORM, formId?: string) {
  const [form, setForm] = useState<BuilderForm>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(
    seed.fields.find((f) => !LAYOUT_TYPES.includes(f.type))?.id ?? null
  );

  const { createFormAsync } = useCreateForm()
  const { updateFormAsync } = useUpdateForm()
  const router = useRouter()

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

  const toCreatePayload = useCallback(
    (): CreateFormInputModel => ({
      ...form,
      fields: form.fields.map(({ id: _id, ...field }) => field),
    }),
    [form]
  );

  /** an editing save sends the whole field list — anything missing from it is removed —
   *  keeping database ids so the server updates those rows instead of inserting copies */
  const toUpdatePayload = useCallback(
    () => ({
      title: form.title,
      description: form.description,
      visibility: form.visibility,
      fields: form.fields.map(({ id, ...field }) =>
        SAVED_ID.test(id) ? { ...field, id } : field
      ),
    }),
    [form]
  );

  const save = useCallback(
    async (status?: typeof PUBLISHED) => {
      // the schema demands a title and at least one field — say so before the round trip
      if (form.title.trim() === "") {
        toast.error("Give the form a title before saving.");
        return;
      }
      if (form.fields.length === 0) {
        toast.error("Add at least one question before saving.");
        return;
      }

      try {
        if (formId) {
          const result = await updateFormAsync({ formId, ...toUpdatePayload(), status });
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(status === PUBLISHED ? "Form published." : "Changes saved.");
          return result.formData;
        }

        // forms are created as drafts — the database defaults `status` to draft
        const saved = await createFormAsync(toCreatePayload());

        // create carries no status, so publishing is a second call against the new form
        if (status === PUBLISHED) await updateFormAsync({ formId: saved.id, status });

        toast.success(status === PUBLISHED ? "Form published." : "Draft saved.");
        router.replace("/forms");
        return saved;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not save the form.");
      }
    },
    [form, formId, router, createFormAsync, toCreatePayload, toUpdatePayload, updateFormAsync]
  );

  const saveAsDraft = useCallback(() => save(), [save]);

  const saveAndPublish = useCallback(() => save(PUBLISHED), [save]);

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
