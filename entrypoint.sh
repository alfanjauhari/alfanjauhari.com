#!/bin/sh
set -e

echo "Running DB initialization..."
node scripts/db-init.cjs

echo "Starting server..."
exec node .output/server/index.mjs
