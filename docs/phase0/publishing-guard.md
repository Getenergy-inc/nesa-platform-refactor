# Phase 0 protected-page publishing guard

**Current status: BLOCKED.** Governance and judges page changes cannot pass the guard until independent security sign-off and the exact written message **“Phase 0 approved”** are recorded with evidence.

## Enforcement

- `npm run guard:phase0` checks committed, staged, unstaged and untracked changes against the recovery baseline. Use `--base <revision>` to select the comparison base explicitly.
- The existing `prebuild` command runs the guard first, so a protected diff with missing or invalid approval evidence fails before the application build starts.
- The **Phase 0 Protected Pages Guard** GitHub workflow runs the same check for pull requests and pushes to `main`, without installing dependencies or executing application code.
- Unrelated files do not trigger this specific guard. All other security, review and production-release holds still apply.

Protected paths are the governance and Judges pages, judges and judges-arena route folders, NRC pages, and their dedicated governance/judge/NRC components. The authoritative path list is in `scripts/check-phase0-publishing-guard.mjs`.

## Recording clearance

The machine-readable record is `phase0-approval.json`. Do not populate it with assumed names, dates, evidence references or revisions.

1. Complete and independently accept the required Phase 0 checks in `security-clearance-checklist.md`, including its evidence ledger.
2. Record the reviewed evidence-pack version and full cleared recovery commit hash.
3. Under `independentSecuritySignOff`, record the named reviewer, explicit independence confirmation, restricted or redacted evidence reference, and actual UTC sign-off time.
4. Under `writtenPhase0Approval`, record the named management approver, the exact message `Phase 0 approved`, its source evidence reference, and actual UTC approval time.
5. Change `status` to `APPROVED` only after both evidence entries exist. Missing files, malformed JSON, placeholders, incomplete fields, non-UTC timestamps, a shortened revision, or any wording variation fail closed.

Example command for a pull-request-style comparison:

```sh
node scripts/check-phase0-publishing-guard.mjs --base origin/main
```

Run the focused guard tests with:

```sh
node --test scripts/check-phase0-publishing-guard.test.mjs
```

## Control limits

The guard validates the recorded evidence fields; it does not authenticate restricted artefacts or replace reviewer due diligence. Repository administrators must make the workflow a required status check and retain independent review/branch protections. Phase 0 clearance authorises only its stated next-phase scope: it is not production publishing, deployment or merge approval.
