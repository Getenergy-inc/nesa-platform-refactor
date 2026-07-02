
# NESA-Africa 2026 Capability Content Refactor

## Scope
Content-only refactor. Keep every existing layout, component, colour, font, spacing, header, footer, nav and responsive behaviour. Only copy inside existing sections/cards changes. No new pages, no new components, no new visual styles.

## Approach
1. Centralise the approved copy in a single content module so every consumer page reads from one source of truth.
2. Update each target page/section to import from that module and swap the text-only props (headings, subheadings, body copy, card titles/descriptions, CTA labels). Keep existing component structure, class names, routes, images, and CTA URLs unchanged.
3. Where a section already renders from a config file (tiers, pillars, stats, objectives, programmes, capabilities, partnership cards), edit only the string fields inside those configs.
4. Preserve SEO structure; refresh `<title>` / `<meta name="description">` copy on the affected pages using the approved positioning line.

## Files to add
- `src/content/capability2026.ts` — single source of truth for hero, about, vision, mission, 4 objectives, core identity, "What NESA-Africa Does" (8 cards), recognition architecture stats, 4 tiers, 9 pillars, continental reach, key programmes, 8 capability areas, who-we-serve, 7 partnership opportunities, integrity/governance, why partner, impact pathway, final CTA.

## Files to edit (content only)
- Homepage sections that already exist:
  - `src/components/nesa/TrophyHeroSection.tsx` — hero headline, sub-copy, CTA labels.
  - `src/components/nesa/WhatIsNESASection.tsx` — About intro paragraph.
  - `src/components/nesa/WhoWeHonourSection.tsx` / `WhoWeRecogniseClustersSection.tsx` — cluster copy.
  - `src/components/nesa/RecognitionTiersHomeSection.tsx` — 4-tier titles + descriptions.
  - `src/components/nesa/SevenPillarsHomeSection.tsx` — 9-pillar copy (labels already updated to 9).
  - `src/components/nesa/StatsStrip.tsx` — architecture stat labels.
  - `src/components/nesa/GovernanceFirewallSection.tsx` — integrity copy.
  - `src/components/nesa/FinalCTASection.tsx` — closing CTA copy.
- About page sections:
  - `src/pages/about/About.tsx` (+ existing About subsections: Vision, Mission, Strategic Objectives, Core Identity, What We Do, Continental Reach, Key Programmes, Capabilities, Who We Serve, Impact Pathway).
- Sponsors & Partners: `src/pages/*` sponsor/partner sections — 7 partnership opportunity cards + "Why Partner" copy.
- Awards overview: `src/pages/Awards.tsx` — tier descriptions + architecture line.
- Impact Programmes: hub page — 6 programme cards.
- Capability Statement page: reuse `src/pages/about/About.tsx` sub-route if present; otherwise add copy into the closest existing "About/Capability" surface without new layout.

## Content rules applied
- Positioning line: "Africa's Education Recognition & Impact Platform — Recognising the Enablers of Education for All Across Africa".
- Theme: "The African Blue-Garnet Awards for Education". Gala: 22 October 2026, Lagos.
- Architecture numbers: 4 tiers · 18 categories · 100+ pathways · 9 pillars · 8 Africa regions · 2 global communities.
- Preserve firewall line: "Sponsorship does not influence winners."
- British/Nigerian English spelling (recognise, organisation, programme, centre).
- Closing line where appropriate: "Africa sees you. Africa appreciates you. Africa says thank you."

## Non-goals
- No route changes, no new components, no design tokens, no image swaps, no analytics changes, no backend changes.

## Verification
- `tsgo` typecheck after edits.
- Spot-check homepage, About, Awards, Sponsors, Programmes in the preview to confirm copy renders inside existing components with no layout regressions.
