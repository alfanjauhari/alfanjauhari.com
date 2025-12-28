#!/bin/sh

PRIVATE_CONTENT_DIR=${PRIVATE_CONTENT_DIR:-content/privates}
PRIVATE_CONTENT_BRANCH="${PRIVATE_CONTENT_BRANCH:-main}"
PRIVATE_CONTENT_REPO="${PRIVATE_CONTENT_REPO:?PRIVATE_CONTENT_REPO required}"

echo "Sync content from $PRIVATE_CONTENT_REPO ($PRIVATE_CONTENT_BRANCH)"

if [ ! -d "$PRIVATE_CONTENT_DIR/.git" ]; then
  echo "Cloning content repo"
  git clone --depth=1 \
    --branch "$PRIVATE_CONTENT_BRANCH" \
    "$PRIVATE_CONTENT_REPO" \
    "$PRIVATE_CONTENT_DIR"
else
  echo "Updating content repo"
  git -C "$PRIVATE_CONTENT_DIR" fetch origin "$PRIVATE_CONTENT_BRANCH"
  git -C "$PRIVATE_CONTENT_DIR" reset --hard "origin/$PRIVATE_CONTENT_BRANCH"
fi

CONTENT_SHA=$(git -C "$PRIVATE_CONTENT_DIR" rev-parse HEAD)
echo "Content synced at $CONTENT_SHA"

# export for CI
if [ -n "${GITHUB_ENV:-}" ]; then
  echo "CONTENT_SHA=$CONTENT_SHA" >> "$GITHUB_ENV"
fi

if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
  echo "Skipping DB sync on GitHub Actions"
  exit 0
fi

echo "Syncing metadata to Postgres"
node scripts/sync-contents-db.cjs
echo "Metadata sync done"
