ALTER TABLE cache
ALTER COLUMN expired_at
TYPE TIMESTAMP;

DROP FUNCTION IF EXISTS cache_get (p_key TEXT);

CREATE
OR REPLACE FUNCTION cache_get (p_key TEXT) RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    SELECT value INTO result FROM cache 
    WHERE key = p_key AND (expired_at IS NULL OR expired_at > NOW());
    RETURN result;
END;
$$ LANGUAGE plpgsql;