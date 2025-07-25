CREATE UNLOGGED TABLE IF NOT EXISTS cache (
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    expired_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cache_expired_at ON cache (expired_at) WHERE expired_at IS NOT NULL;

CREATE OR REPLACE FUNCTION cache_set(p_key TEXT, p_value TEXT, p_ttl INT DEFAULT 3600)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO cache (key, value, expired_at) 
    VALUES (p_key, p_value, 
            CASE WHEN p_ttl IS NULL THEN NULL 
                 ELSE NOW() + INTERVAL '1 second' * p_ttl END)
    ON CONFLICT (key) DO UPDATE SET 
        value = EXCLUDED.value,
        expired_at = EXCLUDED.expired_at;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cache_get(p_key TEXT)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    SELECT value INTO result FROM cache 
    WHERE key = p_key AND (expired_at IS NULL OR expired_at > NOW());
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- DEL key
CREATE OR REPLACE FUNCTION cache_del(p_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    deleted BOOLEAN;
BEGIN
    DELETE FROM cache WHERE key = p_key;
    GET DIAGNOSTICS deleted = ROW_COUNT;
    RETURN deleted;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INT AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM cache WHERE expired_at IS NOT NULL AND expired_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('cache-cleanup', '0 0 * * *', 'SELECT cleanup_expired_cache()');
