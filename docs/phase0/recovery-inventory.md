# Phase 0 recovery inventory

Date: 12 November 2026 (UTC). Status: **REPORTS COMPLETE; SECURITY CLEARANCE BLOCKED**.

## Local project

- Audit branch: `edit/edt-2f9efc10-1577-4415-9ce4-a8426689d245`.
- Audited revision: `71d4e563ce122c836b5a3b37b37672337fbb89d3`.
- Local main: `06b14ced40c07603d77fd5f6a76d06a4395b2bac`; current branch is one commit ahead, zero behind.
- Preview: https://id-preview--0dccfe96-032e-496e-82bd-c8af7c5b9e55.lovable.app
- Preview and published app share one active Lovable Cloud instance; it is **not an isolated backend staging environment**. No backend writes or production changes were made.
- Root stack: React/Vite/TypeScript/Tailwind/shadcn; backend/ contains an Express scaffold and is not authorised hosting parity.
- Root lockfiles: bun.lock, bun.lockb, package-lock.json. Frontend manifest has no postinstall entry, but dev/build call suspect init; backend dev/build/start do likewise.
- 169 migration files; 38 local Edge Function index.ts entrypoints. _shared has no index.ts. Local files do not prove deployed function parity.

## GitHub branch inventory

Public API inventory completed for both supplied repositories; no checkout, fetch, merge or execution. Branch protection below is the API branch flag, not a full ruleset audit. Commit authors do not establish collaborator authority.

### Santos-pkis/NESA-2026

| Branch | Revision | Last author | UTC timestamp | Protected | Versus main |
|---|---|---|---|---|---|
| backend/chukwuma-core | `b3bd670b5eeb147e676c2264c890b3d9038fe490` | gpt-engineer-app[bot] | 2026-08-04T21:08:34Z | False | 0 ahead / 3 behind |
| chore/repository-foundation | `f845a3ec4b564eb3849a334718c9a07c33ec4d13` | Ayeromara | 2026-08-13T13:38:27Z | False | 0 ahead / 1 behind |
| data-engineering/lovable-phil-database-merge | `b3bd670b5eeb147e676c2264c890b3d9038fe490` | gpt-engineer-app[bot] | 2026-08-04T21:08:34Z | False | 0 ahead / 3 behind |
| data-engineering/phil-database-foundation | `b3bd670b5eeb147e676c2264c890b3d9038fe490` | gpt-engineer-app[bot] | 2026-08-04T21:08:34Z | False | 0 ahead / 3 behind |
| database/lovable-supabase | `b3bd670b5eeb147e676c2264c890b3d9038fe490` | gpt-engineer-app[bot] | 2026-08-04T21:08:34Z | False | 0 ahead / 3 behind |
| frontend/lovable-latest | `b3bd670b5eeb147e676c2264c890b3d9038fe490` | gpt-engineer-app[bot] | 2026-08-04T21:08:34Z | False | 0 ahead / 3 behind |
| integration/nesa-africa-2027-foundation | `b3bd670b5eeb147e676c2264c890b3d9038fe490` | gpt-engineer-app[bot] | 2026-08-04T21:08:34Z | False | 0 ahead / 3 behind |
| main | `7ed6389a755a986ceafb812fd57b575b47bc13ef` | Santos-pkis | 2026-08-13T13:55:35Z | False | main |
| staging | `b3bd670b5eeb147e676c2264c890b3d9038fe490` | gpt-engineer-app[bot] | 2026-08-04T21:08:34Z | False | 0 ahead / 3 behind |

Collaborator API: HTTP 401; authenticated owner review needed. Force-push/audit-log history unverified. Dependency manifests, lockfile locations and function paths are recorded in github-evidence.json.

### Getenergy-inc/nesa-platform-refactor

