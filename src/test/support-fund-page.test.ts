import { describe, it, expect, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => ({ insert: async () => ({ error: null }) }) } }));
import {
  SNS_REGIONS, SNS_COUNTRIES, SNS_CATEGORIES, SNS_BANK_ACCOUNTS, VOTING_OPEN, REGION_TARGET_USD, CONTINENTAL_TARGET_USD,
  SNS_UNASSIGNED, makeSupportRef, SNS_CTAS,
} from "@/config/schoolSupport";
import { submitPledge, assertNoSensitiveFields } from "@/services/supportFund";
import * as fs from "node:fs";
import * as path from "node:path";

describe("Support a Special-Needs School config", () => {
  it("has 8 regions with 8 distinct desks", () => {
    expect(SNS_REGIONS).toHaveLength(8);
    expect(new Set(SNS_REGIONS.map((r) => r.desk)).size).toBe(8);
  });
  it("maps exactly 54 unique countries, all to a known region, Western Sahara unassigned", () => {
    expect(SNS_COUNTRIES).toHaveLength(54);
    expect(new Set(SNS_COUNTRIES.map((c) => c.id)).size).toBe(54);
    const keys = new Set(SNS_REGIONS.map((r) => r.key));
    expect(SNS_COUNTRIES.every((c) => keys.has(c.region))).toBe(true);
    expect(SNS_COUNTRIES.some((c) => c.id === SNS_UNASSIGNED.id)).toBe(false);
  });
  it("has 8 categories and 4 bank accounts with the official numbers", () => {
    expect(SNS_CATEGORIES).toHaveLength(8);
    expect(Object.fromEntries(SNS_BANK_ACCOUNTS.map((a) => [a.currency, a.number]))).toEqual({ NGN: "1305744507", USD: "1307264500", EUR: "1307264531", GBP: "1307264548" });
  });
  it("keeps voting closed and targets at US$150,000 × 8 = US$1.2M", () => {
    expect(VOTING_OPEN).toBe(false);
    expect(SNS_CTAS.vote.disabled).toBe(true);
    expect(REGION_TARGET_USD * SNS_REGIONS.length).toBe(CONTINENTAL_TARGET_USD);
    expect(CONTINENTAL_TARGET_USD).toBe(1_200_000);
  });
  it("generates EA references in the required format", () => {
    expect(makeSupportRef("DN", new Date("2027-04-05T00:00:00Z"))).toMatch(/^EA-DN-270405-[A-Z0-9]{4}$/);
  });
});

describe("Support fund forms", () => {
  it("rejects submission without the acknowledgement", async () => {
    await expect(submitPledge({ ref: "EA-DN-1", kind: "donation", acknowledged: false, email: "a@b.co" })).rejects.toThrow();
  });
  it("rejects card, cvv, pin, password and otp fields", () => {
    for (const k of ["card_number", "cvv", "pin", "password", "otp"]) expect(() => assertNoSensitiveFields({ [k]: "x" })).toThrow();
  });
  it("has no form field named card / cvv / pin / password / otp", () => {
    const dir = path.resolve(__dirname, "../components/school-support");
    for (const f of fs.readdirSync(dir)) {
      const src = fs.readFileSync(path.join(dir, f), "utf8");
      expect(src).not.toMatch(/name="[^"]*(card|cvv|pin|password|otp)[^"]*"/i);
    }
  });
});
