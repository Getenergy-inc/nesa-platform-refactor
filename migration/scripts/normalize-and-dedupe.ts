/**
 * NESA-Africa Nominee Normalization & Deduplication Script
 * 
 * This script:
 * 1. Reads all nominees.raw.*.json files
 * 2. Normalizes to canonical schema
 * 3. Deduplicates by slug or name+org+country
 * 4. Outputs nominees.final.json and nominees.dedupe.report.md
 * 
 * Usage:
 *   npx ts-node scripts/normalize-and-dedupe.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Canonical schema
interface CanonicalNominee {
  legacySource: 'repo' | 'live' | 'refactorzip' | 'manual';
  legacyId: string | null;
  fullName: string;
  organisation: string | null;
  country: string | null;
  region: 'North' | 'West' | 'East' | 'Central' | 'Southern' | null;
  categoryName: string;
  subcategoryName: string;
  tierEligibility: Array<'platinum' | 'gold' | 'blue-garnet' | 'icon'>;
  profileBio: string | null;
  imageUrl: string | null;
  evidenceLinks: string[];
  status: 'submitted' | 'in_review' | 'approved' | 'rejected' | 'platinum';
  createdAt: string | null;
  updatedAt: string | null;
}

interface DedupeResult {
  winner: CanonicalNominee;
  duplicates: CanonicalNominee[];
  dedupeKey: string;
  score: number;
}

// PRD-correct category slugs for validation
const VALID_CATEGORY_SLUGS = [
  'best-csr-education-africa',
  'best-csr-education-nigeria',
  'best-edutech-organisation-africa',
  'best-media-educational-advocacy-nigeria',
  'best-ngo-education-nigeria',
  'best-ngo-education-africa',
  'best-stem-education-africa',
  'creative-arts-education-nigeria',
  'best-education-friendly-state-nigeria',
  'best-library-tertiary-nigeria',
  'best-research-development-nigeria',
  'christian-education-impact-africa',
  'islamic-education-impact-africa',
  'political-leaders-education-nigeria',
  'international-bilateral-education',
  'diaspora-education-impact',
  'africa-education-icon-award',
];

/**
 * Normalize string for comparison
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Generate dedupe key from nominee
 */
function generateDedupeKey(nominee: CanonicalNominee): string {
  // If slug exists in legacy data, use it
  if (nominee.legacyId && nominee.legacyId.startsWith('slug:')) {
    return nominee.legacyId;
  }
  
  // Otherwise, normalize name + org + country
  const parts = [
    normalizeString(nominee.fullName),
    normalizeString(nominee.organisation || ''),
    normalizeString(nominee.country || ''),
  ];
  
  return parts.join('|');
}

/**
 * Score a nominee for deduplication (higher = better)
 */
function scoreNominee(nominee: CanonicalNominee): number {
  let score = 0;
  
  // Has valid category/subcategory mapping (+3)
  if (nominee.categoryName !== 'UNMAPPED' && nominee.subcategoryName !== 'UNMAPPED') {
    score += 3;
  }
  
  // Has profile image (+2)
  if (nominee.imageUrl) {
    score += 2;
  }
  
  // Has bio (+1)
  if (nominee.profileBio && nominee.profileBio.length > 10) {
    score += 1;
  }
  
  // Has evidence links (+1)
  if (nominee.evidenceLinks.length > 0) {
    score += 1;
  }
  
  // More recent update (+1)
  if (nominee.updatedAt) {
    score += 1;
  }
  
  // Approved status (+1)
  if (nominee.status === 'approved' || nominee.status === 'platinum') {
    score += 1;
  }
  
  return score;
}

/**
 * Main processing function
 */
