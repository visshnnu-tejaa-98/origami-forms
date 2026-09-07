CREATE TYPE "public"."forms_views" AS ENUM('grid', 'list');--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "view" "forms_views" DEFAULT 'grid';