| Branch | Revision | Last author | UTC timestamp | Protected | Versus main |
|---|---|---|---|---|---|
| isaiah2 | `dada48180b0f11e923174b8af909f3ef8f9d4164` | Ayeromara | 2026-04-07T10:48:42Z | False | 1 ahead / 4592 behind |
| lovable-deploy | `2569beaf9b77b7f43193d10a6755b5a5045b7723` | gpt-engineer-app[bot] | 2026-05-23T10:55:27Z | False | 1 ahead / 3819 behind |
| lovable-sync | `48772cec5ef921e3c3af7abbd8429669efa334b7` | gpt-engineer-app[bot] | 2026-11-07T17:34:59Z | False | 52 ahead / 5 behind |
| lovable-sync-1794150441 | `efffbfa8fa2e52cdd9b816427bbaf71f6af1cf9c` | gpt-engineer-app[bot] | 2026-10-25T10:39:34Z | False | 1 ahead / 5 behind |
| lovable-sync-1794151480 | `08f0326b999ff9292c56dc4ec374a6c078a940bd` | gpt-engineer-app[bot] | 2026-11-08T15:24:19Z | False | 40 ahead / 5 behind |
| lovable-sync-1794152062 | `2ace4c568dfaa632f1fa4ffa870fb4b4dae92e24` | gpt-engineer-app[bot] | 2026-11-08T15:34:02Z | False | 47 ahead / 5 behind |
| lovable-sync-1794152550 | `66021d594d0bf23729c2d08c376bb6643df4f783` | gpt-engineer-app[bot] | 2026-11-08T15:42:09Z | False | 49 ahead / 5 behind |
| lovable-sync-1794152846 | `6d15249f05bbfcc13550343aabbe948cc331f41a` | gpt-engineer-app[bot] | 2026-11-08T15:47:05Z | False | 56 ahead / 5 behind |
| lovable-sync-1794153187 | `982ff116db6612a79b71934fe5a8ed6d12c95bac` | gpt-engineer-app[bot] | 2026-11-08T15:52:47Z | False | 67 ahead / 5 behind |
| lovable-sync-1794207814 | `6f7ff253bbba5a82eae884e0a45441ada39b2e7a` | gpt-engineer-app[bot] | 2026-11-09T07:03:12Z | False | 69 ahead / 5 behind |
| lovable-sync-1794208999 | `44490fda4f86d2c1ce7b88d5d703a9a85e553c1b` | gpt-engineer-app[bot] | 2026-11-09T07:22:59Z | False | 81 ahead / 5 behind |
| lovable-sync-1794213434 | `23859a7624293231d10c06e969a78ddc45fbc402` | gpt-engineer-app[bot] | 2026-11-09T08:36:52Z | False | 83 ahead / 5 behind |
| lovable-sync-1794214052 | `94adef94a43656a1e3bba6e11e829ae8dd41c71f` | gpt-engineer-app[bot] | 2026-11-09T08:47:12Z | False | 90 ahead / 5 behind |
| lovable-sync-1794214433 | `58a435d6c47d8aabb816e58d3abf55ad455d4af8` | gpt-engineer-app[bot] | 2026-11-09T08:53:31Z | False | 95 ahead / 5 behind |
| lovable-sync-1794215173 | `01c16404134cb7db3cd1f33cc722d54e143ae7f5` | gpt-engineer-app[bot] | 2026-11-09T09:05:52Z | False | unverified |
| lovable-sync-1794222838 | `1194277e2a8f8107fe5ed09f06df6c65965d4ed9` | gpt-engineer-app[bot] | 2026-11-09T11:13:34Z | False | unverified |
| lovable-sync-1794226208 | `06b14ced40c07603d77fd5f6a76d06a4395b2bac` | gpt-engineer-app[bot] | 2026-11-09T12:09:47Z | False | unverified |
| main | `878cd628f3e435b7800cc705d5a0a9872675262c` | gpt-engineer-app[bot] | 2026-11-08T14:58:15Z | False | main |
| preview | `2c6906e3654f719868d56e7738c8fb058bec0fa9` | mesha-transfergratis | 2026-07-06T12:22:01Z | False | unverified |
| user/chukwuma | `6fa4e1c3d6112845dec7c614e0745612ce4ea450` | Ayeromara | 2026-05-18T10:17:57Z | False | unverified |
| user/isaiahh | `16ff99b4703f911f8c1d8cbeb2b863810be9aca5` | gpt-engineer-app[bot] | 2026-05-12T14:56:49Z | False | unverified |

