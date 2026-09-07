import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { formsViewsEnum, themesEnum, userRolesEnum } from "./enum";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),

  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }),

  email: varchar("email", { length: 255 }).notNull().unique(),
  avatarUrl: text("profile_image_url"),
  role: userRolesEnum("role").default("starter"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true })
});

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;


export const userSettings = pgTable("user_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),

  theme: themesEnum("theme").default("light"),
  formsPerPage: integer("forms_per_page").default(10),
  responsesPerPage: integer("responses_per_page").default(20),
  view: formsViewsEnum("view").default("grid"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true })
})

export type SelectUserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;


export const userRelations = relations(users, ({ one }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
}));