import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { formFieldsTable, formsTable } from "./forms";
import { analyticsEventTypeEnum } from "./enum";

export const analyticsEventsTable = pgTable("analytics_events", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
        .notNull()
        .references(() => formsTable.id),
    eventType: analyticsEventTypeEnum("event_type").notNull(),
    formFieldId: uuid("form_field_id")
        .notNull()
        .references(() => formFieldsTable.id),
    metaData: text("metadata"),
    occuredAt: timestamp("occured_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectAnalyticsEvents = typeof analyticsEventsTable.$inferSelect;
export type InsertAnalyticsEvents = typeof analyticsEventsTable.$inferInsert;