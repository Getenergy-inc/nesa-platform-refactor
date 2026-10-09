// /sponsorship-packages — Full catalogue of all NESA-Africa 2026 sponsorship
// tiers with detailed benefits, governance rules, FAQ and an inquiry CTA.
// Data-driven from SPONSOR_LANE_COPY so the page stays in sync with the
// Sponsor Hub.

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileDown,
  Handshake,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SponsorFAQ } from "@/components/sponsor/SponsorFAQ";
import { SponsorFirewallBanner } from "@/components/governance/SponsorFirewallBanner";
import {
  SPONSOR_LANE_COPY,
  type SponsorLaneCopy,
  type SponsorLaneSlug,
} from "@/config/sponsorLaneCopy";
import { trackEvent } from "@/lib/analytics";

// Ordered display of every package.
const PACKAGE_ORDER: SponsorLaneSlug[] = [
  "blue-diamond",
  "gala-main",
  "gala-supporting",
  "africa-icon-main",
  "icon-documentary",
  "icon-tribute",
  "gold-blue-garnet-main",
  "blue-garnet-category",
  "platinum-main",
  "platinum-category",
  "influencers-main",
  "influencers-supporting",
  "eduaid-webinar-main",
  "eduaid-webinar-supporting",
  "nesa-tv-feature",
  "nesa-tv-supporting",
  "subcategory-lead",
  "subcategory-supporting",
  "subcategory-visibility",
  "supporter-visibility-listing",
  "merchandise-visibility",
  "rmsa-regional-partner",
];

// Logical groupings shown as section headings.
const GROUPS: { id: string; title: string; slugs: SponsorLaneSlug[] }[] = [
  {
    id: "headline",
    title: "Headline & Continental Partnership",
    slugs: ["blue-diamond"],
  },
  {
    id: "gala",
    title: "Blue Garnet Awards Gala",
    slugs: ["gala-main", "gala-supporting"],
  },
  {
    id: "icon",
    title: "Africa Education Icon",
    slugs: ["africa-icon-main", "icon-documentary", "icon-tribute"],
  },
  {
    id: "garnet",
    title: "Gold-Blue Garnet Recognition",
    slugs: ["gold-blue-garnet-main", "blue-garnet-category"],
  },
  {
    id: "platinum",
    title: "Platinum Recognition",
    slugs: ["platinum-main", "platinum-category"],
  },
  {
    id: "influencers",
    title: "Influencers Education Impact",
    slugs: ["influencers-main", "influencers-supporting"],
  },
  {
    id: "eduaid",
    title: "EduAid-Africa Webinars",
    slugs: ["eduaid-webinar-main", "eduaid-webinar-supporting"],
  },
  {
    id: "nesa-tv",
    title: "NESA-Africa TV",
    slugs: ["nesa-tv-feature", "nesa-tv-supporting"],
  },
  {
    id: "subcategory",
    title: "Sub-Category & Page Visibility",
    slugs: [
      "subcategory-lead",
      "subcategory-supporting",
      "subcategory-visibility",
    ],
  },
  {
    id: "supporter",
    title: "Supporter & Visibility Listings",
    slugs: ["supporter-visibility-listing", "merchandise-visibility"],
  },
  {
    id: "rmsa",
    title: "Rebuild My School Africa — Legacy Impact",
    slugs: ["rmsa-regional-partner"],
  },
];

