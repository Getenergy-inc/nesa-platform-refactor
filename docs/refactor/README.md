# NESA-Africa 60 → 38 Page Refactor

Stage 1 deliverables (read-only audit — no code changes yet).

| File | Purpose |
|---|---|
| [route-inventory.md](./route-inventory.md) | Every current route in `src/App.tsx` with classification |
| [sitemap-38.md](./sitemap-38.md) | Target 20 core + 18 category public pages |
| [route-migration-matrix.md](./route-migration-matrix.md) | Old → new mapping with redirect type |
| [db-relationship-map.md](./db-relationship-map.md) | Target Supabase spine `cycles → tiers → categories → subcategories` |
| [component-reuse-plan.md](./component-reuse-plan.md) | Which existing components become the reusable spine |
| [implementation-sequence.md](./implementation-sequence.md) | 9-stage plan with entry/exit criteria |

**Approved plan:** `.lovable/plan.md`.

## Guardrails (all stages)
- No destructive schema drops until Stage 9 sign-off. All migrations additive.
- Every removed URL gets a 301 redirect entry — never a hard 404.
- Terminology: `pathway` → `subcategory`. Enforced via CI banned-strings.
- No public award voting in 2026 UI. Wallet earn/spend retained for non-award utility.
- Icon Jury (27 judges) scoped to `africa-education-icon` tier only.
