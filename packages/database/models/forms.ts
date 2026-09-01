import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    text,
    integer,
    boolean,
    doublePrecision,
    uniqueIndex,
    jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { formFieldTypeEnum, formStatusEnum, formVisibilityEnum } from "./enum";
import { relations } from "drizzle-orm";
import { formResponses } from "./response";

export const forms = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    slug: varchar("slug", { length: 255 }).notNull(),

    status: formStatusEnum("status").default("draft").notNull(),
    visibility: formVisibilityEnum("visibility").default("unlisted").notNull(),

    maxSubmissions: integer("max_submissions"),
    submissionCount: integer("submission_count").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
});

export const formFields = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),

    type: formFieldTypeEnum("type").notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    description: text("description"),
    placeholder: varchar("placeholder", { length: 255 }),
    helpText: varchar("help_text", { length: 255 }),
    required: boolean("required").default(false),
    order: doublePrecision("number").notNull(),
    labelKey: varchar("label_key", { length: 255 }).notNull(),

    validation: jsonb("validation").$type<Record<string, unknown>>().notNull().default({}),
    options: jsonb("options")
        .$type<{ id: string; label: string; value: string }[] | Record<string, never>>()
        .notNull()
        .default({}),
    defaultValue: text("default_value"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
})

export const views = pgTable("form_views", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),

    sessionId: text("session_id").notNull(),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    uniqueIndex("form_view_from_session_uq").on(t.formId, t.sessionId)
]);


export type SelectForms = typeof forms.$inferSelect;
export type InsertForm = typeof forms.$inferInsert;

export type SelectFormField = typeof formFields.$inferSelect;
export type InsertFormField = typeof formFields.$inferInsert;

export type SelectFormViews = typeof views.$inferSelect;
export type InsertFormViews = typeof views.$inferInsert;


export const formRelations = relations(forms, ({ one, many }) => ({
    creator: one(users, {
        fields: [forms.creatorId],
        references: [users.id]
    }),
    fields: many(formFields),
    responses: many(formResponses)
}))

export const formFieldRelations = relations(formFields, ({ one }) => ({
    form: one(forms, {
        fields: [formFields.formId],
        references: [forms.id]
    }),
}))

export const formViewsRelations = relations(views, ({ one }) => ({
    form: one(forms, {
        fields: [views.formId],
        references: [forms.id]
    })
}))