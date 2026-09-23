ALTER TABLE "analytics"
ADD COLUMN "deleted_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "form_views"
ADD COLUMN "deleted_at" timestamp with time zone;
