-- Drop Foreign Keys
ALTER TABLE "contents_tags" DROP CONSTRAINT "contents_tags_tag_id_fkey";
ALTER TABLE "contents_tags" DROP CONSTRAINT "contents_tags_content_id_fkey";
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- Drop Indexes
DROP INDEX IF EXISTS "contents_tags_content_id_tag_id_key";
DROP INDEX IF EXISTS "tags_slug_key";
DROP INDEX IF EXISTS "tags_name_key";
DROP INDEX IF EXISTS "contents_slug_key";
DROP INDEX IF EXISTS "contents_notion_id_key";
DROP INDEX IF EXISTS "sessions_token_key";
DROP INDEX IF EXISTS "users_email_key";

-- Drop Tables
DROP TABLE IF EXISTS "contents_tags";
DROP TABLE IF EXISTS "tags";
DROP TABLE IF EXISTS "contents";
DROP TABLE IF EXISTS "sessions";
DROP TABLE IF EXISTS "users";