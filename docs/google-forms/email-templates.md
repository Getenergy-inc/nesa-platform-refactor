# NESA-Africa 2026 — Finalized Email Templates (A–D)

Pipeline: **Google Forms → Google Sheets → Email Notification → Data Review → Evidence Review → Nominee / School Follow-Up → Website Database Synchronization**

All placeholders use `{{ExactFormFieldName}}` and resolve via `fieldHints` in
`email-routing-registry.json`. Missing fields render as `Not provided`.
Every email ends with the **Integrity Notice** block. No approval, finalist
selection, payment influence, or winner status is implied anywhere.

Legend:
- **From (Award forms):** `NESA-Africa 2026 Pre-Nomination Review Team <category-recipient@gmail.com>`
- **From (RMSA forms):** `NESA-Africa / EduAid-Africa / Rebuild My School Africa Team <region-recipient@gmail.com>`
- **Reply-To (always):** `{{Nominator Email}}`
- **Consent gate (C):** `{{Consent for NESA-Africa to share my name and contact with the nominee}}`
- **Consent gate (D):** `{{Can NESA-Africa / EduAid-Africa / RMSA contact the school?}}`

---

## Integrity Notice (appended to every email)

```
Integrity Notice
NESA-Africa 2026 is a transparent, evidence-based recognition programme.
This message confirms receipt of a pre-nomination only. It is NOT an
approval, finalist selection, winner notification, grant approval, or
school selection. No payment, sponsorship, or donation can influence
review outcomes. All records are reviewed by the NESA-Africa Nominations
Review Committee (NRC) on merit and evidence.
```

---

# AWARD FORMS (23 categories)

## Email A — Nominator Confirmation (Award)

**To:** `{{Nominator Email}}`
**From:** Award category Gmail
**Reply-To:** `{{Nominator Email}}`
**Subject:** `NESA-Africa 2026 Nomination Received - {{Award Category}}`

```
Dear {{Nominator Full Name}},

Thank you for submitting a pre-nomination to NESA-Africa 2026 — The African
Blue-Garnet Awards for Education.

We have received your nomination with the following details:

  • Award Group:         {{Award Group}}
  • Award Category:      {{Award Category}}
  • Award Subcategory:   {{Award Subcategory}}
  • Nominee Name:        {{Nominee Name}}
  • Nominee Type:        {{Nominee Type}}
  • Submission Date:     {{Timestamp}}
  • Reference ID:        {{Response ID}}

What happens next
  1. The NESA-Africa Nominations Review Committee (NRC) will review your
     submission and the evidence links provided.
  2. If additional information is required, the review team will contact you
     using this email address.
  3. You will receive an update when the review status changes.

You may keep this email as your acknowledgement of submission.

Warm regards,
NESA-Africa 2026 Pre-Nomination Review Team
nesa.africa@gmail.com

— Integrity Notice —
[see Integrity Notice block]
```

---

## Email B — Internal Review Notification (Award)

**To:** category recipient Gmail (from `awardForms[].recipient`)
**From:** category recipient Gmail
**Reply-To:** `{{Nominator Email}}`
**Subject:** `New NESA-Africa 2026 Pre-Nomination - {{Award Category}} - {{Nominee Name}}`

```
A new pre-nomination has been submitted for review.

NOMINATOR
  • Full Name:           {{Nominator Full Name}}
  • Email:               {{Nominator Email}}
  • Phone / WhatsApp:    {{Nominator Phone}}
  • Country of Residence:{{Nominator Country of Residence}}
  • Country of Origin:   {{Nominator Country of Origin}}
  • Knows Nominee:       {{Knows Nominee Personally}}
  • Share Consent:       {{Consent to Share Contact}}
  • Updates Consent:     {{Consent to Receive NESA-Africa Updates}}

NOMINEE
  • Name:                {{Nominee Name}}
  • Type:                {{Nominee Type}}
  • Organization:        {{Nominee Organization}}
  • Country:             {{Nominee Country}}
  • African Region:      {{Nominee Region}}
  • Website / Social:    {{Nominee Website / Social Media}}
  • Public Contact Email:{{Nominee Public Contact Email}}
  • Best Contact Route:  {{Best Contact / Verification Route}}

AWARD
  • Group:               {{Award Group}}
  • Category:            {{Award Category}}
  • Subcategory:         {{Award Subcategory}}

EVIDENCE
  • Impact Summary:      {{Education Impact Summary}}
  • Beneficiaries:       {{Beneficiaries}}
  • Reason:              {{Reason for Nomination}}
  • Evidence Link 1:     {{Evidence Link 1}}
  • Evidence Link 2:     {{Evidence Link 2}}
  • Accuracy Confirmed:  {{Accuracy Confirmation}}
  • Integrity Declared:  {{Integrity Declaration}}

META
  • Response ID:         {{Response ID}}
  • Submitted At:        {{Timestamp}}
  • Sheet Tab:           {{Sheet Title}}

ACTION: Review in the Nominations Review Committee (NRC) workflow.
Reply to this email to contact the nominator directly.

— Integrity Notice —
[see Integrity Notice block]
```

