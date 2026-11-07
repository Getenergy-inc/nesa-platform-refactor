# Architecture rules

- Keep PDF-backed research pathways in a presentation-only registry; legacy taxonomy, nomination keys and eligibility remain authoritative to avoid reclassifying existing nominations.
- Stage research manifests in the existing private import review queue with source page/row and exact normalized-name/category/pathway deduplication; never publish candidates from research imports.
- Use the existing canonical nomination-window constants in category metadata so dates cannot drift between shared pages.
- Serve original research PDFs through asset pointers and expose private source claims only in the protected review queue; public pages cite the supplied source documents without publishing staged candidates.
- The NESA-Africa 2026 Master Document and 2 Nov 2026 brief override older `/docs` files; conflicting docs carry a SUPERSEDED banner and `docs/refactor/audit-2026-11.md` lists remaining code conflicts, so legacy docs are never used as requirements.
- Keep `scripts/check-startup-integrity.sh` and `src/test/startup-integrity.test.ts` passing; they block the start-up loader, editor auto-run and fake-font patterns that were maliciously injected twice.
- Missing approved content renders a visible "CONTENT REQUIRED" placeholder and is tracked in `docs/content-required.md`, so nothing is invented.
- Public award totals remain approved presentation constants rather than legacy catalogue aggregates; live operational statistics cannot overwrite them.
- Social-preview metadata must not default to missing image files; omit unspecified images so hosting can supply its preview, retaining explicit page images only when available.
- Role and volunteer-badge catalogues use an administrator-controlled publication flag with private defaults and approval-scoped public reads; assignments remain independently protected.
