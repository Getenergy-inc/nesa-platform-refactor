// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Includes Phase 1–4 award + nominee routes.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { ALL_CATEGORIES, GROUP_META } from "../src/config/awardCategories/index.ts";

const BASE_URL = "https://nesaafrica.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const ICON_SUBCATEGORIES = [
  "literary-new-curriculum-advocate",
  "technical-educator-icon",
  "education-philanthropy-icon",
];
const ICON_CLASSIFICATIONS = [
  "africans-in-africa",
  "diaspora-africans",
  "friends-of-africa",
];
const GOLD_TRACKS = [
  "sports-for-education",
  "music-for-education",
  "social-media-for-education",
];

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  // Award pillars (Phase 4)
  { path: "/awards/africa-education-icon", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/gold-special-recognition", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/csr-education", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/digital-voices", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/global-partnerships", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/winners", changefreq: "weekly", priority: "0.8" },
  // Nominee directories (Phase 1)
  { path: "/nominees", changefreq: "daily", priority: "0.9" },
  { path: "/nominees/africa-education-icon-award", changefreq: "weekly", priority: "0.8" },
  { path: "/nominees/gold-special-recognition", changefreq: "weekly", priority: "0.8" },
  // Region-first nominee ecosystem (Phase 5)
  { path: "/nominees/west-africa", changefreq: "weekly", priority: "0.85" },
  { path: "/nominees/east-africa", changefreq: "weekly", priority: "0.85" },
  { path: "/nominees/north-africa", changefreq: "weekly", priority: "0.85" },
  { path: "/nominees/central-africa", changefreq: "weekly", priority: "0.85" },
  { path: "/nominees/southern-africa", changefreq: "weekly", priority: "0.85" },
  // Participation
  { path: "/nominate", changefreq: "weekly", priority: "0.9" },
  { path: "/vote", changefreq: "daily", priority: "0.9" },
  { path: "/trending", changefreq: "daily", priority: "0.85" },
  { path: "/how-voting-works", changefreq: "monthly", priority: "0.6" },
  { path: "/earn-agc", changefreq: "weekly", priority: "0.8" },
  { path: "/about-agc", changefreq: "monthly", priority: "0.6" },
  // Ecosystem
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/about/governance", changefreq: "monthly", priority: "0.5" },
  { path: "/about/scef", changefreq: "monthly", priority: "0.5" },
  { path: "/about/vision-2035", changefreq: "monthly", priority: "0.5" },
  { path: "/ambassadors", changefreq: "monthly", priority: "0.6" },
  { path: "/judges", changefreq: "monthly", priority: "0.6" },
  { path: "/volunteer", changefreq: "monthly", priority: "0.6" },
  { path: "/sponsors", changefreq: "monthly", priority: "0.6" },
  { path: "/chapters", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.4" },
  { path: "/donate", changefreq: "monthly", priority: "0.6" },
  // Media
  { path: "/media", changefreq: "weekly", priority: "0.6" },
  { path: "/videos", changefreq: "weekly", priority: "0.6" },
  // Governance pages
  { path: "/pathways", changefreq: "monthly", priority: "0.5" },
  { path: "/ecosystem", changefreq: "monthly", priority: "0.5" },
  { path: "/movement", changefreq: "monthly", priority: "0.5" },
  { path: "/impact", changefreq: "monthly", priority: "0.5" },
  { path: "/programs", changefreq: "monthly", priority: "0.5" },
  // Auth
  { path: "/auth/login", changefreq: "yearly", priority: "0.3" },
  { path: "/auth/register", changefreq: "yearly", priority: "0.3" },
];

// Icon nested directory pages (Phase 1)
const iconNested: SitemapEntry[] = ICON_SUBCATEGORIES.flatMap((sub) => [
  { path: `/nominees/africa-education-icon-award/${sub}`, changefreq: "weekly", priority: "0.7" },
  ...ICON_CLASSIFICATIONS.map((cls) => ({
    path: `/nominees/africa-education-icon-award/${sub}/${cls}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
]);

// Gold track pages
const goldNested: SitemapEntry[] = GOLD_TRACKS.map((slug) => ({
  path: `/nominees/gold-special-recognition/${slug}`,
  changefreq: "weekly",
  priority: "0.7",
}));

// Award category group index pages (driven from GROUP_META)
const groupIndexEntries: SitemapEntry[] = Array.from(
  new Set(
    Object.values(GROUP_META)
      .map((g) => g.indexUrl.split("#")[0])
      .filter(Boolean),
  ),
).map((path) => ({ path, changefreq: "weekly" as const, priority: "0.85" }));

// One sitemap entry per canonical award category URL
const categoryEntries: SitemapEntry[] = ALL_CATEGORIES.map((c) => ({
  path: c.url,
  changefreq: "weekly" as const,
  priority: "0.8",
}));

// Master /awards/categories index
const categoriesIndex: SitemapEntry = {
  path: "/awards/categories",
  changefreq: "weekly",
  priority: "0.9",
};

const allEntries = [
  ...staticEntries,
  ...iconNested,
  ...goldNested,
  categoriesIndex,
  ...groupIndexEntries,
  ...categoryEntries,
];

// Dedupe by path (last one wins)
const dedupedMap = new Map<string, SitemapEntry>();
for (const e of allEntries) dedupedMap.set(e.path, e);
const entries = Array.from(dedupedMap.values());

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