Collaborator API: HTTP 401; authenticated owner review needed. Force-push/audit-log history unverified. Dependency manifests, lockfile locations and function paths are recorded in github-evidence.json.

## Recovery recommendation

Recommend **Santos-pkis/NESA-2026 main at 7ed6389a755a986ceafb812fd57b575b47bc13ef**, recovered into a proposed protected `refactor/2026-gala` staging branch, as the **candidate baseline for independent review**. Its publicly read frontend/backend manifests do not call node init and the main tree inventory has no init/editor-task payload path. It predates newer content and is not certified clean: approve after full tree/history/dependency review, then selectively reapply independently reviewed newer changes. Do not replace the working project or discard protected data during this audit.

Getenergy-inc/nesa-platform-refactor main and the local checkout expose the suspect hooks; a “removed harmful startup code” commit title is not sufficient evidence of recovery. Required protections: independent required review, restricted pushes, no force-push, secret scanning and approved test gates only after containment. No branch was created or protections changed.

## Cloud inventory

- Active managed instance; client configuration matches the managed project. Internal project identifiers are intentionally omitted from reports.
- 193 public tables, all RLS enabled; 451 policies; 36 unconditional-expression policies.
- 94 public SECURITY DEFINER functions, 49 anonymous-executable; none missing configured search_path.
- Six buckets: contributor-photos (public), nominee-media (public), gallery-media (public), nomination-evidence (private), database_export_14_07_26 (private), nominee-videos (private).
- Read-only catalogue results contain no user records. Detailed function/ACL evidence remains in sandbox tool results; security review summary is in security-findings.md.

## Environment names only

Frontend file names: VITE_SUPABASE_PROJECT_ID, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_URL. Server references below are source mentions, not proof configured secrets exist:

- LOVABLE_API_KEY
- PAYSTACK_SECRET_KEY
- PUBLIC_APP_URL
- PUBLIC_SITE_URL
- RESEND_API_KEY
- RESEND_FROM
- SITE_URL
- SOPHIA_TRANSLATE_KEY
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_URL
- WHATSAPP_ACCESS_TOKEN
- WHATSAPP_PHONE_NUMBER_ID
- WHATSAPP_VERIFY_TOKEN
- YOUTUBE_CLIENT_ID
- YOUTUBE_CLIENT_SECRET
- YOUTUBE_REFRESH_TOKEN

Available connector lookup returned Gmail only, not authenticated GitHub access; no connections were changed.

## Backup and rollback evidence

The existing dated 8 November migration package reports 169/169 schema migrations and zero differences against that exported snapshot. **That historical report was read, not rerun.** Its manifest explicitly omits production data, authentication export and storage object binaries; the storage inventory is not a file backup. Full current database/Auth backup, storage checksums and tested full rollback are therefore **not verified**. Secure these through the authorised project owner before clearance.

## Delivered and verified

Created recovery-inventory.md, security-findings.md, rotation-checklist.md, static-evidence.json, github-evidence.json and ../OPEN_DECISIONS.md. Updated roadmap and phase-gate memory only. No application files, tables, policies, routes or credentials changed.

Verification: static source and hash checks, read-only local Git refs/history, public GitHub branch/tree/manifests/comparisons, live Cloud catalogue and ACL reads, archive manifest/report reads. No installs, application tests, builds, browser visits, rotations, writes, deployment, merge or publishing. Browser screenshots are not applicable to a documentation-only Phase 0.

## Stop and open gates

STOP. Application execution remains blocked by the confirmed hooks. Need approved containment, authenticated repository-owner audit, full backup and rollback, independent security clearance and named release owners. Latest upload conflicts with earlier approved gala/certificate/criteria/social rules; see OPEN_DECISIONS.md. Only after these gates clear and written **Phase 0 approved** may Phase 1 begin.
