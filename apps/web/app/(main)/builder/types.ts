import { CreateFormInputModel } from "@repo/services/form/model";
import { IconName } from "../components/icons";

/** the field types the API accepts — the palette can only ever offer these */
export type FieldType = CreateFormInputModel["fields"][number]["type"];

/** studio-only blocks that structure the canvas but are never persisted */
export type LayoutType = "page-break" | "heading";

export type BlockType = FieldType | LayoutType;

/** the washi tint a field type wears in the palette and on its type pill */
export type Tint = "accent" | "pink" | "matcha" | "peach" | "lavender" | "indigo" | "highlighter";

export type FieldTypeMeta = {
  key: BlockType;
  label: string;
  icon: IconName;
  tint: Tint;
};

/** the persisted field shape, plus the client-only id the studio selects on */
export type FieldBlock = CreateFormInputModel["fields"][number] & { id: string };

/** page breaks and headings live only in the studio — the API never sees them */
export type LayoutBlock = {
  id: string;
  type: LayoutType;
  label: string;
  order: number;
};

/** every option-bearing member of the field union */
export type OptionFieldBlock = Extract<FieldBlock, { options: unknown }>;

export type FieldOption = OptionFieldBlock["options"][number];

/** Omit collapses a union to its shared keys unless it is distributed member-wise */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** a patch is applied to whichever union member the field happens to be */
export type FieldPatch = Partial<DistributiveOmit<FieldBlock, "id" | "type">>;

export type TextLikeFieldsValidation = {
  minLength?: number;
  maxLength?: number;
  regex?: RegExp
}

export type NumberLikeValidation = {
  min?: number;
  max?: number;
  step?: number;
}

export type DateValidation = {
  min: Date
  max: Date
}


/** one block on the canvas — a question, a page break or a heading */
export type BuilderField = FieldBlock | LayoutBlock;

/** the create-form payload, but holding studio blocks while it's being edited */
export type BuilderForm = Omit<CreateFormInputModel, "fields"> & { fields: BuilderField[] };

export type TopbarProps = {
  title: string;
  setTitle: (title: string) => void;
  saveAsDraft: () => void;
  saveAndPublish: () => void;
};

export type FieldPaletteProps = {
  addField: (type: BlockType) => void;
};

export type FormCanvasProps = {
  form: BuilderForm;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  selectedId: string | null;
  selectField: (id: string) => void;
  addField: (type: BlockType) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
};

export type QuestionBlockProps = {
  field: FieldBlock;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

export type InspectorProps = {
  index: number;
  field?: BuilderField;
  updateField: (id: string, patch: FieldPatch) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
};
