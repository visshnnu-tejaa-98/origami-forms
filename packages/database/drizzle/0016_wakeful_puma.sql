ALTER TABLE "analytics"
ADD COLUMN "deleted_at" timestamp with time zone DEFAULT NOT NULL;
--> statement-breakpoint
ALTER TABLE "form_views"
ADD COLUMN "deleted_at" timestamp with time zone DEFAULT NOT NULL;