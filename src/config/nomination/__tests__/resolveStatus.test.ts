import { describe, it, expect } from "vitest";
import {
  hasUsableFormUrls,
  resolveFormStatus,
  withResolvedStatus,
  withResolvedStatuses,
} from "@/config/nomination/resolveStatus";
import {
  RMSA_REGIONAL_FORMS,
  RMSA_REGIONAL_FORMS_RAW,
} from "@/config/nomination/rmsaRegionalForms";
import {
  AWARD_CATEGORY_FORMS,
  AWARD_CATEGORY_FORMS_RAW,
} from "@/config/nomination/awardCategoryForms";

const base = {
  formPublicUrl: "",
  formEmbedUrl: "",
};

describe("resolveFormStatus — auto-flip Link Pending → Active", () => {
  it("returns Active when both URLs present and status is Link Pending", () => {
    expect(
      resolveFormStatus({
        status: "Link Pending",
        formPublicUrl: "https://docs.google.com/forms/d/e/abc/viewform",
        formEmbedUrl:
          "https://docs.google.com/forms/d/e/abc/viewform?embedded=true",
      }),
    ).toBe("Active");
  });

  it("stays Link Pending when only one URL is present", () => {
    expect(
      resolveFormStatus({
        status: "Link Pending",
        formPublicUrl: "https://docs.google.com/forms/d/e/abc/viewform",
        formEmbedUrl: "",
      }),
    ).toBe("Link Pending");
    expect(
      resolveFormStatus({
        ...base,
        status: "Link Pending",
        formEmbedUrl:
          "https://docs.google.com/forms/d/e/abc/viewform?embedded=true",
      }),
    ).toBe("Link Pending");
  });

  it("treats whitespace-only URLs as empty", () => {
    expect(
      resolveFormStatus({
        status: "Link Pending",
        formPublicUrl: "   ",
        formEmbedUrl: "   ",
      }),
    ).toBe("Link Pending");
  });

  it.each(["Active", "Draft", "Coming Soon", "Closed", "Replaced"] as const)(
    "passes through %s status unchanged even with URLs present",
    (status) => {
      expect(
        resolveFormStatus({
          status,
          formPublicUrl: "https://x/y",
          formEmbedUrl: "https://x/y?embedded=true",
        }),
      ).toBe(status);
    },
  );

  it("hasUsableFormUrls is true only when both URLs are non-empty", () => {
    expect(hasUsableFormUrls({ ...base, status: "Link Pending" })).toBe(false);
    expect(
      hasUsableFormUrls({
        status: "Link Pending",
        formPublicUrl: "a",
        formEmbedUrl: "b",
      }),
    ).toBe(true);
  });

  it("withResolvedStatus returns same object reference when status unchanged", () => {
    const form = {
      slug: "x",
      status: "Link Pending" as const,
      formPublicUrl: "",
      formEmbedUrl: "",
    };
    expect(withResolvedStatus(form)).toBe(form);
  });

  it("withResolvedStatus returns new object when promoted", () => {
    const form = {
      slug: "x",
      status: "Link Pending" as const,
      formPublicUrl: "a",
      formEmbedUrl: "b",
    };
    const out = withResolvedStatus(form);
    expect(out).not.toBe(form);
    expect(out.status).toBe("Active");
    expect(form.status).toBe("Link Pending"); // raw untouched
  });

  it("withResolvedStatuses preserves array length and order", () => {
    const input = [
      { status: "Link Pending" as const, formPublicUrl: "a", formEmbedUrl: "b" },
      { status: "Link Pending" as const, formPublicUrl: "", formEmbedUrl: "" },
      { status: "Closed" as const, formPublicUrl: "a", formEmbedUrl: "b" },
    ];
    const out = withResolvedStatuses(input);
    expect(out).toHaveLength(3);
    expect(out.map((f) => f.status)).toEqual([
      "Active",
      "Link Pending",
      "Closed",
    ]);
  });
});

describe("RMSA & Award Category configs — resolved exports", () => {
  it("RMSA resolved length equals raw length", () => {
    expect(RMSA_REGIONAL_FORMS).toHaveLength(RMSA_REGIONAL_FORMS_RAW.length);
    expect(RMSA_REGIONAL_FORMS).toHaveLength(8);
  });

  it("Award Category resolved length equals raw length", () => {
    expect(AWARD_CATEGORY_FORMS).toHaveLength(AWARD_CATEGORY_FORMS_RAW.length);
    expect(AWARD_CATEGORY_FORMS).toHaveLength(23);
  });

  it("every resolved entry matches the auto-flip rule for its raw entry", () => {
    for (const raw of [...RMSA_REGIONAL_FORMS_RAW, ...AWARD_CATEGORY_FORMS_RAW]) {
      const expected =
        raw.status === "Link Pending" &&
        raw.formPublicUrl.trim().length > 0 &&
        raw.formEmbedUrl.trim().length > 0
          ? "Active"
          : raw.status;
      const resolved =
        [...RMSA_REGIONAL_FORMS, ...AWARD_CATEGORY_FORMS].find(
          (f) => f.slug === raw.slug,
        )?.status;
      expect(resolved).toBe(expected);
    }
  });

  it("today: all 8 RMSA forms are Link Pending (no URLs pasted yet)", () => {
    for (const r of RMSA_REGIONAL_FORMS) {
      expect(r.status).toBe("Link Pending");
    }
  });
});
