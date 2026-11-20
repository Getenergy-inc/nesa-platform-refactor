import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(`${process.cwd()}/${path}`, "utf8");

describe("consolidated master v3 Release 1", () => {
  it("keeps only the two approved final CTA actions", () => {
    const source = read("src/components/nesa/FinalCTASection.tsx");
    expect((source.match(/<Link /g) || []).length).toBe(2);
    expect(source).toContain('to="/nominate"');
    expect(source).toContain('to="/get-involved"');
    expect(source).not.toContain('/shop');
    expect(source).not.toContain('to="/awards"');
    expect(source).toContain("Every nomination starts a review; it is not a win.");
  });

  it("uses true desktop exit intent once per visitor without a timer", () => {
    const source = read("src/components/nesa/ExitIntentPopup.tsx");
    expect(source).toContain('nesa_exit_popup_shown_v2');
    expect(source).toContain('(min-width:1024px) and (pointer:fine)');
    expect(source).toContain('role="dialog"');
    expect(source).toContain('event.key === "Escape"');
    expect(source).not.toContain("setTimeout");
    expect(source).toContain('"/nominate"');
    expect(source).toContain('"/admin"');
  });

  it("routes support help to canonical recognition, sponsor and chapter pages", () => {
    const source = read("src/components/support/CustomerCareChat.tsx");
    expect(source).toContain('{ label: "How Recognition Works", to: "/how-it-works" }');
    expect(source).toContain('{ label: "Sponsorship", to: "/sponsors" }');
    expect(source).toContain('{ label: "Local Chapters", to: "/chapters/join" }');
    expect(source).toContain("How does recognition work?");
    expect(source).toContain("Independent of judging and recognition decisions.");
  });

  it("makes Sophia's backend guidance explicitly prohibit public and AGC voting in 2026", () => {
    const source = read("supabase/functions/chat/index.ts");
    expect(source).toContain("There is no public voting and no AGC voting in 2026.");
    expect(source).toContain("Recognition process, including questions about voting → /how-it-works");
    expect(source).toContain("Nine independent Icon judges");
    expect(source).not.toContain("27 internal judges");
    expect(source).not.toContain("Gold Awards: 100% public voting");
  });

  it("does not redirect the canonical FAQs page back to Help", () => {
    const source = read("src/config/refactorRedirects2026.ts");
    expect(source).not.toContain('{ from: "/faqs", to: "/help"');
    expect(source).not.toContain('{ from: "/faq", to: "/help"');
  });
});
