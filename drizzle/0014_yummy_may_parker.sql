CREATE TABLE "feeds" (
	"id" text PRIMARY KEY DEFAULT generate_nanoid() NOT NULL,
	"date" timestamp NOT NULL,
	"tag" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"draft" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
