# Phase 0 security-clearance checklist

Prepared: 12 November 2026 (UTC). Target from the recovery brief: 15 November 2026; the target is not permission to proceed.

**Overall status: BLOCKED — not cleared.** This checklist records requirements and existing reports, not new security verification. No application code, installs, builds, browser tests, credential rotations or deployments were performed for this document.

## Tracking rules

- Statuses: **Reported** = evidence exists but has not been accepted for clearance; **Partial** = incomplete evidence; **Blocked** = an external approval/access/input is needed; **Not verified** = no adequate evidence. Mark **Accepted** only after a named reviewer signs a specific evidence entry.
- Every row needs an assigned person's name, evidence ID/location, UTC verification time, exact revision/environment, reviewer and review outcome. Role names below are proposed responsibilities, not appointed people. All named assignments remain **TBC**.
- Store sensitive evidence in an approved restricted location. This checklist contains references and redacted summaries only, never credentials, tokens, private records or children's information. Internal Cloud identifiers belong only in restricted evidence.
- Any failed or unverified required check keeps clearance blocked. No silent acceptance, inferred safety from commit messages, or unchecked boxes treated as complete.
- Do not execute suspect payloads to investigate them. Containment changes and isolated recovery tests require separate explicit authorisation and independent review; this checklist does not authorise them or ordinary application execution.

## A. Ownership, scope and recovery inventory

| ID | Required check | Current status / evidence | Evidence needed for acceptance | Accountable role |
|---|---|---|---|---|
| P0-01 | Name developer, independent security reviewer, QA testers, incident owner, repository owners and production approver | Blocked — names not supplied | Written role assignments, authorised scope and reviewer independence; approval channel and responsible backup owner | Management |
| P0-02 | Record project, feature branch, exact revision and staging/production boundaries | Partial — [recovery inventory](recovery-inventory.md) records audited branch/revision and preview | Dated revision/branch record; source ownership; staging URL; explicit boundary diagram. Preview currently shares production Cloud: do not label it isolated | Developer / incident owner |
| P0-03 | Inventory all branches in both GitHub repositories, last commits, authors and divergence | Partial — [GitHub evidence](github-evidence.json); some comparisons unverified | Complete branch list with revisions, authors, timestamps and reproducible comparisons; resolve unverified rows and record collection limits | Repository owner |
| P0-04 | Inventory dependency manifests, lockfiles, functions and environment variable names | Partial — [static evidence](static-evidence.json), [recovery inventory](recovery-inventory.md) | Complete dated inventory for both repositories and local source; lockfile parity decision; function entrypoints and deployed parity; environment names only and restricted Cloud-binding evidence | Developer / Cloud owner |

## B. Repository security and containment

| ID | Required check | Current status / evidence | Evidence needed for acceptance | Accountable role |
|---|---|---|---|---|
| P0-05 | Review collaborators and access authority | Blocked — public collaborator queries returned 401 | Authenticated owner export/review of collaborators, teams, invitations, tokens/deploy keys, integrations and access scope; document unknown or revoked access without attributing wrongdoing from commit authors | Repository owner |
| P0-06 | Review force-pushes, suspicious changes and audit history | Not verified — public commit history only | Owner audit-log evidence covering the incident period, force-push/deletion events and relevant merges; explain any unavailable retention/history | Repository owner / security reviewer |
| P0-07 | Preserve and assess obfuscated startup payloads | Reported — root/backend `init` hashes in [security findings](security-findings.md) | Restricted evidence archive with hashes, provenance and collection times; independent static assessment; authorised containment diff and proof affected startup paths no longer invoke payloads | Incident owner / security reviewer |
| P0-08 | Contain hidden editor tasks and executable fake fonts | Reported — auto-run task/settings and `.orc` payload identified | Preserved hashed evidence; approved removal/quarantine diff; independent review of task/settings, adjacent files and every equivalent execution path; do not execute the font payload | Developer / security reviewer |
| P0-09 | Review install hooks, unfamiliar dependencies and lockfile consistency | Partial — install-script flags found; no dependencies installed | Static review of direct/transitive package provenance, unfamiliar/low-download packages, advisories, lifecycle scripts and lockfile differences; justified allow/reject decisions with source/revision references | Security reviewer |
| P0-10 | Check hard-coded keys and frontend privilege secrets | Partial — narrow pattern scan only; not a clean bill of health | Restricted current-tree and history secret-scan report including client output scope and encoded-file limits; resolve every finding; no service-role/private credential in frontend; scan evidence never contains secret values | Security reviewer / Cloud owner |
| P0-11 | Review unknown outbound domains and integrations | Partial — 83 source hosts inventoried; runtime traffic unverified | Approved-domain register with purpose, source paths, ownership and decisions on unfamiliar hosts; independently reviewed encoded-path limits. Any runtime check must use a separately authorised safe environment | Security reviewer |
| P0-12 | Approve one clean recovery source and protected branch | Blocked — candidate recommended, not certified clean | Independent full-tree/history/dependency review of the candidate revision; written selection of one baseline and feature/staging branch; provenance and selective-reapplication plan for newer changes | Management / security reviewer |
| P0-13 | Verify branch protections, required review and secret scanning | Partial — public APIs reported unprotected branches; rulesets unknown | Authenticated effective ruleset/protection evidence: restricted pushes, no force-push, required independent review and supported secret scanning; document enforcement scope and approved post-containment test gates | Repository owner |

