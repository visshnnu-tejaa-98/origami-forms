const mod: any = await import("./form/index");
const FormService = mod.default?.default ?? mod.default;
const s = new FormService();
const creatorId = process.env.TEST_USER_ID!;

const created = await s.createForm(creatorId, {
  title: "Diff test form",
  visibility: "unlisted",
  fields: [
    { type: "short_text", label: "Name", order: 0, required: false },
    { type: "page_break", label: "page break", order: 1 },
    { type: "email", label: "Email", order: 2, required: false },
  ],
} as any);
const c: any = created;
console.log("created:", c.fields.map((f: any) => [f.label, f.type, f.order, f.labelKey.slice(0, 8)]));

const [name, brk, email] = c.fields;

const res: any = await s.updateForm({
  formId: c.id,
  requesterId: creatorId,
  title: "Diff test form (edited)",
  fields: [
    { id: email.id, type: "email", label: "Email", order: 0, required: true },   // kept + reordered + edited
    { id: name.id, type: "short_text", label: "Full name", order: 1, required: false }, // renamed
    { type: "rating", label: "How was it?", order: 2, required: false },          // new
    // brk omitted -> soft delete
  ],
} as any);

console.log("message:", res.message, "| title:", res.formData.title);
console.log("after:", res.formData.fields.map((f: any) => [f.label, f.type, f.order, f.labelKey.slice(0, 8)]));
console.log("labelKey stable for Name?", res.formData.fields.find((f: any) => f.id === name.id)?.labelKey === name.labelKey);
console.log("page break gone from read?", !res.formData.fields.some((f: any) => f.id === brk.id));
process.exit(0);