async function main() {
  console.log('NESA-Africa Normalization & Deduplication Script');
  console.log('=================================================\n');
  
  const migrationDir = path.join(__dirname, '..');
  const rawFiles: string[] = [];
  
  // Find all raw files
  const files = fs.readdirSync(migrationDir);
  for (const file of files) {
    if (file.startsWith('nominees.raw.') && file.endsWith('.json')) {
      rawFiles.push(path.join(migrationDir, file));
    }
  }
  
  console.log(`Found ${rawFiles.length} raw data files\n`);
  
  // Collect all nominees from all sources
  const allNominees: CanonicalNominee[] = [];
  const sourceCounts: Record<string, number> = {};
  
  for (const filePath of rawFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      const nominees = data.nominees || [];
      
      console.log(`  ${path.basename(filePath)}: ${nominees.length} nominees`);
      allNominees.push(...nominees);
      
      const source = data._meta?.source || 'unknown';
      sourceCounts[source] = (sourceCounts[source] || 0) + nominees.length;
    } catch (e) {
      console.warn(`  Warning: Failed to read ${filePath}`);
    }
  }
  
  console.log(`\nTotal raw nominees: ${allNominees.length}\n`);
  
  // Deduplicate
  const dedupeMap = new Map<string, DedupeResult>();
  
  for (const nominee of allNominees) {
    const key = generateDedupeKey(nominee);
    const score = scoreNominee(nominee);
    
    const existing = dedupeMap.get(key);
    
    if (!existing) {
      dedupeMap.set(key, {
        winner: nominee,
        duplicates: [],
        dedupeKey: key,
        score,
      });
    } else if (score > existing.score) {
      // New record is better, make it the winner
      existing.duplicates.push(existing.winner);
      existing.winner = nominee;
      existing.score = score;
    } else {
      // Existing is better, add new as duplicate
      existing.duplicates.push(nominee);
    }
  }
  
  // Collect results
  const finalNominees: CanonicalNominee[] = [];
  const unmappedNominees: CanonicalNominee[] = [];
  let totalDuplicates = 0;
  
  for (const result of dedupeMap.values()) {
    finalNominees.push(result.winner);
    totalDuplicates += result.duplicates.length;
    
    if (result.winner.categoryName === 'UNMAPPED' || result.winner.subcategoryName === 'UNMAPPED') {
      unmappedNominees.push(result.winner);
    }
  }
  
  console.log(`Unique nominees after dedupe: ${finalNominees.length}`);
  console.log(`Duplicates removed: ${totalDuplicates}`);
  console.log(`Nominees needing mapping: ${unmappedNominees.length}\n`);
  
  // Write final.json
  const finalOutput = {
    _meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      description: 'Canonical deduped nominee import file for NESA-Africa 2025',
      schema_version: '1.0',
      total_count: finalNominees.length,
      ready_for_import: unmappedNominees.length === 0,
      sources: sourceCounts,
    },
    nominees: finalNominees,
  };
  
  fs.writeFileSync(
    path.join(migrationDir, 'nominees.final.json'),
    JSON.stringify(finalOutput, null, 2)
  );
  
  console.log('✓ Written nominees.final.json');
  
  // Update dedupe report
  const reportContent = generateDedupeReport(allNominees, finalNominees, dedupeMap, sourceCounts);
  fs.writeFileSync(
    path.join(migrationDir, 'nominees.dedupe.report.md'),
    reportContent
  );
  
  console.log('✓ Updated nominees.dedupe.report.md');
  
  // Update mapping todo
  if (unmappedNominees.length > 0) {
    const todoContent = generateMappingTodo(unmappedNominees);
    fs.writeFileSync(
      path.join(migrationDir, 'nominees.mapping.todo.md'),
      todoContent
    );
    console.log('✓ Updated nominees.mapping.todo.md');
  }
  
  console.log('\nDone!');
}

/**
 * Generate dedupe report markdown
 */
function generateDedupeReport(
  allNominees: CanonicalNominee[],
  finalNominees: CanonicalNominee[],
  dedupeMap: Map<string, DedupeResult>,
  sourceCounts: Record<string, number>
): string {
  const duplicatesFound: DedupeResult[] = [];
  for (const result of dedupeMap.values()) {
    if (result.duplicates.length > 0) {
      duplicatesFound.push(result);
    }
  }
  
  let content = `# NESA-Africa Legacy Nominee Deduplication Report

**Generated:** ${new Date().toISOString().split('T')[0]}  
**Migration Pack Version:** 1.0.0

---

## Summary

| Metric | Count |
|--------|-------|
| Total Raw Records | ${allNominees.length} |
| Final Canonical Records | ${finalNominees.length} |
| Duplicates Removed | ${allNominees.length - finalNominees.length} |
| Duplicate Groups | ${duplicatesFound.length} |

---

## Source Breakdown

| Source | Records |
|--------|---------|
`;

  for (const [source, count] of Object.entries(sourceCounts)) {
    content += `| ${source} | ${count} |\n`;
  }

  content += `
---

## Duplicates Found

`;

  if (duplicatesFound.length === 0) {
    content += `**None** - No duplicate records found.\n`;
  } else {
    content += `Found ${duplicatesFound.length} duplicate groups:\n\n`;
    
    for (const result of duplicatesFound.slice(0, 10)) {
      content += `### ${result.winner.fullName}\n`;
      content += `- **Dedupe Key:** \`${result.dedupeKey}\`\n`;
      content += `- **Winner Score:** ${result.score}\n`;
      content += `- **Sources:** Winner from ${result.winner.legacySource}, ${result.duplicates.length} duplicates\n\n`;
    }
    
    if (duplicatesFound.length > 10) {
      content += `... and ${duplicatesFound.length - 10} more duplicate groups.\n`;
    }
  }

  return content;
}

/**
 * Generate mapping todo markdown
 */
function generateMappingTodo(unmappedNominees: CanonicalNominee[]): string {
  let content = `# NESA-Africa Nominee Mapping TODO

**Generated:** ${new Date().toISOString().split('T')[0]}  
**Status:** ${unmappedNominees.length} nominees need mapping

---

## Nominees Requiring Manual Mapping

`;

  for (let i = 0; i < unmappedNominees.length; i++) {
    const nominee = unmappedNominees[i];
    content += `### NOM-${String(i + 1).padStart(3, '0')}: ${nominee.fullName}
- **Source:** ${nominee.legacySource}
- **Legacy Category:** ${nominee.categoryName}
- **Legacy Subcategory:** ${nominee.subcategoryName}
- **Organisation:** ${nominee.organisation || 'N/A'}
- **Country:** ${nominee.country || 'N/A'}
- **Suggested Mapping:** _TO BE DETERMINED_
- **Action Required:** REVIEW

`;
  }

  return content;
}

main().catch(console.error);
