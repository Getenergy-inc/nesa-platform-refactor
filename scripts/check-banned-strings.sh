#!/usr/bin/env bash
# Fails if banned legacy strings appear in source code.
# CSV/data dumps under src/data are excluded (historical records).
set -euo pipefail

# Legacy date ranges (strict — blocks build)
BANNED=(
  "2005–2025"
  "2005-2025"
  "2005 to 2025"
  "2006–2025"
  "2006-2025"
)

# Voting sunset (2026 policy: no public award voting)
# Currently WARN-only during the 60→38 refactor sweep. Will flip to strict
# once Stage 7 consolidation finishes the copy migration.
VOTING_BANNED=(
  "Vote Now"
  "Vote with AGC"
  "Trending Nominees"
)

# User-facing terminology sweep (2026): prefer "subcategory" / "tier" over "pathway".
# Warn-only — internal type names (NominationPathway, PathwaySlug) are exempt via
# grep filter below.
TERMINOLOGY_WARN=(
  "Pathways to Recognition"
  "Recognition Pathways"
  "recognition pathway"
)

FAIL=0
for pattern in "${BANNED[@]}"; do
  if matches=$(grep -RIn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
       --exclude-dir=docs --exclude-dir=tests \
       --exclude='*.csv' --exclude='*.lock' --exclude='bun.lockb' \
       --exclude='check-banned-strings.sh' \
       --exclude='banned-strings.test.ts' \
       -- "$pattern" src/ public/ index.html 2>/dev/null); then
    echo "❌ Banned string found: \"$pattern\""
    echo "$matches"
    echo ""
    FAIL=1
  fi
done

WARN_COUNT=0
for pattern in "${VOTING_BANNED[@]}"; do
  if matches=$(grep -RIn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
       --exclude-dir=docs --exclude-dir=tests \
       --exclude='*.csv' --exclude='*.lock' --exclude='bun.lockb' \
       --exclude='check-banned-strings.sh' --exclude='featureFlags.ts' \
       --exclude='banned-strings.test.ts' \
       -- "$pattern" src/ public/ index.html 2>/dev/null); then
    hits=$(echo "$matches" | wc -l | tr -d ' ')
    echo "⚠️  Voting-sunset copy still present: \"$pattern\" ($hits occurrences) — Stage 2 sweep pending"
    WARN_COUNT=$((WARN_COUNT + hits))
  fi
done

for pattern in "${TERMINOLOGY_WARN[@]}"; do
  if matches=$(grep -RIn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
       --exclude-dir=docs --exclude-dir=tests \
       --exclude='*.csv' --exclude='*.lock' --exclude='bun.lockb' \
       --exclude='check-banned-strings.sh' \
       --exclude='recognitionArchitecture.ts' \
       --exclude='banned-strings.test.ts' \
       -- "$pattern" src/ public/ index.html 2>/dev/null); then
    echo "❌ Terminology drift (strict): \"$pattern\" — use 'subcategory' or 'tier'."
    echo "$matches"
    FAIL=1
  fi
done

if [ "$FAIL" -eq 1 ]; then
  echo ""
  echo "Banned string check FAILED — update legacy date ranges to '2006–2026'."
  exit 1
fi

if [ "$WARN_COUNT" -gt 0 ]; then
  echo ""
  echo "ℹ️  $WARN_COUNT copy occurrences remain (warn-only)."
fi

echo "✅ Banned-string check passed (strict rules)."
