import { index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { forms } from "./forms";
import { analyticsEventTypeEnum } from "./enum";
import { relations } from "drizzle-orm";
import { users } from "./user";
import { formResponses } from "./response";

export const activities = pgTable(
    "analytics",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        formId: uuid("form_id")
            .notNull()
            .references(() => forms.id, { onDelete: "cascade" }),
        creatorId: uuid("creatorId").references(() => users.id, { onDelete: "cascade" }),
        respondeeId: uuid("respondeeId").references(() => users.id, { onDelete: "cascade" }),
        activityType: analyticsEventTypeEnum("activity_type").notNull(),
        metaData: jsonb("metadata").$type<Record<string, string | number>>().default({}),
        occuredAt: timestamp("occured_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
        deletedAt: timestamp("deleted_at", { withTimezone: true }),
    },
    (t) => [index("analytics_form_type_occured_idx").on(t.formId, t.activityType, t.occuredAt)],
);

export type SelectActivities = typeof activities.$inferSelect;
export type InsertActivities = typeof activities.$inferInsert;

export const formAnalyticsEventsRelations = relations(activities, ({ one }) => ({
    form: one(forms, {
        fields: [activities.formId],
        references: [forms.id],
    }),
    creator: one(users, {
        fields: [activities.creatorId],
        references: [users.id],
    }),
    respondee: one(users, {
        fields: [activities.respondeeId],
        references: [users.id],
    }),
    response: one(formResponses, {
        fields: [activities.id],
        references: [formResponses.id],
    }),
}));
