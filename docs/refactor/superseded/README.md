# Superseded Refactor Specs

Documents in this folder describe approaches that were **explicitly rejected**
after further review. They are preserved for auditability only — **do not
implement anything from them**.

If you are a developer or agent looking for the canonical spec for a topic
listed below, use the "supersedes with" doc instead.

---

## Doc 24 — Mandatory 5,000 Public Endorsement Gate

- **Status:** Superseded.
- **Superseded by:** Doc 26 (final policy) and the build spec in Doc 25 §1/§13.
- **Rejected on:** 2026-07-26 governance review.
- **Why it was rejected:**
  - Reintroduced the AGC-style count-gating pattern the platform had just
    removed.
  - Favoured large orgs with existing reach; disadvantaged small NGOs and
    low-visibility categories (library programs, policy work, rural literacy).
  - Created a clear gaming/coordination attack surface (paid endorsement
    farms, bot rings) that NRC verification cannot cheaply police at 5,000
    signal volume.
  - Coupled certificate release to a public metric rather than to NRC
    verification + EDI Matrix outcome, weakening the integrity story.
- **Do not implement:**
  - Any `endorsement_count >= 5000` gate before certificate issuance.
  - Any `Certificate Pending Public Endorsement Requirement` status.
  - Any UI copy that frames 5,000 endorsements as a prerequisite for the
    Certificate of Recognition.
- **What is allowed** (from Doc 26 / Doc 25):
  - Endorsements and public re-nominations remain available as *social signal*
    surfaced on the nominee profile and used by NRC as one input among many.
  - No numeric threshold gates the recognition lifecycle. Certificate issuance
    is gated by NRC verification + governance ratification only.

If you find a code path, migration, edge function, or UI component that
implements the 5,000-endorsement gate, treat it as a bug and remove it.