function PackageCard({ copy }: { copy: SponsorLaneCopy }) {
  return (
    <article
      id={copy.slug}
      className="scroll-mt-24 rounded-2xl border border-gold/15 bg-white/[0.03] p-5 sm:p-6 hover:border-gold/35 transition-colors"
    >
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className="bg-gold/15 text-gold border border-gold/30">
            {copy.amount}
          </Badge>
          <Badge
            variant="outline"
            className="border-white/15 text-white/70 bg-white/[0.02]"
          >
            <Users className="h-3 w-3 mr-1" /> {copy.sponsorLimit}
          </Badge>
        </div>
        <h3 className="font-display text-ivory text-xl leading-snug">
          {copy.headline}
        </h3>
        {copy.subheadline && (
          <p className="text-ivory/70 mt-1.5">{copy.subheadline}</p>
        )}
      </header>

      <p className="text-ivory/75 text-sm leading-relaxed mb-4">
        {copy.purpose}
      </p>

      <ul className="space-y-2 mb-5">
        {copy.benefits.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-ivory/80">
            <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <p className="text-[12px] text-ivory/50 border-l-2 border-gold/30 pl-3 mb-5">
        {copy.sponsorSafeLanguage}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          asChild
          size="sm"
          className="bg-gold text-charcoal hover:bg-gold-dark font-semibold"
        >
          <Link
            to={copy.href}
            onClick={() =>
              trackEvent("sponsor_package_cta", {
                cta: "primary",
                lane: copy.slug,
                from: "packages_page",
              })
            }
          >
            {copy.ctaLabel}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold"
        >
          <Link
            to={`/contact?topic=sponsorship&lane=${copy.slug}&intent=inquiry`}
            onClick={() =>
              trackEvent("sponsor_package_cta", {
                cta: "inquiry",
                lane: copy.slug,
                from: "packages_page",
              })
            }
          >
            Inquire
          </Link>
        </Button>
      </div>
    </article>
  );
}

export default function SponsorshipPackages() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Sponsorship Packages — NESA-Africa 2026 | All Tiers & Inquiry</title>
        <meta
          name="description"
          content="Full catalogue of NESA-Africa 2026 sponsorship packages — Blue Diamond, Gala, Africa Education Icon, Blue Garnet, Platinum, Influencers, EduAid-Africa, NESA-Africa TV, Sub-Category, RMSA and Supporter tiers. Benefits, limits, FAQs and inquiry form."
        />
        <link rel="canonical" href="https://nesa.africa/sponsorship-packages" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-charcoal border-b border-gold/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--gold)/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Sponsorship Packages
            </span>
            <h1 className="font-display text-ivory font-bold leading-tight mb-3">
              Full NESA-Africa 2026 Sponsorship Packages
            </h1>
            <p className="text-ivory/80 max-w-2xl mb-6">
              Every governance-approved sponsorship lane with amounts, sponsor
              limits, benefits and inquiry pathways. Choose a tier or request a
              custom partnership package.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gold text-charcoal hover:bg-gold-dark font-semibold"
              >
                <Link
                  to="/contact?topic=sponsorship&intent=prospectus"
                  onClick={() =>
                    trackEvent("sponsor_cta_click", {
                      cta: "prospectus",
                      from: "packages_hero",
                    })
                  }
                >
                  <FileDown className="mr-1.5 h-4 w-4" /> Request Prospectus
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold"
              >
                <a href="#inquiry">
                  <Handshake className="mr-2 h-4 w-4" /> Inquire About a Package
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Governance firewall */}
      <section className="bg-charcoal pt-10">
        <div className="container mx-auto px-4">
          <SponsorFirewallBanner />
        </div>
      </section>

      {/* Quick-jump index */}
      <section className="bg-charcoal py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-ivory/60 text-xs uppercase tracking-[0.18em] font-semibold mb-3">
            Jump to a package family
          </h2>
          <ul className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex text-xs text-ivory/80 hover:text-gold border border-white/10 hover:border-gold/40 rounded-full px-3 py-1.5 transition-colors"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Package groups */}
      <section className="bg-charcoal pb-12">
        <div className="container mx-auto px-4 space-y-12">
          {GROUPS.map((group) => (
            <div key={group.id} id={group.id} className="scroll-mt-24">
              <h2 className="font-display text-ivory text-2xl md:text-3xl mb-5 border-l-4 border-gold pl-3">
                {group.title}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {group.slugs.map((slug) => (
                  <PackageCard key={slug} copy={SPONSOR_LANE_COPY[slug]} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <SponsorFAQ />

      {/* Inquiry CTA */}
      <section
        id="inquiry"
        className="bg-charcoal border-t border-gold/10 py-14 md:py-20 scroll-mt-24"
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Badge className="bg-gold/15 text-gold border border-gold/30 mb-4">
            Sponsorship Inquiry
          </Badge>
          <h2 className="font-display text-ivory text-2xl md:text-4xl font-bold mb-4">
            Ready to Sponsor or Build a Custom Package?
          </h2>
          <p className="text-ivory/70 md:text-lg mb-7">
            Our partnerships team will respond within two business days with the
            Sponsorship Prospectus, term sheet template and a tailored
            recommendation across awards, gala, media, webinars and legacy
            impact lanes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-gold text-charcoal hover:bg-gold-dark font-semibold"
            >
              <Link
                to="/contact?topic=sponsorship&intent=inquiry"
                onClick={() =>
                  trackEvent("sponsor_cta_click", {
                    cta: "inquiry",
                    from: "packages_footer",
                  })
                }
              >
                <Handshake className="mr-2 h-4 w-4" /> Send a Sponsorship Inquiry
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold"
            >
              <Link to="/contact?topic=sponsorship&intent=prospectus">
                <FileDown className="mr-2 h-4 w-4" /> Request Prospectus
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold"
            >
              <Link to="/contact?topic=verify-payment">
                <ShieldCheck className="mr-2 h-4 w-4" /> Verify Payment Channel
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-ivory/80 hover:text-gold hover:bg-gold/5"
            >
              <Link to="/support?chat=sophia">
                <MessageSquare className="mr-2 h-4 w-4" /> Chat with Sophia
              </Link>
            </Button>
          </div>
          <p className="text-ivory/45 text-xs mt-6 max-w-xl mx-auto">
            partnerships@nesa.africa · All sponsorship engagements are governed
            by term sheet or MoU, with receipts issued for every verified
            settlement.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}

// Re-export the ordered package list for downstream usage (e.g. sitemaps).
export { PACKAGE_ORDER };
