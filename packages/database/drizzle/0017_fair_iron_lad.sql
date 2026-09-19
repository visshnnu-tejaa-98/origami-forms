ALTER TABLE "analytics" ALTER COLUMN "deleted_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "analytics" ALTER COLUMN "deleted_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "form_views" ALTER COLUMN "deleted_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "form_views" ALTER COLUMN "deleted_at" DROP NOT NULL;--> statement-breakpoint
-- 0016 added these columns as NOT NULL DEFAULT now(), which stamped every existing row as
-- soft-deleted. The value carries no real information, so it is cleared rather than kept.
UPDATE "analytics" SET "deleted_at" = NULL;--> statement-breakpoint
UPDATE "form_views" SET "deleted_at" = NULL;
