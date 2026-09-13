CREATE TABLE "analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"activity_type" "analytics_event_type" NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"occured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "analytics" ALTER COLUMN "activity_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "analytics_events" ALTER COLUMN "event_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."analytics_event_type";--> statement-breakpoint
CREATE TYPE "public"."analytics_event_type" AS ENUM('viewed', 'submitted', 'created', 'edited');--> statement-breakpoint
ALTER TABLE "analytics" ALTER COLUMN "activity_type" SET DATA TYPE "public"."analytics_event_type" USING "activity_type"::"public"."analytics_event_type";--> statement-breakpoint
ALTER TABLE "analytics_events" ALTER COLUMN "event_type" SET DATA TYPE "public"."analytics_event_type" USING "event_type"::"public"."analytics_event_type";--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_form_type_occured_idx" ON "analytics" USING btree ("form_id","activity_type","occured_at");