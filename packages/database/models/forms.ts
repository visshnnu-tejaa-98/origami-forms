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
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { formFieldTypeEnum, formStatusEnum, formVisibilityEnum } from "./enum";

export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id").notNull().references(() => usersTable.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    slug: varchar("slug", { length: 255 }).notNull(),

    status: formStatusEnum("status").default("draft").notNull(),
    visibility: formVisibilityEnum("visibility").default("unlisted").notNull(),

    maxSubmissions: integer("max_submissions"),
    submissionCount: integer("submission_count").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at").$onUpdate(() => new Date()),
});

export const formFieldsTable = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => formsTable.id),

    type: formFieldTypeEnum("type").notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    description: text("description"),
    placeholder: varchar("placeholder", { length: 255 }),
    helpText: varchar("help_text", { length: 255 }),
    required: boolean("required").default(false),
    order: doublePrecision("number").notNull(),
    labelKey: varchar("label_key", { length: 255 }).notNull(),
})

export const formViewsTable = pgTable("form_views", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => formsTable.id),

    sessionId: text("session_id").notNull(),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    uniqueIndex("form_view_from_session_uq").on(t.formId, t.sessionId)
]);


export type SelectForms = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;

export type SelectFormViews = typeof formViewsTable.$inferSelect;
export type InsertFormViews = typeof formViewsTable.$inferInsert;
