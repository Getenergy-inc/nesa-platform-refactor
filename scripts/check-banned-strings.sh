#!/usr/bin/env bash
# Fails if banned legacy strings appear in source code.
# CSV/data dumps under src/data are excluded (historical records).
set -euo pipefail

# Legacy date ranges
BANNED=(
  "2005–2025"
  "2005-2025"
  "2005 to 2025"
  "2006–2025"
  "2006-2025"
)

# Voting sunset (2026 policy: no public award voting)
# Enforced only in user-facing UI copy — code paths gated by
# PUBLIC_AWARD_VOTING flag are allowed to reference these identifiers.
VOTING_BANNED=(
  "Vote Now"
  "Vote with AGC"
  "Trending Nominees"
)

FAIL=0
for pattern in "${BANNED[@]}"; do
  if matches=$(grep -RIn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
       --exclude-dir=docs --exclude='*.csv' --exclude='*.lock' --exclude='bun.lockb' \
       --exclude='check-banned-strings.sh' \
       -- "$pattern" src/ public/ index.html 2>/dev/null); then
    echo "❌ Banned string found: \"$pattern\""
    echo "$matches"
    echo ""
    FAIL=1
  fi
done

for pattern in "${VOTING_BANNED[@]}"; do
  # Voting copy — skip archived pages under src/pages/vote and VoteWithAGC page shell
  if matches=$(grep -RIn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
       --exclude-dir=docs --exclude-dir='src/pages/vote' \
       --exclude='*.csv' --exclude='*.lock' --exclude='bun.lockb' \
       --exclude='check-banned-strings.sh' --exclude='featureFlags.ts' \
       --exclude='Vote.tsx' --exclude='VoteWithAGC.tsx' \
       --exclude='VoteWithAGCSection.tsx' \
       -- "$pattern" src/ public/ index.html 2>/dev/null); then
    echo "❌ Voting-sunset banned string found: \"$pattern\""
    echo "$matches"
    echo ""
    FAIL=1
  fi
done

if [ "$FAIL" -eq 1 ]; then
  echo "Banned string check FAILED."
  echo "  - Date ranges: update to '2006–2026'."
  echo "  - Voting copy: 2026 has no public award voting — remove or gate behind PUBLIC_AWARD_VOTING."
  exit 1
fi

echo "✅ No banned strings found."
