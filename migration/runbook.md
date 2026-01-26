# NESA-Africa Legacy Nominee Migration Runbook

**Version:** 1.0.0  
**Last Updated:** 2026-01-26

---

## Overview

This runbook documents the complete process for extracting, normalizing, and importing legacy nominees into the NESA-Africa platform.

---

## Prerequisites

- [ ] Admin access to Supabase project (`sjghitoydzpirpqjules`)
- [ ] Node.js 18+ installed
- [ ] Access to legacy data sources (CMS exports, ZIPs, etc.)

---

## Migration Files

| File | Purpose |
|------|---------|
| `nominees.raw.repo.json` | Nominees extracted from codebase |
| `nominees.raw.live.json` | Nominees from live database |
| `nominees.final.json` | Canonical deduped import file |
| `nominees.dedupe.report.md` | Deduplication audit report |
| `nominees.mapping.todo.md` | Items requiring manual category mapping |
| `runbook.md` | This file |
| `scripts/extract-from-zip.ts` | ZIP extraction script |
| `scripts/live-extraction-guide.md` | Guide for scraping live site |
| `scripts/normalize-and-dedupe.ts` | Normalization script |
| `scripts/import-nominees.ts` | Import execution script |

---

## Step 1: Collect Source Data

### 1.1 Repository Search (DONE)
```bash
# Already completed - results in nominees.raw.repo.json
# No hardcoded nominees found in codebase
```

### 1.2 Live Database Export (DONE)
```bash
# Already completed - results in nominees.raw.live.json
# Database currently has 0 nominees
```

### 1.3 ZIP Archive Extraction
```bash
# If ZIP files are available:
cd migration
npx ts-node scripts/extract-from-zip.ts /path/to/archive.zip
```

### 1.4 Live Site Scraping (if needed)
See `scripts/live-extraction-guide.md` for Chrome DevTools approach.

---

## Step 2: Normalize Data

### 2.1 Run Normalization Script
```bash
cd migration
npx ts-node scripts/normalize-and-dedupe.ts
```

### 2.2 Review Output
- Check `nominees.dedupe.report.md` for duplicates
- Review `nominees.mapping.todo.md` for manual mapping tasks
- Verify `nominees.final.json` looks correct

---

## Step 3: Manual Review

### 3.1 Category Mapping
- Open `nominees.mapping.todo.md`
- For each unmapped nominee, assign correct category/subcategory
- Mark each as APPROVE, REJECT, or DISCUSS

### 3.2 Update Final File
After manual review, update `nominees.final.json` with corrected mappings.

---

## Step 4: Import to Database

### 4.1 Get Admin Token
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sjghitoydzpirpqjules.supabase.co',
  'your-service-role-key'
);

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@nesa-africa.org',
  password: 'your-password'
});

console.log(data.session.access_token);
```

### 4.2 Dry Run Import
```bash
curl -X POST \
  "https://sjghitoydzpirpqjules.supabase.co/functions/v1/import-nominees" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nominees": [...],
    "dry_run": true
  }'
```

Expected response:
```json
{
  "dry_run": true,
  "would_import": 150,
  "validation_errors": [],
  "sample_records": [...]
}
```

### 4.3 Actual Import
```bash
curl -X POST \
  "https://sjghitoydzpirpqjules.supabase.co/functions/v1/import-nominees" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nominees": [...],
    "dry_run": false
  }'
```

Expected response:
```json
{
  "success": true,
  "imported": 150,
  "failed": 0,
  "errors": [],
  "created_ids": ["uuid-1", "uuid-2", ...]
}
```

---

## Step 5: Verify Import

### 5.1 Check Nominee Counts
```sql
SELECT COUNT(*) as total FROM nominees;
SELECT status, COUNT(*) FROM nominees GROUP BY status;
SELECT c.name, COUNT(n.id) 
FROM categories c 
LEFT JOIN subcategories s ON s.category_id = c.id 
LEFT JOIN nominees n ON n.subcategory_id = s.id 
GROUP BY c.name;
```

### 5.2 Check Audit Logs
```sql
SELECT * FROM audit_logs 
WHERE action = 'bulk_import_nominees' 
ORDER BY created_at DESC 
LIMIT 5;
```

### 5.3 Verify Frontend
1. Visit `/nominees` page
2. Confirm nominees appear in directory
3. Test search and filters
4. Click through to individual nominee profiles

---

## Step 6: Cleanup

### 6.1 Archive Migration Files
```bash
tar -czvf migration-archive-2026-01-26.tar.gz migration/
```

### 6.2 Document Issues
Log any issues encountered in project documentation.

---

## Idempotency Notes

The import process is designed to be idempotent:

1. **Slug uniqueness:** Each nominee gets a unique slug based on name + timestamp
2. **Re-running:** Running import twice will create duplicates - avoid unless needed
3. **Updates:** Use separate UPDATE queries for existing records

To safely re-run:
1. Delete all nominees first (if full re-import needed)
2. Or filter out already-imported records by comparing slugs

---

## Troubleshooting

### Error: "Unauthorized - missing token"
- Ensure Bearer token is included in Authorization header
- Check token hasn't expired

### Error: "Forbidden - admin access required"
- User must have 'admin' role in user_roles table

### Error: "No subcategory found"
- Check category/subcategory slugs match database
- Run: `SELECT slug FROM subcategories ORDER BY slug;`

### Error: "Maximum 500 nominees per import batch"
- Split import into batches of 500 or fewer

---

## Contact

For migration issues, contact the NESA-Africa tech team.
