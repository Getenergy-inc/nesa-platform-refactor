# NESA-Africa Nominee Mapping TODO

**Generated:** 2026-01-26  
**Status:** Awaiting source data

---

## Overview

This file tracks nominees that require manual category/subcategory mapping before import.

---

## PRD-Correct Category Mapping Reference

### 17 Official Categories

| # | Category Slug | Category Name | Scope |
|---|---------------|---------------|-------|
| 1 | `best-csr-education-africa` | Best CSR in Education (Africa Regional) | AFRICA_REGIONAL |
| 2 | `best-csr-education-nigeria` | Best CSR in Education (Nigeria) | NIGERIA |
| 3 | `best-edutech-organisation-africa` | Best EduTech Organisation (Africa Regional) | AFRICA_REGIONAL |
| 4 | `best-media-educational-advocacy-nigeria` | Best Media Organisation in Educational Advocacy (Nigeria) | NIGERIA |
| 5 | `best-ngo-education-nigeria` | Best NGO Contribution to Education (Nigeria) | NIGERIA |
| 6 | `best-ngo-education-africa` | Best NGO Contribution to Education for All (Africa Regional) | AFRICA_REGIONAL |
| 7 | `best-stem-education-africa` | Best STEM Education Programme (Africa Regional) | AFRICA_REGIONAL |
| 8 | `creative-arts-education-nigeria` | Creative Arts Industry Contribution to Education (Nigeria) | NIGERIA |
| 9 | `best-education-friendly-state-nigeria` | Best Education-Friendly State (Nigeria) | NIGERIA |
| 10 | `best-library-tertiary-nigeria` | Best Library in Nigerian Tertiary Institutions | NIGERIA |
| 11 | `best-research-development-nigeria` | Best Research & Development Contribution to Education (Nigeria) | NIGERIA |
| 12 | `christian-education-impact-africa` | Christian Education Impact (Africa Regional) | AFRICA_REGIONAL |
| 13 | `islamic-education-impact-africa` | Islamic Education Impact (Africa Regional) | AFRICA_REGIONAL |
| 14 | `political-leaders-education-nigeria` | Political Leaders Educational Support (Nigeria) | NIGERIA |
| 15 | `international-bilateral-education` | International & Bilateral Contributors to Education | INTERNATIONAL |
| 16 | `diaspora-education-impact` | Diaspora Association Educational Impact | INTERNATIONAL |
| 17 | `africa-education-icon-award` | Africa Education Icon Award (2005–2025) | ICON |

---

## Incorrect Categories to Replace

The following legacy categories are **NOT VALID** and must be remapped:

| ❌ Incorrect Category | ✅ Correct Mapping | Notes |
|----------------------|-------------------|-------|
| Music | creative-arts-education-nigeria | Map to "Music Industry Contribution" subcategory |
| Film | creative-arts-education-nigeria | Map to "Nollywood Educational Content" or "Film & Media for Education" |
| Sports | — | NO SPORTS CATEGORY EXISTS - Reject or discuss with admin |
| Entertainment | creative-arts-education-nigeria | Map to appropriate arts subcategory |
| Best Actor | — | NOT AN EDUCATION AWARD - Reject |
| Best Musician | — | NOT AN EDUCATION AWARD - Reject |

---

## Nominees Requiring Manual Mapping

*Currently empty - will be populated when source data is processed*

### Template for entries:

```markdown
### NOM-001: [Nominee Name]
- **Source:** [repo/live/zip]
- **Legacy Category:** [original category if any]
- **Suggested Mapping:** [category_slug / subcategory_slug]
- **Confidence:** [HIGH/MEDIUM/LOW]
- **Notes:** [reason for uncertainty]
- **Action Required:** [APPROVE / REJECT / DISCUSS]
```

---

## Unmappable Records

*Records that cannot be mapped to any valid category*

| Record ID | Name | Legacy Category | Reason |
|-----------|------|-----------------|--------|
| — | — | — | — |

---

## Instructions for Manual Review

1. For each unmapped nominee, check:
   - Is this an education-focused contribution?
   - Which of the 17 categories best fits?
   - Which subcategory within that category?
   - For Africa Regional categories, which region?

2. Update this file with your decisions

3. After review, update `nominees.final.json` with correct mappings

4. Re-run deduplication if needed
