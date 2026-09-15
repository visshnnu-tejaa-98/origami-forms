ALTER TABLE "analytics" ALTER COLUMN "activity_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."analytics_event_type";--> statement-breakpoint
CREATE TYPE "public"."analytics_event_type" AS ENUM('submitted', 'drafted', 'published', 'edited');--> statement-breakpoint
--> the old labels are gone from the type, so remap them while the column is still text
UPDATE "analytics" SET "activity_type" = 'published' WHERE "activity_type" = 'created';--> statement-breakpoint
DELETE FROM "analytics" WHERE "activity_type" NOT IN ('submitted', 'drafted', 'published', 'edited');--> statement-breakpoint
ALTER TABLE "analytics" ALTER COLUMN "activity_type" SET DATA TYPE "public"."analytics_event_type" USING "activity_type"::"public"."analytics_event_type";