---

## Email C — Nominee Awareness (Award)

Sent **only** when `{{Nominee Public Contact Email}}` is a valid email.
Two variants based on `{{Consent to Share Contact}}`.

### C.1 — Consent ALLOWED (`Yes, NESA-Africa may share...`)

**To:** `{{Nominee Public Contact Email}}`
**From:** Award category Gmail
**Reply-To:** `{{Nominator Email}}`
**Subject:** `You Have Been Recommended for NESA-Africa 2026 Review`

```
Dear {{Nominee Name}},

You have been recommended for pre-nomination review under NESA-Africa 2026 —
The African Blue-Garnet Awards for Education.

Recommendation details
  • Award Group:         {{Award Group}}
  • Award Category:      {{Award Category}}
  • Award Subcategory:   {{Award Subcategory}}
  • Submitted On:        {{Timestamp}}
  • Reference ID:        {{Response ID}}

Recommended by (consent given to share)
  • Name:    {{Nominator Full Name}}
  • Email:   {{Nominator Email}}
  • Country: {{Nominator Country of Residence}}

What this means
This message is a courtesy awareness notice. It is NOT an approval,
finalist selection, or winner notification. Our Nominations Review
Committee (NRC) will evaluate the submission and any supporting evidence
on merit.

If you would like to provide additional evidence, clarify details, or
withdraw from consideration, reply to this email.

Warm regards,
NESA-Africa 2026 Pre-Nomination Review Team

— Integrity Notice —
[see Integrity Notice block]
```

### C.2 — Consent DENIED (`No, please keep nominator details private`)

**To:** `{{Nominee Public Contact Email}}`
**From:** Award category Gmail
**Reply-To:** `nesa.africa@gmail.com` (nominator identity withheld)
**Subject:** `You Have Been Recommended for NESA-Africa 2026 Review`

```
Dear {{Nominee Name}},

You have been recommended by a supporter for pre-nomination review under
NESA-Africa 2026 — The African Blue-Garnet Awards for Education.

Recommendation details
  • Award Group:         {{Award Group}}
  • Award Category:      {{Award Category}}
  • Award Subcategory:   {{Award Subcategory}}
  • Submitted On:        {{Timestamp}}
  • Reference ID:        {{Response ID}}

Recommended by
A supporter who has chosen to remain anonymous at this stage. NESA-Africa
holds their details securely and will not share them without consent.

What this means
This is a courtesy awareness notice only. It is NOT an approval, finalist
selection, or winner notification. The Nominations Review Committee (NRC)
evaluates each submission on merit and evidence.

To provide additional evidence, clarify details, or request withdrawal
from consideration, reply to this email or write to nesa.africa@gmail.com
quoting Reference ID {{Response ID}}.

Warm regards,
NESA-Africa 2026 Pre-Nomination Review Team

— Integrity Notice —
[see Integrity Notice block]
```

---

# RMSA / EDUAID REGIONAL FORMS (8 regions)

## Email A2 — Nominator Confirmation (RMSA)

**To:** `{{Nominator Email}}`
**From:** RMSA region Gmail
**Reply-To:** `{{Nominator Email}}`
**Subject:** `Special Needs School Nomination Received - NESA-Africa / EduAid-Africa / RMSA`

