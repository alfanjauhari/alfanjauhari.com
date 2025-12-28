CREATE TYPE "public"."comment_status_enum" AS ENUM('pending', 'approved', 'rejected', 'deleted', 'deleted_by_admin');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY DEFAULT generate_nanoid() NOT NULL,
	"ref_table" varchar(100) NOT NULL,
	"ref_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"status" "comment_status_enum",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;