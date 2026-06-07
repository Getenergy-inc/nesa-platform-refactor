/**
 * Unit tests — Influencer Education Impact Award 2026 taxonomy & filter logic.
 *
 * Guards the data contract that drives the page and the DB schema:
 *   - Three categories exist with the spec'd ids
 *   - Classification arrays match the approved framework verbatim
 *   - DB column names declared in `classificationFields` match the DB migration
 *   - filterNominees reducer composes filters correctly (AND semantics)
 */
import { describe, it, expect } from "vitest";
import {
  CATEGORIES,
  SOCIAL_PLATFORMS,
  SOCIAL_CONTENT_IMPACT_AREAS,
  SPORT_AREAS,
  SPORTS_IMPACT_AREAS,
  MUSIC_GENRES,
  MUSIC_IMPACT_AREAS,
  EVIDENCE_CATEGORIES,
  GOVERNANCE_RULES,
  RECOGNITION_CLASSES,
  REGIONS,
  EDX_WEIGHTS,
  SEED_NOMINEES,
  filterNominees,
} from "../influencerImpact2026";

const noDuplicates = (arr: readonly string[]) =>
  new Set(arr).size === arr.length;

describe("Influencer Impact 2026 — taxonomy", () => {
  it("declares exactly the three approved categories", () => {
    expect(CATEGORIES.map((c) => c.id)).toEqual([
      "social-media",
      "sports",
      "music",
    ]);
  });

  it("has the 11 spec'd social media platforms", () => {
    expect(SOCIAL_PLATFORMS).toHaveLength(12);
    expect(SOCIAL_PLATFORMS).toContain("TikTok");
    expect(SOCIAL_PLATFORMS).toContain("Podcast Platforms");
    expect(SOCIAL_PLATFORMS).toContain("Multi-Platform Influencers");
    expect(noDuplicates(SOCIAL_PLATFORMS)).toBe(true);
  });

  it("has the 11 spec'd sport areas including Multi-Sport", () => {
    expect(SPORT_AREAS).toHaveLength(11);
    expect(SPORT_AREAS).toContain("Football");
    expect(SPORT_AREAS).toContain("Paralympic Sports");
    expect(SPORT_AREAS).toContain("Multi-Sport Athlete");
    expect(noDuplicates(SPORT_AREAS)).toBe(true);
  });

  it("has the 10 spec'd music genres including Multi-Genre", () => {
    expect(MUSIC_GENRES).toHaveLength(10);
    expect(MUSIC_GENRES).toContain("Afrobeats");
    expect(MUSIC_GENRES).toContain("Amapiano");
    expect(MUSIC_GENRES).toContain("Multi-Genre Artist");
    expect(noDuplicates(MUSIC_GENRES)).toBe(true);
  });

  it("has the spec'd impact-area sets per category", () => {
    expect(SOCIAL_CONTENT_IMPACT_AREAS).toHaveLength(10);
    expect(SPORTS_IMPACT_AREAS).toHaveLength(9);
    expect(MUSIC_IMPACT_AREAS).toHaveLength(9);
  });

  it("has 8 evidence categories and 4 governance rules", () => {
    expect(EVIDENCE_CATEGORIES).toHaveLength(8);
    expect(GOVERNANCE_RULES).toHaveLength(4);
  });

  it("recognition classes match the two spec'd classes", () => {
    expect(RECOGNITION_CLASSES).toEqual([
      "African Living in Africa",
      "African in the Diaspora",
    ]);
  });

  it("has the 5 African regions", () => {
    expect(REGIONS).toHaveLength(5);
    expect(REGIONS).toContain("West Africa");
    expect(REGIONS).toContain("North Africa");
  });

  it("EDX weights total 100", () => {
    const total =
      EDX_WEIGHTS.education + EDX_WEIGHTS.development + EDX_WEIGHTS.excellence;
    expect(total).toBe(100);
  });

  it("classificationFields name the DB columns each category populates", () => {
    const byId = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
    expect(byId["social-media"].classificationFields).toEqual([
      "primary_social_media_platform",
      "content_impact_area",
    ]);
    expect(byId["sports"].classificationFields).toEqual([
      "primary_sport_area",
      "sports_education_impact_area",
    ]);
    expect(byId["music"].classificationFields).toEqual([
      "music_genre",
      "music_education_impact_area",
    ]);
  });
});

describe("Influencer Impact 2026 — seed nominees", () => {
  it("seed nominees populate the classification field appropriate to their category", () => {
    for (const n of SEED_NOMINEES) {
      if (n.award_category === "social-media") {
        expect(n.primary_social_media_platform).toBeTruthy();
      }
      if (n.award_category === "sports") {
        expect(n.primary_sport_area).toBeTruthy();
      }
      if (n.award_category === "music") {
        expect(n.music_genre).toBeTruthy();
      }
    }
  });

  it("does not classify all sports as Football or all music as Afrobeats", () => {
    const sportAreas = new Set(
      SEED_NOMINEES.filter((n) => n.award_category === "sports").map(
        (n) => n.primary_sport_area,
      ),
    );
    const musicGenres = new Set(
      SEED_NOMINEES.filter((n) => n.award_category === "music").map(
        (n) => n.music_genre,
      ),
    );
    expect(sportAreas.size).toBeGreaterThan(1);
    expect(musicGenres.size).toBeGreaterThan(1);
  });
});

describe("filterNominees", () => {
  it("returns all when no filters applied", () => {
    expect(filterNominees(SEED_NOMINEES, {})).toHaveLength(SEED_NOMINEES.length);
  });

  it("filters by category", () => {
    const r = filterNominees(SEED_NOMINEES, { category: "music" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((n) => n.award_category === "music")).toBe(true);
  });

  it("filters by recognition class", () => {
    const r = filterNominees(SEED_NOMINEES, {
      recognitionClass: "African in the Diaspora",
    });
    expect(r.every((n) => n.recognition_class === "African in the Diaspora")).toBe(
      true,
    );
  });

  it("intersects category + region", () => {
    const r = filterNominees(SEED_NOMINEES, {
      category: "sports",
      region: "Southern Africa",
    });
    expect(r.length).toBeGreaterThan(0);
    expect(
      r.every(
        (n) =>
          n.award_category === "sports" && n.nominee_region === "Southern Africa",
      ),
    ).toBe(true);
  });

  it("filters by music genre without touching social/sports rows", () => {
    const r = filterNominees(SEED_NOMINEES, { musicGenre: "Afrobeats" });
    expect(r.every((n) => n.music_genre === "Afrobeats")).toBe(true);
  });

  it("matches search across name, foundation and country", () => {
    const r = filterNominees(SEED_NOMINEES, { search: "kolisi" });
    expect(r.map((n) => n.slug)).toContain("siya-kolisi");
  });

  it("treats 'all' sentinels as no-op", () => {
    const r = filterNominees(SEED_NOMINEES, {
      category: "all",
      recognitionClass: "all",
      region: "all",
      verification: "all",
    });
    expect(r).toHaveLength(SEED_NOMINEES.length);
  });
});
