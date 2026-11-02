#!/usr/bin/env bash
# Start-up integrity guard.
#
# Fails if any of the patterns used by the malicious code that was removed
# from this project (Oct/Nov 2026) reappear:
#   - start-up scripts that run `node init` or `node api.js`
#   - `createRequire(import.meta.url)` loaders
#   - editor auto-run tasks (`allowAutomaticTasks`, `.vscode/tasks.json`)
#   - root-level `api.js` / `init.js` files
#   - font files that are not real fonts (fake .woff/.woff2/.ttf/.otf)
#
# The same rules run in vitest: src/test/startup-integrity.test.ts
set -euo pipefail

fail=0

# Patterns are assembled from pieces so this script never matches itself.
P1="node ""init"
P2="node ""api\\.js"
P3="createRequire""\\(import\\.meta\\.url\\)"
P4="allowAutomatic""Tasks"

EXCLUDES=(
  -g '!node_modules/**'
  -g '!.git/**'
  -g '!.lovable/**'
  -g '!docs/**'
  -g '!scripts/check-startup-integrity.sh'
  -g '!src/test/startup-integrity.test.ts'
  -g '!bun.lock' -g '!bun.lockb' -g '!package-lock.json'
)

for pat in "$P1" "$P2" "$P3" "$P4"; do
  if hits=$(rg --hidden -n -e "$pat" "${EXCLUDES[@]}" . 2>/dev/null); then
    echo "::error::Forbidden start-up pattern found: $pat"
    echo "$hits"
    fail=1
  fi
done

for f in .vscode/tasks.json api.js init.js init; do
  if [ -e "$f" ]; then
    echo "::error::Forbidden file present: $f"
    fail=1
  fi
done

# Fake font files: every font must start with a real font signature.
while IFS= read -r -d '' font; do
  sig=$(head -c 4 "$font" | od -An -tx1 | tr -d ' \n')
  case "$sig" in
    774f4646|774f4632|00010000|4f54544f|74727565|74746366) ;; # wOFF wOF2 TTF OTTO true ttcf
    *) echo "::error::Not a real font file: $font (signature $sig)"; fail=1 ;;
  esac
done < <(find . -path ./node_modules -prune -o -path ./.git -prune -o \
  -type f \( -name '*.woff' -o -name '*.woff2' -o -name '*.ttf' -o -name '*.otf' \) -print0)

if [ "$fail" -ne 0 ]; then
  echo "Start-up integrity check FAILED."
  exit 1
fi
echo "Start-up integrity check passed."
