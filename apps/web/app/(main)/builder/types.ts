import { IconName } from "../components/icons";
import { BUILDER_TABS, FIELD_TYPES, LAYOUT_BLOCKS } from "./constants";

export type FieldType = (typeof FIELD_TYPES)[number]["key"];
export type LayoutType = (typeof LAYOUT_BLOCKS)[number]["key"];
export type BlockType = FieldType | LayoutType;

export type BuilderTab = (typeof BUILDER_TABS)[number]["key"];

/** the washi tint a field type wears in the palette and on its type pill */
export type Tint = "accent" | "pink" | "matcha" | "peach" | "lavender" | "indigo" | "highlighter";

export type FieldTypeMeta = {
  key: BlockType;
  label: string;
  icon: IconName;
  tint: Tint;
};

export type FieldOption = {
  id: string;
  label: string;
};

/** one block on the canvas — a question, a page break or a heading */
export type BuilderField = {
  id: string;
  type: BlockType;
  label: string;
  help: string;
  placeholder: string;
  required: boolean;
  options: FieldOption[];
  /** rating fields only — how many stars are lit in the preview */
  rating?: number;
  /** an inline note rendered as a dashed logic line under the block */
  logic?: string;
};

export type BuilderForm = {
  title: string;
  description: string;
  slug: string;
  status: "draft" | "published";
  editedLabel: string;
  fields: BuilderField[];
};

export type TopbarProps = {
  title: string;
  setTitle: (title: string) => void;
  slug: string;
  status: BuilderForm["status"];
  editedLabel: string;
  tab: BuilderTab;
  setTab: (tab: BuilderTab) => void;
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
  field: BuilderField;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

export type InspectorProps = {
  field: BuilderField | null;
  index: number;
  updateField: (id: string, patch: Partial<BuilderField>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
};
