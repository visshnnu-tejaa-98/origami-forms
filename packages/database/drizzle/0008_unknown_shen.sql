CREATE TYPE "public"."themes" AS ENUM('light', 'dark');--> statement-breakpoint
ALTER TYPE "public"."form_status" ADD VALUE 'expired';--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"theme" "themes" DEFAULT 'light',
	"forms_per_page" integer DEFAULT 10,
	"responses_per_page" integer DEFAULT 20,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;