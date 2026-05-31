import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileDown,
  Handshake,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { SponsorPillarsSection } from "@/components/sponsor/SponsorPillarsSection";
import { LegacyFundCallout } from "@/components/sponsor/LegacyFundCallout";
import { SponsorshipDefinitions } from "@/components/sponsor/SponsorshipDefinitions";
import { SponsorFirewallBanner } from "@/components/governance/SponsorFirewallBanner";
import { DonorTrustPanel } from "@/components/governance/DonorTrustPanel";
import { SponsorSlotMatrix } from "@/components/sponsor/SponsorSlotMatrix";
import { SponsorPricingTable } from "@/components/sponsor/SponsorPricingTable";
import { SponsorPartnershipLanes } from "@/components/sponsor/SponsorPartnershipLanes";
import { SponsorFAQ } from "@/components/sponsor/SponsorFAQ";
import { SponsorSectionNav } from "@/components/sponsor/SponsorSectionNav";
import { SponsorLaneDetails } from "@/components/sponsor/SponsorLaneDetails";

export default function SponsorHub() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Sponsor NESA-Africa 2026 — Premium Partnership & CSR Ecosystem</title>
        <meta
          name="description"
          content="Sponsor New Education Standard Award Africa (NESA-Africa) 2026 — &quot;The African Blue-Garnet Awards for Education.&quot; Align your brand with Africa's continental education recognition and impact platform: gala, awards, NESA-Africa TV, EduAid-Africa and Rebuild My School Africa."
        />
        <link rel="canonical" href="https://nesa.africa/sponsor" />
      </Helmet>

      {/* Hero */}
      <section
        id="overview"
        className="relative bg-charcoal border-b border-gold/10 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--gold)/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 py-14 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Sponsor NESA-Africa 2026
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-ivory leading-tight mb-3">
              Sponsor New Education Standard Award Africa (NESA-Africa) 2026
            </h1>
            <p className="text-gold/90 italic text-lg md:text-xl mb-5">
              “The African Blue-Garnet Awards for Education”
            </p>
            <p className="text-ivory/80 text-base md:text-lg max-w-2xl mb-3">
              Align your brand with Africa's continental education recognition and impact platform.
            </p>
            <p className="text-ivory/70 text-sm md:text-base max-w-2xl mb-5">
              Partner with NESA-Africa 2026 to support verified education changemakers, the Blue
              Garnet Awards Gala, Africa Education Icon recognition, EduAid-Africa webinars,
              NESA-Africa TV, Rebuild My School Africa and post-award legacy impact across Africa
              and the diaspora.
            </p>
            <p className="text-ivory/55 text-xs md:text-sm max-w-2xl mb-8 border-l-2 border-gold/40 pl-3">
              Sponsorship does not influence nominations, voting, judging, finalists or winners.
              Recognition → Visibility → Partnerships → Legacy Impact.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gold text-charcoal hover:bg-gold-dark font-semibold"
              >
                <Link
                  to="/contact?topic=sponsorship&intent=prospectus"
                  onClick={() =>
                    trackEvent("sponsor_cta_click", { cta: "prospectus", from: "hub_hero" })
                  }
                >
                  <FileDown className="mr-1.5 h-4 w-4" /> Request Sponsorship Prospectus
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold"
              >
                <Link
                  to="/contact?topic=sponsorship"
                  onClick={() =>
                    trackEvent("sponsor_cta_click", { cta: "talk", from: "hub_hero" })
                  }
                >
                  <Handshake className="mr-2 h-4 w-4" /> Talk to Partnerships
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-ivory/80 hover:text-gold hover:bg-gold/5"
              >
                <a
                  href="#packages"
                  onClick={() =>
                    trackEvent("sponsor_cta_click", { cta: "packages", from: "hub_hero" })
                  }
                >
                  <ListChecks className="mr-2 h-4 w-4" /> View Sponsorship Packages
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Anchor nav (desktop) */}
      <SponsorSectionNav />

      {/* Sponsor firewall — governance prominence */}
      <section className="bg-charcoal pt-10 md:pt-12">
        <div className="container mx-auto px-4">
          <SponsorFirewallBanner />
          <div className="mt-4">
            <Link
              to="/governance#sponsor-firewall"
              className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] text-gold font-semibold hover:underline"
              onClick={() =>
                trackEvent("sponsor_cta_click", { cta: "integrity_policy", from: "hub_firewall" })
              }
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Read Full Award Integrity Policy <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Master pricing matrix */}
      <SponsorPricingTable />

      {/* 4 Governance Pillars */}
      <SponsorPillarsSection />

      {/* Partnership lane cards */}
      <SponsorPartnershipLanes />

      {/* Lane-by-lane developer-ready copy blocks (config-driven) */}
      <SponsorLaneDetails />

      {/* 5% RMSA Legacy Fund */}
      <LegacyFundCallout />

      {/* Sponsor slot limits — governance rule */}
      <SponsorSlotMatrix />

      {/* Sponsorship vs Partnership vs Donation vs Supporter definitions */}
      <SponsorshipDefinitions />

      {/* Donor & Sponsor Trust Center */}
      <section
        id="payment-trust"
        className="bg-charcoal py-12 md:py-16 border-t border-gold/10 scroll-mt-24"
      >
        <div className="container mx-auto px-4">
          <DonorTrustPanel />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold"
              size="sm"
            >
              <Link to="/contact?topic=verify-payment">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Verify Payment Channel
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <SponsorFAQ />

      {/* Final CTA */}
      <section
        id="contact"
        className="bg-charcoal border-t border-gold/10 py-14 md:py-20 scroll-mt-24"
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-ivory mb-4">
            Build a Custom Sponsorship or Partnership Package
          </h2>
          <p className="text-ivory/70 md:text-lg mb-7">
            Our partnerships team can help your organisation design a package across awards, media,
            webinars, legacy impact, sub-category pages and CSR reporting. Whether you are a
            corporate sponsor, foundation, development partner, media institution, university or
            diaspora organisation, NESA-Africa 2026 offers a structured pathway for education
            impact.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
              <Link to="/contact?topic=sponsorship&intent=prospectus">
                <FileDown className="mr-1.5 h-4 w-4" /> Request Sponsorship Prospectus
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold"
            >
              <Link to="/contact?topic=sponsorship">
                <Handshake className="mr-2 h-4 w-4" /> Talk to Partnerships
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
            partnerships@nesa.africa · All sponsorship engagements are governed by term sheet or
            MoU, with receipts issued for every verified settlement.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
