# NESA-Africa Legacy Nominee Deduplication Report

**Generated:** 2026-01-26  
**Migration Pack Version:** 1.0.0

---

## Summary

| Metric | Count |
|--------|-------|
| Total Raw Records (Repo) | 0 |
| Total Raw Records (Live DB) | 0 |
| Total After Merge | 0 |
| Duplicates Removed | 0 |
| Final Canonical Records | 0 |

---

## Data Sources Analyzed

### 1. Repository Search
- **Files searched:** 47+ files containing nominee-related keywords
- **Result:** No hardcoded nominee lists found
- **Notes:** 
  - Frontend is fully data-driven (fetches from Supabase)
  - `Winners.tsx` contains placeholder "Coming Soon" text only
  - `ExistingNomineesSection.tsx` fetches dynamically by subcategory

### 2. Live Database
- **Table:** `public.nominees`
- **Total rows:** 0
- **Notes:**
  - Categories table: 17 records ✅
  - Subcategories table: 138 records ✅
  - Nominees table: Empty (ready for import)

### 3. ZIP Archives
- **Note:** No ZIP files were attached/accessible in this session
- **Action Required:** If ZIP archives exist, re-run extraction script

---

## Deduplication Strategy

### Primary Key Resolution
1. **If slug exists:** Use slug as unique identifier
2. **Else:** Generate normalized key from `normalize(fullName + organisation + country)`

### Scoring Weights (for picking best record)
| Factor | Points |
|--------|--------|
| Has valid category/subcategory mapping | +3 |
| Has profile image | +2 |
| Has bio text | +1 |
| Most recent updatedAt | +1 |

### Duplicate Handling
- Winner record kept in `nominees.final.json`
- All versions preserved in `duplicates` array for audit

---

## Duplicates Found

**None** - No duplicate records to report (0 source records)

---

## Next Steps

1. **Collect Legacy Data:**
   - Export from previous CMS/database
   - Scrape public nominee pages (if accessible)
   - Process uploaded ZIP archives

2. **Format to Canonical Schema:**
   - See `nominees.final.json` for schema definition
   - Map to PRD-correct category names

3. **Run Import:**
   ```bash
   # Dry run first
   curl -X POST \
     -H "Authorization: Bearer <admin_token>" \
     -H "Content-Type: application/json" \
     -d '{"nominees": [...], "dry_run": true}' \
     https://sjghitoydzpirpqjules.supabase.co/functions/v1/import-nominees

   # Then actual import
   curl -X POST \
     -H "Authorization: Bearer <admin_token>" \
     -H "Content-Type: application/json" \
     -d '{"nominees": [...], "dry_run": false}' \
     https://sjghitoydzpirpqjules.supabase.co/functions/v1/import-nominees
   ```

4. **Verify:**
   - Check audit_logs table for import event
   - Query nominees table to confirm counts
