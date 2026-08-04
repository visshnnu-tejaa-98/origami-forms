import { IconName } from "../components/icons";
import type { BuilderForm, FieldTypeMeta, Tint } from "./types";

export const FIELD_TYPES = [
  { key: "short-text", label: "Short text", icon: "text", tint: "accent" },
  { key: "long-text", label: "Long text", icon: "align", tint: "pink" },
  { key: "email", label: "Email", icon: "mail", tint: "indigo" },
  { key: "number", label: "Number", icon: "hash", tint: "peach" },
  { key: "single-select", label: "Single select", icon: "list", tint: "matcha" },
  { key: "multi-select", label: "Multi select", icon: "check", tint: "lavender" },
  { key: "rating", label: "Rating", icon: "star", tint: "highlighter" },
  { key: "date", label: "Date", icon: "calendar", tint: "peach" },
  { key: "phone", label: "Phone", icon: "phone", tint: "indigo" },
  { key: "url", label: "URL", icon: "link", tint: "matcha" },
  { key: "file", label: "File upload", icon: "upload", tint: "accent" },
  { key: "boolean", label: "Yes / No", icon: "toggle", tint: "pink" },
]

export const LAYOUT_BLOCKS = [
  { key: "page-break", label: "Page break", icon: "layers", tint: "accent" },
  { key: "heading", label: "Heading", icon: "text", tint: "accent" },
];

/** every block type keyed by name — used for pills, icons and defaults */
export const BLOCK_META: Record<string, FieldTypeMeta> = Object.fromEntries(
  [...FIELD_TYPES, ...LAYOUT_BLOCKS].map((b) => [b.key, b as FieldTypeMeta])
);

/** field types that carry a list of options */
export const OPTION_TYPES = ["single-select", "multi-select"];

/** field types that render no question chrome on the canvas */
export const LAYOUT_TYPES = ["page-break", "heading"];

/** placeholder copy shown per field type in the canvas preview */
export const PREVIEW_PLACEHOLDER: Record<string, string> = {
  "short-text": "Type your answer…",
  "long-text": "Anything we should know…",
  email: "you@studio.dev",
  number: "e.g. 4",
  date: "select a date",
  phone: "+91 00000 00000",
  url: "https://…",
  file: "drop a file, or browse",
};

export const DEFAULT_OPTIONS = ["First option", "Second option", "Third option"];

/* ====== the sheet we open the studio with ====== */
export const SEED_FORM: BuilderForm = {
  title: "Sakura Festival RSVP",
  description:
    "Three Saturdays in April, a quiet park, paper boats on the pond. RSVP below — we'll send a map.",
  slug: "/f/sakura-rsvp",
  status: "published",
  editedLabel: "edited 2 min ago",
  fields: [
    {
      id: "q-name",
      type: "short-text",
      label: "What name should we list at the gate?",
      help: "your name or your group's name — whichever is cuter",
      placeholder: "Type your name…",
      required: true,
      options: [],
    },
    {
      id: "q-email",
      type: "email",
      label: "Email — we'll send the picnic map and a reminder.",
      help: "we send one email. it's good.",
      placeholder: "you@studio.dev",
      required: true,
      options: [],
    },
    {
      id: "q-date-pick",
      type: "single-select",
      label: "Pick a Saturday — we have three to offer.",
      help: "we can squeeze you in last-minute too, just say so in the notes",
      placeholder: "",
      required: true,
      options: [
        { id: "o-1", label: "April 6 · cherry blossoms" },
        { id: "o-2", label: "April 13 · peak bloom" },
        { id: "o-3", label: "April 20 · soft petals" },
        { id: "o-4", label: "can't make any of those" },
      ],
      logic: "if \"can't make any\" → jump to the date suggestion",
    },
    {
      id: "q-headcount",
      type: "number",
      label: "Headcount — how many cranes shall we fold?",
      help: "adults + kids combined is fine",
      placeholder: "e.g. 4",
      required: true,
      options: [],
    },
    {
      id: "q-bring",
      type: "multi-select",
      label: "Anything to bring? (we'll pack the rest)",
      help: "",
      placeholder: "",
      required: false,
      options: [
        { id: "o-5", label: "snacks for sharing" },
        { id: "o-6", label: "a picnic blanket" },
        { id: "o-7", label: "a polaroid camera" },
      ],
    },
    {
      id: "q-hype",
      type: "rating",
      label: "How hyped are you (1 = chill, 5 = sakura overload)?",
      help: "",
      placeholder: "",
      required: false,
      options: [],
      rating: 4,
    },
    {
      id: "b-page",
      type: "page-break",
      label: "halfway there",
      help: "",
      placeholder: "",
      required: false,
      options: [],
    },
    {
      id: "q-notes",
      type: "long-text",
      label: "Allergies, accessibility needs, or extra notes for us?",
      help: "optional · we read every word, slowly",
      placeholder: "Anything we should know…",
      required: false,
      options: [],
    },
    {
      id: "q-alt-date",
      type: "date",
      label: 'If "can\'t make any" — suggest a date instead?',
      help: "",
      placeholder: "select a date",
      required: false,
      options: [],
    },
  ],
};
