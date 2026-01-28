/**
 * NESA-Africa Legacy Prisma Export Script
 * 
 * Exports nominees from legacy Supabase/Prisma backend to PRD-ready import format.
 * 
 * This script handles:
 * - Brand/org info preservation (organization, website, linkedinProfile, profileImageUrl)
 * - Work done tracking (nominationReason + nominatorMessage + evidence)
 * - Renomination history and counts
 * 
 * Prerequisites:
 * - Access to legacy Postgres/Supabase database
 * - DATABASE_URL environment variable set
 * 
 * Usage:
 *   export DATABASE_URL="postgres://..."
 *   npx ts-node migration/scripts/export-from-legacy-prisma.ts
 * 
 * Output:
 *   - exports/legacy_nominees.json
 *   - exports/legacy_nomination_records.json
 *   - exports/prd_nominees.csv
 *   - exports/prd_nominations.csv
 *   - exports/import_summary.json
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// CONFIGURATION - Update these for your legacy database
// =============================================================================

// Legacy Supabase credentials (from nesaserver backend)
const LEGACY_SUPABASE_URL = process.env.LEGACY_SUPABASE_URL || '';
const LEGACY_SUPABASE_SERVICE_KEY = process.env.LEGACY_SUPABASE_SERVICE_KEY || '';

// Alternatively, use direct Postgres connection
const DATABASE_URL = process.env.DATABASE_URL || '';

// =============================================================================
// LEGACY SCHEMA INTERFACES (from Prisma schema in nesaserver ZIP)
// =============================================================================

interface LegacyNominee {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  organization?: string;
  website?: string;
  linkedinProfile?: string;
  title?: string;
  bio?: string;
  profileImageUrl?: string;
  logoUrl?: string;
  country?: string;
  region?: string;
  
  // Category references
  categoryId?: string;
  subcategoryId?: string;
  
  // Status & verification
  status: string;
  approvalStatus?: string;
  nrcVerified?: boolean;
  nrcVerifiedAt?: string;
  
  // Nomination tracking
  nominationCount: number;
  approvedNominationCount: number;
  
  // Acceptance
  acceptanceStatus?: string;
  acceptedAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

interface LegacyNominationRecord {
  id: string;
  nomineeId: string;
  nominatorId?: string;
  nominatorEmail?: string;
  nominatorName?: string;
  nominatorPhone?: string;
  
  // Nomination content
  nominationReason?: string;
  nominatorMessage?: string;
  endorsementMessage?: string;
  
  // Source tracking
  channel?: string; // START_MEMBER, NRC, PUBLIC
  
  // Status
  status: string;
  reviewedAt?: string;
  reviewNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

interface LegacySupportingDocument {
  id: string;
  nomineeId?: string;
  nominationRecordId?: string;
  fileUrl: string;
  fileType?: string;
  description?: string;
  createdAt: string;
}

interface LegacyCertificate {
  id: string;
  nomineeId: string;
  tier: string;
  serialNumber?: string;
  verificationCode?: string;
  downloadLocked?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  status: string;
}

interface LegacyCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface LegacySubcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
}

// =============================================================================
// PRD EXPORT INTERFACES (for new Lovable NESA.Africa)
// =============================================================================

interface PRDNominee {
  // Identity
  legacy_id: string;
  legacy_source: 'prisma_export';
  full_name: string;
  slug: string;
  email?: string;
  phone?: string;
  
  // Brand info
  brand_name?: string; // organization
  website?: string;
  linkedin?: string;
  profile_image_url?: string;
  logo_url?: string;
  
  // Location
  country?: string;
  region?: string;
  
  // Category (requires mapping)
  legacy_category_id?: string;
  legacy_category_name?: string;
  legacy_subcategory_id?: string;
  legacy_subcategory_name?: string;
  mapped_category_slug?: string;
  mapped_subcategory_slug?: string;
  
  // Work done summary
  work_done: string; // Combined from nomination reasons
  evidence_links: string[];
  
  // Status
  status: string;
  acceptance_status?: string;
  nrc_verified: boolean;
  
  // Renomination tracking
  renomination_count_total: number;
  nomination_records_total: number;
  nomination_records_approved: number;
  
  // Tier eligibility
  tier_eligibility: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

interface PRDNomination {
  legacy_id: string;
  legacy_nominee_id: string;
  
  // Nominator info
  nominator_id?: string;
  nominator_email?: string;
  nominator_name?: string;
  
  // Channel inference
  channel: 'START_MEMBER' | 'NRC' | 'PUBLIC';
  
  // Content
  nomination_reason?: string;
  nominator_message?: string;
  endorsement_message?: string;
  
  // Status
  status: string;
  
  // Timestamps
  created_at: string;
}

// =============================================================================
// CATEGORY MAPPING (from PRD 17-category model)
// =============================================================================

// Load category mapping from JSON
function loadCategoryMapping(): Record<string, { categorySlug: string; subcategorySlug?: string }> {
  const mappingPath = path.join(__dirname, '..', 'category-mapping.json');
  if (fs.existsSync(mappingPath)) {
    const data = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    // Build lookup from legacy names to new slugs
    const lookup: Record<string, { categorySlug: string; subcategorySlug?: string }> = {};
    
    // Add invalid category mappings
    if (data.invalid_categories_mapping) {
      for (const [key, value] of Object.entries(data.invalid_categories_mapping as Record<string, any>)) {
        if (value.target) {
          lookup[key.toLowerCase()] = {
            categorySlug: value.target,
            subcategorySlug: value.subcategory || undefined,
          };
        }
      }
    }
    
    return lookup;
  }
  return {};
}

// =============================================================================
// EXPORT FUNCTIONS
// =============================================================================

async function fetchLegacyData(supabase: ReturnType<typeof createClient>) {
  console.log('Fetching legacy data...\n');
  
  // Fetch nominees
  const { data: nominees, error: nomineesError } = await supabase
    .from('nominees')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (nomineesError) {
    throw new Error(`Failed to fetch nominees: ${nomineesError.message}`);
  }
  
  console.log(`  Nominees: ${nominees?.length || 0}`);
  
  // Fetch nomination records
  const { data: nominationRecords, error: recordsError } = await supabase
    .from('nomination_records')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (recordsError) {
    console.log(`  Nomination records: Error - ${recordsError.message}`);
  } else {
    console.log(`  Nomination records: ${nominationRecords?.length || 0}`);
  }
  
  // Fetch supporting documents
  const { data: documents, error: docsError } = await supabase
    .from('supporting_documents')
    .select('*');
  
  if (docsError) {
    console.log(`  Supporting documents: Error - ${docsError.message}`);
  } else {
    console.log(`  Supporting documents: ${documents?.length || 0}`);
  }
  
  // Fetch certificates
  const { data: certificates, error: certsError } = await supabase
    .from('certificates')
    .select('*');
  
  if (certsError) {
    console.log(`  Certificates: Error - ${certsError.message}`);
  } else {
    console.log(`  Certificates: ${certificates?.length || 0}`);
  }
  
  // Fetch categories
  const { data: categories, error: catsError } = await supabase
    .from('categories')
    .select('*');
  
  if (catsError) {
    console.log(`  Categories: Error - ${catsError.message}`);
  } else {
    console.log(`  Categories: ${categories?.length || 0}`);
  }
  
  // Fetch subcategories
  const { data: subcategories, error: subcatsError } = await supabase
    .from('subcategories')
    .select('*');
  
  if (subcatsError) {
    console.log(`  Subcategories: Error - ${subcatsError.message}`);
  } else {
    console.log(`  Subcategories: ${subcategories?.length || 0}`);
  }
  
  return {
    nominees: (nominees || []) as LegacyNominee[],
    nominationRecords: (nominationRecords || []) as LegacyNominationRecord[],
    documents: (documents || []) as LegacySupportingDocument[],
    certificates: (certificates || []) as LegacyCertificate[],
    categories: (categories || []) as LegacyCategory[],
    subcategories: (subcategories || []) as LegacySubcategory[],
  };
}

function transformToPRD(
  legacyData: Awaited<ReturnType<typeof fetchLegacyData>>,
  categoryMapping: Record<string, { categorySlug: string; subcategorySlug?: string }>
): { nominees: PRDNominee[]; nominations: PRDNomination[] } {
  console.log('\nTransforming to PRD format...\n');
  
  const { nominees, nominationRecords, documents, categories, subcategories, certificates } = legacyData;
  
  // Build lookups
  const categoryLookup = new Map(categories.map(c => [c.id, c]));
  const subcategoryLookup = new Map(subcategories.map(s => [s.id, s]));
  const recordsByNominee = new Map<string, LegacyNominationRecord[]>();
  const docsByNominee = new Map<string, LegacySupportingDocument[]>();
  const certsByNominee = new Map<string, LegacyCertificate[]>();
  
  for (const record of nominationRecords) {
    if (!recordsByNominee.has(record.nomineeId)) {
      recordsByNominee.set(record.nomineeId, []);
    }
    recordsByNominee.get(record.nomineeId)!.push(record);
  }
  
  for (const doc of documents) {
    const key = doc.nomineeId || doc.nominationRecordId || '';
    if (!docsByNominee.has(key)) {
      docsByNominee.set(key, []);
    }
    docsByNominee.get(key)!.push(doc);
  }
  
  for (const cert of certificates) {
    if (!certsByNominee.has(cert.nomineeId)) {
      certsByNominee.set(cert.nomineeId, []);
    }
    certsByNominee.get(cert.nomineeId)!.push(cert);
  }
  
  // Transform nominees
  const prdNominees: PRDNominee[] = [];
  const prdNominations: PRDNomination[] = [];
  
  for (const nominee of nominees) {
    const records = recordsByNominee.get(nominee.id) || [];
    const docs = docsByNominee.get(nominee.id) || [];
    const certs = certsByNominee.get(nominee.id) || [];
    
    // Get category info
    const category = nominee.categoryId ? categoryLookup.get(nominee.categoryId) : undefined;
    const subcategory = nominee.subcategoryId ? subcategoryLookup.get(nominee.subcategoryId) : undefined;
    
    // Try to map to new category structure
    const categoryName = category?.name?.toLowerCase() || '';
    const mapping = categoryMapping[categoryName];
    
    // Compile work done from all nomination records
    const workDoneParts: string[] = [];
    for (const record of records) {
      if (record.nominationReason) workDoneParts.push(record.nominationReason);
      if (record.nominatorMessage) workDoneParts.push(record.nominatorMessage);
      if (record.endorsementMessage) workDoneParts.push(record.endorsementMessage);
    }
    const workDone = workDoneParts.join('\n\n---\n\n');
    
    // Collect evidence links
    const evidenceLinks = docs.map(d => d.fileUrl).filter(Boolean);
    
    // Determine tier eligibility
    const tierEligibility: string[] = [];
    for (const cert of certs) {
      if (!tierEligibility.includes(cert.tier)) {
        tierEligibility.push(cert.tier);
      }
    }
    if (tierEligibility.length === 0 && nominee.status === 'approved') {
      tierEligibility.push('platinum');
    }
    
    // Count approved nominations
    const approvedCount = records.filter(r => r.status === 'approved').length;
    
    prdNominees.push({
      legacy_id: nominee.id,
      legacy_source: 'prisma_export',
      full_name: nominee.name,
      slug: nominee.slug,
      email: nominee.email,
      phone: nominee.phone,
      
      brand_name: nominee.organization,
      website: nominee.website,
      linkedin: nominee.linkedinProfile,
      profile_image_url: nominee.profileImageUrl,
      logo_url: nominee.logoUrl,
      
      country: nominee.country,
      region: nominee.region,
      
      legacy_category_id: nominee.categoryId,
      legacy_category_name: category?.name,
      legacy_subcategory_id: nominee.subcategoryId,
      legacy_subcategory_name: subcategory?.name,
      mapped_category_slug: mapping?.categorySlug,
      mapped_subcategory_slug: mapping?.subcategorySlug,
      
      work_done: workDone,
      evidence_links: evidenceLinks,
      
      status: nominee.status,
      acceptance_status: nominee.acceptanceStatus,
      nrc_verified: nominee.nrcVerified || false,
      
      renomination_count_total: nominee.nominationCount || 0,
      nomination_records_total: records.length,
      nomination_records_approved: approvedCount,
      
      tier_eligibility: tierEligibility,
      
      created_at: nominee.createdAt,
      updated_at: nominee.updatedAt,
    });
    
    // Transform nomination records
    for (const record of records) {
      // Infer channel
      let channel: PRDNomination['channel'] = 'PUBLIC';
      if (record.channel) {
        if (record.channel.toUpperCase().includes('START') || record.channel.toUpperCase().includes('MEMBER')) {
          channel = 'START_MEMBER';
        } else if (record.channel.toUpperCase().includes('NRC')) {
          channel = 'NRC';
        }
      } else if (!record.nominatorId && !record.nominatorEmail) {
        channel = 'NRC'; // If no nominator info, likely NRC-sourced
      }
      
      prdNominations.push({
        legacy_id: record.id,
        legacy_nominee_id: record.nomineeId,
        
        nominator_id: record.nominatorId,
        nominator_email: record.nominatorEmail,
        nominator_name: record.nominatorName,
        
        channel,
        
        nomination_reason: record.nominationReason,
        nominator_message: record.nominatorMessage,
        endorsement_message: record.endorsementMessage,
        
        status: record.status,
        
        created_at: record.createdAt,
      });
    }
  }
  
  console.log(`  PRD Nominees: ${prdNominees.length}`);
  console.log(`  PRD Nominations: ${prdNominations.length}`);
  
  return { nominees: prdNominees, nominations: prdNominations };
}

function writeExports(
  legacyData: Awaited<ReturnType<typeof fetchLegacyData>>,
  prdData: ReturnType<typeof transformToPRD>
) {
  const exportsDir = path.join(__dirname, '..', 'exports');
  
  // Create exports directory
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  
  console.log('\nWriting exports...\n');
  
  // Write legacy JSON exports
  fs.writeFileSync(
    path.join(exportsDir, 'legacy_nominees.json'),
    JSON.stringify(legacyData.nominees, null, 2)
  );
  console.log(`  ✓ legacy_nominees.json`);
  
  fs.writeFileSync(
    path.join(exportsDir, 'legacy_nomination_records.json'),
    JSON.stringify(legacyData.nominationRecords, null, 2)
  );
  console.log(`  ✓ legacy_nomination_records.json`);
  
  fs.writeFileSync(
    path.join(exportsDir, 'legacy_documents.json'),
    JSON.stringify(legacyData.documents, null, 2)
  );
  console.log(`  ✓ legacy_documents.json`);
  
  fs.writeFileSync(
    path.join(exportsDir, 'legacy_certificates.json'),
    JSON.stringify(legacyData.certificates, null, 2)
  );
  console.log(`  ✓ legacy_certificates.json`);
  
  // Write PRD JSON exports
  fs.writeFileSync(
    path.join(exportsDir, 'prd_nominees.json'),
    JSON.stringify(prdData.nominees, null, 2)
  );
  console.log(`  ✓ prd_nominees.json`);
  
  fs.writeFileSync(
    path.join(exportsDir, 'prd_nominations.json'),
    JSON.stringify(prdData.nominations, null, 2)
  );
  console.log(`  ✓ prd_nominations.json`);
  
  // Write CSV exports
  const nomineeCsv = convertToCSV(prdData.nominees);
  fs.writeFileSync(path.join(exportsDir, 'prd_nominees.csv'), nomineeCsv);
  console.log(`  ✓ prd_nominees.csv`);
  
  const nominationsCsv = convertToCSV(prdData.nominations);
  fs.writeFileSync(path.join(exportsDir, 'prd_nominations.csv'), nominationsCsv);
  console.log(`  ✓ prd_nominations.csv`);
  
  // Write import summary
  const summary = {
    exported_at: new Date().toISOString(),
    legacy_totals: {
      nominees: legacyData.nominees.length,
      nomination_records: legacyData.nominationRecords.length,
      documents: legacyData.documents.length,
      certificates: legacyData.certificates.length,
      categories: legacyData.categories.length,
      subcategories: legacyData.subcategories.length,
    },
    prd_totals: {
      nominees: prdData.nominees.length,
      nominations: prdData.nominations.length,
    },
    category_mapping_needed: prdData.nominees.filter(n => !n.mapped_category_slug).length,
    channels: {
      START_MEMBER: prdData.nominations.filter(n => n.channel === 'START_MEMBER').length,
      NRC: prdData.nominations.filter(n => n.channel === 'NRC').length,
      PUBLIC: prdData.nominations.filter(n => n.channel === 'PUBLIC').length,
    },
    status_breakdown: {} as Record<string, number>,
  };
  
  for (const nominee of prdData.nominees) {
    summary.status_breakdown[nominee.status] = (summary.status_breakdown[nominee.status] || 0) + 1;
  }
  
  fs.writeFileSync(
    path.join(exportsDir, 'import_summary.json'),
    JSON.stringify(summary, null, 2)
  );
  console.log(`  ✓ import_summary.json`);
  
  return summary;
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(item => 
    headers.map(h => {
      const value = item[h];
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return `"${value.join(';')}"`;
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('NESA-Africa Legacy Prisma Export Script');
  console.log('=======================================\n');
  
  // Check configuration
  if (!LEGACY_SUPABASE_URL || !LEGACY_SUPABASE_SERVICE_KEY) {
    console.log('Configuration required:');
    console.log('  export LEGACY_SUPABASE_URL="https://xxx.supabase.co"');
    console.log('  export LEGACY_SUPABASE_SERVICE_KEY="eyJ..."');
    console.log('\nAlternatively for direct Postgres:');
    console.log('  export DATABASE_URL="postgres://..."');
    console.log('\nNote: You can also manually export from Supabase dashboard:');
    console.log('  1. Go to Table Editor > nominees');
    console.log('  2. Click Export > CSV');
    console.log('  3. Repeat for nomination_records, supporting_documents, certificates');
    console.log('  4. Place CSVs in migration/exports/ folder');
    process.exit(1);
  }
  
  // Initialize Supabase client
  const supabase = createClient(LEGACY_SUPABASE_URL, LEGACY_SUPABASE_SERVICE_KEY);
  
  // Load category mapping
  const categoryMapping = loadCategoryMapping();
  console.log(`Loaded ${Object.keys(categoryMapping).length} category mappings\n`);
  
  // Fetch legacy data
  const legacyData = await fetchLegacyData(supabase);
  
  // Transform to PRD format
  const prdData = transformToPRD(legacyData, categoryMapping);
  
  // Write exports
  const summary = writeExports(legacyData, prdData);
  
  // Print summary
  console.log('\n=======================================');
  console.log('Export Summary');
  console.log('=======================================');
  console.log(`Total nominees: ${summary.prd_totals.nominees}`);
  console.log(`Total nominations: ${summary.prd_totals.nominations}`);
  console.log(`Need category mapping: ${summary.category_mapping_needed}`);
  console.log('\nChannel breakdown:');
  console.log(`  START_MEMBER: ${summary.channels.START_MEMBER}`);
  console.log(`  NRC: ${summary.channels.NRC}`);
  console.log(`  PUBLIC: ${summary.channels.PUBLIC}`);
  console.log('\nStatus breakdown:');
  for (const [status, count] of Object.entries(summary.status_breakdown)) {
    console.log(`  ${status}: ${count}`);
  }
  console.log('\nExports written to: migration/exports/');
  console.log('\nNext steps:');
  console.log('1. Review prd_nominees.csv and prd_nominations.csv');
  console.log('2. Fix any category mappings in nominees with mapped_category_slug = null');
  console.log('3. Run import-nominees.ts with DRY_RUN=true first');
  console.log('4. Then run actual import');
}

main().catch(console.error);
