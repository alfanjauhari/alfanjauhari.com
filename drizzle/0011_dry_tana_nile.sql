ALTER TABLE "comments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."comment_status_enum";--> statement-breakpoint
CREATE TYPE "public"."comment_status_enum" AS ENUM('published', 'deleted', 'deleted_by_admin');--> statement-breakpoint
UPDATE "comments" SET "status" = 'published' WHERE "status" IN ('pending', 'approved');
UPDATE "comments" SET "status" = 'deleted_by_admin' WHERE "status" = 'rejected';
ALTER TABLE "comments" ALTER COLUMN "status" SET DATA TYPE "public"."comment_status_enum" USING "status"::"public"."comment_status_enum";
