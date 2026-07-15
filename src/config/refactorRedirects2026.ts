// Refactor Redirects 2026 — central 301 register for the master refactor.
//
// Extends the pattern established in `legacyRecognitionRedirects.ts`.
// Registered in `App.tsx` via <RedirectRoute>, which substitutes `:param`
// tokens against the current URL params.
//
// Rule: no component may be deleted until its old URL appears here.

export interface RefactorRedirect {
  from: string;
  to: string;
  /** Free-text reason kept in source for audit purposes. */
  reason: string;
}

export const REFACTOR_REDIRECTS_2026: RefactorRedirect[] = [
  // --- Obsolete voting surfaces (2026 has no public voting on the four tiers) ---
  { from: "/vote", to: "/nominees", reason: "2026 has no public voting" },
  { from: "/vote/:categorySlug", to: "/nominees", reason: "vote pages deprecated" },
  {
    from: "/awards/africa-education-icon/vote",
    to: "/awards/africa-education-icon/nominees",
    reason: "Icon award is jury-only",
  },
  {
    from: "/awards/platinum/vote",
    to: "/awards/platinum/nominees",
    reason: "Platinum is jury-only",
  },
  {
    from: "/awards/gold-blue-garnet/vote",
    to: "/awards/gold-blue-garnet/nominees",
    reason: "2026 is Recognition Edition; competition returns 2027",
  },
  {
    from: "/awards/influencer-education-impact/vote",
    to: "/awards/influencer-education-impact/nominees",
    reason: "Influencer recognition is impact-based, not popularity",
  },

  // --- 2025 tier landings → 2026 canonical tier landings ---
  { from: "/awards/2025", to: "/awards", reason: "Archived cycle" },
  { from: "/awards/2025/:slug", to: "/awards", reason: "Archived cycle" },
  { from: "/awards/icon-2025", to: "/awards/africa-education-icon", reason: "2025 → 2026 canonical" },
  { from: "/awards/blue-garnet-2025", to: "/awards/gold-blue-garnet", reason: "2025 → 2026 canonical" },
  { from: "/awards/platinum-2025", to: "/awards/platinum", reason: "2025 → 2026 canonical" },

  // --- Duplicate About / FAQ / Sponsor surfaces ---
  { from: "/about-us", to: "/about", reason: "Duplicate About" },
  { from: "/about/overview", to: "/about", reason: "Duplicate About" },
  { from: "/faqs", to: "/help", reason: "FAQs consolidated into Help Centre" },
  { from: "/faq", to: "/help", reason: "FAQs consolidated into Help Centre" },
  { from: "/sponsor-us", to: "/sponsors", reason: "Duplicate sponsor landing" },
  { from: "/sponsor/enquire", to: "/sponsors/enquire", reason: "Canonicalise sponsor enquiry" },
  { from: "/become-a-sponsor", to: "/sponsors", reason: "Duplicate sponsor CTA page" },
  { from: "/become-a-partner", to: "/partners", reason: "Duplicate partner CTA page" },

  // --- Directory naming (URL preserved for SEO; alias legacy names) ---
  { from: "/directory", to: "/nominees", reason: "Alias into Africa Education Impact Directory" },
  { from: "/impact-directory", to: "/nominees", reason: "Alias into Africa Education Impact Directory" },
  { from: "/verified-profiles", to: "/nominees", reason: "Alias into Africa Education Impact Directory" },

  // --- 5-region legacy pages → 8-region equivalents on /about/regions ---
  { from: "/regions/north", to: "/about/regions#north-africa", reason: "Adopt 8-region model" },
  { from: "/regions/south", to: "/about/regions#southern-africa", reason: "Adopt 8-region model" },
  { from: "/regions/east", to: "/about/regions#east-africa", reason: "Adopt 8-region model" },
  { from: "/regions/west", to: "/about/regions#west-africa", reason: "Adopt 8-region model" },
  { from: "/regions/central", to: "/about/regions#central-africa", reason: "Adopt 8-region model" },

  // --- Friends of Africa is a participation class, not a region ---
  { from: "/regions/friends-of-africa", to: "/about/regions#friends-of-africa", reason: "Reclassified as participation class" },
  { from: "/friends-of-africa", to: "/about/regions#friends-of-africa", reason: "Reclassified as participation class" },

  // --- Nomination hub cleanup ---
  { from: "/submit-nomination", to: "/nominate", reason: "Canonical nomination hub" },
  { from: "/nominate/all", to: "/nominate", reason: "No omnibus form; tier chooser only" },

  // --- Endorsements language cleanup ---
  { from: "/vote-endorse", to: "/endorsements", reason: "Endorsements are not votes" },
  { from: "/endorse", to: "/endorsements", reason: "Canonical endorsements hub" },

  // --- 22-page consolidation (Phase A) ---
  // Partners + Sponsors merged into single /partners-sponsors entry page
  { from: "/sponsors", to: "/partners-sponsors", reason: "Merged into Partners & Sponsors" },
  { from: "/sponsors/packages", to: "/partners-sponsors#sponsor-packages", reason: "Merged" },
  { from: "/sponsors/enquire", to: "/partners-sponsors#sponsor-enquire", reason: "Merged" },
  { from: "/partners", to: "/partners-sponsors", reason: "Merged" },
  { from: "/get-involved/partner", to: "/partners-sponsors#partner", reason: "Merged" },

  // Media Centre consolidation
  { from: "/nesatv", to: "/media/tv", reason: "Media Centre consolidation" },
  { from: "/radio-podcast", to: "/media", reason: "Media Centre consolidation" },
  { from: "/media/news", to: "/news", reason: "Media Centre consolidation" },
  { from: "/media/stories", to: "/news", reason: "Media Centre consolidation" },
  { from: "/media/gallery", to: "/gallery", reason: "Media Centre consolidation" },
  { from: "/media/press", to: "/press-room", reason: "Media Centre consolidation" },

  // Events & Gala consolidation
  { from: "/gala", to: "/events", reason: "Events & Gala consolidation" },
  { from: "/events/gala-2026", to: "/events#gala-2026", reason: "Events & Gala consolidation" },
  { from: "/events/tickets", to: "/events#tickets", reason: "Events & Gala consolidation" },
  { from: "/events/media-accreditation", to: "/events#accreditation", reason: "Events & Gala consolidation" },
  { from: "/events/attendance-request", to: "/events#attendance", reason: "Events & Gala consolidation" },
  { from: "/events/calendar", to: "/events", reason: "Events & Gala consolidation" },
  { from: "/webinars", to: "/events", reason: "Events & Gala consolidation" },

  // Policies hub
  { from: "/privacy", to: "/policies#privacy", reason: "Policies hub" },
  { from: "/terms", to: "/policies#terms", reason: "Policies hub" },
  { from: "/cookies", to: "/policies#cookies", reason: "Policies hub" },
  { from: "/accessibility", to: "/policies#accessibility", reason: "Policies hub" },
  { from: "/policies/nomination-integrity", to: "/policies#nomination-integrity", reason: "Policies hub" },
  { from: "/policies/sponsor-independence", to: "/policies#sponsor-independence", reason: "Policies hub" },
  { from: "/policies/data-protection", to: "/policies#data-protection", reason: "Policies hub" },
  { from: "/policies/conflict-of-interest", to: "/policies#conflict-of-interest", reason: "Policies hub" },
  { from: "/policies/endorsement", to: "/policies#endorsement", reason: "Policies hub" },
  { from: "/policies/certificate", to: "/policies#certificate", reason: "Policies hub" },
  { from: "/policies/media-consent", to: "/policies#media-consent", reason: "Policies hub" },

  // Resources hub — reports consolidation
  { from: "/reports", to: "/resources#reports", reason: "Resources hub" },
  { from: "/impact/reports", to: "/resources#impact-reports", reason: "Resources hub" },

  // Recognition tier alias (spec says /awards/platinum canonical)
  { from: "/awards/platinum-recognition", to: "/awards/platinum", reason: "Canonical tier slug" },

  // Community merges (Get Involved → Community)
  { from: "/get-involved", to: "/community", reason: "Renamed to Community" },
  { from: "/membership/types", to: "/membership", reason: "Membership consolidation" },
  { from: "/membership/benefits", to: "/membership", reason: "Membership consolidation" },
];

