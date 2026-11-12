# Management-owned credential rotation checklist

Date: 12 November 2026. **Checklist only; no credentials rotated.**

Treat credentials available to affected startup/editor processes as potentially exposed until incident review determines scope. Never paste credentials into chat, source, URLs or evidence logs.

| Credential group | Management action | Verification required |
|---|---|---|
| Lovable Cloud application keys and signing keys | Authorised platform owner to arrange supported credential replacement; identify impacted clients/functions and session invalidation. Private service-role keys and database passwords are not available to users on Lovable Cloud. Do not request or fabricate them. | Approved key-change evidence, old-access invalidation, authorised/unauthorised checks after clearance. |
| Database connection credentials | Platform-managed handling; do not attempt direct rotation from this audit. | Backup, controlled maintenance and post-change connectivity. |
| SMTP/email delivery | Replace provider credentials after containment and update authorised configuration. | Verified sending domain, delivery and failure logging. |
| Google APIs / nomination-sheet service account | Review access, replace credentials if exposure is suspected, limit sheet access to read-only. | Owner approval, sheet scope and idempotent import checks. No sheet service account confirmed in this audit. |
| YouTube OAuth | Review consent, revoke affected refresh tokens and reauthorise the approved service. | Least-privilege scopes, authorised upload/publish flow. |
| GitHub tokens, deploy keys and sessions | Review collaborators, access logs, webhooks, deploy keys and actions credentials; revoke affected access. | Named-owner approval, protected branches, required review, authenticated audit evidence. |
| Lovable integrations and API access | Review sessions and linked services; replace/reconnect only affected credentials after containment. | Provider access and audit evidence; no automatic rotation. |
| Payments / WhatsApp / translation providers | Review Paystack, WhatsApp and custom translation credentials named in source; restrict or replace as appropriate. | Authorised service tests; never enable public wallet/voting/shop as a side effect. |

## Safe order

1. Name incident owner, reviewer, QA and production approver; preserve hashed evidence.
2. Stop affected execution paths using an explicitly approved containment change.
3. Secure authorised dated full database/Auth and storage-file backups; test rollback in isolation.
4. Review who could access credentials and determine rotation scope with owners.
5. Replace only through supported authorised controls; update server configuration without exposing values.
6. Invalidate old credentials/sessions as approved; verify new access after Phase 0 clearance.
7. Record actor, time, credential **name**, affected services and verification result—never value.

## Open dependencies

Authenticated repository-owner access, named incident/release owners, backup ownership, provider access and supported platform-managed credential handling remain unverified. Written phase approval does not substitute for these evidence requirements.