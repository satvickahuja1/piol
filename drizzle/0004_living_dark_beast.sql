ALTER TABLE "workflow" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;