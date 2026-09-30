import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    text,
    boolean,
    doublePrecision,
    jsonb,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { templateFieldTypeEnum, templateStatusEnum } from "./enum";
import { relations } from "drizzle-orm";


export const templates = pgTable("templates", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    slug: varchar("slug", { length: 255 }).notNull(),

    status: templateStatusEnum("status").default("draft").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
});

export const templateFields = pgTable("template_fields", {
    id: uuid("id").primaryKey().defaultRandom(),
    templateId: uuid("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),

    type: templateFieldTypeEnum("type").notNull(),
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

export const likes = pgTable("template_likes", {
    id: uuid("id").primaryKey().defaultRandom(),
    templateId: uuid("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),

    sessionId: text("session_id").notNull(),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
}, (t) => [
    uniqueIndex("template_like_from_session_uq").on(t.templateId, t.sessionId)
]);


export type SelectTemplates = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

export type SelectTemplateField = typeof templateFields.$inferSelect;
export type InsertTemplateField = typeof templateFields.$inferInsert;

export type SelectTemplateLikes = typeof likes.$inferSelect;
export type InsertTemplateLikes = typeof likes.$inferInsert;

export const templateRelations = relations(templates, ({ one, many }) => ({
    creator: one(users, {
        fields: [templates.creatorId],
        references: [users.id]
    }),
    fields: many(templateFields),
    likes: many(likes)
}))

export const templateFieldRelations = relations(templateFields, ({ one }) => ({
    template: one(templates, {
        fields: [templateFields.templateId],
        references: [templates.id]
    }),
}))

export const templateLikesRelations = relations(likes, ({ one }) => ({
    template: one(templates, {
        fields: [likes.templateId],
        references: [templates.id]
    })
}))