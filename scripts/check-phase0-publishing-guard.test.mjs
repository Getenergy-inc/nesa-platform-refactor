import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateGuard,
  findProtectedChanges,
  isProtectedPagePath,
  validateApprovalRecord,
} from "./check-phase0-publishing-guard.mjs";

const FULL_REVISION = "a".repeat(40);

function approvedRecord() {
  return {
    status: "APPROVED",
    evidencePackVersion: "phase0-evidence-2026-11-13-v1",
    recoveryRevision: FULL_REVISION,
    independentSecuritySignOff: {
      reviewer: "Named Independent Reviewer",
      independenceConfirmed: true,
      evidenceReference: "restricted/phase0/security-sign-off.pdf",
      signedAtUtc: "2026-11-13T08:00:00Z",
    },
    writtenPhase0Approval: {
      approver: "Named Management Approver",
      exactMessage: "Phase 0 approved",
      evidenceReference: "restricted/phase0/management-approval.pdf",
      approvedAtUtc: "2026-11-13T08:05:00Z",
    },
  };
}

test("protects governance, judges and NRC page surfaces", () => {
  const protectedPaths = [
    "src/pages/GovernancePage.tsx",
    "src/pages/Judges.tsx",
    "src/pages/judges/JudgePanel.tsx",
    "src/pages/judges-arena/ArenaReview.tsx",
    "src/pages/nrc/NRCMembers.tsx",
    "src/components/governance/StageGate.tsx",
    "src/components/judges/MeetOurJudges.tsx",
    "src/features/iconJudges/IconJudgeGate.tsx",
  ];
  for (const filePath of protectedPaths) {
    assert.equal(isProtectedPagePath(filePath), true, filePath);
  }
  assert.deepEqual(findProtectedChanges(["src/App.tsx", ...protectedPaths]), protectedPaths.sort());
});

test("does not hold unrelated files or bypass the hold with no protected diff", () => {
  const result = evaluateGuard(["src/pages/About.tsx", "docs/phase0/security-findings.md"], null, "missing record");
  assert.deepEqual(result.protectedChanges, []);
  assert.deepEqual(result.errors, []);
});

test("fails closed when a protected diff has no readable approval record", () => {
  const result = evaluateGuard(["src/pages/GovernancePage.tsx"], null, "approval record missing");
  assert.deepEqual(result.errors, ["approval record missing"]);
});

test("accepts only a complete approval record for a protected diff", () => {
  const result = evaluateGuard(["src/pages/judges/JudgePanel.tsx"], approvedRecord());
  assert.deepEqual(result.errors, []);
});

test("keeps a BLOCKED status blocked even when approval-shaped fields are populated", () => {
  const record = approvedRecord();
  record.status = "BLOCKED";
  assert.ok(validateApprovalRecord(record).some((error) => error.includes("APPROVED")));
});

test("requires a named independent reviewer, independence confirmation, evidence and UTC time", () => {
  const record = approvedRecord();
  record.independentSecuritySignOff = {
    reviewer: "TBC",
    independenceConfirmed: false,
    evidenceReference: "PENDING",
    signedAtUtc: "13 November 2026",
  };
  const errors = validateApprovalRecord(record).join("\n");
  assert.match(errors, /reviewer must be named/);
  assert.match(errors, /independence must be explicitly confirmed/);
  assert.match(errors, /sign-off evidence reference/);
  assert.match(errors, /sign-off needs an ISO UTC timestamp/);
});

test("requires the exact written Phase 0 approval message and named approver", () => {
  const record = approvedRecord();
  record.writtenPhase0Approval.approver = "TBC";
  record.writtenPhase0Approval.exactMessage = "Phase 0 approved.";
  const errors = validateApprovalRecord(record).join("\n");
  assert.match(errors, /management approver must be named/);
  assert.match(errors, /must be exactly "Phase 0 approved"/);
});

test("requires the written approval evidence reference and UTC timestamp", () => {
  const record = approvedRecord();
  record.writtenPhase0Approval.evidenceReference = "";
  record.writtenPhase0Approval.approvedAtUtc = "2026-11-13T08:05:00+01:00";
  const errors = validateApprovalRecord(record).join("\n");
  assert.match(errors, /written Phase 0 approval evidence reference/);
  assert.match(errors, /approval needs an ISO UTC timestamp/);
});

test("requires a reviewed evidence-pack version and exact full recovery revision", () => {
  const record = approvedRecord();
  record.evidencePackVersion = "TBC";
  record.recoveryRevision = "main";
  const errors = validateApprovalRecord(record).join("\n");
  assert.match(errors, /evidence-pack version/);
  assert.match(errors, /full 40- or 64-character Git commit hash/);
});
