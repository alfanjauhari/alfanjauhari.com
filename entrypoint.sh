#!/bin/sh
set -e

echo "Running Content sync..."
node /app/scripts/sync-contents-db.cjs

echo "Starting server..."
exec node server/index.mjs
