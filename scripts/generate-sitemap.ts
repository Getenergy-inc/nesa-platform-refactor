// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
//
// Goals:
//   • Only emit URLs that correspond to REAL, public, canonical SPA routes.
//   • Never emit URLs that are themselves 301/Navigate redirect SOURCES
//     (those targets cause duplicate-content + redirect-chain warnings in
//     Google Search Console).
//   • Never emit dynamic (`:slug`) routes, wildcard routes, or private
//     admin / dashboard / auth-only routes.
//   • Validate curated entries against the live route table; drop any
//     curated path that no longer exists in src/App.tsx.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { ALL_CATEGORIES, GROUP_META } from "../src/config/awardCategories/index.ts";

const BASE_URL = "https://nesaafrica.lovable.app";
const APP_TSX = resolve("src/App.tsx");

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// ---------------------------------------------------------------------------
// 1. Parse src/App.tsx → set of CANONICAL public routes
// ---------------------------------------------------------------------------
const source = readFileSync(APP_TSX, "utf8");

// Match each <Route ...> opening tag with its element="..." payload (best-effort).
// We capture the path and a short window after it so we can detect <Navigate>.
const ROUTE_RE = /<Route\s+path=["']([^"']+)["'][^>]*element=\{([\s\S]*?)\}\s*\/?>/g;

const allRoutePaths = new Set<string>();
const redirectSources = new Set<string>(); // routes whose element is <Navigate ...> or SlugRedirect

let m: RegExpExecArray | null;
while ((m = ROUTE_RE.exec(source)) !== null) {
  const path = m[1];
  const element = m[2];
  allRoutePaths.add(path);
  if (/<Navigate\b/.test(element) || /<SlugRedirect\b/.test(element)) {
    redirectSources.add(path);
  }
}

// Fallback: if the greedy element regex missed any path (e.g. nested braces),
// pick them up with the simpler path-only regex so we still know the route exists.
const PATH_ONLY_RE = /<Route\s+path=["']([^"']+)["']/g;
while ((m = PATH_ONLY_RE.exec(source)) !== null) {
  allRoutePaths.add(m[1]);
}

const PRIVATE_PREFIXES = [
  "/admin",
  "/nrc",
  "/olc",
  "/dashboard",
  "/wallet",
  "/account",
  "/install",
  "/judge/",
  "/judge-signup",
  "/judge-verify",
  "/volunteer/", // private volunteer console; public /volunteer index stays
  "/auth", // canonical auth pages live at /login, /register, etc.
  "/otp",
  "/forgot-password",
  "/reset-password",
];

function isIndexable(path: string): boolean {
  if (path === "*" || path === "/*") return false;
  if (path.includes(":")) return false; // dynamic
  if (redirectSources.has(path)) return false;
  if (PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(p + "/") || path === p.replace(/\/$/, ""))) {
    return false;
  }
  return true;
}

const canonicalRoutes = new Set(
  Array.from(allRoutePaths).filter(isIndexable),
);

// ---------------------------------------------------------------------------
// 2. Curated high-priority entries (validated against route table)
// ---------------------------------------------------------------------------
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

const curated: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  // Award pillars
  { path: "/awards/africa-education-icon", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/gold-special-recognition", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/csr-education", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/digital-voices", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/global-partnerships", changefreq: "weekly", priority: "0.9" },
  { path: "/awards/winners", changefreq: "weekly", priority: "0.8" },
  // Nominee directories
  { path: "/nominees", changefreq: "daily", priority: "0.9" },
  { path: "/nominees/africa-education-icon-award", changefreq: "weekly", priority: "0.8" },
  { path: "/nominees/gold-special-recognition", changefreq: "weekly", priority: "0.8" },
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
  // Governance / impact
  { path: "/pathways", changefreq: "monthly", priority: "0.5" },
  { path: "/ecosystem", changefreq: "monthly", priority: "0.5" },
  { path: "/movement", changefreq: "monthly", priority: "0.5" },
  { path: "/impact", changefreq: "monthly", priority: "0.5" },
  { path: "/programs", changefreq: "monthly", priority: "0.5" },
  // Auth landing — explicitly the canonical public-facing login (not /auth/* aliases)
  { path: "/login", changefreq: "yearly", priority: "0.3" },
  { path: "/register", changefreq: "yearly", priority: "0.3" },
];

