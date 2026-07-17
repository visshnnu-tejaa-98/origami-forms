import {
    pgTable,
    uuid,
    timestamp,
    text,
    integer,
    jsonb,
} from "drizzle-orm/pg-core";
import { formFieldsTable, formsTable } from "./forms";
import { responseStatusEnum } from "./enum";


type FormMetadata = {
    ip: string;
    country: string;
    deviceType: string;
    userAgent: string;
    referrer?: string;
};

export const ResponsesTable = pgTable("responses", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").notNull().references(() => formsTable.id),

    status: responseStatusEnum("status").default("partial").notNull(),
    metaData: jsonb("metadata").$type<FormMetadata>().notNull(),

    startedAt: timestamp("started_at", { withTimezone: true }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    CompletionTimeInSec: integer("completion_time"),
});

export const ResponseAnswersTable = pgTable("response_answers", {
    id: uuid().primaryKey().notNull(),
    responseId: uuid("response_id")
        .notNull()
        .references(() => ResponsesTable.id),
    formFieldId: uuid("form_field_id")
        .notNull()
        .references(() => formFieldsTable.id),
    value: text("value").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})

export type SelectResponse = typeof ResponsesTable.$inferSelect;
export type InsertResponse = typeof ResponsesTable.$inferInsert;

export type SelectResponseAnswers = typeof ResponseAnswersTable.$inferSelect;
export type InsertResponseAnswers = typeof ResponseAnswersTable.$inferInsert;