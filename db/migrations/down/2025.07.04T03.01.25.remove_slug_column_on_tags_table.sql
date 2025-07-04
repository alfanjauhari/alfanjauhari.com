-- down migration
ALTER TABLE tags
ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_key ON tags (slug);