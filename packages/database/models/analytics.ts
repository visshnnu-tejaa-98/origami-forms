import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { formFields, forms } from "./forms";
import { analyticsEventTypeEnum } from "./enum";
import { relations } from "drizzle-orm";

export const formAnalyticsEvents = pgTable("analytics_events", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
        .notNull()
        .references(() => forms.id),
    eventType: analyticsEventTypeEnum("event_type").notNull(),
    formFieldId: uuid("form_field_id")
        .notNull()
        .references(() => formFields.id),
    metaData: text("metadata"),
    occuredAt: timestamp("occured_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectAnalyticsEvents = typeof formAnalyticsEvents.$inferSelect;
export type InsertAnalyticsEvents = typeof formAnalyticsEvents.$inferInsert;

export const formAnalyticsEventsRelations = relations(formAnalyticsEvents, ({ one }) => ({
    form: one(forms, {
        fields: [formAnalyticsEvents.formId],
        references: [forms.id]
    }),
    field: one(formFields, {
        fields: [formAnalyticsEvents.formFieldId],
        references: [formFields.id]
    })
}))
