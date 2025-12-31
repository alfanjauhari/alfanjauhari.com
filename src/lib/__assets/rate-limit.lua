-- sliding_window.lua
-- KEYS[1] = rate limit key
-- ARGV[1] = now (ms)
-- ARGV[2] = window (ms)
-- ARGV[3] = limit
-- ARGV[4] = request_id

redis.call("ZREMRANGEBYSCORE", KEYS[1], 0, ARGV[1] - ARGV[2])

local count = redis.call("ZCARD", KEYS[1])

if count >= tonumber(ARGV[3]) then
  return {0, count}
end

redis.call("ZADD", KEYS[1], ARGV[1], ARGV[4])
redis.call("PEXPIRE", KEYS[1], ARGV[2])

return {1, count + 1}
