# NESA-Africa Legacy Nominee Migration Runbook

**Version:** 2.0.0  
**Last Updated:** 2026-01-28

---

## Overview

This runbook documents the complete process for extracting, normalizing, and importing legacy nominees from the Prisma/Express backend into the new Lovable NESA-Africa platform.

---

## Prerequisites

- [ ] Admin access to Supabase project (`sjghitoydzpirpqjules`)
- [ ] Access to legacy Supabase/Postgres database (from nesaserver)
- [ ] Node.js 18+ installed
- [ ] Legacy backend ZIP extracted

---

## Migration Files

| File | Purpose |
|------|---------|
| `nesaserver.zip` | Legacy backend codebase (Prisma schema reference) |
| `category-mapping.json` | PRD 17-category mapping |
| `nominees.final.json` | Canonical deduped import file |
| `nominees.dedupe.report.md` | Deduplication audit report |
| `LOVABLE_IMPORT_EXPORT_PROMPT.md` | AI prompt for import assistance |
| `scripts/export-from-legacy-prisma.ts` | **NEW** - Legacy Prisma export script |
| `scripts/extract-from-zip.ts` | ZIP extraction script |
| `scripts/normalize-and-dedupe.ts` | Normalization script |
| `scripts/import-nominees.ts` | Import execution script |

---

## Step 1: Export from Legacy Database

### 1.1 Set Environment Variables
```bash
export LEGACY_SUPABASE_URL="https://your-legacy-project.supabase.co"
export LEGACY_SUPABASE_SERVICE_KEY="eyJ..."
```

### 1.2 Run Export Script
```bash
cd migration
npx ts-node scripts/export-from-legacy-prisma.ts
```

### 1.3 Review Output
The script generates:

**Raw Legacy Exports (for audit):**
- `exports/legacy_nominees.json`
- `exports/legacy_nomination_records.json`
- `exports/legacy_documents.json`
- `exports/legacy_certificates.json`

**PRD-Ready Imports:**
- `exports/prd_nominees.json` / `.csv`
- `exports/prd_nominations.json` / `.csv`
- `exports/import_summary.json`

---

## Step 2: Review Category Mappings

### 2.1 Check Unmapped Nominees
```bash
cat exports/import_summary.json | jq '.category_mapping_needed'
```

### 2.2 Update Category Mappings
Edit `category-mapping.json` to add any missing legacy→new category mappings.

### 2.3 Re-run Export
After updating mappings, re-run the export script.

---

## Step 3: Validate Data Quality

### 3.1 Check for Duplicates
Review `prd_nominees.csv` for duplicate names/orgs.

### 3.2 Verify Renomination Counts
```bash
# Sum of all renomination_count_total should match nomination_records_total
cat exports/prd_nominees.json | jq '[.[].renomination_count_total] | add'
```

### 3.3 Check Channel Distribution
```bash
cat exports/import_summary.json | jq '.channels'
```

---

## Step 4: Import to New Database

### 4.1 Get Admin Token
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sjghitoydzpirpqjules.supabase.co',
  'your-service-role-key'
);

const { data } = await supabase.auth.signInWithPassword({
  email: 'admin@nesa-africa.org',
  password: 'your-password'
});

console.log(data.session.access_token);
```

### 4.2 Dry Run Import
```bash
DRY_RUN=true ADMIN_TOKEN=xxx npx ts-node scripts/import-nominees.ts
```

### 4.3 Actual Import
```bash
ADMIN_TOKEN=xxx npx ts-node scripts/import-nominees.ts
```

---

## Step 5: Verify Import

### 5.1 Check Nominee Counts
```sql
SELECT COUNT(*) as total FROM nominees;
SELECT status, COUNT(*) FROM nominees GROUP BY status;
```

### 5.2 Check Renomination Counts Preserved
```sql
SELECT name, renomination_count 
FROM nominees 
WHERE renomination_count > 0 
ORDER BY renomination_count DESC 
LIMIT 20;
```

### 5.3 Verify Frontend
1. Visit `/nominees` page
2. Confirm nominees appear with correct categories
3. Test search and filters
4. Verify nominee profiles show work done / evidence

---

## Step 6: Post-Import Tasks

### 6.1 Generate Email Notification Job
Create batch email to all imported nominees with:
- New profile links
- Updated platform information
- Re-verification instructions (if needed)

### 6.2 Archive Migration Files
```bash
tar -czvf migration-archive-$(date +%Y-%m-%d).tar.gz migration/exports/
```

---

## Data Preservation Details

### Brand/Org Info
- `organization` → `organization` (direct)
- `website` → stored in `evidence_urls` array
- `linkedinProfile` → stored in `evidence_urls` array
- `profileImageUrl` → `photo_url`
- `logoUrl` → `logo_url`

### Work Done
- Combined from `nominationReason` + `nominatorMessage` fields
- Stored in nominee `bio` + nomination `justification`
- Evidence links from `SupportingDocument` table

### Renomination History
- `nominationCount` → `renomination_count`
- Full nomination history in `nominations` table
- Channel tracking: START_MEMBER, NRC, PUBLIC

---

## Troubleshooting

### Error: "No subcategory found"
1. Check legacy category name against `category-mapping.json`
2. Add mapping if missing
3. Re-run export

### Error: "Duplicate identity hash"
1. Review duplicate candidates in export
2. Manually merge or dedupe
3. Re-run import

### Error: "RLS policy violation"
1. Ensure using admin token with correct role
2. Check `user_roles` table for admin role

---

## Contact

For migration issues, contact the NESA-Africa tech team.
