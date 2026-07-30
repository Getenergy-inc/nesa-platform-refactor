/**
 * Regression tests: page titles + Open Graph metadata for every secure
 * workspace route (NRC Arena + Judges Arena) must match the shared arena
 * branding tokens.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { ArenaSeo, resolveArenaPageTitle, type ArenaWorkspace } from "../ArenaSeo";

const SITE_URL = "https://nesaafrica.lovable.app";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const SUITE = "NESA-Africa 2026";

const JUDGE_ROUTES = [
  "/judges-arena",
  "/judges-arena/nominees",
  "/judges-arena/discussion",
  "/judges-arena/rubric",
  "/judges-arena/calendar",
  "/judges-arena/reports",
  "/judges-arena/resources",
  "/judges/dashboard",
  "/judges/chat",
  "/judges/results",
  "/judges/pathways",
  "/judges/directory",
  "/judge",
];

const NRC_ROUTES = [
  "/nrc",
  "/nrc/dashboard",
  "/nrc/dashboard/intake",
  "/nrc/dashboard/nominees",
  "/nrc/dashboard/my-reviews",
  "/nrc/dashboard/queue",
  "/nrc/dashboard/flagged",
  "/nrc/dashboard/merge",
  "/nrc/dashboard/edi-analytics",
  "/nrc/dashboard/guidelines",
  "/nrc/cases",
  "/nrc/teams",
  "/nrc/automation",
  "/nrc/duplicates",
  "/nrc/evidence",
  "/nrc/endorsements",
  "/nrc/handover/judges",
  "/nrc/handover/governance",
  "/nrc/reports",
  "/nrc/directory",
  "/nrc/profile",
  "/nrc/onboarding",
  "/nrc/audit-log",
  "/nrc/my-queue",
  "/nrc/members",
  "/nrc/settings",
  "/nrc/arena",
];

function renderSeo(pathname: string, workspace: ArenaWorkspace) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[pathname]}>
        <ArenaSeo workspace={workspace} />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

const meta = (selector: string) =>
  document.head.querySelector<HTMLMetaElement>(selector)?.content;

describe("ArenaSeo — arena branding metadata", () => {
  beforeEach(() => {
    cleanup();
    document.head.querySelectorAll("meta, title").forEach((n) => n.remove());
  });

  const cases: Array<[string, ArenaWorkspace]> = [
    ...JUDGE_ROUTES.map((r) => [r, "Judges Arena"] as [string, ArenaWorkspace]),
    ...NRC_ROUTES.map((r) => [r, "NRC Arena"] as [string, ArenaWorkspace]),
  ];

  it.each(cases)("%s carries branded title + OG tokens", async (pathname, workspace) => {
    renderSeo(pathname, workspace);

    const page = resolveArenaPageTitle(pathname);
    const expectedTitle = page
      ? `${page} · ${workspace} · ${SUITE}`
      : `${workspace} · ${SUITE}`;

    await waitFor(() => {
      expect(document.title).toBe(expectedTitle);
    });

    // Every arena route resolves to a named page token.
    expect(page).toBeTruthy();

    // Private workspaces must never be indexed.
    expect(meta('meta[name="robots"]')).toBe("noindex, nofollow");

    // Open Graph branding tokens.
    expect(meta('meta[property="og:type"]')).toBe("website");
    expect(meta('meta[property="og:site_name"]')).toBe(`NESA-Africa · ${workspace}`);
    expect(meta('meta[property="og:title"]')).toBe(expectedTitle);
    expect(meta('meta[property="og:url"]')).toBe(`${SITE_URL}${pathname}`);
    expect(meta('meta[property="og:image"]')).toBe(OG_IMAGE);
    expect(meta('meta[property="og:image:width"]')).toBe("1200");
    expect(meta('meta[property="og:image:height"]')).toBe("630");
    expect(meta('meta[property="og:locale"]')).toBe("en_US");

    // Twitter card mirrors the OG tokens.
    expect(meta('meta[name="twitter:card"]')).toBe("summary_large_image");
    expect(meta('meta[name="twitter:title"]')).toBe(expectedTitle);
    expect(meta('meta[name="twitter:image"]')).toBe(OG_IMAGE);

    // Description is workspace-scoped and non-empty.
    const desc = meta('meta[name="description"]');
    expect(desc).toBeTruthy();
    expect(desc).toBe(meta('meta[property="og:description"]'));
    expect(desc).toBe(meta('meta[name="twitter:description"]'));
    expect(desc).toContain("NESA-Africa 2026");
  });

  it("honours explicit title and description overrides", async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/nrc/dashboard"]}>
          <ArenaSeo
            workspace="NRC Arena"
            title="Custom Page"
            description="Custom arena description."
          />
        </MemoryRouter>
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.title).toBe("Custom Page · NRC Arena · NESA-Africa 2026");
    });
    expect(meta('meta[name="description"]')).toBe("Custom arena description.");
    expect(meta('meta[property="og:title"]')).toBe(
      "Custom Page · NRC Arena · NESA-Africa 2026",
    );
  });

  it("falls back to the workspace title for unmapped paths", async () => {
    expect(resolveArenaPageTitle("/some/other/route")).toBeUndefined();
    renderSeo("/some/other/route", "Judges Arena");
    await waitFor(() => {
      expect(document.title).toBe("Judges Arena · NESA-Africa 2026");
    });
  });
});
