import { describe, expect, it } from "vitest";
import {
  buildSlug,
  isPlaceholderName,
  mapRow,
  matchCategory,
  matchSubcategory,
  normaliseRegion,
  subcategoryRegion,
} from "../../supabase/functions/bulk-import-nominees/matching";

const categories = [
  { id: "c1", name: "Africa Education Icon Award", slug: "africa-education-icon" },
  { id: "c2", name: "Corporate Social Responsibility in Education", slug: "csr-education" },
];

const subcategories = [
  { id: "s1", category_id: "c2", name: "Best CSR in Education (West Africa)", slug: "csr-west" },
  { id: "s2", category_id: "c2", name: "Best CSR in Education (East Africa)", slug: "csr-east" },
  { id: "s3", category_id: "c1", name: "Lifetime Education Icon", slug: "icon-lifetime" },
];

describe("bulk import matching", () => {
  it("treats 'South Africa' as a region alias for Southern Africa", () => {
    expect(normaliseRegion("South Africa")).toBe("Southern Africa");
    expect(normaliseRegion("west africa")).toBe("West Africa");
    expect(normaliseRegion("Atlantis")).toBeNull();
  });

  it("maps flexible column headers", () => {
    const row = mapRow({
      "Nominee / Organisation": "Acme Foundation",
      "Award Title": "CSR in Education Award",
      Classification: "Best CSR in Education",
      Region: "West Africa",
      "Primary Email": "a@b.com",
      "Phone Number": "+234",
    });
    expect(row.name).toBe("Acme Foundation");
    expect(row.email).toBe("a@b.com");
    expect(row.phone).toBe("+234");
  });

  it("strips boilerplate before matching a category", () => {
    const m = matchCategory(
      "The Overall Best Corporate Social Responsibility in Education Award 2024 Nigeria",
      categories,
    );
    expect(m.match?.id).toBe("c2");
    expect(m.confident).toBe(true);
  });

  it("reads a region suffix off a subcategory name", () => {
    expect(subcategoryRegion("Best CSR in Education (West Africa)")).toBe("West Africa");
    expect(subcategoryRegion("Lifetime Education Icon")).toBeNull();
  });

  it("only matches subcategories whose region suffix matches the row region", () => {
    const west = matchSubcategory("Best CSR in Education", subcategories.slice(0, 2), "West Africa");
    expect(west.match?.id).toBe("s1");

    const southern = matchSubcategory(
      "Best CSR in Education",
      subcategories.slice(0, 2),
      "Southern Africa",
    );
    expect(southern.match).toBeNull();

    const noRegion = matchSubcategory("Best CSR in Education", subcategories.slice(0, 2), null);
    expect(noRegion.match).toBeNull();
  });

  it("matches suffix-free subcategories when the row has no region", () => {
    const m = matchSubcategory("Lifetime Education Icon", [subcategories[2]], null);
    expect(m.match?.id).toBe("s3");
  });

  it("detects placeholder nominee names", () => {
    expect(isPlaceholderName("Nominee 1")).toBe(true);
    expect(isPlaceholderName("Nominee 27")).toBe(true);
    expect(isPlaceholderName("TBD")).toBe(true);
    expect(isPlaceholderName("Aliko Dangote Foundation")).toBe(false);
  });

  it("builds a url-safe slug with a random suffix", () => {
    const slug = buildSlug("Aliko Dangote Foundation & Co.");
    expect(slug).toMatch(/^aliko-dangote-foundation-co-[a-z0-9]{6}$/);
    expect(buildSlug("Same Name")).not.toBe(buildSlug("Same Name"));
  });
});
