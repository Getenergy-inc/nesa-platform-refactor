# NESA-Africa Legacy Migration Master Prompt

**For: Lovable AI / Codex / Claude**  
**Purpose: Import legacy nominees into new NESA-Africa Lovable build**

---

## Context

The NESA-Africa platform is being rebuilt on Lovable (React + Supabase). We need to migrate nominee data from a legacy Prisma/Express backend.

### Two Data Sources

| Source | Role | Trust Level |
|--------|------|-------------|
| **A: Backend Database** | System of record | 100% authoritative for governance data |
| **B: Live Site** | Validator/gap filler | Use for display data gaps only |

### Critical Rules

1. **Backend is truth**: All nomination counts, statuses, acceptance records, and certificates come from the backend database only
2. **Live site fills gaps**: Bio text, photos, and missing display info can be scraped from live site
3. **Never trust live site for**: Nomination counts, approval status, certificate validity
4. **Dedupe by identity hash**: `sha256(lower(name) + '|' + lower(email) + '|' + digits_only(phone) + '|' + lower(country))`

---

## Legacy Schema (from Prisma)

```prisma
model Nominee {
  id                      String   @id
  name                    String
  slug                    String   @unique
  email                   String?
  phone                   String?
  organization            String?  // Brand name
  website                 String?
  linkedinProfile         String?
  title                   String?
  bio                     String?
  profileImageUrl         String?
  logoUrl                 String?
  country                 String?
  region                  String?
  categoryId              String?
  subcategoryId           String?
  status                  String
  nrcVerified             Boolean  @default(false)
  nominationCount         Int      @default(0)
  approvedNominationCount Int      @default(0)
  acceptanceStatus        String?
  createdAt               DateTime
  updatedAt               DateTime
}

model NominationRecord {
  id                String   @id
  nomineeId         String
  nominatorId       String?
  nominatorEmail    String?
  nominatorName     String?
  nominationReason  String?  // "Work done" content
  nominatorMessage  String?  // Additional work done
  endorsementMessage String? // Re-nomination content
  channel           String?  // START_MEMBER, NRC, PUBLIC
  status            String
  createdAt         DateTime
}

model SupportingDocument {
  id                  String   @id
  nomineeId           String?
  nominationRecordId  String?
  fileUrl             String   // Evidence link
  fileType            String?
  createdAt           DateTime
}

model Certificate {
  id               String   @id
  nomineeId        String
  tier             String   // platinum, gold, blue-garnet, icon
  serialNumber     String?
  verificationCode String?
  downloadLocked   Boolean  @default(true)
  status           String
  issuedAt         DateTime?
}
```

---

## New Lovable Schema

The new platform uses these tables (from Supabase):

| Table | Key Fields |
|-------|------------|
| `nominees` | id, name, slug, organization, country, region, subcategory_id, status, acceptance_status, renomination_count, nrc_verified |
| `nominations` | id, nominee_id, nominator_id, source, status, justification |
| `certificates` | id, nominee_id, tier, verification_code, download_locked |
| `subcategories` | id, category_id, name, slug |
| `categories` | id, name, slug |

---

## Export Script Usage

Run in the legacy backend repo:

```bash
export LEGACY_SUPABASE_URL="https://xxx.supabase.co"
export LEGACY_SUPABASE_SERVICE_KEY="eyJ..."
npx ts-node migration/scripts/export-from-legacy-prisma.ts
```

Outputs:
- `exports/prd_nominees.csv` - Import-ready nominees
- `exports/prd_nominations.csv` - Import-ready nominations
- `exports/import_summary.json` - Stats and validation

---

## Import Process

1. **Upload CSVs** to this chat after export
2. **AI validates** category mappings against 17-category PRD model
3. **AI generates** SQL insert statements or edge function calls
4. **Run dry_run=true** import first
5. **Verify** counts match export totals
6. **Run actual import**

---

## Field Mapping

| Legacy Field | New Field | Notes |
|--------------|-----------|-------|
| `organization` | `organization` | Brand name |
| `website` | (store in evidence_urls) | Or custom field |
| `linkedinProfile` | (store in evidence_urls) | Or custom field |
| `profileImageUrl` | `photo_url` | |
| `logoUrl` | `logo_url` | |
| `nominationCount` | `renomination_count` | Direct map |
| `nominationReason + nominatorMessage` | `bio` + `nominations.justification` | Split appropriately |
| `nrcVerified` | `nrc_verified` | Boolean |
| `acceptanceStatus` | `acceptance_status` | PENDING/ACCEPTED/DECLINED |

---

## Category Mapping

See `migration/category-mapping.json` for the 17-category model mapping.

**Invalid categories to reject:**
- Music awards (non-education)
- Film awards (non-education) 
- Sports awards (non-education)
- "Best Actor/Musician" etc.

**Remap these to Creative Arts:**
- Nollywood educational content → `arts-ng-nollywood`
- Music industry education contribution → `arts-ng-music`

---

## Validation Checklist

- [ ] All nominees have valid subcategory mapping
- [ ] No duplicate identity hashes
- [ ] Renomination counts preserved
- [ ] Evidence links migrated
- [ ] Certificates linked to correct nominees
- [ ] NRC verification status preserved
- [ ] Acceptance status preserved

---

## Live Site Scraping (Gap Filling Only)

Use these URLs to validate completeness:
- https://nesa.africa/non-competitive
- https://nesa.africa/competitive
- https://nesa.africa/nomination/sub-categories/africa-lifetime-education-icon

Scrape ONLY for:
- Missing profile photos
- Missing bio text
- Public display name corrections

NEVER scrape for:
- Nomination counts
- Approval status
- Certificate status

---

## Contact

For migration issues, contact the NESA-Africa tech team.
