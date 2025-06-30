ALTER TABLE cache
ALTER COLUMN expired_at
TYPE TIMESTAMPTZ;

DROP FUNCTION IF EXISTS cache_get (p_key TEXT);

CREATE
OR REPLACE FUNCTION cache_get (p_key TEXT) RETURNS TABLE (result TEXT, expired TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
    SELECT value, expired_at FROM cache
    WHERE key = p_key AND (expired_at IS NULL OR expired_at > NOW());
END;
$$ LANGUAGE plpgsql;