import type {
  BuilderField,
  BuilderForm,
  FieldBlock,
  FieldTypeMeta,
  OptionFieldBlock,
} from "./types";

export const FIELD_TYPES = [
  { key: "short_text", label: "Short text", icon: "text", tint: "accent" },
  { key: "long_text", label: "Long text", icon: "align", tint: "pink" },
  { key: "email", label: "Email", icon: "mail", tint: "indigo" },
  { key: "number", label: "Number", icon: "hash", tint: "peach" },
  { key: "single_select", label: "Single select", icon: "list", tint: "matcha" },
  { key: "multi_select", label: "Multi select", icon: "check", tint: "lavender" },
  { key: "radio", label: "Radio", icon: "toggle", tint: "matcha" },
  { key: "check_box", label: "Checkbox", icon: "check", tint: "lavender" },
  { key: "rating", label: "Rating", icon: "star", tint: "highlighter" },
  { key: "date", label: "Date", icon: "calendar", tint: "peach" },
  { key: "phone", label: "Phone", icon: "phone", tint: "indigo" },
  { key: "url", label: "URL", icon: "link", tint: "matcha" },
  { key: "file_upload", label: "File upload", icon: "upload", tint: "accent" },
];

export const PAGE_BREAK = "page_break";
export const HEADING = "heading";

export const LAYOUT_BLOCKS = [
  { key: PAGE_BREAK, label: "Page break", icon: "layers", tint: "accent" },
  { key: HEADING, label: "Heading", icon: "text", tint: "accent" },
] as const satisfies readonly FieldTypeMeta[];

/** every block type keyed by name — used for pills, icons and defaults */
export const BLOCK_META: Record<string, FieldTypeMeta> = Object.fromEntries(
  [...FIELD_TYPES, ...LAYOUT_BLOCKS].map((b) => [b.key, b as FieldTypeMeta])
);

/** field types that carry a list of options */
export const OPTION_TYPES: readonly string[] = ["single_select", "multi_select", "check_box", "radio"];

/** field types that render no question chrome on the canvas */
export const LAYOUT_TYPES: readonly string[] = [PAGE_BREAK, HEADING];

export const isFieldBlock = (block: BuilderField): block is FieldBlock =>
  !LAYOUT_TYPES.includes(block.type);

/** narrows a field to one that carries an options list */
export const hasOptions = (field: BuilderField): field is OptionFieldBlock & { id: string } =>
  OPTION_TYPES.includes(field.type);

/** placeholder copy shown per field type in the canvas preview */
export const PREVIEW_PLACEHOLDER: Record<string, string> = {
  short_text: "Type your answer…",
  long_text: "Anything we should know…",
  email: "you@studio.dev",
  number: "e.g. 4",
  date: "select a date",
  phone: "+91 99999 99999",
  url: "https://…",
  file_upload: "drop a file, or browse",
};

export const DEFAULT_OPTIONS = ["First option", "Second option"];

export const FORM_VISIBILITY: { key: BuilderForm["visibility"]; label: string }[] = [
  { key: "unlisted", label: "Unlisted · link only" },
  { key: "public", label: "Public · anyone" },
  { key: "authenticated", label: "Authenticated · registered users only" }
];

export const SEED_FORM: BuilderForm = {
  title: "",
  description: "",
  visibility: "unlisted",
  fields: [],
};
