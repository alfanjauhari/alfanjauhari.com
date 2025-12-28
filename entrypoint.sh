#!/bin/sh
set -e

echo "Running Content sync..."
sh /app/scripts/sync-contents.sh

echo "Starting server..."
exec node server/index.mjs