const iconNested: SitemapEntry[] = ICON_SUBCATEGORIES.flatMap((sub) => [
  { path: `/nominees/africa-education-icon-award/${sub}`, changefreq: "weekly", priority: "0.7" },
  ...ICON_CLASSIFICATIONS.map((cls) => ({
    path: `/nominees/africa-education-icon-award/${sub}/${cls}`,
    changefreq: "weekly" as const,
    priority: "0.6",
  })),
]);

const goldNested: SitemapEntry[] = GOLD_TRACKS.map((slug) => ({
  path: `/nominees/gold-special-recognition/${slug}`,
  changefreq: "weekly",
  priority: "0.7",
}));

const groupIndexEntries: SitemapEntry[] = Array.from(
  new Set(
    Object.values(GROUP_META)
      .map((g) => g.indexUrl.split("#")[0])
      .filter(Boolean),
  ),
).map((path) => ({ path, changefreq: "weekly" as const, priority: "0.85" }));

const categoryEntries: SitemapEntry[] = ALL_CATEGORIES.map((c) => ({
  path: c.url.split("#")[0],
  changefreq: "weekly" as const,
  priority: "0.8",
}));

const categoriesIndex: SitemapEntry = {
  path: "/awards/categories",
  changefreq: "weekly",
  priority: "0.9",
};

// ---------------------------------------------------------------------------
// 3. Combine, dedupe, validate against actual route table
// ---------------------------------------------------------------------------
const combined = [
  ...curated,
  ...iconNested,
  ...goldNested,
  categoriesIndex,
  ...groupIndexEntries,
  ...categoryEntries,
];

const dedupedMap = new Map<string, SitemapEntry>();
for (const e of combined) {
  // Normalise: strip query string + trailing slash (except root)
  let p = e.path.split("?")[0];
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  dedupedMap.set(p, { ...e, path: p });
}

// Validate against canonical route table. Two-pass: exact match first,
// then prefix match for dynamic parents (e.g. /nominees/west-africa is
// served by /nominees/:region in App.tsx — accept if a prefix route exists).
const dynamicParents = Array.from(allRoutePaths)
  .filter((p) => p.includes(":"))
  .map((p) => p.replace(/\/:.+$/, "")); // crude: take prefix before first :param

function isServed(path: string): boolean {
  if (canonicalRoutes.has(path)) return true;
  // Accept if a dynamic parent route would serve it.
  return dynamicParents.some(
    (parent) => parent && (path === parent || path.startsWith(parent + "/")),
  );
}

const dropped: string[] = [];
const entries: SitemapEntry[] = [];
for (const e of Array.from(dedupedMap.values()).sort((a, b) => a.path.localeCompare(b.path))) {
  if (redirectSources.has(e.path)) {
    dropped.push(`${e.path} (redirect source)`);
    continue;
  }
  if (PRIVATE_PREFIXES.some((p) => e.path === p || e.path.startsWith(p + "/"))) {
    dropped.push(`${e.path} (private)`);
    continue;
  }
  if (!isServed(e.path)) {
    dropped.push(`${e.path} (no matching route)`);
    continue;
  }
  entries.push(e);
}

// ---------------------------------------------------------------------------
// 4. Emit sitemap.xml
// ---------------------------------------------------------------------------
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
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!-- Auto-generated by scripts/generate-sitemap.ts — do not edit by hand -->`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(
  `sitemap.xml written (${entries.length} entries; ${dropped.length} dropped, ${redirectSources.size} known redirect sources excluded)`,
);
if (dropped.length) {
  console.log("  Dropped:");
  for (const d of dropped) console.log(`    - ${d}`);
}