```
Dear {{Nominator Full Name}},

Thank you for nominating a special needs school for review by EduAid-Africa
and the Rebuild My School Africa (RMSA) programme of NESA-Africa 2026.

We have received your submission with the following details:

  • Region:              {{African Region}}
  • School Name:         {{School Name}}
  • School Country:      {{School Country}}
  • Special Needs Focus: {{Special Needs Categories}}
  • Submission Date:     {{Timestamp}}
  • Reference ID:        {{Response ID}}

What happens next
  1. The EduAid-Africa / RMSA review team will assess the school profile,
     special needs context, and evidence provided.
  2. If the school contact gave consent, the team may reach out to verify
     details and discuss possible support pathways.
  3. You will be contacted via this email address if additional information
     is required.

Warm regards,
NESA-Africa / EduAid-Africa / Rebuild My School Africa Team
nesa.africa@gmail.com

— Integrity Notice —
[see Integrity Notice block]
```

---

## Email B2 — Internal Review Notification (RMSA)

**To:** RMSA region recipient Gmail (from `rmsaRegionalForms[].recipient`)
**From:** RMSA region recipient Gmail
**Reply-To:** `{{Nominator Email}}`
**Subject:** `New RMSA / EduAid Special Needs School Nomination - {{African Region}} - {{School Name}}`

```
A new special needs school nomination has been submitted for review.

NOMINATOR
  • Full Name:           {{Nominator Full Name}}
  • Email:               {{Nominator Email}}
  • Phone / WhatsApp:    {{Nominator Phone}}
  • Country of Residence:{{Nominator Country of Residence}}
  • Visited School:      {{Visited School}}
  • Share Consent:       {{Consent to Share Contact}}
  • Updates Consent:     {{Consent to Receive NESA-Africa Updates}}

SCHOOL
  • Name:                {{School Name}}
  • Type:                {{School Type}}
  • Ownership:           {{School Ownership}}
  • Country:             {{School Country}}
  • Region:              {{African Region}}
  • State / Province:    {{State / Province / District}}
  • City / Community:    {{City / Town / Community}}
  • Address:             {{School Address}}
  • Website / Social:    {{School Website / Social Media}}
  • Management:          {{Legal / Board / PTA / Management Structure}}

SCHOOL CONTACT
  • Contact Person:      {{School Contact Person}}
  • Contact Email:       {{School Contact Email}}
  • Contact Phone:       {{School Contact Phone}}
  • Contact Consent:     {{Can NESA-Africa / EduAid-Africa / RMSA contact the school?}}

POPULATION
  • Special Needs Categories: {{Special Needs Categories}}
  • Estimated Learners:       {{Estimated Learners}}
  • Estimated Teachers:       {{Estimated Teachers}}
  • Estimated Support Staff:  {{Estimated Support Staff}}
  • Age Range:                {{Age Range}}
  • Residential/Day/Mixed:    {{Residential / Day / Mixed}}

NEEDS
  • Grant / Service Needs:    {{Grant / Service Needs}}
  • Top Three Urgent Needs:   {{Top Three Urgent Needs}}
  • Support Level:            {{Support Level}}
  • Verification Visit OK:    {{Verification Visit}}

EVIDENCE
  • Photo / Video Evidence:   {{Photo / Video Evidence}}
  • Evidence Link 1:          {{Evidence Link 1}}
  • Evidence Link 2:          {{Evidence Link 2}}
  • Accuracy Confirmed:       {{Accuracy Confirmation}}
  • Integrity Declared:       {{Integrity Declaration}}

META
  • Response ID:         {{Response ID}}
  • Submitted At:        {{Timestamp}}
  • Sheet Tab:           {{Sheet Title}}

ACTION: Route to EduAid-Africa / RMSA regional coordinator for verification.
Reply to this email to contact the nominator directly.

— Integrity Notice —
[see Integrity Notice block]
```

---

## Email D — School Contact Awareness (RMSA)

Sent **only** when `{{School Contact Email}}` is a valid email **AND**
`{{Can NESA-Africa / EduAid-Africa / RMSA contact the school?}}` = `Yes`.
If either condition fails, log status `Missing Email` or `Consent Not Given`
and do not send.

### D.1 — School consent ALLOWED + nominator share consent ALLOWED

**To:** `{{School Contact Email}}`
**Cc:** (none)
**From:** RMSA region Gmail
**Reply-To:** `{{Nominator Email}}`
**Subject:** `Your School Has Been Recommended for EduAid-Africa / Rebuild My School Africa Review`

