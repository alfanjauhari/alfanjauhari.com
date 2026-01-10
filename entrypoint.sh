#!/bin/sh
set -e

echo "Running DB initialization..."
node dist/scripts/db-init.js

echo "Starting server..."
exec node dist/scripts/serve-prod.js
