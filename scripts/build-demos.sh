#!/usr/bin/env bash
set -euo pipefail

DEMO_IDS=$(grep "id:" src/public-demos/demos.config.ts | sed "s/.*id: '//;s/'.*//" | tr '\n' ' ')

echo "Building demos..."
echo ""

for id in $DEMO_IDS; do
  echo "▸ $id"
  DEMO_ID="$id" npx vite build --config vite.config.demos.ts 2>&1 | grep -E "^(✓|dist-demos)" || true
  # Rename the generated HTML to index.html
  mv "dist-demos/$id/.demo-$id.html" "dist-demos/$id/index.html"
  echo "  ✓ dist-demos/$id/"
  echo ""
done

echo "Done."