## C. Lovable Cloud access and privacy review

Historical counts below describe the existing report, not current clearance. Refresh dated catalogue evidence when the authorised reviewer performs acceptance.

| ID | Required check | Current status / evidence | Evidence needed for acceptance | Accountable role |
|---|---|---|---|---|
| P0-14 | Inventory every application table, grants and row-level protection | Reported — 193 public tables, none without RLS in prior catalogue | Complete dated table/grant/policy inventory; explicit access decisions for public/member/privileged roles; review any disabled or missing protection. RLS enabled alone is not proof of safe access | Cloud owner / security reviewer |
| P0-15 | Review unconditional policy expressions and sensitive public exposure | Partial — 36 unconditional expressions flagged | Policy-by-policy purpose and effective-grant review; data-sensitivity assessment beyond column-name scans; approved remediation or justified access decision; authorised evidence that private records cannot be read publicly | Cloud owner / security reviewer |
| P0-16 | Verify role-definition and volunteer-badge publication scope | Not verified — findings remain open | Current live policies/grants and explicit approved-public versus future/internal distinction; authorised public/member/approver access checks. Do not dismiss these findings merely because some labels may be public | Cloud owner / security reviewer |
| P0-17 | Review privileged functions and anonymous execution | Partial — 94 SECURITY DEFINER functions, 49 anonymous-executable; configured search paths | Live function-body and grant review, caller/role checks and escalation/enumeration decisions for each exposed function; safe authorised validation evidence. Do not invoke mutation functions during read-only audit | Cloud owner / security reviewer |
| P0-18 | Inventory every bucket and storage policy | Partial — six buckets, three public; NRC evidence access appears role-wide | Dated bucket visibility and underlying storage RLS/policy/grant inventory; private evidence ownership/assignment review; approved public-media consent/access decisions; authorised access evidence for private files | Cloud owner / safeguarding reviewer |

## D. Credentials, backups and rollback

| ID | Required check | Current status / evidence | Evidence needed for acceptance | Accountable role |
|---|---|---|---|---|
| P0-19 | Produce management-owned credential rotation plan | Reported — [rotation checklist](rotation-checklist.md); no rotations performed | Owner-signed exposure/scope assessment and sequence covering Cloud keys/signing, database credentials, SMTP, Google APIs, GitHub access and Lovable integrations plus affected providers; credential names only. Platform-managed private credentials are not user-accessible | Incident owner / service owners |
| P0-20 | Record separately authorised credential actions, if needed | Blocked — no exposure decision or change authorisation | Written owner decision for each group; approved maintenance/change record and safe verification plan. Do not rotate during the audit; any later authorised replacement needs invalidation and connectivity evidence, without secret values | Service owners |
| P0-21 | Confirm dated full database and authentication backup | Blocked — 8 November migration package is metadata/schema evidence only | Authorised full database/Auth export reference, UTC timestamp, source identity in restricted record, coverage manifest/checksums, encryption/access controls, responsible owner and retention. Explicitly identify any platform export limitations | Backup owner |
| P0-22 | Confirm dated storage-file backup | Blocked — bucket inventory is not a binary-file backup | Complete authorised object backup, paths/object metadata and checksums; reconcile object count/size with source; include private buckets in restricted storage; record failures and backup time | Backup owner |
| P0-23 | Prove isolated rollback readiness | Blocked — historical 169-migration report is not full rollback evidence | Separately authorised disposable/isolated recovery environment, restore log, manifest/schema comparison, record coverage and Auth/storage integrity checks, safe access tests, recovery duration, failures and independent sign-off; no writes to shared production Cloud | Backup owner / QA / security reviewer |

