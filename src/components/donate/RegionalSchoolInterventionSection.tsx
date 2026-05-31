// Regional Special Needs School Intervention — accordion of 8 regions × 20 slots.
// Mobile-first stacked mini-cards; desktop grid; CTAs region-scoped.

import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  School,
  MapPin,
  Vote,
  Heart,
  Plane,
  Wallet,
  ArrowRight,
  Users,
} from "lucide-react";
import {
  REGIONAL_INTERVENTIONS,
  STATUS_STYLES,
  TOTAL_REGIONS,
  TOTAL_SLOTS,
} from "@/config/specialNeedsSchoolSlots";

export function RegionalSchoolInterventionSection() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/30 px-4 py-1.5">
            <School className="h-4 w-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
              Regional Intervention
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-3">
            Support Special Needs Schools Across Africa
          </h2>
          <p className="text-gold/90 text-sm md:text-base font-semibold mb-4">
            20 Nominations per Region · 1 School Selected per Region for 2027 Intervention
          </p>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Through <span className="text-gold font-semibold">EduAid-Africa</span> and{" "}
            <span className="text-gold font-semibold">Rebuild My School Africa</span>,
            NESA-Africa 2026 is opening a continental Special Needs Education support
            pathway across the approved {TOTAL_REGIONS} African regions. Each region opens{" "}
            <span className="text-gold font-semibold">20 Special Needs School nomination
            slots</span> ({TOTAL_SLOTS} in total). After verification and regional
            intervention voting,{" "}
            <span className="text-gold font-semibold">only 1 school per region</span> —
            a total of <span className="text-gold font-semibold">{TOTAL_REGIONS} schools
            continent-wide</span> — will be selected for the 2027 Rebuild My School Africa
            intervention.
          </p>
        </div>

        {/* 1-per-region selection callout */}
        <div className="mx-auto max-w-4xl mb-8 rounded-2xl border border-gold/40 bg-gold/10 p-4 sm:p-5 text-center">
          <p className="text-gold text-xs sm:text-sm font-bold uppercase tracking-[0.18em] mb-1">
            2027 Selection Rule
          </p>
          <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
            Communities nominate 20 schools per region. Regional intervention voting then
            shortlists the highest-priority school in each of the 8 regions.{" "}
            <span className="text-gold font-semibold">One school per region · 8 schools
            total</span> will move into the October 2026 – October 2027 intervention
            pipeline (fundraising, project delivery, and impact reporting).
          </p>
        </div>

        {/* Support focus pills */}
        <div className="mx-auto max-w-4xl flex flex-wrap justify-center gap-2 mb-10">
          {[
            "Accessibility upgrades",
            "Classroom rehabilitation",
            "Assistive learning tools",
            "Teacher support",
            "Special-needs learning materials",
            "WASH & sanitation",
            "Digital learning access",
            "Inclusive education resources",
            "School safety improvements",
            "Community-led support",
          ].map((focus) => (
            <span
              key={focus}
              className="text-[11px] md:text-xs px-3 py-1 rounded-full bg-white/5 border border-white/15 text-white/75"
            >
              {focus}
            </span>
          ))}
        </div>

        <Accordion type="single" collapsible className="mx-auto max-w-5xl space-y-3">
          {REGIONAL_INTERVENTIONS.map((region) => (
            <AccordionItem
              key={region.slug}
              value={region.slug}
              className="border border-gold/20 bg-white/5 rounded-2xl overflow-hidden data-[state=open]:border-gold/40"
            >
              <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline text-left">
                <div className="flex flex-1 items-center gap-3 sm:gap-4 min-w-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-display font-semibold text-base sm:text-lg truncate">
                      {region.regionName}
                    </h3>
                    <p className="text-white/55 text-[11px] sm:text-xs truncate">
                      {region.countries.length} countries · 20 nominations · 1 selected for 2027
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold font-semibold">
                    1 of 20
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6 pb-6">
                {/* Countries covered */}
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-white/50 mb-2">
                    Countries Covered
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {region.countries.map((c) => (
                      <span
                        key={c}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/75"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA group */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
                  <Link to={region.nominateLink}>
                    <Button className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold gap-2">
                      <School className="h-4 w-4" /> Nominate a School
                    </Button>
                  </Link>
                  <Link to={region.votingLink}>
                    <Button variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10 gap-2">
                      <Vote className="h-4 w-4" /> Vote for Intervention
                    </Button>
                  </Link>
                  <Link to={region.donationLink}>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 gap-2">
                      <Heart className="h-4 w-4" /> Donate to This Region
                    </Button>
                  </Link>
                  <Link to={`/sponsor?region=${region.slug}`}>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 gap-2">
                      <Users className="h-4 w-4" /> Sponsor a School
                    </Button>
                  </Link>
                  <Link to={region.gfaWzipPortal}>
                    <Button variant="ghost" className="w-full text-gold/80 hover:text-gold hover:bg-gold/5 gap-2">
                      <Wallet className="h-4 w-4" /> GFA Wzip Wallet
                    </Button>
                  </Link>
                  <Link to={region.eduTourism2027Link}>
                    <Button variant="ghost" className="w-full text-gold/80 hover:text-gold hover:bg-gold/5 gap-2">
                      <Plane className="h-4 w-4" /> EduTourism 2027
                    </Button>
                  </Link>
                </div>

                {/* 20 school slots */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/50">
                      20 Special Needs School Slots
                    </p>
                    <p className="text-[10px] text-white/40">
                      0 verified · 20 open
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {region.schoolSlots.map((slot) => (
                      <div
                        key={slot.slotNumber}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:border-gold/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                            Slot {slot.slotNumber.toString().padStart(2, "0")}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${STATUS_STYLES[slot.status]}`}>
                            {slot.status}
                          </span>
                        </div>
                        <p className="text-white text-xs font-medium leading-snug mb-1 line-clamp-2">
                          {slot.schoolName}
                        </p>
                        <p className="text-white/55 text-[10px] mb-3 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" /> {slot.country}
                        </p>
                        <Link to={region.nominateLink}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full h-7 text-[10px] border-gold/30 text-gold hover:bg-gold/10 gap-1"
                          >
                            {slot.cta} <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Governance + Legacy notes */}
        <div className="mx-auto max-w-4xl mt-10 space-y-4">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-xs sm:text-sm text-white/75 leading-relaxed">
            <p className="text-white font-semibold mb-1">Governance Note</p>
            Donations, sponsorships, regional school nominations, and school intervention
            votes do not influence NESA-Africa award nominations, judges, public voting,
            finalists, honourees, or winners. Special Needs School intervention nominations
            are managed separately through EduAid-Africa and Rebuild My School Africa for
            education-impact purposes only.
          </div>
          <div className="rounded-2xl border border-gold/30 bg-gold/5 p-5 text-xs sm:text-sm text-white/80 leading-relaxed">
            <p className="text-gold font-semibold mb-1">5% Legacy Contribution</p>
            NESA-Africa 2026 will allocate 5% of eligible sponsorship income to the
            Rebuild My School Africa Legacy Fund, supporting post-award education
            infrastructure, Special Needs Education interventions, accessibility
            upgrades, digital learning spaces, WASH facilities, libraries, learning
            materials, and community-led school improvement from{" "}
            <span className="text-gold font-semibold">October 2026 to October 2027</span>.
            Subject to Board, Finance, and Compliance approval, allocations may be
            distributed across the approved 8 African regional GFA Wzip wallet accounts
            with monthly reconciliation, project documentation, transaction records,
            beneficiary verification, and sponsor-ready reporting.
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegionalSchoolInterventionSection;
