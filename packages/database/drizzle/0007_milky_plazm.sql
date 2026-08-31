ALTER TYPE "public"."form_visibility" ADD VALUE 'authenticated';--> statement-breakpoint
ALTER TYPE "public"."response_status" ADD VALUE 'all';--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "response_answers" ADD COLUMN "deleted_at" timestamp with time zone;