CREATE TABLE "updates" (
	"id" text PRIMARY KEY DEFAULT generate_nanoid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"summary" text NOT NULL,
	"date" timestamp NOT NULL,
	"git_sha" varchar(255) NOT NULL,
	"source_path" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "updates_slug_unique" UNIQUE("slug")
);
