#!/usr/bin/env bash
# Fails if banned legacy strings appear in source code.
# CSV/data dumps under src/data are excluded (historical records).
set -euo pipefail

BANNED=(
  "2005–2025"
  "2005-2025"
  "2005 to 2025"
  "2006–2025"
  "2006-2025"
)

FAIL=0
for pattern in "${BANNED[@]}"; do
  # Search source, exclude CSVs and lockfiles
  if matches=$(grep -RIn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
       --exclude='*.csv' --exclude='*.lock' --exclude='bun.lockb' \
       -- "$pattern" src/ public/ index.html 2>/dev/null); then
    echo "❌ Banned string found: \"$pattern\""
    echo "$matches"
    echo ""
    FAIL=1
  fi
done

if [ "$FAIL" -eq 1 ]; then
  echo "Banned string check FAILED. Update occurrences to '2006–2026'."
  exit 1
fi

echo "✅ No banned strings found."