## E. Evidence pack and written gate

| ID | Required check | Current status / evidence | Evidence needed for acceptance | Accountable role |
|---|---|---|---|---|
| P0-24 | Complete required reports and evidence index | Reported — inventory, findings, rotation checklist and JSON evidence exist | Reviewed versions of all required reports; evidence ledger below links each row to its artefact; dated documentation/change log; explicitly state which checks were not run and why | Developer / security reviewer |
| P0-25 | Track open findings and management decisions | Partial — [open decisions](../OPEN_DECISIONS.md) and [roadmap](../../roadmap.md) | Finding-by-finding disposition with owner, severity/impact, remediation evidence and reviewer outcome; programme conflicts preserved for later content approval, not silently resolved. Distinguish security blockers from later programme inputs | Incident owner / management |
| P0-26 | Record independent clearance and exact written phase approval | Blocked — no clearance or written approval recorded | Accepted P0-01–P0-25 evidence, named independent security sign-off and management's exact **“Phase 0 approved”** message referencing the evidence-pack version and recovery revision; explicitly state permission for the next phase only | Security reviewer / management approver |

## Evidence ledger — complete one row per artefact/review

This ledger starts empty deliberately: existing reports are not retroactively signed off.

| Evidence ID | Check ID(s) | Restricted artefact or redacted report link | Revision / environment | Collected by / UTC | Reviewed by / UTC | Outcome and unresolved limits |
|---|---|---|---|---|---|---|
| TBC | TBC | TBC | TBC | TBC | TBC | Not reviewed |

## Finding closure record — repeat per finding

- Finding/check ID: TBC
- Named owner and target date: TBC
- Evidence of impact and affected scope: TBC
- Separately approved containment/remediation reference: TBC
- Preserved original evidence and reviewed replacement revision: TBC
- Validation method/result and limitations: TBC
- Independent reviewer, UTC date and outcome: TBC
- Remaining blocker or management decision: TBC

## Written approval record

Do not pre-fill signatures or mark this approved because a plan was accepted.

- Evidence-pack version and date: TBC
- Accepted checklist rows and evidence ledger reference: TBC
- Cleared recovery repository, branch and exact revision: TBC
- Safe staging boundary and backup/rollback evidence IDs: TBC
- Named independent security reviewer, sign-off reference and UTC time: TBC
- Named management approver and authority: TBC
- Exact written message: **Pending — must be “Phase 0 approved”**
- Approval source/reference and UTC time: TBC
- Authorised next-phase scope and remaining non-security decisions: TBC

**Approval does not authorise production publishing, deployment or merging.** Every later phase requires its own written approval; production release additionally requires the named production approver. A new suspect change, material environment drift or evidence invalidation reopens the affected checks and blocks execution pending renewed review.

## Immediate blockers

1. Appoint the responsible people and authorise containment independently of this checklist.
2. Obtain authenticated repository-owner evidence and complete dependency/secret/domain review.
3. Remove or isolate confirmed execution hooks through an approved reviewed change and certify the recovery source.
4. Finish live access-policy/function/storage review, retaining the public-reference findings until verified.
5. Obtain full database/Auth/storage backups and independently reviewed isolated rollback evidence.
6. Complete the evidence ledger, independent clearance and exact written phase approval.

Official school forms, EduAid project access, regional mapping and voting rules remain later programme dependencies; they do not substitute for security clearance.