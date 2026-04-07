CREATE TABLE "recruiting_invitations" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"token" text NOT NULL,
	"candidate_name" text NOT NULL,
	"candidate_email" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"user_id" text,
	"expires_at" timestamp with time zone,
	"redeemed_at" timestamp with time zone,
	"ip_address" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "show_results_to_candidate" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "recruiting_invitations" ADD CONSTRAINT "recruiting_invitations_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiting_invitations" ADD CONSTRAINT "recruiting_invitations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiting_invitations" ADD CONSTRAINT "recruiting_invitations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ri_token_idx" ON "recruiting_invitations" USING btree ("token");--> statement-breakpoint
CREATE INDEX "ri_assignment_idx" ON "recruiting_invitations" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "ri_status_idx" ON "recruiting_invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ri_user_idx" ON "recruiting_invitations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ri_created_at_idx" ON "recruiting_invitations" USING btree ("created_at");