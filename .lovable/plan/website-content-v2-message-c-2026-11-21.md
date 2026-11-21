# Website Content v2 — Message C

## Boundaries
Preserve the current layouts, page-specific branding, header/footer, images, components and stored data. Reuse existing forms, submission services and the school-support registry. No database-table, access-rule or nomination-form changes; no publishing. All new wording uses translations with English defaults.

Message C supersedes the earlier fourteen-category/“regional participation” presentation: show the requested eight picture categories and voting wording, but preserve all registry records and keep voting closed. Country-to-region mapping stays hidden. Existing funding figures remain explicitly targets, never secured funds.

## Pages
1. **Support a Special-Needs School:** update hero and anchor buttons; add search over verified, publication-approved schools only; expand Take part into the eight requested tabs; retain donation and sponsor/partner forms; add category pictures, the process/ballot/selection explanations, eight-region timetable, five-arms table, partner action and safeguarding notice. Hide partner downloads until a real approved PDF exists.
2. **Online Programme:** keep Monday 28 December 2026 and any confirmed start time; use Add to calendar before that date and Watch live from that date only when an approved destination exists. Add click-to-load YouTube viewing, subscription action, requested running order, up to six existing approved videos and the latest podcast only if available. No invented stream, video or episode.
3. **About:** retain existing disclosures and sections; add/update `#scef`, `#arms`, `#governance`, `#advisors`, `#partners` and `#vision`, preserving the older Vision anchor. Include the supplied founder identity, NRRC remit, nine independent Icon judges, conflicts, integrity and data protection; retain the FAQ link and existing endorsers.
4. **Get Involved and Academy:** reuse existing section/card styles for the six choices, one action each; keep the volunteer band and integrity notice. Academy remains on `#academy` with the supplied four offers and a Register interest form. Volunteer/chapter actions reuse existing real forms or Contact enquiries rather than inventing destinations.
5. **Contact:** show six public topics mapped to existing historical enquiry values, retain correction preselection, add the two supplied email addresses and six FAQs. Show the requested thank-you wording only after a confirmed save, alongside the existing case reference. Do not imply automatic inbox delivery is configured.

## Form destinations
| Form | Existing destination |
| --- | --- |
| Monetary donation; sponsorship/partnership | Existing Support Fund pledge service and `support_fund_pledges`; retain reconciliation and transfer-report handling |
| Get involved; school nomination; vote reminder; scholarships/fees; support offers; EduTourism; Academy interest; item donation | `contact_enquiries`, through the existing Contact submission service, with matching existing topic and form details in the message |
| Existing volunteer and chapter applications | Retain their existing forms where functional; use matching Contact topic only when no existing save destination exists |
| Contact | `contact_enquiries`, visible to authorised administrators |

Short forms collect only school/adult contact and participation details, with consent and no child identifiers, health details, uploads or payment credentials. Email-only reminders need a neutral internal enquiry label to satisfy the existing Contact name/country requirements; no invented participant name or country will be stored. If that cannot be represented safely with the existing service, request the minimum adult contact fields rather than change tables.

**Nomination distinction:** all NESA award Nominate buttons use `PUBLIC_ACTIONS_2026.nominate.href` in a new tab with `noopener noreferrer`. The explicitly requested school-nomination tab remains a separate school-support enquiry, not an award submission.

Voting stays disabled while `VOTING_OPEN` is false; a reminder submission is not a vote or an automatic scheduled email. No new live voting engine is included: opening voting still requires the existing approval, verification and anti-fraud safeguards.

## Verification and report
- Add/run focused tests for form routing, closed voting, publication filtering and approved category presentation.
- Submit synthetic entries through each new form path, confirm their saved rows, and delete only those test rows by id. Exercise the existing donation/partner path where changed, without payments or privilege bypasses.
- Check preview compilation and tests; inspect all five pages at 1280px and 360px with screenshots, anchor/tab navigation, lazy imagery and no sideways page overflow.
- Report each page’s sections, every form destination, any configured facts retained, unavailable approved media/PDFs, email-delivery status and exact files changed. Stop for review without publishing.