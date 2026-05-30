import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Handshake, Sparkles } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { SPONSOR_CATEGORIES } from "@/config/sponsorCategories";
import { trackEvent } from "@/lib/analytics";
import { SponsorPillarsSection } from "@/components/sponsor/SponsorPillarsSection";
import { LegacyFundCallout } from "@/components/sponsor/LegacyFundCallout";
import { SponsorshipDefinitions } from "@/components/sponsor/SponsorshipDefinitions";
import { SponsorFirewallBanner } from "@/components/governance/SponsorFirewallBanner";
import { DonorTrustPanel } from "@/components/governance/DonorTrustPanel";

export default function SponsorHub() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Sponsor New Education Standard Award Africa (NESA-Africa) 2026 — Premium Partnership Ecosystem</title>
        <meta
          name="description"
          content="Sponsor New Education Standard Award Africa (NESA-Africa) 2026 — motto: &quot;The African Blue-Garnet Awards for Education.&quot; Align your brand with Africa's continental education recognition and impact platform."
        />
        <link rel="canonical" href="https://nesa.africa/sponsor" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-charcoal border-b border-gold/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--gold)/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
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
            <p className="text-ivory/70 text-base md:text-lg max-w-2xl mb-4">
              Align your brand with Africa's continental education recognition and impact platform. Headline the Blue Garnet Awards Gala, own an award category, fund EduAid-Africa scholarships, rebuild schools, power NESA-Africa TV, or co-create a multi-year CSR partnership.
            </p>
            <p className="text-ivory/55 text-xs md:text-sm max-w-2xl mb-8 border-l-2 border-gold/40 pl-3">
              Integrity policy: Sponsors and partners cannot nominate, shortlist, vote, judge, lobby or influence award outcomes. Sponsorship benefits are limited to approved visibility, reporting, engagement, CSR alignment, media exposure and impact documentation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
                <Link to="/sponsor/deck" onClick={() => trackEvent("sponsor_cta_click", { cta: "deck", from: "hub_hero" })}>
                  Download Sponsorship Deck <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold">
                <Link to="/contact?topic=sponsorship" onClick={() => trackEvent("sponsor_cta_click", { cta: "contact", from: "hub_hero" })}>
                  <Handshake className="mr-2 h-4 w-4" /> Talk to Partnerships
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="bg-charcoal py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-2">
              Choose your partnership lane
            </h2>
            <p className="text-ivory/60 text-sm md:text-base">
              Ten dedicated ways to align your brand, institution or foundation with Africa's most credible education awards platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {SPONSOR_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <Link
                  to={`/sponsor/${cat.slug}`}
                  onClick={() => trackEvent("sponsor_category_click", { slug: cat.slug, from: "hub_grid" })}
                  className={`group relative block h-full rounded-2xl border border-gold/20 hover:border-gold/60 bg-gradient-to-br ${cat.accent} bg-charcoal/60 p-6 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_hsl(var(--gold)/0.5)]`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-gold/60 group-hover:text-gold group-hover:translate-x-0.5 transition" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ivory mb-1.5 leading-tight">
                    {cat.label}
                  </h3>
                  <p className="text-ivory/65 text-sm leading-relaxed mb-4">{cat.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                    {cat.ctaLabel} <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-charcoal border-t border-gold/10 py-14">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
            Build a custom partnership.
          </h2>
          <p className="text-ivory/65 mb-6">
            Our partnerships team will tailor a sponsorship package across multiple lanes to match your CSR strategy and audience goals.
          </p>
          <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
            <Link to="/contact?topic=sponsorship">Contact Partnerships <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
