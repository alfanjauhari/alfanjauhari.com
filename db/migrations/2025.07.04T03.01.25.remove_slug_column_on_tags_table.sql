-- up migration
ALTER TABLE tags
DROP COLUMN IF EXISTS slug;

DROP INDEX IF EXISTS tags_slug_key;