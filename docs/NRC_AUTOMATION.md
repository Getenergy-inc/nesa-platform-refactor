# NRC Automation Module - NESA-Africa 2025

**Last Updated:** 2026-02-05

## Overview

The NRC (Nominee Research Corps) Automation Module provides a 99% governance-grade verification system for NESA-Africa 2025 nominations. It combines AI-assisted assessment with human review workflows, ensuring consistent, auditable, and scalable verification.

## Database Schema

### New Tables Created
- **`ai_nrc_assessments`** - AI verification results with scores and reason codes
- **`nrc_reviews`** - Human reviewer checklist submissions
- **`nrc_assignment_rules`** - Configurable auto-assignment rules
- **`nrc_evidence_queries`** - Clarification requests to nominees
- **`nrc_verification_summaries`** - Final decision records

### Enhanced Tables
- **`nominations`** - Added `workflow_status`, `rubric_version`, `query_count`, `sla_deadline`
- **`nrc_members`** - Added `nrc_role`, `current_assignments`, `total_reviews`, `is_available`

## Workflow States

```
DRAFT → SUBMITTED_PENDING_ACCEPTANCE → ACCEPTED_PENDING_NRC
                                    ↓
                              NRC_ASSIGNED → NRC_IN_REVIEW
                                    ↓
                     NRC_QUERY_SENT (if needed) → back to NRC_IN_REVIEW
                                    ↓
                    VERIFIED_BY_NRC  or  REJECTED_BY_NRC
                           ↓
                  PUBLISHED_FOR_VOTING
```

## Key Features

### 1. AI-Assisted Verification
- Automated evidence scoring (0-100)
- Category fit analysis
- Identity verification
- Risk flagging
- Reason codes for explainability

### 2. Human Review Workflow
- Dual-reviewer assignment (2 of 3 quorum)
- Standardized verification checklist
- Evidence query system
- SLA tracking (72-hour deadline)
- Escalation for split decisions

### 3. Auto-Assignment
- Workload-balanced assignment algorithm
- Random reviewer selection
- SLA deadline enforcement
- Escalation after 96 hours

### 4. Quorum Decision Rules
- 2 of 3 approvals = Verified
- 2 of 3 rejections = Rejected
- Split decision = Escalate to NRC Lead

## Database Functions

- `assign_nrc_reviewers(nomination_id, num_reviewers)` - Auto-assign reviewers
- `check_nrc_quorum(nomination_id)` - Check decision quorum
- `escalate_overdue_nrc_assignments()` - Handle SLA violations

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/nrc/queue` | GET | Get NRC review queue |
| `/nrc/my-queue` | GET | Get user's assigned queue |
| `/nrc/ai/assess/:id` | POST | Request AI assessment |
| `/nrc/review/:id` | POST | Submit human review |
| `/nrc/query` | POST | Request additional evidence |
| `/nrc/assign/auto` | POST | Auto-assign reviewers |
| `/nrc/lead/resolve/:id` | POST | Lead resolves split decision |
| `/nrc/stats` | GET | Dashboard statistics |

## Frontend Components

- **`AIAssessmentPanel`** - Displays AI scores and recommendations
- **`NRCReviewChecklist`** - Interactive verification checklist
- **`NomineeDossier`** - Read-only nominee information viewer

## Configuration

See `src/config/nrcConfig.ts` for:
- Workflow status definitions
- Verification checklist items
- Reason codes
- SLA settings
- Evidence types

## Verification Checklist (FAQ)

### Identity & Existence
1. Does the nominee exist as a real entity?
2. Is there independent verification?
3. Is identity consistent across sources?
4. Are contact details valid?

### Category Fit
5. Does nominee fit selected category?
6. Is work relevant to SDG4/Education?
7. Is geography correct?
8. Is timeframe within eligibility?

### Evidence Quality
9. Is there documented evidence?
10. Are files readable/accessible?
11. Multiple evidence types?
12. Impact metrics present?

### Risk Assessment
13. Fraud indicators?
14. Conflict of interest?
15. Safeguarding concerns?
16. Reputation red flags?

## Certificate Lock Rules

- Certificate issued on acceptance
- **Download locked until 200 renominations**
- Auto-unlock trigger on threshold + verification
