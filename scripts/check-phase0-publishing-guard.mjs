#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const APPROVAL_RECORD = "docs/phase0/phase0-approval.json";

const PROTECTED_FILES = new Set([
  "src/pages/GovernancePage.tsx",
  "src/pages/Judges.tsx",
]);

const PROTECTED_PREFIXES = [
  "src/pages/governance/",
  "src/pages/judges/",
  "src/pages/judges-arena/",
  "src/pages/nrc/",
  "src/components/governance/",
  "src/components/judge/",
  "src/components/judges/",
  "src/components/nrc/",
  "src/features/iconJudges/",
];

const PLACEHOLDERS = new Set(["", "TBC", "PENDING", "CONTENT REQUIRED", "N/A"]);
const UTC_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const GIT_REVISION = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i;

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

export function isProtectedPagePath(filePath) {
  const normalized = normalizePath(filePath);
  return PROTECTED_FILES.has(normalized)
    || PROTECTED_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function findProtectedChanges(changedFiles) {
  return [...new Set(changedFiles.map(normalizePath))]
    .filter(isProtectedPagePath)
    .sort();
}

function hasRecordedValue(value) {
  return typeof value === "string" && !PLACEHOLDERS.has(value.trim().toUpperCase());
}

function hasUtcTimestamp(value) {
  return typeof value === "string"
    && UTC_TIMESTAMP.test(value)
    && !Number.isNaN(Date.parse(value));
}

export function validateApprovalRecord(record) {
  const errors = [];

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return ["Approval record must be a JSON object."];
  }

  if (record.status !== "APPROVED") {
    errors.push('Approval status must be exactly "APPROVED"; the current security hold remains in force.');
  }
  if (!hasRecordedValue(record.evidencePackVersion)) {
    errors.push("A reviewed evidence-pack version is required.");
  }
  if (typeof record.recoveryRevision !== "string" || !GIT_REVISION.test(record.recoveryRevision)) {
    errors.push("The cleared recovery revision must be a full 40- or 64-character Git commit hash.");
  }

  const signOff = record.independentSecuritySignOff;
  if (!signOff || typeof signOff !== "object" || Array.isArray(signOff)) {
    errors.push("Independent security sign-off is required.");
  } else {
    if (!hasRecordedValue(signOff.reviewer)) {
      errors.push("The independent security reviewer must be named.");
    }
    if (signOff.independenceConfirmed !== true) {
      errors.push("Reviewer independence must be explicitly confirmed.");
    }
    if (!hasRecordedValue(signOff.evidenceReference)) {
      errors.push("The independent security sign-off evidence reference is required.");
    }
    if (!hasUtcTimestamp(signOff.signedAtUtc)) {
      errors.push("Security sign-off needs an ISO UTC timestamp ending in Z.");
    }
  }

  const approval = record.writtenPhase0Approval;
  if (!approval || typeof approval !== "object" || Array.isArray(approval)) {
    errors.push('Written "Phase 0 approved" evidence is required.');
  } else {
    if (!hasRecordedValue(approval.approver)) {
      errors.push("The management approver must be named.");
    }
    if (approval.exactMessage !== "Phase 0 approved") {
      errors.push('The written approval message must be exactly "Phase 0 approved".');
    }
    if (!hasRecordedValue(approval.evidenceReference)) {
      errors.push("The written Phase 0 approval evidence reference is required.");
    }
    if (!hasUtcTimestamp(approval.approvedAtUtc)) {
      errors.push("Written Phase 0 approval needs an ISO UTC timestamp ending in Z.");
    }
  }

  return errors;
}

export function evaluateGuard(changedFiles, approvalRecord, recordError = null) {
  const protectedChanges = findProtectedChanges(changedFiles);
  if (protectedChanges.length === 0) {
    return { protectedChanges, errors: [] };
  }
  if (recordError) {
    return { protectedChanges, errors: [recordError] };
  }
  return { protectedChanges, errors: validateApprovalRecord(approvalRecord) };
}

function runGit(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message || result.stderr.trim() || `git exited with ${result.status}`;
    throw new Error(`Cannot establish changed files: ${detail}`);
  }
  return result.stdout;
}

function splitNullDelimited(value) {
  return value.split("\0").filter(Boolean);
}

function resolveDefaultBase(cwd) {
  const branch = spawnSync("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], {
    cwd,
    encoding: "utf8",
  });
  if (branch.status === 0 && branch.stdout.trim() === "main") {
    return "HEAD^";
  }

  for (const candidate of ["origin/main", "main"]) {
    const check = spawnSync("git", ["rev-parse", "--verify", `${candidate}^{commit}`], {
      cwd,
      encoding: "utf8",
    });
    if (check.status === 0) return candidate;
  }
  throw new Error("Cannot establish changed files: supply --base with a valid Git revision.");
}

export function collectChangedFiles(cwd = process.cwd(), requestedBase = null) {
  let base = requestedBase || resolveDefaultBase(cwd);
  if (/^0+$/.test(base)) base = "HEAD^";
  runGit(cwd, ["rev-parse", "--verify", `${base}^{commit}`]);

  const committed = runGit(cwd, ["diff", "--name-only", "-z", `${base}...HEAD`]);
  const unstaged = runGit(cwd, ["diff", "--name-only", "-z"]);
  const staged = runGit(cwd, ["diff", "--cached", "--name-only", "-z"]);
  const untracked = runGit(cwd, ["ls-files", "--others", "--exclude-standard", "-z"]);

  return [...new Set([
    ...splitNullDelimited(committed),
    ...splitNullDelimited(unstaged),
    ...splitNullDelimited(staged),
    ...splitNullDelimited(untracked),
  ])].sort();
}

function readApprovalRecord(cwd) {
  try {
    return {
      record: JSON.parse(readFileSync(path.join(cwd, APPROVAL_RECORD), "utf8")),
      error: null,
    };
  } catch (error) {
    return {
      record: null,
      error: `Cannot read a valid ${APPROVAL_RECORD}: ${error.message}`,
    };
  }
}

function parseArguments(argv) {
  const options = { base: null, changedFilesManifest: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") {
      options.help = true;
    } else if (argument === "--base" || argument === "--changed-files") {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} requires a value.`);
      if (argument === "--base") options.base = value;
      else options.changedFilesManifest = value;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function main(argv) {
  const options = parseArguments(argv);
  if (options.help) {
    console.log("Usage: node scripts/check-phase0-publishing-guard.mjs [--base <revision>] [--changed-files <newline-delimited-manifest>]");
    return;
  }

  const cwd = process.cwd();
  const changedFiles = options.changedFilesManifest
    ? readFileSync(options.changedFilesManifest, "utf8").split(/\r?\n/).filter(Boolean)
    : collectChangedFiles(cwd, options.base);
  const { record, error } = readApprovalRecord(cwd);
  const result = evaluateGuard(changedFiles, record, error);

  if (result.protectedChanges.length === 0) {
    console.log("Phase 0 guard: no protected governance or judges page changes detected.");
    return;
  }

  if (result.errors.length > 0) {
    console.error("Phase 0 guard BLOCKED protected governance/judges page changes:");
    for (const file of result.protectedChanges) console.error(`  - ${file}`);
    for (const message of result.errors) console.error(`  * ${message}`);
    console.error(`Record valid independent security sign-off and exact written Phase 0 approval in ${APPROVAL_RECORD} before retrying.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Phase 0 guard: approval evidence validated for ${result.protectedChanges.length} protected file change(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`Phase 0 guard BLOCKED: ${error.message}`);
    process.exitCode = 1;
  }
}
