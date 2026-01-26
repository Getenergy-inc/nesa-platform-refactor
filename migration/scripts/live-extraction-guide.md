# Live Extraction Requirements Guide

## Overview

This guide documents how to extract nominee data from the live NESA-Africa website if public pages contain nominee listings that need to be migrated.

---

## Chrome DevTools Method

### Step 1: Open Network Tab
1. Navigate to the live NESA nominees page
2. Open Chrome DevTools (F12 or Cmd+Option+I)
3. Go to **Network** tab
4. Filter by **Fetch/XHR**

### Step 2: Identify API Requests

Look for requests to endpoints like:
- `/api/nominees`
- `/api/nominations`
- `/rest/v1/nominees`
- Supabase URLs containing `.supabase.co`

### Step 3: Capture Request Details

For each relevant request, document:

```
REQUEST URL:
[Full URL including query params]

METHOD:
GET | POST

HEADERS NEEDED:
Authorization: Bearer xxx (if required)
apikey: xxx (if Supabase)
Content-Type: application/json

QUERY PARAMS:
select: *,subcategories(name,categories(name))
order: created_at.desc
limit: 1000

EXAMPLE RESPONSE:
{
  "id": "uuid",
  "name": "Nominee Name",
  "slug": "nominee-slug",
  "organization": "Org Name",
  "bio": "Bio text...",
  "photo_url": "https://...",
  "status": "approved",
  "subcategory_id": "uuid",
  ...
}
```

### Step 4: Export Data

Option A: Copy response JSON directly
1. Right-click response in Network tab
2. Select "Copy response"
3. Paste into `nominees.raw.live.json`

Option B: Use curl to re-fetch
```bash
curl -X GET \
  "https://example.supabase.co/rest/v1/nominees?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  > nominees.raw.live.json
```

---

## HTML Scraping Method (Fallback)

If no API is available, use this approach:

### Step 1: Identify Card Structure

Inspect nominee card elements:
```html
<div class="nominee-card" data-id="xxx">
  <img src="..." alt="Name" />
  <h3 class="nominee-name">Name</h3>
  <p class="nominee-org">Organization</p>
  <span class="nominee-category">Category</span>
</div>
```

### Step 2: Console Extraction Script

Run in browser console:
```javascript
const nominees = [];
document.querySelectorAll('.nominee-card').forEach(card => {
  nominees.push({
    legacySource: 'live',
    fullName: card.querySelector('.nominee-name')?.textContent?.trim() || '',
    organisation: card.querySelector('.nominee-org')?.textContent?.trim() || '',
    categoryName: card.querySelector('.nominee-category')?.textContent?.trim() || '',
    imageUrl: card.querySelector('img')?.src || null,
    status: 'approved'
  });
});

console.log(JSON.stringify(nominees, null, 2));
// Copy output and save to nominees.raw.live.json
```

---

## Known NESA-Africa Endpoints

Based on current codebase analysis:

### Supabase REST API
```
Base URL: https://sjghitoydzpirpqjules.supabase.co/rest/v1

Endpoints:
GET /nominees?select=*,subcategories(name,slug,categories(name,slug))
GET /categories?select=*,subcategories(*)
GET /subcategories?select=*,categories(name,slug)
```

### Edge Functions
```
Base URL: https://sjghitoydzpirpqjules.supabase.co/functions/v1

Endpoints:
POST /import-nominees (admin only)
GET /season
GET /stage
```

---

## Data Validation Checklist

After extraction, verify:
- [ ] All names are non-empty
- [ ] Categories/subcategories map to PRD-correct values
- [ ] Regions are valid: North, West, East, Central, Southern
- [ ] Status values are valid: pending, under_review, approved, rejected, platinum
- [ ] No duplicate entries (by slug or name+org combination)

---

## Output Format

Save extracted data in this format:
```json
{
  "_meta": {
    "source": "live",
    "extractedAt": "2026-01-26T12:00:00Z",
    "extractedBy": "Your Name",
    "total_count": 150
  },
  "nominees": [
    {
      "legacySource": "live",
      "legacyId": "original-uuid-if-available",
      "fullName": "Nominee Name",
      "organisation": "Organization",
      "country": "Nigeria",
      "region": "West",
      "categoryName": "Best CSR in Education (Nigeria)",
      "subcategoryName": "Banking & Finance",
      "tierEligibility": ["platinum", "gold"],
      "profileBio": "Bio text...",
      "imageUrl": "https://...",
      "evidenceLinks": [],
      "status": "approved"
    }
  ]
}
```
