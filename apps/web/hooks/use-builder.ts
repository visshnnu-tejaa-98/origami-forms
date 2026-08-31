"use client";
import { useCallback, useMemo, useRef, useState } from "react";
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
  FormSettingsPatch,
  MutationPayloadShape,
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

/** a cheap structural fingerprint — enough to tell "nothing changed since the last save" */
const fingerprint = (form: BuilderForm) => JSON.stringify(form);

export function useBuilder(seed: BuilderForm = SEED_FORM, formId?: string) {
  const [form, setForm] = useState<BuilderForm>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(
    seed.fields.find((f) => !LAYOUT_TYPES.includes(f.type))?.id ?? null
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  const savedPrint = useRef(fingerprint(seed));

  const { createFormAsync } = useCreateForm()
  const { updateFormAsync } = useUpdateForm()
  const router = useRouter()

  const setTitle = useCallback((title: string) => setForm((f) => ({ ...f, title })), []);

  const setDescription = useCallback(
    (description: string) => setForm((f) => ({ ...f, description })),
    []
  );

  const selectField = useCallback((id: string | null) => {
    setSettingsOpen(false);
    setSelectedId(id);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  const updateSettings = useCallback(
    (patch: FormSettingsPatch) => setForm((f) => ({ ...f, ...patch })),
    []
  );

  const addField = useCallback((type: BlockType) => {
    const field = blankField(type);
    setForm((f) => ({ ...f, fields: [...f.fields, field] }));
    setSettingsOpen(false);
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
    (): MutationPayloadShape => ({
      ...form,
      expiresAt: form.expiresAt ? new Date(form.expiresAt) : undefined,
      status: form.status ? form.status : null,
      fields: form.fields.map(({ id: _id, ...field }) => field),
    }),
    [form]
  );

  const toUpdatePayload = useCallback(
    () => ({
      title: form.title,
      description: form.description,
      visibility: form.visibility,
      maxSubmissions: form.maxSubmissions ?? null,
      expiresAt: form.expiresAt ?? null,
      fields: form.fields.map(({ id, ...field }) =>
        SAVED_ID.test(id) ? { ...field, id } : field
      ),
    }),
    [form]
  );

  const save = useCallback(
    async (status?: typeof PUBLISHED, options?: { redirect?: boolean; silent?: boolean }) => {
      const { redirect = true, silent = false } = options ?? {};
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
          savedPrint.current = fingerprint(form);
          if (!silent) toast.success(status === PUBLISHED ? "Form published." : "Changes saved.");
          return result.formData;
        }

        const saved = await createFormAsync(toCreatePayload());

        if (status === PUBLISHED) await updateFormAsync({ formId: saved.id, status });

        savedPrint.current = fingerprint(form);
        if (!silent) toast.success(status === PUBLISHED ? "Form published." : "Draft saved.");
        if (redirect) router.replace("/forms");
        return saved;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not save the form.");
      }
    },
    [form, formId, router, createFormAsync, toCreatePayload, toUpdatePayload, updateFormAsync]
  );

  const saveAsDraft = useCallback(() => save(), [save]);

  const saveAndPublish = useCallback(() => save(PUBLISHED), [save]);

  const preview = useCallback(async () => {
    if (formId && fingerprint(form) === savedPrint.current) {
      router.push(`/builder/${formId}/preview`);
      return;
    }

    const saved = await save(undefined, { redirect: false, silent: true });
    if (!saved) return;

    router.push(`/builder/${formId ?? saved.id}/preview`);
  }, [form, formId, router, save]);

  return {
    form,
    stats,
    selectedId,
    selectedField,
    selectedIndex,
    settingsOpen,
    selectField,
    openSettings,
    setTitle,
    setDescription,
    updateSettings,
    addField,
    updateField,
    duplicateField,
    removeField,
    saveAsDraft,
    saveAndPublish,
    preview,
  };
}