```
Dear {{School Contact Person}},

{{School Name}} has been recommended for review under the EduAid-Africa and
Rebuild My School Africa (RMSA) programme of NESA-Africa 2026 — The African
Blue-Garnet Awards for Education.

Recommendation details
  • School:              {{School Name}}
  • Region:              {{African Region}}
  • Country:             {{School Country}}
  • Special Needs Focus: {{Special Needs Categories}}
  • Submitted On:        {{Timestamp}}
  • Reference ID:        {{Response ID}}

Recommended by (consent given to share)
  • Name:    {{Nominator Full Name}}
  • Email:   {{Nominator Email}}
  • Country: {{Nominator Country of Residence}}

What this means
Your school has been brought to our attention for possible inclusion in
the EduAid-Africa / RMSA review pathway. This is NOT a grant approval,
school selection, or guarantee of support. The review team will assess
the school profile, evidence, and need before any next steps.

Next step
A regional coordinator may contact you to verify school details and
discuss whether the school fits the current support cycle. To provide
additional evidence or request that the school be withdrawn from
consideration, reply to this email.

Warm regards,
NESA-Africa / EduAid-Africa / Rebuild My School Africa Team

— Integrity Notice —
[see Integrity Notice block]
```

### D.2 — School consent ALLOWED + nominator share consent DENIED

**To:** `{{School Contact Email}}`
**From:** RMSA region Gmail
**Reply-To:** `nesa.africa@gmail.com` (nominator identity withheld)
**Subject:** `Your School Has Been Recommended for EduAid-Africa / Rebuild My School Africa Review`

```
Dear {{School Contact Person}},

{{School Name}} has been recommended by a supporter for review under the
EduAid-Africa and Rebuild My School Africa (RMSA) programme of
NESA-Africa 2026.

Recommendation details
  • School:              {{School Name}}
  • Region:              {{African Region}}
  • Country:             {{School Country}}
  • Special Needs Focus: {{Special Needs Categories}}
  • Submitted On:        {{Timestamp}}
  • Reference ID:        {{Response ID}}

Recommended by
A supporter who has chosen to remain anonymous at this stage. NESA-Africa
holds their details securely and will not share them without consent.

What this means
Your school has been brought to our attention for possible inclusion in
the EduAid-Africa / RMSA review pathway. This is NOT a grant approval,
school selection, or guarantee of support.

Next step
A regional coordinator may contact you to verify school details. To
provide additional evidence or request withdrawal from consideration,
reply to this email or write to nesa.africa@gmail.com quoting Reference
ID {{Response ID}}.

Warm regards,
NESA-Africa / EduAid-Africa / Rebuild My School Africa Team

— Integrity Notice —
[see Integrity Notice block]
```

### D.3 — School consent DENIED (no email sent)

Do not send. Log `school_awareness_status = Consent Not Given` in
`_NotificationLog`.

### D.4 — School contact email missing or invalid (no email sent)

Do not send. Log `school_awareness_status = Missing Email`.

---

# Placeholder → Form Field Map

All placeholders resolve through `fieldHints` in
`docs/google-forms/email-routing-registry.json` (fuzzy match,
case-insensitive). Authoritative names below.

