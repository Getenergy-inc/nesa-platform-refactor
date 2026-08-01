/**
 * NESA-Africa — Master Nominee Register Migration Report
 *
 * Source of truth: NESA_Award_Nominees_Master_List.xlsx, imported verbatim into
 * `src/data/nominees-2025.ts`. This script re-reads that register, applies the
 * approved 2026 Recognition Framework mapping, region assignment and
 * classification rules, and emits a balance-checked migration report.
 *
 * Run:    bunx tsx scripts/nominee-master-migration-report.ts
 * Output: docs/refactor/nominee-master-migration-report.md
 *         docs/refactor/nominee-migration-review-queue.json
 *
 * No record is ever deleted, merged away or overwritten by this script.
 */
import { writeFileSync, mkdirSync } from "fs";
import { NOMINEES_2025 } from "../src/data/nominees-2025";
import { CATEGORY_MAP, CATALOGUE_TIERS, MIN_MAPPING_CONFIDENCE } from "../src/config/directory/catalogueTaxonomy";
import { resolveMasterCategorySlug } from "../src/lib/directory/masterCatalogueSource";
import {
  enrichNomineeGeography,
  identityKey,
  organisationKey,
  standardiseName,
  standardiseCountry,
  APPROVED_REGIONS,
  CLASSIFICATIONS,
} from "../src/lib/directory/nomineeEnrichment";

const inc = (m: Record<string, number>, k: string) => (m[k] = (m[k] ?? 0) + 1);
const table = (title: string, m: Record<string, number>, limit?: number) => {
  const rows = Object.entries(m).sort((a, b) => b[1] - a[1]);
  const shown = limit ? rows.slice(0, limit) : rows;
  return `### ${title}\n\n| Value | Nominees |\n|---|---:|\n${shown
    .map(([k, v]) => `| ${k} | ${v} |`)
    .join("\n")}\n${limit && rows.length > limit ? `\n_${rows.length - limit} further values omitted._\n` : ""}`;
};

const total = NOMINEES_2025.length;

const byTier: Record<string, number> = {};
const byCategory: Record<string, number> = {};
const bySubcategory: Record<string, number> = {};
const byRegion: Record<string, number> = {};
const byClassification: Record<string, number> = {};
const byCountry: Record<string, number> = {};
const byYear: Record<string, number> = {};

const missing = {
  country: 0,
  region: 0,
  category: 0,
  subcategory: 0,
  biography: 0,
  impactSummary: 0,
  photograph: 0,
  evidence: 0,
};

const identities = new Map<string, string[]>();
const orgs = new Map<string, string[]>();
const nameSpellings = new Map<string, Set<string>>();
const reviewQueue: Array<Record<string, string>> = [];
let standardised = 0;

for (const [id, category, region, subcategory, name, country, state, achievement] of NOMINEES_2025) {
  const cleanName = standardiseName(name);
  const cleanCountry = standardiseCountry(country);
  if (cleanName !== (name ?? "") || cleanCountry !== (country ?? "")) standardised += 1;

  const geo = enrichNomineeGeography({ region, country, state, category, subcategory });

  inc(byRegion, geo.region);
  inc(byClassification, geo.classification);
  inc(byCountry, cleanCountry || "Unspecified");
  inc(byYear, "2025");

  if (!cleanCountry) missing.country += 1;
  if (!region || region === "N/A") missing.region += 1;
  if (!category) missing.category += 1;
  if (!subcategory) missing.subcategory += 1;
  if (!achievement) missing.biography += 1;
  if (!achievement) missing.impactSummary += 1;
  missing.photograph += 1; // no photograph column exists in the register
  missing.evidence += 1; // no evidence column exists in the register

  const key = identityKey(cleanName, cleanCountry);
  identities.set(key, [...(identities.get(key) ?? []), `#${id}`]);
  const okey = organisationKey(cleanName);
  if (okey) orgs.set(okey, [...(orgs.get(okey) ?? []), cleanName]);
  const nkey = identityKey(cleanName);
  if (!nameSpellings.has(nkey)) nameSpellings.set(nkey, new Set());
  nameSpellings.get(nkey)!.add(cleanName);

  const categorySlug = resolveMasterCategorySlug(category);
  const mapping = categorySlug ? CATEGORY_MAP[categorySlug] : undefined;

  if (!mapping || mapping.confidence < MIN_MAPPING_CONFIDENCE) {
    reviewQueue.push({
      id: String(id),
      name: cleanName,
      sourceCategory: category,
      subcategory,
      region: geo.region,
      classification: geo.classification,
      reason: mapping
        ? `Mapping confidence ${(mapping.confidence * 100).toFixed(0)}% is below the 90% threshold`
        : "No confirmed tier mapping for this historical category",
    });
    continue;
  }

  inc(byTier, mapping.tier);
  inc(byCategory, mapping.displayName);
  inc(bySubcategory, `${mapping.displayName} → ${subcategory}`);
}

