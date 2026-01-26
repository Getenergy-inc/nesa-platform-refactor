/**
 * NESA-Africa Legacy Nominee ZIP Extraction Script
 * 
 * This script extracts nominee data from ZIP archives containing
 * legacy codebase exports.
 * 
 * Usage:
 *   npx ts-node scripts/extract-from-zip.ts /path/to/archive.zip
 * 
 * Output:
 *   - nominees.raw.zip-[timestamp].json
 */

import * as fs from 'fs';
import * as path from 'path';

// Canonical schema interface
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

// Search patterns for nominee data in files
const SEARCH_PATTERNS = {
  json: /\.(json)$/i,
  csv: /\.(csv)$/i,
  typescript: /\.(ts|tsx)$/i,
  javascript: /\.(js|jsx)$/i,
};

const NOMINEE_KEYWORDS = [
  'nominee',
  'nominees',
  'nomination',
  'nominations',
  'seed',
  'fixture',
  'mock',
  'data',
];

/**
 * Parse JSON file for nominee data
 */
function parseJsonFile(content: string, filePath: string): CanonicalNominee[] {
  try {
    const data = JSON.parse(content);
    const nominees: CanonicalNominee[] = [];
    
    // Handle array of nominees
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const nominee = extractNomineeFromObject(item, `${filePath}[${index}]`);
        if (nominee) nominees.push(nominee);
      });
    }
    
    // Handle object with nominees property
    if (data.nominees && Array.isArray(data.nominees)) {
      data.nominees.forEach((item: any, index: number) => {
        const nominee = extractNomineeFromObject(item, `${filePath}.nominees[${index}]`);
        if (nominee) nominees.push(nominee);
      });
    }
    
    // Handle object with data property
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((item: any, index: number) => {
        const nominee = extractNomineeFromObject(item, `${filePath}.data[${index}]`);
        if (nominee) nominees.push(nominee);
      });
    }
    
    return nominees;
  } catch (e) {
    console.warn(`Failed to parse JSON: ${filePath}`, e);
    return [];
  }
}

/**
 * Extract nominee from various object shapes
 */
function extractNomineeFromObject(obj: any, source: string): CanonicalNominee | null {
  if (!obj || typeof obj !== 'object') return null;
  
  // Try to find name field
  const name = obj.name || obj.fullName || obj.nominee_name || obj.nomineeName || obj.title;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return null;
  }
  
  // Map status values
  let status: CanonicalNominee['status'] = 'submitted';
  const rawStatus = String(obj.status || '').toLowerCase();
  if (rawStatus.includes('approved')) status = 'approved';
  else if (rawStatus.includes('review')) status = 'in_review';
  else if (rawStatus.includes('reject')) status = 'rejected';
  else if (rawStatus.includes('platinum')) status = 'platinum';
  
  // Map region values
  let region: CanonicalNominee['region'] = null;
  const rawRegion = String(obj.region || '').toLowerCase();
  if (rawRegion.includes('north') && !rawRegion.includes('south')) region = 'North';
  else if (rawRegion.includes('west')) region = 'West';
  else if (rawRegion.includes('east')) region = 'East';
  else if (rawRegion.includes('central')) region = 'Central';
  else if (rawRegion.includes('south')) region = 'Southern';
  
  return {
    legacySource: 'refactorzip',
    legacyId: obj.id || obj.legacyId || null,
    fullName: name.trim(),
    organisation: obj.organization || obj.organisation || obj.org || null,
    country: obj.country || null,
    region,
    categoryName: obj.category || obj.categoryName || obj.category_name || 'UNMAPPED',
    subcategoryName: obj.subcategory || obj.subcategoryName || obj.subcategory_name || 'UNMAPPED',
    tierEligibility: inferTierEligibility(obj),
    profileBio: obj.bio || obj.description || obj.profileBio || null,
    imageUrl: obj.photo_url || obj.image || obj.imageUrl || obj.avatar || null,
    evidenceLinks: extractEvidenceLinks(obj),
    status,
    createdAt: obj.created_at || obj.createdAt || null,
    updatedAt: obj.updated_at || obj.updatedAt || null,
  };
}

/**
 * Infer tier eligibility from object properties
 */