| Placeholder | Exact Form Field Name(s) | Used In |
| --- | --- | --- |
| `{{Nominator Full Name}}` | "Nominator Full Name" / "Your Full Name" | A, A2, B, B2, C.1, D.1 |
| `{{Nominator Email}}` | "Nominator Email" / "Your Email" | A, A2, B, B2, C.1, D.1, Reply-To |
| `{{Nominator Phone}}` | "Nominator Phone / WhatsApp" | B, B2 |
| `{{Nominator Country of Residence}}` | "Country of Residence" | B, B2, C.1, D.1 |
| `{{Nominator Country of Origin}}` | "Country of Origin" | B |
| `{{Consent to Share Contact}}` | "Consent for NESA-Africa to share my name and contact with the nominee" | gate for C, D ; shown in B/B2 |
| `{{Consent to Receive NESA-Africa Updates}}` | "Consent to Receive NESA-Africa Updates" | B, B2 |
| `{{Knows Nominee Personally}}` | "Do you know the nominee personally?" | B |
| `{{Nominee Name}}` | "Nominee Name" / "Full Name of Nominee" | A, B, C |
| `{{Nominee Type}}` | "Nominee Type" | A, B |
| `{{Nominee Organization}}` | "Organization / Platform" | B |
| `{{Nominee Country}}` | "Nominee Country" | B |
| `{{Nominee Region}}` | "African Region" | B |
| `{{Nominee Website / Social Media}}` | "Website / Social Media" | B |
| `{{Nominee Public Contact Email}}` | "Nominee Public Contact Email" | C (recipient) |
| `{{Best Contact / Verification Route}}` | "Best Contact / Verification Route" | B |
| `{{Award Group}}` | "Award Group" | A, B, C |
| `{{Award Category}}` | "Award Category" | A, B, C, subject lines |
| `{{Award Subcategory}}` | "Award Subcategory" | A, B, C |
| `{{Education Impact Summary}}` | "Education Impact Summary" | B |
| `{{Beneficiaries}}` | "Beneficiaries" | B |
| `{{Reason for Nomination}}` | "Reason for Nomination" | B |
| `{{Evidence Link 1}}` | "Evidence Link 1" | B, B2 |
| `{{Evidence Link 2}}` | "Evidence Link 2" | B, B2 |
| `{{Accuracy Confirmation}}` | "Accuracy Confirmation" | B, B2 |
| `{{Integrity Declaration}}` | "Integrity Declaration" | B, B2 |
| `{{School Name}}` | "School Name" | A2, B2, D, subject |
| `{{School Type}}` | "School Type" | B2 |
| `{{School Ownership}}` | "School Ownership" | B2 |
| `{{School Country}}` | "School Country" | A2, B2, D |
| `{{African Region}}` | "African Region" | A2, B2, D, subject |
| `{{State / Province / District}}` | "State / Province / District" | B2 |
| `{{City / Town / Community}}` | "City / Town / Community" | B2 |
| `{{School Address}}` | "School Address" | B2 |
| `{{School Website / Social Media}}` | "School Website / Social Media" | B2 |
| `{{Legal / Board / PTA / Management Structure}}` | "Legal / Board / PTA / Management Structure" | B2 |
| `{{School Contact Person}}` | "School Contact Person" | B2, D |
| `{{School Contact Email}}` | "School Contact Email" | D (recipient) |
| `{{School Contact Phone}}` | "School Contact Phone" | B2 |
| `{{Can NESA-Africa / EduAid-Africa / RMSA contact the school?}}` | exact field text | gate for D, shown in B2 |
| `{{Special Needs Categories}}` | "Special Needs Categories" | A2, B2, D |
| `{{Estimated Learners}}` | "Estimated Learners" | B2 |
| `{{Estimated Teachers}}` | "Estimated Teachers" | B2 |
| `{{Estimated Support Staff}}` | "Estimated Support Staff" | B2 |
| `{{Age Range}}` | "Age Range" | B2 |
| `{{Residential / Day / Mixed}}` | "Residential / Day / Mixed" | B2 |
| `{{Grant / Service Needs}}` | "Grant / Service Needs" | B2 |
| `{{Top Three Urgent Needs}}` | "Top Three Urgent Needs" | B2 |
| `{{Support Level}}` | "Support Level" | B2 |
| `{{Verification Visit}}` | "Verification Visit" | B2 |
| `{{Photo / Video Evidence}}` | "Photo / Video Evidence" | B2 |
| `{{Visited School}}` | "Visited School" | B2 |
| `{{Timestamp}}` | Google Forms auto field | all |
| `{{Response ID}}` | Google Forms auto field | all |
| `{{Sheet Title}}` | Google Sheets tab name | B, B2 |

---

# Send Matrix

| Scenario | Nominator email present | Share consent | Nominee/School email present | School contact consent | A/A2 | B/B2 | C / D |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Award — full consent | Y | Yes | Y | n/a | Sent | Sent | C.1 |
| Award — share denied | Y | No  | Y | n/a | Sent | Sent | C.2 (redacted) |
| Award — no nominee email | Y | any | N | n/a | Sent | Sent | Skipped (`Missing Email`) |
| Award — no nominator email | N | any | any | n/a | Skipped | Sent (Reply-To = admin) | per rules above |
| RMSA — full consent | Y | Yes | Y | Yes | Sent | Sent | D.1 |
| RMSA — school consent + share denied | Y | No | Y | Yes | Sent | Sent | D.2 (redacted) |
| RMSA — school consent denied | Y | any | Y | No | Sent | Sent | Skipped (`Consent Not Given`) |
| RMSA — no school email | Y | any | N | any | Sent | Sent | Skipped (`Missing Email`) |

Every send result is written to the `_NotificationLog` sheet with one of:
`Sent`, `Not Sent`, `Failed`, `Missing Email`, `Consent Not Given`, `Pending`, `Retry Required`.