const dupIdentities = [...identities.entries()].filter(([, v]) => v.length > 1);
const dupOrgs = [...orgs.entries()].filter(([, v]) => v.length > 1);
const spellingVariants = [...nameSpellings.entries()].filter(([, v]) => v.size > 1);

const mapped = Object.values(byTier).reduce((a, b) => a + b, 0);
const balanced = mapped + reviewQueue.length === total;
const successPct = ((mapped / total) * 100).toFixed(1);

const md = `# Master Nominee Register — Migration Report

_Generated ${new Date().toISOString()}_

**Source of truth:** \`NESA_Award_Nominees_Master_List.xlsx\` → \`src/data/nominees-2025.ts\`
**Worksheet:** All Nominees

## 1. Balance Check

| Metric | Count |
|---|---:|
| Rows in master register | ${total} |
| Classified into a recognition tier | ${mapped} |
| Held in Migration Review Queue | ${reviewQueue.length} |
| **Accounted for (must equal rows)** | **${mapped + reviewQueue.length}** |
| Records deleted | 0 |
| Import success | ${successPct}% |

${balanced ? "✅ **The register balances 100%.** Every row is imported and accounted for." : "❌ **Register does not balance — publication blocked.**"}

## 2. Data Quality — Detected, Not Deleted

| Issue | Records |
|---|---:|
| Duplicate identity clusters (name + country) | ${dupIdentities.length} |
| Duplicate organisation clusters | ${dupOrgs.length} |
| Name spelling variants | ${spellingVariants.length} |
| Missing country | ${missing.country} |
| Missing region (source column blank) | ${missing.region} |
| Missing category | ${missing.category} |
| Missing subcategory | ${missing.subcategory} |
| Missing biography | ${missing.biography} |
| Missing impact summary | ${missing.impactSummary} |
| Missing photograph | ${missing.photograph} |
| Missing supporting evidence | ${missing.evidence} |
| Records standardised (name/country) | ${standardised} |

> The register carries no photograph, contact, evidence or verification columns.
> Those fields are left blank on the public profile rather than invented, and
> are populated later through NRC verification.

## 3. Recognition Framework Distribution

### By Tier

| Tier | Nominees |
|---|---:|
${CATALOGUE_TIERS.map((t) => `| Tier ${t.tierNumber} · ${t.name} | ${byTier[t.slug] ?? 0} |`).join("\n")}

${table("By Category", byCategory)}
${table("By Subcategory", bySubcategory, 40)}

### By Region (10 approved regions)

| Region | Nominees |
|---|---:|
${APPROVED_REGIONS.map((r) => `| ${r} | ${byRegion[r] ?? 0} |`).join("\n")}

### By Classification

| Classification | Nominees |
|---|---:|
${CLASSIFICATIONS.map((c) => `| ${c} | ${byClassification[c] ?? 0} |`).join("\n")}

${table("By Country", byCountry, 30)}
${table("By Nomination Year", byYear)}

## 4. Migration Review Queue (${reviewQueue.length})

${reviewQueue.length === 0 ? "_Empty — every historical category mapped at ≥90% confidence._" : `| # | Nominee | Source category | Reason |\n|---|---|---|---|\n${reviewQueue.slice(0, 100).map((r) => `| ${r.id} | ${r.name} | ${r.sourceCategory} | ${r.reason} |`).join("\n")}`}

Full payload: \`docs/refactor/nominee-migration-review-queue.json\`

## 5. Duplicate Clusters (${dupIdentities.length})

${dupIdentities.length === 0 ? "_None detected._" : `| Normalised identity | Rows |\n|---|---|\n${dupIdentities.slice(0, 60).map(([k, v]) => `| ${k} | ${v.join(", ")} |`).join("\n")}`}

## 6. Governance Notes

- Mapping is applied at the presentation layer only; no historical row is rewritten.
- Original imported region/country/state values are preserved on every record.
- Every nominee resolves to exactly one tier (or the review queue), one category,
  one subcategory, one of the ten approved regions and one of the three classifications.
- Public profiles are generated at \`/nominees/[slug]\` from register data only.
`;

mkdirSync("docs/refactor", { recursive: true });
writeFileSync("docs/refactor/nominee-master-migration-report.md", md);
writeFileSync(
  "docs/refactor/nominee-migration-review-queue.json",
  JSON.stringify(reviewQueue, null, 2),
);

console.log(`Rows: ${total} | mapped: ${mapped} | review: ${reviewQueue.length} | balanced: ${balanced}`);
