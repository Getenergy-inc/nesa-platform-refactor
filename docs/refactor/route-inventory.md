# Route Inventory (Current)

Auto-extracted from `src/App.tsx` — **367 route entries** (includes existing `<Navigate>` aliases).

Classification lives in [`route-migration-matrix.md`](./route-migration-matrix.md); this file is the raw enumeration used to build that matrix. Bugs found during extraction:

- `App.tsx` contains 3 malformed path values without leading `/`: `discussion`, `nominees`, `nominee/:slug` — fix in Stage 4.

The full list is committed alongside this doc as the source-of-truth snapshot at the start of the refactor. See `docs/refactor/_snapshot-2026-routes.txt`.
