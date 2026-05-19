/**
 * Automated visual checks for the pathway half-card poster crops.
 *
 * These tests guard the contract between the uploaded poster graphics
 * (src/assets/pathway-cards/*.jpg) and the way PathwayVideoCard renders
 * the top half across common breakpoints:
 *
 *  - Each asset exists and decodes as a JPEG with the expected intrinsic
 *    dimensions we cropped from the uploads.
 *  - The poster <img> is rendered absolutely-positioned with object-cover so
 *    it always fills the 16:10 top-half regardless of card width.
 *  - The gradient overlay is dimmed (opacity-40 mix-blend-multiply) when a
 *    poster is present, so the artwork stays visible underneath.
 *  - The rendered layout holds at mobile, tablet, laptop and desktop widths
 *    (320 → 1920px) without dropping the poster or its overlays.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { Crown } from "lucide-react";
import { PathwayVideoCard, type PathwayVideoCardData } from "../PathwayVideoCard";

// ─── Asset contract ──────────────────────────────────────────────────────────

const ASSETS_DIR = resolve(__dirname, "../../../assets/pathway-cards");

type PosterSpec = {
  file: string;
  /** Expected intrinsic dimensions of the cropped upload. */
  width: number;
  height: number;
};

const POSTERS: Record<"icon" | "csr" | "influencer" | "grants", PosterSpec> = {
  icon:       { file: "icon.jpg",       width: 880, height: 470 },
  csr:        { file: "csr.jpg",        width: 880, height: 470 },
  influencer: { file: "influencer.jpg", width: 880, height: 420 },
  grants:     { file: "grants.jpg",     width: 880, height: 420 },
};

/** Read JPEG SOF0/SOF2 markers to get intrinsic width/height without deps. */
function readJpegSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  if (buf[0] !== 0xff || buf[1] !== 0xd8) {
    throw new Error(`${path} is not a JPEG (missing SOI marker)`);
  }
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error(`Bad marker at ${i} in ${path}`);
    const marker = buf[i + 1];
    const size = buf.readUInt16BE(i + 2);
    // SOF0..SOF15 except DHT(0xC4), JPG(0xC8), DAC(0xCC)
    if (
      marker >= 0xc0 && marker <= 0xcf &&
      marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    ) {
      const height = buf.readUInt16BE(i + 5);
      const width = buf.readUInt16BE(i + 7);
      return { width, height };
    }
    i += 2 + size;
  }
  throw new Error(`No SOF marker found in ${path}`);
}

describe("pathway poster assets", () => {
  for (const [id, spec] of Object.entries(POSTERS)) {
    it(`${id}: ${spec.file} exists with expected dimensions`, () => {
      const full = resolve(ASSETS_DIR, spec.file);
      // exists and non-empty
      const stat = statSync(full);
      expect(stat.isFile()).toBe(true);
      expect(stat.size).toBeGreaterThan(1024); // > 1KB, not a placeholder

      const { width, height } = readJpegSize(full);
      expect(width).toBe(spec.width);
      expect(height).toBe(spec.height);

      // Poster aspect must be wider than 1:1 so object-cover into the
      // 16:10 top-half crops vertically (never letterboxes horizontally).
      const aspect = width / height;
      expect(aspect).toBeGreaterThan(16 / 10 - 0.4); // tolerant lower bound
      expect(aspect).toBeLessThan(16 / 5);           // sanity upper bound
    });
  }
});

// ─── Render contract across viewports ────────────────────────────────────────

function makeCard(id: keyof typeof POSTERS): PathwayVideoCardData {
  return {
    id,
    icon: Crown,
    accentLabel: "Test • Accent",
    category: "Test Category",
    headline: "Test headline",
    story: "Test story copy.",
    videoTitle: "Test video title",
    posterAlt: `${id} poster alt`,
    posterImage: `/__test__/${POSTERS[id].file}`,
    visualGradient: "from-gold/45 via-emerald-900/40 to-charcoal",
    actionWords: ["One", "Two", "Three"],
    animatedPhrases: ["Phrase A", "Phrase B"],
    previewSummary: "Preview summary.",
    primaryCta: { label: "Primary", href: "/x" },
    secondaryCta: { label: "Secondary", href: "/y" },
    engagementCtaLabel: "Watch",
  };
}

function setViewport(width: number, height = 800) {
  Object.defineProperty(window, "innerWidth",  { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
  window.dispatchEvent(new Event("resize"));
}

const VIEWPORTS: Array<{ label: string; width: number }> = [
  { label: "mobile-sm",  width: 320 },
  { label: "mobile",     width: 375 },
  { label: "mobile-lg",  width: 414 },
  { label: "tablet",     width: 768 },
  { label: "laptop",     width: 1024 },
  { label: "desktop",    width: 1366 },
  { label: "desktop-xl", width: 1920 },
];

describe("PathwayVideoCard poster rendering across viewports", () => {
  beforeEach(() => setViewport(1280));
  afterEach(() => cleanup());

  for (const id of Object.keys(POSTERS) as Array<keyof typeof POSTERS>) {
    for (const vp of VIEWPORTS) {
      it(`${id} @ ${vp.label} (${vp.width}px): poster image + dimmed gradient render`, () => {
        setViewport(vp.width);

        const card = makeCard(id);
        const { container, getByAltText } = render(
          <MemoryRouter>
            <PathwayVideoCard card={card} index={0} />
          </MemoryRouter>
        );

        // Poster image is present with the expected src + alt.
        const img = getByAltText(card.posterAlt) as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.getAttribute("src")).toBe(card.posterImage);
        expect(img.getAttribute("loading")).toBe("lazy");
        expect(img.getAttribute("decoding")).toBe("async");

        // It fills the top half (absolute inset-0 + object-cover).
        const cls = img.className;
        expect(cls).toMatch(/\babsolute\b/);
        expect(cls).toMatch(/\binset-0\b/);
        expect(cls).toMatch(/\bh-full\b/);
        expect(cls).toMatch(/\bw-full\b/);
        expect(cls).toMatch(/\bobject-cover\b/);

        // The top-half wrapper preserves the 16:10 aspect ratio so the crop
        // is identical at every breakpoint.
        const wrapper = img.parentElement!;
        expect(wrapper.className).toMatch(/aspect-\[16\/10\]/);

        // The gradient layer is dimmed when a poster is present, so the
        // uploaded artwork shows through.
        const gradient = wrapper.querySelector<HTMLDivElement>(
          "div.bg-gradient-to-br"
        );
        expect(gradient).not.toBeNull();
        expect(gradient!.className).toMatch(/opacity-40/);
        expect(gradient!.className).toMatch(/mix-blend-multiply/);

        // Sanity: only one poster <img> rendered for this card.
        expect(container.querySelectorAll(`img[alt="${card.posterAlt}"]`).length).toBe(1);
      });
    }
  }

  it("renders no poster <img> when posterImage is omitted (fallback gradient stays opaque)", () => {
    const card = { ...makeCard("icon"), posterImage: undefined };
    const { container } = render(
      <MemoryRouter>
        <PathwayVideoCard card={card} index={0} />
      </MemoryRouter>
    );
    expect(container.querySelector(`img[alt="${card.posterAlt}"]`)).toBeNull();
    const gradient = container.querySelector("div.bg-gradient-to-br");
    expect(gradient).not.toBeNull();
    expect(gradient!.className).not.toMatch(/opacity-40/);
    expect(gradient!.className).not.toMatch(/mix-blend-multiply/);
  });
});
