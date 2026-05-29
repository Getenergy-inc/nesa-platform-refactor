// Region-page 2026–2027 Legacy Impact section.
// Renders the Edu-Tourism conference, special needs school nomination flow,
// regional voting, GFA Wzip wallet, stats, CTAs, sponsorship-impact strip,
// brand-safety note and final CTA — for a single region.

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Accessibility,
  BookOpen,
  Globe2,
  GraduationCap,
  HandCoins,
  Heart,
  Plane,
  School,
  ShieldCheck,
  Sparkles,
  Users,
  Vote,
  Wallet,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { REGIONS, FLOW_STEPS, type LegacyRegion } from "@/components/nesa/RegionalLegacyEcosystem";

export function RegionLegacySection({ slug }: { slug: string }) {
  const region: LegacyRegion | undefined = REGIONS.find((r) => r.slug === slug);
  if (!region) return null;

  return (
    <section className="relative py-16 md:py-24 bg-charcoal overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--gold)/0.08),transparent_60%)]" />
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {/* Continental Impact Ecosystem header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Globe2 className="h-3.5 w-3.5" /> Continental Impact Ecosystem
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mb-4 leading-tight">
            Explore Africa's Regions &{" "}
            <span className="text-gold">2027 Special Needs School Legacy Projects</span>
          </h2>
          <p className="text-ivory/75 text-sm md:text-base leading-relaxed">
            One Continent. Eight Legacy Regions. School nominations, regional voting,
            EduAid-Africa conferences, and Rebuild My School Africa interventions.
          </p>
        </motion.div>

        {/* RMSA 2026–2027 model copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-charcoal/60 to-charcoal/80 p-6 md:p-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="h-3 w-3" /> Rebuild My School Africa · 2026–2027 Model
          </div>
          <p className="text-ivory/85 text-sm md:text-base leading-relaxed">
            After the NESA-Africa 2026 Awards, the campaign moves from recognition into
            measurable education intervention through{" "}
            <span className="text-gold font-semibold">Rebuild My School Africa</span> and{" "}
            <span className="text-gold font-semibold">EduAid-Africa</span>. For the
            2026–2027 legacy phase, special needs schools and inclusive education
            institutions will be nominated through{" "}
            <a href="https://eduaid.africa" target="_blank" rel="noreferrer" className="text-gold underline underline-offset-4">
              EduAid.Africa
            </a>{" "}
            during an approved nomination window. Each school is mapped to one of the
            eight approved legacy regions, may enter a regional public voting process, and
            may qualify for intervention based on verified need, regional relevance and
            community participation. Each region also has a dedicated funding portal and{" "}
            <span className="text-gold font-semibold">GFA Wzip Regional Legacy Wallet</span>{" "}
            for donations, CSR, sponsorships and crowdfunding.
          </p>
        </motion.div>

        {/* This region — headline card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-3xl border border-gold/30 bg-charcoal/70 p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-widest">
              Region {region.index} · Legacy Hub
            </span>
            <span className="inline-flex items-center gap-1 text-ivory/70 text-xs">
              <MapPin className="h-3.5 w-3.5 text-gold" /> Lead Country: {region.leadCountry}
            </span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory">
            {region.name}
          </h3>
          <p className="mt-2 text-gold/90 text-sm md:text-base font-medium">{region.theme}</p>

          <div className="mt-4 inline-flex items-start gap-2 text-sm text-ivory/75">
            <Plane className="h-4 w-4 mt-0.5 text-gold shrink-0" />
            <span>
              {region.conferenceWindow ?? `EduAid-Africa Edu-Tourism Conference · ${region.conferenceDestination}`}
            </span>
          </div>

          {region.conferenceCountries && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {region.conferenceCountries.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-[11px]">
                  {c}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Legacy project + tracks */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="rounded-2xl border border-gold/20 bg-charcoal/60 p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ivory/55 mb-2">
              <School className="h-3.5 w-3.5 text-gold" /> 2026–2027 Special Needs Legacy Project
            </div>
            <p className="text-base font-semibold text-ivory mb-3">{region.legacyProject}</p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {region.legacyTracks.map((p) => (
                <li key={p} className="flex items-start gap-1.5 text-[12px] text-ivory/75">
                  <Sparkles className="h-3 w-3 mt-0.5 text-gold shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gold/20 bg-charcoal/60 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-ivory">
                <Wallet className="h-4 w-4 text-gold" /> GFA Wzip · {region.wallet}
              </div>
              <span className="text-sm text-gold font-bold">{region.walletProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-ivory/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold to-gold-dark" style={{ width: `${region.walletProgress}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-ivory/55">
              Funding Goal {region.metrics.goal} · Fed by 5% of every approved sponsorship.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Stat icon={School} value={region.metrics.schools} label="Schools" />
              <Stat icon={Accessibility} value={region.metrics.specialNeeds} label="Special Needs" />
              <Stat icon={GraduationCap} value={region.metrics.scholarships} label="Scholarships" />
            </div>
          </div>
        </div>

        {/* Region CTAs */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <a href={region.paths.nominate} target="_blank" rel="noreferrer">
            <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-5 gap-2">
              <School className="h-4 w-4" /> Nominate a Special Needs School
            </Button>
          </a>
          <Link to={region.paths.vote}>
            <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-5 gap-2">
              <Vote className="h-4 w-4" /> Vote
            </Button>
          </Link>
          <Link to={region.paths.donate}>
            <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-5 gap-2">
              <HandCoins className="h-4 w-4" /> Donate
            </Button>
          </Link>
          <Link to={region.paths.tourism}>
            <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-5 gap-2">
              <Plane className="h-4 w-4" /> Edu-Tourism
            </Button>
          </Link>
          <Link to={region.paths.partner}>
            <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-5 gap-2">
              <Heart className="h-4 w-4" /> Partner
            </Button>
          </Link>
        </div>

        {/* 8-step Flow */}
        <div className="mb-14">
          <h3 className="font-display text-xl md:text-2xl font-bold text-ivory text-center mb-2">
            Regional School Nomination Flow
          </h3>
          <p className="text-center text-ivory/60 text-xs md:text-sm mb-6">
            Region → Conference → Nomination → Voting → Funding → Intervention → Impact
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FLOW_STEPS.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-gold/20 bg-charcoal/60 p-3 hover:border-gold/45 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-6 w-6 rounded-full bg-gold text-charcoal text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <s.icon className="h-4 w-4 text-gold" />
                </div>
                <h4 className="text-[12px] font-bold text-ivory leading-snug mb-1">{s.title}</h4>
                <p className="text-[11px] text-ivory/65 leading-snug">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Every Sponsorship Creates Impact */}
        <div className="mb-8 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal/60 to-charcoal/80 p-6 md:p-10">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
                <Heart className="h-3 w-3" /> Every Sponsorship Creates Impact
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
                5% of every approved sponsorship feeds the{" "}
                <span className="text-gold">RMSA Legacy Fund</span>
              </h3>
              <p className="text-ivory/75 text-sm md:text-base leading-relaxed">
                Contributions are distributed equally into the eight{" "}
                <span className="text-gold font-semibold">GFA Wzip Regional Legacy Wallets</span>{" "}
                — funding school interventions, special needs schools, inclusive learning,
                scholarships, learning access and regional education initiatives between
                October 2026 and October 2027.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: School, label: "School Interventions" },
                { icon: Accessibility, label: "Special Needs Schools" },
                { icon: Users, label: "Inclusive Learning" },
                { icon: GraduationCap, label: "Scholarships" },
                { icon: BookOpen, label: "Learning Access" },
                { icon: Globe2, label: "Regional Initiatives" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 rounded-xl bg-charcoal/60 border border-gold/20 px-3 py-2.5">
                  <b.icon className="h-4 w-4 text-gold shrink-0" />
                  <span className="text-xs text-ivory/85 font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand safety */}
        <div className="mb-12 rounded-2xl border border-ivory/15 bg-charcoal/60 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-gold mt-0.5 shrink-0" />
            <p className="text-[12px] md:text-sm text-ivory/75 leading-relaxed">
              <span className="text-ivory font-semibold">Brand Safety & Integrity:</span>{" "}
              All sponsorships, endorsements, partnerships, donations and visibility
              opportunities support education advocacy, media storytelling, community
              engagement, post-award school intervention and special needs education
              impact only. Sponsors, endorsers, partners, donors and contributors cannot
              nominate, shortlist, vote, judge, lobby, influence or determine award or
              school selection outcomes. Sponsorship or donation visibility does not
              create any advantage in nominations, voting, jury review, finalist
              selection, school selection or award winner selection.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-2">
            Support a Region. <span className="text-gold">Transform a School.</span>
          </h3>
          <p className="text-ivory/65 text-sm mb-6">
            Join the legacy journey from recognition to regional school intervention.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={region.paths.nominate} target="_blank" rel="noreferrer">
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 gap-2">
                <School className="h-4 w-4" /> Nominate a Special Needs School
              </Button>
            </a>
            <Link to="/donate?fund=rmsa">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2">
                <HandCoins className="h-4 w-4" /> Donate to RMSA
              </Button>
            </Link>
            <Link to={region.paths.tourism}>
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2">
                <Plane className="h-4 w-4" /> Join Edu-Tourism Waiting List
              </Button>
            </Link>
            <Link to={region.paths.partner}>
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2">
                <Heart className="h-4 w-4" /> Partner for Impact
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="rounded-lg border border-gold/15 bg-charcoal/50 p-2 text-center">
      <Icon className="h-3.5 w-3.5 text-gold mx-auto mb-1" />
      <div className="text-sm font-bold text-ivory leading-none">{value}</div>
      <div className="text-[9px] uppercase tracking-wide text-ivory/55 mt-1">{label}</div>
    </div>
  );
}
