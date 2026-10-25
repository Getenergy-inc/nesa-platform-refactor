import { describe, expect, it } from "vitest";
import {
  OFFICIAL_NOMINATION_FORM_URL,
  isNominationHref,
} from "@/config/nomination/officialGoogleForm";

describe("official nomination link", () => {
  it("uses the official Google Form", () => {
    expect(OFFICIAL_NOMINATION_FORM_URL).toBe(
      "https://docs.google.com/forms/d/e/1FAIpQLSeBqubtaJlGCsc6n_NUuL3j_o2DVPWhIrq8ifm7-W3Vn1GxtQ/viewform",
    );
  });

  it("sends nomination buttons to the form", () => {
    expect(isNominationHref("/nominate")).toBe(true);
    expect(isNominationHref("/nominate?category=best-csr-for-education-nigeria")).toBe(true);
    expect(isNominationHref("/nominate/africa-education-icon")).toBe(true);
    expect(isNominationHref("#nominate")).toBe(true);
  });

  it("keeps browsing links on the website", () => {
    expect(isNominationHref("/nominees")).toBe(false);
    expect(isNominationHref("/nominate/pages")).toBe(false);
    expect(isNominationHref("/nominate/help-me-choose")).toBe(false);
    expect(isNominationHref("https://example.com/nominate")).toBe(false);
  });
});
