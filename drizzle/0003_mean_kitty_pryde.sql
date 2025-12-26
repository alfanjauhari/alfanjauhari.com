CREATE TABLE "likes" (
	"id" text PRIMARY KEY DEFAULT generate_nanoid() NOT NULL,
	"ref_table" varchar(100) NOT NULL,
	"ref_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;