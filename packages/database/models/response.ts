import {
    pgTable,
    uuid,
    timestamp,
    text,
    integer,
    jsonb,
} from "drizzle-orm/pg-core";
import { formFields, forms } from "./forms";
import { responseStatusEnum } from "./enum";
import { relations } from "drizzle-orm";


type FormMetadata = {
    ip: string;
    country: string;
    deviceType: string;
    userAgent: string;
    referrer?: string;
};

export const formResponses = pgTable("responses", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),

    status: responseStatusEnum("status").default("partial").notNull(),
    metaData: jsonb("metadata").$type<FormMetadata>(),

    startedAt: timestamp("started_at", { withTimezone: true }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    CompletionTimeInSec: integer("completion_time"),
});

export const responseAnswers = pgTable("response_answers", {
    id: uuid().primaryKey().defaultRandom(),
    responseId: uuid("response_id")
        .notNull()
        .references(() => formResponses.id, { onDelete: "cascade" }),
    formFieldId: uuid("form_field_id")
        .notNull()
        .references(() => formFields.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export type SelectResponse = typeof formResponses.$inferSelect;
export type InsertResponse = typeof formResponses.$inferInsert;

export type SelectResponseAnswers = typeof responseAnswers.$inferSelect;
export type InsertResponseAnswers = typeof responseAnswers.$inferInsert;


export const formResponsesRelations = relations(formResponses, ({ one, many }) => ({
    form: one(forms, {
        fields: [formResponses.formId],
        references: [forms.id]
    }),
    answers: many(responseAnswers)
}))

export const responseAnswersRelations = relations(responseAnswers, ({ one }) => ({
    response: one(formResponses, {
        fields: [responseAnswers.responseId],
        references: [formResponses.id]
    }),
    field: one(formFields, {
        fields: [responseAnswers.formFieldId],
        references: [formFields.id]
    })
}))