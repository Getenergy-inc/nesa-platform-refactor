/**
 * NESA-Africa Nominee Import Script
 * 
 * This script imports nominees from nominees.final.json into the database
 * via the import-nominees edge function.
 * 
 * Usage:
 *   # Dry run first (recommended)
 *   DRY_RUN=true ADMIN_TOKEN=xxx npx ts-node scripts/import-nominees.ts
 * 
 *   # Actual import
 *   ADMIN_TOKEN=xxx npx ts-node scripts/import-nominees.ts
 * 
 * Environment variables:
 *   ADMIN_TOKEN - Bearer token from admin user session
 *   DRY_RUN - Set to 'true' for validation only (default: false)
 *   BATCH_SIZE - Number of nominees per batch (default: 100)
 */

import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_PROJECT_ID = 'sjghitoydzpirpqjules';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const IMPORT_ENDPOINT = `${SUPABASE_URL}/functions/v1/import-nominees`;

interface ImportNominee {
  name: string;
  slug?: string;
  title?: string;
  organization?: string;
  bio?: string;
  photo_url?: string;
  region?: string;
  subcategory_id?: string;
  subcategory_slug?: string;
  category_slug?: string;
  status?: string;
  is_platinum?: boolean;
  evidence_urls?: string[];
  renomination_count?: number;
}

interface CanonicalNominee {
  fullName: string;
  organisation: string | null;
  country: string | null;
  region: string | null;
  categoryName: string;
  subcategoryName: string;
  profileBio: string | null;
  imageUrl: string | null;
  evidenceLinks: string[];
  status: string;
}

/**
 * Convert canonical nominee to import format
 */
function toImportFormat(nominee: CanonicalNominee): ImportNominee {
  // Generate slug from name
  const slug = nominee.fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Map canonical status to import status
  let status = 'pending';
  if (nominee.status === 'approved') status = 'approved';
  else if (nominee.status === 'rejected') status = 'rejected';
  else if (nominee.status === 'in_review') status = 'under_review';
  else if (nominee.status === 'platinum') status = 'platinum';
  
  // Map category/subcategory names to slugs
  const categorySlug = nominee.categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  const subcategorySlug = nominee.subcategoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  return {
    name: nominee.fullName,
    slug: `${slug}-${Date.now()}`,
    organization: nominee.organisation || undefined,
    bio: nominee.profileBio || undefined,
    photo_url: nominee.imageUrl || undefined,
    region: nominee.region || undefined,
    category_slug: categorySlug,
    subcategory_slug: subcategorySlug,
    status,
    is_platinum: nominee.status === 'platinum',
    evidence_urls: nominee.evidenceLinks.length > 0 ? nominee.evidenceLinks : undefined,
  };
}

/**
 * Import a batch of nominees
 */
async function importBatch(
  nominees: ImportNominee[],
  token: string,
  dryRun: boolean
): Promise<{ success: boolean; imported?: number; failed?: number; errors?: any[] }> {
  const response = await fetch(IMPORT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nominees,
      dry_run: dryRun,
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  
  return data;
}

/**
 * Main import function
 */
async function main() {
  console.log('NESA-Africa Nominee Import Script');
  console.log('==================================\n');
  
  // Get config from environment
  const token = process.env.ADMIN_TOKEN;
  const dryRun = process.env.DRY_RUN === 'true';
  const batchSize = parseInt(process.env.BATCH_SIZE || '100', 10);
  
  if (!token) {
    console.error('Error: ADMIN_TOKEN environment variable required');
    console.log('\nTo get a token:');
    console.log('1. Log in as admin in the NESA-Africa app');
    console.log('2. Open browser DevTools > Application > Local Storage');
    console.log('3. Find the Supabase auth token');
    console.log('\nOr use the Supabase client to sign in programmatically.');
    process.exit(1);
  }
  
  console.log(`Mode: ${dryRun ? 'DRY RUN (validation only)' : 'LIVE IMPORT'}`);
  console.log(`Batch size: ${batchSize}\n`);
  
  // Load nominees
  const finalPath = path.join(__dirname, '..', 'nominees.final.json');
  
  if (!fs.existsSync(finalPath)) {
    console.error('Error: nominees.final.json not found');
    console.log('Run normalize-and-dedupe.ts first.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(finalPath, 'utf-8'));
  const nominees: CanonicalNominee[] = data.nominees || [];
  
  if (nominees.length === 0) {
    console.log('No nominees to import.');
    process.exit(0);
  }
  
  console.log(`Loaded ${nominees.length} nominees from nominees.final.json\n`);
  
  // Convert to import format
  const importNominees = nominees.map(toImportFormat);
  
  // Process in batches
  const batches: ImportNominee[][] = [];
  for (let i = 0; i < importNominees.length; i += batchSize) {
    batches.push(importNominees.slice(i, i + batchSize));
  }
  
  console.log(`Processing ${batches.length} batch(es)...\n`);
  
  let totalImported = 0;
  let totalFailed = 0;
  const allErrors: any[] = [];
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Batch ${i + 1}/${batches.length} (${batch.length} nominees)...`);
    
    try {
      const result = await importBatch(batch, token, dryRun);
      
      if (dryRun) {
        console.log(`  ✓ Would import: ${result.imported || batch.length}`);
        if (result.errors && result.errors.length > 0) {
          console.log(`  ⚠ Validation errors: ${result.errors.length}`);
          allErrors.push(...result.errors);
        }
      } else {
        totalImported += result.imported || 0;
        totalFailed += result.failed || 0;
        if (result.errors) allErrors.push(...result.errors);
        console.log(`  ✓ Imported: ${result.imported}, Failed: ${result.failed}`);
      }
    } catch (error: any) {
      console.error(`  ✗ Batch failed: ${error.message}`);
      totalFailed += batch.length;
    }
    
    // Rate limiting
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Summary
  console.log('\n==================================');
  console.log('Import Summary');
  console.log('==================================');
  
  if (dryRun) {
    console.log(`Mode: DRY RUN`);
    console.log(`Would import: ${importNominees.length - allErrors.length}`);
    console.log(`Validation errors: ${allErrors.length}`);
  } else {
    console.log(`Imported: ${totalImported}`);
    console.log(`Failed: ${totalFailed}`);
  }
  
  if (allErrors.length > 0) {
    console.log('\nErrors:');
    for (const error of allErrors.slice(0, 10)) {
      console.log(`  - ${error.name || 'Unknown'}: ${error.error}`);
    }
    if (allErrors.length > 10) {
      console.log(`  ... and ${allErrors.length - 10} more errors`);
    }
  }
  
  console.log('\nDone!');
}

main().catch(console.error);
