/**
 * Image regression check.
 *
 * Guarantees the verified-photo nominees (Kolisi, Loroupe, Kidjo + the other
 * bridged honourees) keep rendering REAL <img> tags — not branded initials
 * fallbacks — across the surfaces that matter:
 *   - /nominees/:slug (HonoureeImage drives the hero + related grid)
 *   - profile cards (NomineeCard)
 *   - carousels / search results (both consume the same getAllNominees() feed)
 *
 * Failing this test means a regression has stripped imageUrl from the
 * master bridge, broken the resolver, or reverted a card to placeholder.svg.
 */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fs from "node:fs";
import path from "node:path";

import { getAllNominees } from "@/lib/nesaData";
import { HonoureeImage } from "@/components/honourees/HonoureeImage";
import { NomineeCard } from "@/components/nesa/NomineeCard";

// The resolver hits Supabase; in jsdom we stub it so the test is hermetic.
// It returns whatever fallback the component passes in — which is exactly
// what production does when a nominee_media row is absent but a local
// /nominees/*.jpg exists.
vi.mock("@/hooks/useNomineeMedia", () => ({
  useResolveNomineeMedia: () => (
    _slug: string,
    fallback?: string | null,
    name?: string,
  ) => ({
    image: fallback ?? null,
    thumbnail: fallback ?? null,
    banner: null,
    logo: null,
    og: fallback ?? null,
    alt: name ?? null,
    source: null,
    attribution: null,
    kind: "person" as const,
    verified: Boolean(fallback),
  }),
}));

// react-query QueryClient is not needed because we mocked the hook above.

const VERIFIED = [
  { slug: "siya-kolisi-south-africa-321",  file: "kolisi.jpg",   name: "Siya Kolisi (South Africa)" },
  { slug: "tegla-loroupe-kenya-322",       file: "loroupe.jpg",  name: "Tegla Loroupe (Kenya)" },
  { slug: "angelique-kidjo-benin-323",     file: "kidjo.jpg",    name: "Angelique Kidjo (Benin)" },
] as const;

describe("nominee image regression — verified photos", () => {
  it("ships the local image files for every bridged honouree", () => {
    for (const v of VERIFIED) {
      const p = path.join(process.cwd(), "public", "nominees", v.file);
      expect(fs.existsSync(p), `missing public/nominees/${v.file}`).toBe(true);
      expect(fs.statSync(p).size).toBeGreaterThan(1024);
    }
  });

  it("includes the bridged honourees in getAllNominees() with a real imageUrl", () => {
    const all = getAllNominees();
    for (const v of VERIFIED) {
      const n = all.find((x) => x.slug === v.slug);
      expect(n, `nominee ${v.slug} missing from getAllNominees()`).toBeTruthy();
      expect(n!.imageUrl).toBe(`/nominees/${v.file}`);
      expect(n!.imageUrl).not.toMatch(/placeholder\.svg/);
    }
  });

  it("HonoureeImage renders a real <img> for verified honourees (profile hero + carousels)", () => {
    for (const v of VERIFIED) {
      const { container } = render(
        <HonoureeImage slug={v.slug} name={v.name} fallbackImage={`/nominees/${v.file}`} />,
      );
      const img = container.querySelector("img");
      expect(img, `HonoureeImage fell back to initials for ${v.slug}`).toBeTruthy();
      expect(img!.getAttribute("src")).toBe(`/nominees/${v.file}`);
    }
  });

  it("NomineeCard renders a real <img> for verified honourees (cards + search results)", () => {
    for (const v of VERIFIED) {
      const { container } = render(
        <MemoryRouter>
          <NomineeCard
            nominee={{
              id: `test-${v.slug}`,
              name: v.name,
              slug: v.slug,
              photoUrl: `/nominees/${v.file}`,
              imageType: "photo",
            }}
            showVotes={false}
          />
        </MemoryRouter>,
      );
      const imgs = Array.from(container.querySelectorAll("img"));
      const photo = imgs.find((i) => i.getAttribute("src") === `/nominees/${v.file}`);
      expect(photo, `NomineeCard missing nominee photo for ${v.slug}`).toBeTruthy();
      for (const i of imgs) {
        expect(i.getAttribute("src")).not.toMatch(/placeholder\.svg/);
      }

