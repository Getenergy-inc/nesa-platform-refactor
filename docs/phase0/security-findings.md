# Phase 0 security findings

Date: 12 November 2026 (UTC). Status: **NOT CLEARED — repository-security incident remains open**.

## Confirmed static findings

| Finding | Evidence | Required action before execution |
|---|---|---|
| Obfuscated startup code | Root `init` and `backend/init` contain a large encoded payload and dynamic execution machinery. Both SHA-256: `027facdd9137c6bf68f95cfe9ea8a9947ec832ea2ad513000505f6921636dee3`. | Preserve evidence; isolate and independently review/remove the hooks in an approved recovery change. Do not execute to discover behaviour. |
| Startup scripts invoke the payload | Root `dev`, `build`, `build:dev`; backend `dev`, `build`, `start` call `node init`. | Block these commands until security clearance. |
| Hidden editor execution | `.vscode/tasks.json` runs Node against `fa-brand-400.orc` on folder open and hides output. `.vscode/settings.json` allows automatic tasks. | Disable auto-execution in the approved containment change; inspect contributor tooling. |
| Executable masquerading as a font | `src/pages/nominees/lib/__tests__/public/fonts/fa-brand-400.orc` contains obfuscated JavaScript, not a font. SHA-256: `f8be8d20300064fb0b1a8ea88e7013c16503af934a73eb73eab209837c3b61bf`. | Quarantine; do not load with Node or an editor task. Adjacent assets require provenance review. |
| Misleading commit description | Local history includes `efffbfa8` titled “Removed harmful startup code”; its merge diff adds the hooks and font-directory payload. | Do not infer safety from commit messages or earlier completion summaries. Audit actual trees and merge parents. |
| Public branches unprotected | GitHub branch API reports `protected: false` for all nine branches in Santos-pkis/NESA-2026 and all 21 in Getenergy-inc/nesa-platform-refactor. | Management must enable protected recovery/release branches, required independent review and secret scanning. Ruleset-level protections remain unverified. |
| No proven complete backup | Existing 8 November package explicitly lacks production records, authentication export and storage-file contents. | Obtain and test authorised full backup before clearance. |

These findings establish suspicious execution paths, not proof of exfiltration, attribution or the time of compromise. No payload was executed or decoded into runnable code.

## Live Cloud access-control inventory

Read-only catalogue queries succeeded. Cloud is active. No changes were made.

- 193 public application tables; **0 without RLS**.
- 451 public policies; **36** contain an unconditional `USING true` or `WITH CHECK true` expression.
- 94 public SECURITY DEFINER functions; 49 are executable by `anon`; all 94 have a configured search path.
- Six storage buckets: three public (`contributor-photos`, `nominee-media`, `gallery-media`) and three private (`nomination-evidence`, `database_export_14_07_26`, `nominee-videos`). No public/storage base table without RLS was returned.
- Storage policies expose the three public media buckets and restrict private evidence/video access by ownership and NRC/admin roles. NRC evidence access is role-wide, not assignment-scoped, in the observed storage policies; review against the new least-privilege brief.
- An information-schema query found no email/phone/token/password/secret/identity/score/conflict-named column in the tables with unconditional public SELECT policies. This narrow naming check is **not** proof that those tables contain no personal data.
- Unconditional INSERT policies include bulk-order leads, certificate-verification events, judge/NRC applications, partnership leads, misuse reports, nomination events, renominations and sponsor clicks. Confirm grants, validation, spam protection and business intent; unconditional expressions are not automatically vulnerabilities.
- Anonymous EXECUTE on privileged-sounding functions such as `approve_nominee_revision`, `export_nomination_batch` and `check_email_exists` requires inspection of the **live function bodies** and role checks. No mutation RPCs were called; privilege escalation or enumeration is not established by an ACL alone.
- Role-description and volunteer-badge public-read findings must remain open until approval-scoped exposure is verified; do not dismiss them because reference labels can legitimately be public.

## Dependency and outbound-domain limits

Multiple root lockfiles exist (`bun.lock`, `bun.lockb`, `package-lock.json`). Package-lock install-script flags name @swc/core, core-js, esbuild, fsevents and nested esbuild. These are flags for review, not a malware verdict. No dependencies were installed; package popularity, advisories, transitive script contents and lockfile parity remain unverified.

Static source scanning identified 83 URL hosts, including test/example hosts, citation URLs, image sources, social links and service endpoints. Presence in source is not proof of a network request. See `static-evidence.json` for paths; encoded payload destinations and actual outbound activity remain unknown.

A narrow static credential-pattern scan found no AWS-access-key, GitHub-token or PEM-private-key-shaped literal. It does not certify absence of secrets: JWT/service-role literals, encoded values, history and all credential formats require dedicated scanning after containment. Environment **names only** were recorded; no values, user records or tokens were exported.

## Verification and stop gate

Performed: source-file reads and hashes; read-only Git history; public GitHub branch/tree/manifest requests; Cloud catalogue/ACL queries; archive entry/report inspection.

Not performed: install, application execution, build, tests, browser navigation, payload execution, credential rotation, database writes, storage downloads, deploy, merge or publish. Existing externally managed preview processes were not restarted or claimed stopped.

**Phase 0 is blocked.** Required: approved containment change, authenticated repository-owner audit, named security/release reviewers, full backup and rollback evidence, and written management clearance. Do not proceed to Phase 1 solely because reports exist.