/**
 * Vitest wrapper around scripts/checkTimelineIntegrity.ts so the guard runs on
 * every `npm test` invocation and in CI without a separate step.
 */
import { execFileSync } from "node:child_process";
import { describe, it, expect } from "vitest";

describe("Master Timeline 2026 integrity", () => {
  it("has no legacy timeline strings and all consumers wire the canonical module", () => {
    let output = "";
    let ok = true;
    try {
      output = execFileSync("npx", ["tsx", "scripts/checkTimelineIntegrity.ts"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (err: any) {
      ok = false;
      output = `${err.stdout ?? ""}\n${err.stderr ?? ""}`;
    }
    expect(ok, output).toBe(true);
  });
});
