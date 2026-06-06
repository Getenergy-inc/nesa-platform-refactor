# NESA-Africa 2026 — Google Pre-Nomination Services

Customized email automation for every Google Form submission.

Pipeline: **Google Forms → Google Sheets → Email Notification → Data Review → Evidence Review → Nominee / School Follow-Up → Website Database Synchronization**

## Files

- `email-routing-registry.json` — source of truth: recipients, subject templates, consent rules, field hints, log columns.
- `../../scripts/google-apps-script/NESA_FormRouter.gs` — Apps Script implementation of the 4 email types + notification log.
- `/mnt/documents/email-automation-mapping-table.xlsx` (and `.csv`) — pre-launch mapping table (section 16 requirement).

## Four Email Types per Submission

| Code | Email | Recipient | Conditions |
| ---- | ----- | --------- | ---------- |
| A / A2 | Nominator Confirmation | Submitter | Valid nominator email |
| B / B2 | Internal Review Notification | Category or regional Gmail | Always (Reply-To = nominator) |
| C | Nominee Awareness (award forms) | Nominee public contact email | Valid email; redacted unless nominator gave share-consent |
| D | School Contact Awareness (RMSA forms) | School contact email | Valid email AND school contact consent = Yes |

## Safety Rules (enforced by `NESA_FormRouter.gs`)

- Never stores or transmits Gmail passwords.
- Never sends Nominee/School emails when the contact email is missing or invalid.
- Never reveals nominator name/email/phone to nominee unless `consent to share contact` = Yes.
- Skips School Awareness when school contact consent is not granted.
- Reply-To on every internal review email is the nominator email.
- All four emails include the integrity notice (no approval / no payment influence).
- Missing form fields render as `Not provided` — never as raw placeholders.

## Required Form Fields

**Nominator (all forms):** Full Name, Email, Phone/WhatsApp, Country of Residence, Country of Origin, Consent to Share Contact, Consent to Receive Updates.

**Nominee (award forms):** Nominee Name, Nominee Type, Award Group, Award Category, Award Subcategory, Nominee Email or Public Contact Email, Website / Social, Best Contact / Verification Route, Education Impact Summary, Evidence Links.

**School Contact (RMSA forms):** School Name, Contact Person, Contact Email, Contact Phone, School Country, Region, Special Needs Categories, Can NESA-Africa / EduAid-Africa / RMSA contact the school?, Evidence Links.

## Notification Log (`_NotificationLog` tab)

Columns auto-created on first submission:

`timestamp, response_id, form_type, category_or_region, nominator_email, nominee_email, school_email, recipient_review_email, nominator_confirmation_status, internal_review_notification_status, nominee_awareness_status, school_awareness_status, error_message, sent_at`

Statuses: `Sent`, `Not Sent`, `Failed`, `Missing Email`, `Consent Not Given`, `Pending`, `Retry Required`.

## Per-Form Setup Checklist

1. Open the Google Sheet linked to the Form.
2. Extensions → Apps Script → paste `NESA_FormRouter.gs`.
3. Set `FORM_KEY` to the slug from `email-routing-registry.json`.
4. Triggers → Add Trigger → `onFormSubmit` (From spreadsheet, On form submit).
5. Authorize once — no passwords stored.
6. Submit a test response; confirm:
   - Category/regional Gmail received internal review with Reply-To = test nominator.
   - Nominator received confirmation A or A2.
   - Nominee/School awareness sent only if contact + consent provided.
   - `_NotificationLog` row added with correct statuses.

## Pre-Launch Mapping Table

Section 16 of the spec requires an explicit mapping table before go-live. Generated at:

- `/mnt/documents/email-automation-mapping-table.xlsx`
- `/mnt/documents/email-automation-mapping-table.csv`

Covers all 23 award category forms and all 8 RMSA regional forms.

## Naming Guardrails

- Use **“Gold-Blue Garnet”** for competitive excellence labels.
- Use **“Nominate & Earn AGC Voting Coin”** only where applicable. Never **“Vote & Earn AGC.”**
- Never imply automatic approval, finalist selection, school selection, grant approval, or winner selection.
