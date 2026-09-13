ALTER TABLE "analytics" RENAME COLUMN "user_id" TO "respondeeId";--> statement-breakpoint
ALTER TABLE "analytics" DROP CONSTRAINT "analytics_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "analytics" ADD COLUMN "creatorId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_creatorId_users_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_respondeeId_users_id_fk" FOREIGN KEY ("respondeeId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;