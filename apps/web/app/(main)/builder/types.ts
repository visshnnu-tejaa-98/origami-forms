import { CreateFormInputModel, LayoutFieldType } from "@repo/services/form/model";
import { IconName } from "../components/icons";
import { Status } from "../types";
import { FlowQuestion, FlowStep } from "~/components/form-flow/types";

type CreateFormInputType = CreateFormInputModel["fields"][number];

export type FieldType = Exclude<CreateFormInputType, { type: LayoutType }>["type"];

export type LayoutType = LayoutFieldType;

export type BlockType = CreateFormInputType["type"];

export type Tint = "accent" | "pink" | "matcha" | "peach" | "lavender" | "indigo" | "highlighter";

export type FieldTypeMeta = {
  key: BlockType;
  label: string;
  icon: IconName;
  tint: Tint;
};

export type FieldBlock = Exclude<CreateFormInputType, { type: LayoutType }> & { id: string };

export type LayoutBlock = Extract<CreateFormInputType, { type: LayoutType }> & { id: string };

export type OptionFieldBlock = Extract<FieldBlock, { options: unknown }>;

export type FieldOption = OptionFieldBlock["options"][number];

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type FieldPatch = Partial<DistributiveOmit<CreateFormInputType, "type">>;

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

export type MutationPayloadShape = Omit<CreateFormInputModel, "expiresAt"> & {
  expiresAt?: Date | null;
};


export type BuilderForm = Omit<CreateFormInputModel, "fields"> & {
  fields: BuilderField[];
  expiresAt?: string | null;
  iconUrl?: string | null;
};

export type FormSettings = Pick<BuilderForm, "visibility" | "maxSubmissions" | "expiresAt">;

export type FormSettingsPatch = Partial<FormSettings>;

export type FormSettingsProps = {
  settings: FormSettings;
  updateSettings: (patch: FormSettingsPatch) => void;
};

export type TopbarProps = {
  title: string;
  setTitle: (title: string) => void;
  saveAsDraft: () => void;
  saveAndPublish: () => void;
  preview: () => void;
};

export type FieldPaletteProps = {
  addField: (type: BlockType) => void;
  openSettings: () => void;
  settingsOpen: boolean;
};

export type FormIconPickerProps = {
  iconUrl?: string | null;
  setIcon: (iconUrl: string | null) => void;
  formId?: string;
};

export type FormCanvasProps = {
  form: BuilderForm;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setIcon: (iconUrl: string | null) => void;
  formId?: string;
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
  settingsOpen: boolean;
  settings: FormSettings;
  updateSettings: (patch: FormSettingsPatch) => void;
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

export type LayoutBlockProps = Omit<
  InspectorProps,
  "index" | "settingsOpen" | "settings" | "updateSettings"
> & {
  field: BuilderField;
};

export type InspectorActionsProps = {
  field: BuilderField;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
};

export type AnswerValue = string | string[];

export type PreviewInputProps = {
  field: FieldBlock;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

export type PreviewScreenProps = {
  form: BuilderForm;
  status: Status | "pending",
  onClose: () => void;
};

export type NumberFieldValidation = {
  step: number;
  min?: number;
  max?: number;
}

export type PreviewSideRailProps = {
  form: BuilderForm
  at: number,
  steps: FlowStep[],
  questions: FlowQuestion[]
  onClose: () => void,
  go: (i: number) => void,
}