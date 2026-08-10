import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Download, Mail, Sparkles, Target, Users2, Tv2 } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SPONSOR_CATEGORIES, getSponsorCategory } from "@/config/sponsorCategories";
import { trackEvent } from "@/lib/analytics";
import { SponsorFirewallBanner } from "@/components/governance/SponsorFirewallBanner";
import { LegacyFundCallout } from "@/components/sponsor/LegacyFundCallout";
import { DonorTrustPanel } from "@/components/governance/DonorTrustPanel";
import { SponsorSlotBadge } from "@/components/sponsor/SponsorSlotBadge";

export default function SponsorCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = getSponsorCategory(slug);

  if (!cat) return <Navigate to="/sponsor" replace />;

  const Icon = cat.icon;
  const isDeck = cat.slug === "deck";

  return (
    <PublicLayout>
      <Helmet>
        <title>{cat.label} — NESA-Africa 2026 Sponsorship</title>
        <meta name="description" content={cat.description} />
        <link rel="canonical" href={`https://nesa.africa/sponsor/${cat.slug}`} />
      </Helmet>

      {/* Hero */}
      <section className={`relative bg-charcoal border-b border-gold/10 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent}`} />
        <div className="container mx-auto px-4 py-14 md:py-20 relative">
          <Link
            to="/sponsor"
            className="inline-flex items-center gap-1.5 text-xs text-ivory/60 hover:text-gold mb-6 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All sponsorship lanes
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold mb-5">
              <Icon className="h-6 w-6" />
            </div>
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Sponsor NESA-Africa 2026
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory leading-tight mb-4">
              {cat.label}
            </h1>
            <p className="text-ivory/75 text-base md:text-lg mb-6">{cat.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {cat.sdg.map((s) => (
                <Badge key={s} variant="outline" className="border-gold/40 text-gold bg-gold/5">{s}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {isDeck ? (
                <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
                  <Link
                    to="/sponsors/packages"
                    onClick={() => trackEvent("sponsor_deck_download", { from: "deck_hero" })}
                  >
                    <Download className="mr-2 h-4 w-4" /> View Sponsorship Packages
                  </Link>
                </Button>
              ) : (
                <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
                  <Link
                    to={`/contact?topic=sponsorship&lane=${cat.slug}`}
                    onClick={() => trackEvent("sponsor_inquiry_click", { slug: cat.slug, from: "cat_hero" })}
                  >
                    {cat.ctaLabel} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold">
                <Link to="/sponsor/deck">
                  <Download className="mr-2 h-4 w-4" /> Sponsorship Deck
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sponsor firewall — governance disclosure */}
      <section className="bg-charcoal pt-8 md:pt-10">
        <div className="container mx-auto px-4 space-y-6">
          <SponsorFirewallBanner variant="compact" />
          {!isDeck && <SponsorSlotBadge slug={cat.slug} />}
        </div>
      </section>

      {/* Reach + Audience */}
      <section className="bg-charcoal py-12 md:py-16 border-b border-gold/10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Users2, label: "Audience", value: cat.audience },
            { icon: Target, label: "Reach", value: cat.reach },
            { icon: Tv2, label: "Visibility", value: cat.visibility.slice(0, 2).join(" · ") },
          ].map((b) => (
            <Card key={b.label} className="bg-charcoal/60 border-gold/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-gold mb-2">
                  <b.icon className="h-4 w-4" />
                  <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">{b.label}</span>
                </div>
                <p className="text-ivory/80 text-sm leading-relaxed">{b.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits + Visibility */}
      <section className="bg-charcoal py-14 md:py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-ivory mb-4">Partnership benefits</h2>
            <ul className="space-y-3">
              {cat.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-ivory/80 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ivory mb-4">Brand visibility</h2>
            <ul className="space-y-3">
              {cat.visibility.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-ivory/80 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tiers */}
      {cat.tiers.length > 0 && (
        <section className="bg-charcoal py-14 md:py-20 border-t border-gold/10">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-2xl">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-2">
                Sponsorship tiers
              </h2>
              <p className="text-ivory/60 text-sm">
                All packages are flexible — custom combinations available on request.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cat.tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`bg-charcoal/60 ${
                    tier.highlighted ? "border-gold ring-1 ring-gold/40" : "border-gold/20"
                  }`}
                >
                  <CardContent className="p-6">
                    {tier.highlighted && (
                      <Badge className="bg-gold text-charcoal mb-3 font-semibold">Recommended</Badge>
                    )}
                    <h3 className="font-display text-xl font-bold text-ivory mb-1">{tier.name}</h3>
                    <p className="text-gold text-2xl font-bold mb-4">{tier.price}</p>
                    <ul className="space-y-2">
                      {tier.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-ivory/75 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" /> {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5% RMSA Legacy Fund — shown on every sponsor category page */}
      <LegacyFundCallout />

      {/* Donor & Sponsor Trust Center */}
      <section className="bg-charcoal py-12 md:py-16 border-t border-gold/10">
        <div className="container mx-auto px-4">
          <DonorTrustPanel />
        </div>
      </section>

      {/* Other lanes */}
      <section className="bg-charcoal py-14 border-t border-gold/10">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-xl font-bold text-ivory mb-5">Explore other sponsorship lanes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {SPONSOR_CATEGORIES.filter((c) => c.slug !== cat.slug)
              .slice(0, 5)
              .map((c) => (
                <Link
                  key={c.slug}
                  to={`/sponsor/${c.slug}`}
                  className="group rounded-xl border border-gold/20 hover:border-gold/60 bg-charcoal/40 p-4 transition hover:-translate-y-0.5"
                >
                  <c.icon className="h-5 w-5 text-gold mb-2" />
                  <div className="text-ivory text-xs font-semibold leading-tight">{c.shortLabel}</div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-charcoal border-t border-gold/10 py-14">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
            Ready to partner with NESA-Africa?
          </h2>
          <p className="text-ivory/65 mb-6">
            Our partnerships team will respond within 48 hours with a tailored proposal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
              <Link to={`/contact?topic=sponsorship&lane=${cat.slug}`}>
                <Mail className="mr-2 h-4 w-4" /> Start the conversation
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10 hover:text-gold">
              <Link to="/sponsor">All sponsorship lanes</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
