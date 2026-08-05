import { CreateFormInputModel } from "@repo/services/form/model";
import { IconName } from "../components/icons";

export type FieldType = CreateFormInputModel["fields"][number]["type"];

export type LayoutType = "page-break" | "heading";

export type BlockType = FieldType | LayoutType;

export type Tint = "accent" | "pink" | "matcha" | "peach" | "lavender" | "indigo" | "highlighter";

export type FieldTypeMeta = {
  key: BlockType;
  label: string;
  icon: IconName;
  tint: Tint;
};

export type FieldBlock = CreateFormInputModel["fields"][number] & { id: string };

export type LayoutBlock = {
  id: string;
  type: LayoutType;
  label: string;
  order: number;
};

export type OptionFieldBlock = Extract<FieldBlock, { options: unknown }>;

export type FieldOption = OptionFieldBlock["options"][number];

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type FieldPatch = Partial<DistributiveOmit<FieldBlock, "id" | "type">>;

export type TextLikeFieldsValidation = {
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
};

export type NumberLikeValidation = {
  min?: number;
  max?: number;
  step?: number;
};

export type DateValidation = {
  min: Date;
  max: Date;
};

export type BuilderField = FieldBlock | LayoutBlock;

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

export type InspectorheaderProps = {
  field: FieldBlock;
  index: number;
}

export type FormFieldConfigurationProps = {
  field: FieldBlock;
  updateField: (id: string, patch: FieldPatch) => void;
};
export type OptionFieldsProps = {
  field: BuilderField;
  updateField: (id: string, patch: FieldPatch) => void;
};

export type ValidationsBlockProps = {
  field?: FieldBlock;
  updateField: (id: string, patch: FieldPatch) => void;
};

export type LayoutBlockProps = Omit<InspectorProps, "index"> & {
  field: BuilderField;
};

export type InspectorActionsProps = {
  field: BuilderField;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
};
