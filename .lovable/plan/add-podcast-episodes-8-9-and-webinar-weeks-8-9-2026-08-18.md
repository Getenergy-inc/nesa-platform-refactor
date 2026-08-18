# Add Podcast Episodes 8 & 9 and Webinar Weeks 8 & 9

Add-only completion of the two existing calendars. No existing entry is rewritten, reordered or removed, with one unavoidable exception flagged below.

## What gets added

**EduAid-Africa Webinar Series** (`src/data/eduaidWebinarSeries2026.ts`)
Append two episode objects after Week 7, using the existing episode schema (episode, id, isoDate, dateLabel, title, subtitle, summary, promotes[], tiers, competitiveStatus, competitiveLabel):

- Week 8 — Thursday, 26 November 2026 — "Education Beyond Recognition" / CSR, NGOs, Political Leadership & Institutional Action. Promotes list exactly as supplied. Non-competitive · Impact & Legacy · Institutional Education Impact.
- Week 9 — Thursday, 3 December 2026 — "Africa's Education Champions" / Influencers, Africa Education Icons & Friends of Education. Promotes list exactly as supplied. Non-competitive · Final Pre-Gala Webinar, plus the closing message "Recognition is not the destination. It is an invitation to do more." and the Recognition → Commitment → Partnership → Action → Impact → Legacy chain.

Weeks 1–7 objects are untouched. Series metadata that is currently derived (`episodeCount`) updates itself; the hand-written strings that say "7-Week" / series end "19 November 2026" get corrected to 9 weeks / 3 December 2026 so the calendar is not self-contradicting — copy only, no episode content touched.

**Master timeline** (`src/data/masterTimeline2026.ts`)
Add four dated entries in the existing `MasterTimelineEntry` shape, sorted into place by `startsAt`:

- `podcast-8` — Tuesday, 13 October 2026 — Education Enablers Podcast Episode 8 — Education Beyond Recognition, with the supplied description, topic list and purpose in `details`, plus a cross-reference line to Webinar Week 8 (26 November 2026).
- `podcast-9` — Tuesday, 20 October 2026 — Episode 9 — Africa's Education Champions, same treatment, cross-referencing Webinar Week 9 (3 December 2026).
- `webinar-8` — Thursday, 26 November 2026.
- `webinar-9` — Thursday, 3 December 2026.

Episodes 1–7 and Episode 10, Webinar Weeks 1–7, all nomination/judging/gala rows: unchanged. Existing hrefs (`/media`, `/media/webinars`) reused — no new routes, no new pages, no second calendar.

## The one existing record that must change

The timeline currently holds a single placeholder row `podcast-8-9` labelled "To be confirmed", and a matching internal open item `podcast-8-9-unconfirmed` saying no dates or topics exist. Now that both episodes have confirmed dates and topics, that placeholder is replaced by the two real entries and the open item is removed. Leaving it would render "Episodes 8 & 9 — to be confirmed" alongside the newly dated Episodes 8 and 9.

Knock-on: `src/data/volunteerVacancies2026.ts` derives its host slot pickers from these two datasets, so the podcast picker's "Episode 8 & 9 — to be confirmed" slot automatically becomes two real dated slots, and the webinar picker gains Weeks 8 and 9 (Week 9 becomes the "closing" label). No edit needed there — it is derived.

## Governance

New entries carry the same non-competitive framing as existing ones: participation in a webinar or podcast does not influence nomination approval, verification, judging or any recognition outcome. Weeks 8 and 9 fall after the Icon judging window, so the Episode 4/7 content boundary is not extended.

## Verification

Run the existing test suites that guard these datasets: timeline date validation, timeline integrity, and the Icon content-boundary test (Week 9 names Icon pathways generically — no individual nominee names). Then visually check `/timeline`, `/media/webinars` and the podcast page.
