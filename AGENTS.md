# Architecture rules

- Keep PDF-backed research pathways in a presentation-only registry; legacy taxonomy, nomination keys and eligibility remain authoritative to avoid reclassifying existing nominations.
- Stage research manifests in the existing private import review queue with source page/row and exact normalized-name/category/pathway deduplication; never publish candidates from research imports.
- Use the existing canonical nomination-window constants in category metadata so dates cannot drift between shared pages.
- Serve original research PDFs through asset pointers and expose private source claims only in the protected review queue; public pages cite the supplied source documents without publishing staged candidates.
- Keep clean-database restore tooling in `migration-tools/`; use disposable or explicitly empty isolated databases, atomic migration runs and honest nonzero results for any migration failure or schema drift.
- Keep school-intervention CTAs separate from award nomination and centralised in the school-support registry; public school support fails closed without explicit verification and publication approval to avoid treating nominations as beneficiaries.
- Keep public gala scope in the shared programme presentation configuration backed by English translations; never derive legacy eligibility or certificate-release rules from event copy.
- Keep public desktop/mobile menus and sign-in destination choices in the canonical site-navigation registry; existing route guards and stored roles remain authoritative so navigation never grants workspace access.
- Use Radix menubar/dropdown primitives for grouped desktop header menus and Radix accordion/dialog primitives for mobile; delegate arrow navigation, Escape and modal focus management to them to avoid inconsistent keyboard behaviour.