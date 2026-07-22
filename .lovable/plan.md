
# NESA-Africa NRC Arena + Judges Arena Refactor

This is a large, multi-phase refactor. To keep it shippable I'll break it into
5 phases you can approve one at a time. Phase 1 gets the visual/structural
foundation live using the six uploaded dashboard mocks as the design source of
truth; later phases wire data, automation and handover.

## Design source of truth
The six uploaded mocks (Secure Judges Chat Rooms, Literary & New Curriculum
Advocate Icon, Secure Judges Result Chat Room, General Voting Results Arena,
Pathway Vote Results, Judges Arena sidebar) become the canonical layout for
**both** arenas — same navy `#0A1A3F` shell, gold `#D4A84B` accents, left rail
with brand seal, top identity chip with "Voting Live" / "Voting Closed"
status, 4- or 5-card KPI strip, 3-column workspace body.

## Phase 1 — Shared shell + Judges landing dashboards (this turn)

1. **`ArenaShell`** — extract the layout in the mocks into
   `src/components/arena/ArenaShell.tsx` (sidebar, header with Workspace ▼,
   alerts, profile chip, footer integrity strip). Reused by both arenas.
2. **`WorkspaceSwitcher`** — upgrade the existing switcher to only show
   authorised workspaces (NRC / Judges / Governance / Admin) based on
   `useAuth().roles`. Never grants a role.
3. **Judges landing dashboards** — refactor `/judges`, `/judges/dashboard`,
   `/judges-arena`, `/judges/pathways/:slug`, `/judges/results`,
   `/judges/chat-rooms` to render the mock layouts (KPI strip + pathway
   trio + chat room grid + results leaderboard). Existing data hooks kept.
4. **NRC public landing `/nrc`** — mirror Judges landing with NRC identity
   ("Verification • Research • Evidence • Dossier • Handover").

## Phase 2 — NRC Arena routes (22 pages)

Wire every route in your spec under `ArenaShell` with real navigation:

```
/nrc  /nrc/sign-in  /nrc/onboarding  /nrc/dashboard  /nrc/profile
/nrc/directory  /nrc/teams  /nrc/teams/:slug
/nrc/cases  /nrc/cases/:id  /nrc/evidence  /nrc/duplicates
/nrc/endorsements  /nrc/handover/judges  /nrc/handover/governance
/nrc/reports  /nrc/audit-log  /nrc/automation
/nrc/profile/:reference
```

Dashboard header renders the identity block (photo, NRC ref, tier, category,
region, MFA, notifications) exactly like the Judges header in the mocks.
KPI grid uses the tier-specific card set from your spec.

## Phase 3 — Database (Phase Two schema)

One migration adding: `nrc_profiles`, `nrc_profile_expertise`,
`nrc_appointments`, `nrc_review_teams`, `nrc_team_members`,
`nrc_case_assignments`, `nrc_case_reviews`, `nrc_secondary_reviews`,
`nrc_quality_checks`, `nrc_evidence_items`, `nrc_evidence_versions`,
`nrc_conflict_declarations`, `nrc_reassignments`, `nrc_escalations`,
`nrc_public_endorsements`, `nrc_handoffs`, `nrc_performance_metrics`,
`nrc_notifications`, `nrc_audit_logs`.

Every table gets `GRANT` block + RLS (member sees own + team; lead sees team;
director sees all; judges/governance only see handover artefacts).

## Phase 4 — Automation engine (Phase One)

Edge function `nrc-intake` + tables `nrc_intake_queue`,
`nrc_duplicate_candidates`, `nrc_routing_decisions`, `nrc_auto_flags`.
Runs the 9-step pipeline (validate → dedupe → classify → route → assign)
and produces the `/nrc/automation` dashboard cards from your spec.

## Phase 5 — Handover pipelines

Wire `/nrc/handover/judges` (Icon → locks dossier, notifies 3 pathway
judges — reuses the existing `push_nominee_to_pathway` RPC) and
`/nrc/handover/governance` (non-Icon → governance queue). Judges Arena
receives handover records read-only.

## Out of scope for now
- Real biometric MFA (uses existing Supabase MFA)
- Governance Arena UI (separate track)
- Public Impact Directory rebuild

## Ship order this turn
Phase 1 only — shared shell + Judges dashboards visually aligned to the
mocks + `/nrc` landing. That gives you a reviewable foundation before
touching schema. Reply "go phase 2" (or later) when ready to continue.