function inferTierEligibility(obj: any): CanonicalNominee['tierEligibility'] {
  const tiers: CanonicalNominee['tierEligibility'] = [];
  
  if (obj.tierEligibility && Array.isArray(obj.tierEligibility)) {
    return obj.tierEligibility.filter((t: string) => 
      ['platinum', 'gold', 'blue-garnet', 'icon'].includes(t)
    );
  }
  
  if (obj.is_platinum || obj.isPlatinum) tiers.push('platinum');
  if (obj.is_gold || obj.isGold) tiers.push('gold');
  if (obj.is_blue_garnet || obj.isBlueGarnet) tiers.push('blue-garnet');
  if (obj.is_icon || obj.isIcon) tiers.push('icon');
  
  // Default eligibility based on status
  if (tiers.length === 0) {
    if (obj.status === 'approved') {
      tiers.push('platinum', 'gold');
    }
  }
  
  return tiers;
}

/**
 * Extract evidence links from object
 */
function extractEvidenceLinks(obj: any): string[] {
  if (obj.evidence_urls && Array.isArray(obj.evidence_urls)) {
    return obj.evidence_urls.filter((url: any) => typeof url === 'string');
  }
  if (obj.evidenceLinks && Array.isArray(obj.evidenceLinks)) {
    return obj.evidenceLinks.filter((url: any) => typeof url === 'string');
  }
  return [];
}

/**
 * Main extraction function
 */
async function main() {
  console.log('NESA-Africa ZIP Extraction Script');
  console.log('==================================\n');
  
  const zipPath = process.argv[2];
  
  if (!zipPath) {
    console.log('Usage: npx ts-node scripts/extract-from-zip.ts /path/to/archive.zip');
    console.log('\nThis script requires the AdmZip library. Install with:');
    console.log('  npm install adm-zip @types/adm-zip');
    console.log('\nAlternatively, extract the ZIP manually and run:');
    console.log('  npx ts-node scripts/extract-from-zip.ts /path/to/extracted/folder');
    process.exit(1);
  }
  
  // Check if path exists
  if (!fs.existsSync(zipPath)) {
    console.error(`Error: Path not found: ${zipPath}`);
    process.exit(1);
  }
  
  const stats = fs.statSync(zipPath);
  let filesToProcess: string[] = [];
  
  if (stats.isDirectory()) {
    // Process directory recursively
    console.log(`Processing directory: ${zipPath}\n`);
    filesToProcess = findFilesRecursively(zipPath);
  } else {
    console.log('Note: ZIP extraction requires manual extraction first.');
    console.log('Please extract the ZIP and provide the folder path.\n');
    process.exit(1);
  }
  
  console.log(`Found ${filesToProcess.length} files to scan\n`);
  
  const allNominees: CanonicalNominee[] = [];
  const sourceFiles: string[] = [];
  
  for (const filePath of filesToProcess) {
    // Skip node_modules and .git
    if (filePath.includes('node_modules') || filePath.includes('.git')) continue;
    
    // Check if file might contain nominee data
    const fileName = path.basename(filePath).toLowerCase();
    const hasKeyword = NOMINEE_KEYWORDS.some(kw => fileName.includes(kw));
    const isDataFile = SEARCH_PATTERNS.json.test(fileName) || SEARCH_PATTERNS.csv.test(fileName);
    
    if (hasKeyword || isDataFile) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Check content for nominee-related data
        const contentLower = content.toLowerCase();
        const containsNomineeData = NOMINEE_KEYWORDS.some(kw => contentLower.includes(kw));
        
        if (containsNomineeData && SEARCH_PATTERNS.json.test(fileName)) {
          const nominees = parseJsonFile(content, filePath);
          if (nominees.length > 0) {
            console.log(`✓ Found ${nominees.length} nominees in: ${filePath}`);
            allNominees.push(...nominees);
            sourceFiles.push(filePath);
          }
        }
      } catch (e) {
        // Ignore read errors
      }
    }
  }
  
  // Write output
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(__dirname, '..', `nominees.raw.zip-${timestamp}.json`);
  
  const output = {
    _meta: {
      source: 'refactorzip',
      extractedAt: new Date().toISOString(),
      sourceArchive: zipPath,
      filesProcessed: sourceFiles,
      total_count: allNominees.length,
    },
    nominees: allNominees,
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n==================================`);
  console.log(`Total nominees extracted: ${allNominees.length}`);
  console.log(`Output written to: ${outputPath}`);
}

/**
 * Recursively find all files in directory
 */
function findFilesRecursively(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFilesRecursively(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

main().catch(console.error);
