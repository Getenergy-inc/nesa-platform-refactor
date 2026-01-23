# NESA-Africa API Documentation

This document describes the backend API endpoints for the NESA-Africa platform.

## Base URL

All API endpoints are served from Supabase Edge Functions:

```
https://sjghitoydzpirpqjules.supabase.co/functions/v1/
```

## Endpoints

### GET /stage

Returns the current stage configuration and flags for the active season.

**Response:**

```json
{
  "nominationsOpen": true,
  "votingOpenGold": false,
  "votingOpenBlueGarnet": false,
  "juryOpen": false,
  "ticketsOpen": true,
  "mediaLive": false,
  "currentSeasonKey": "2025",
  "seasonName": "NESA-Africa 2025",
  "ceremonyYear": 2026
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `nominationsOpen` | boolean | Whether nominations are currently accepted |
| `votingOpenGold` | boolean | Whether Gold tier public voting is open |
| `votingOpenBlueGarnet` | boolean | Whether Blue Garnet voting is open |
| `juryOpen` | boolean | Whether jury scoring is in progress |
| `ticketsOpen` | boolean | Whether tickets are available for purchase |
| `mediaLive` | boolean | Whether live media broadcasts are active |
| `currentSeasonKey` | string | Current season identifier (e.g., "2025") |
| `seasonName` | string | Display name for current season |
| `ceremonyYear` | number | Year when the ceremony takes place |

### GET /season

Returns detailed season configuration for the current and next season.

**Response:**

```json
{
  "current": {
    "key": "2025",
    "name": "NESA-Africa 2025",
    "displayYear": 2025,
    "ceremonyYear": 2026,
    "tagline": "Honoring Africa's Changemakers",
    "theme": "Building the Future of Education",
    "isActive": true
  },
  "next": {
    "key": "2026",
    "name": "NESA-Africa 2026",
    "displayYear": 2026,
    "ceremonyYear": 2027,
    "tagline": "Elevating African Excellence",
    "theme": "Innovation in Education",
    "isActive": false
  },
  "serverTime": "2026-01-23T19:45:00.000Z"
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `current` | SeasonInfo | Currently active season details |
| `next` | SeasonInfo | null | Next upcoming season (if configured) |
| `serverTime` | string | ISO timestamp from server |

**SeasonInfo Object:**

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Season identifier |
| `name` | string | Display name |
| `displayYear` | number | Award year (e.g., 2025) |
| `ceremonyYear` | number | Ceremony year (e.g., 2026) |
| `tagline` | string | Marketing tagline |
| `theme` | string | Season theme |
| `isActive` | boolean | Whether this is the active season |

## Planned Endpoints (CMS-Driven)

These endpoints are placeholders for future CMS integration:

### GET /categories

Will return all award categories from the database.

### GET /nominees

Will return approved nominees for the current season (stage-gated).

## Error Handling

All endpoints return graceful fallbacks with 200 status codes to prevent UI breakage. Error details are logged server-side.

## CORS

All endpoints support CORS with the following headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

## Authentication

These endpoints are public and do not require authentication. Protected endpoints will require a valid Supabase JWT in the `Authorization` header.
