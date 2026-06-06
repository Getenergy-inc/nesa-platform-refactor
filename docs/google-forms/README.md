# NESA-Africa Google Pre-Nomination Services — Email Routing

System: **Google Forms → Google Sheets → Email Notification → Data Review → Evidence Review → Website Database Synchronization**

This folder is the version-controlled source of truth for routing each NESA-Africa Google Form submission to the correct category or regional Gmail account.

> Do **not** store Gmail passwords here. Passwords are managed offline in the secure custodian register.

## Files

- [`email-routing-registry.json`](./email-routing-registry.json) — canonical mapping of all 23 award categories + 8 RMSA regions to recipient Gmail addresses, subject templates, log columns, and notification statuses.
- [`../../scripts/google-apps-script/NESA_FormRouter.gs`](../../scripts/google-apps-script/NESA_FormRouter.gs) — Apps Script template to paste into each Form's linked Sheet. Set `FORM_KEY` to the matching slug, add an `onFormSubmit` trigger, authorize once.

## Routing rule (non-negotiable)

> One category or region · One Gmail recipient · One Google Form · One Google Sheet · One email notification route · One evidence trail · One clean DB sync pathway.

## Flow

```
Nominator submits Google Form
  → response saved to linked Google Sheet
  → Apps Script onFormSubmit trigger
  → identify award category or RMSA region (FORM_KEY)
  → lookup recipient in ROUTING table
  → send structured notification to recipient Gmail
      • Reply-To = nominator email
  → optional confirmation email to nominator
  → append row to _NotificationLog sheet
  → admin fallback alert (nesa.africa@gmail.com) on routing/email gaps
```

## Subject formats

- Award: `NESA 2026 Pre-Nomination Submission - {category} - {nomineeName}`
- RMSA: `NESA 2026/2027 RMSA School Nomination - {region} - {schoolName}`

## Notification log columns (`_NotificationLog` sheet)

`timestamp · response_id · form_type · category_or_region · nominator_email · recipient_email · notification_subject · notification_status · error_message · sent_at`

Status values: `Sent`, `Failed`, `Recipient Missing`, `Nominator Email Missing`, `Retry Required`.

## Per-form setup checklist

1. Open the Google Form → set response destination to a dedicated Google Sheet.
2. In the Sheet → Extensions → Apps Script → paste `NESA_FormRouter.gs`.
3. Set `FORM_KEY` to the slug from `email-routing-registry.json` for that form.
4. Triggers → Add trigger → `onFormSubmit` (event source: From spreadsheet).
5. Authorize as the operating Google account (no passwords in code).
6. File a test submission and verify:
   - Correct recipient received the email.
   - `Reply-To` is the nominator's email.
   - `_NotificationLog` row is `Sent`.
   - Confirmation email reached nominator.
7. Record QA pass in the email-routing audit table (Section 16 of the master spec).

## Audit table (fill before go-live)

| Form type | Category / Region | Slug | Recipient | Form title | Sheet title | Nominator email field | Nominee/School field | Subject template | Reply-To | Log status | Trigger status | Test status | QA | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Use one row per form. Do not go live until every row is complete.

## Security

- No Gmail passwords in code, repo, frontend config, WhatsApp, or volunteer groups.
- 2FA on every NESA Gmail account; recovery email/phone held by authorized admin.
- Website only ever stores: category/region name, form URL, embed URL, recipient email, status, last-updated date.

## Naming guardrails

- Use **"Gold-Blue Garnet - Competitive Excellence"** (never "Blue Garnet - Competitive Excellence") in public-facing copy.
- Use **"Nominate & Earn AGC Voting Coin"** where applicable. Never use "Vote & Earn AGC".
- Never imply automatic approval or selection.
