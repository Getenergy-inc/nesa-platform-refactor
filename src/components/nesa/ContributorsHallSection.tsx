// NESA-Africa Contributors Hall of Fame Section
// Used on landing page (compact) and standalone /contributors page (full)

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, Sparkles, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NomineeImage } from "@/components/shared/NomineeImage";
import {
  CONTRIBUTORS,
  ROLE_TABS,
  CONTRIBUTION_AREAS,
  type Contributor,
  type ContributorRole,
  type ContributionArea,
} from "@/data/contributors";
import { cn } from "@/lib/utils";

interface ContributorsHallSectionProps {
  /** Compact landing-page variant (limited cards + CTA to full page) */
  compact?: boolean;
  /** Max cards in compact mode */
  limit?: number;
}

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export function ContributorsHallSection({ compact = false, limit = 12 }: ContributorsHallSectionProps) {
  const [activeRole, setActiveRole] = useState<ContributorRole | "All">("All");
  const [activeYear, setActiveYear] = useState<number | "All">("All");
  const [activeArea, setActiveArea] = useState<ContributionArea | "All">("All");

  const filtered = useMemo(() => {
    let list: Contributor[] = CONTRIBUTORS;
    if (activeRole !== "All") list = list.filter((c) => c.role === activeRole);
    if (activeYear !== "All") {
      list = list.filter(
        (c) => c.yearStart <= activeYear && (c.yearEnd ?? 9999) >= activeYear
      );
    }
    if (activeArea !== "All") {
      list = list.filter((c) => c.contributions?.includes(activeArea));
    }
    return compact ? list.slice(0, limit) : list;
  }, [activeRole, activeYear, activeArea, compact, limit]);

  // Surface the logo/brand designer at the top in compact mode
  const featured = !compact
    ? null
    : CONTRIBUTORS.find((c) => c.contributions?.includes("Logo & Brand Identity"));

  return (
    <section className="relative py-16 md:py-24 bg-charcoal overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="max-w-3xl mb-10 text-left">
          <p className="text-gold text-xs md:text-sm tracking-[0.25em] uppercase mb-3 font-semibold">
            Meet Our Contributors · 2021 — Present
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-4">
            Meet Our <span className="text-gold italic">Volunteers, Interns,</span>
            <br className="hidden md:block" /> Judges & <span className="text-gold italic">Board of Advisors</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            A living recognition wall honouring the volunteers, interns, judges, ambassadors and
            advisors whose contributions have powered NESA-Africa across the continent — from our
            founding logo and brand identity in 2021 to today's design, engineering, content,
            translation, photography, fundraising and chapter outreach work.
          </p>
        </div>

        {/* Featured: Logo Designer (compact mode) */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5 md:p-6 flex flex-col md:flex-row gap-5 items-center md:items-start"
          >
            <NomineeImage
              src={featured.imageUrl}
              alt={featured.name}
              name={featured.name}
              size="xl"
              showBorder
            />
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-gold text-xs uppercase tracking-wider mb-2">
                <Star className="h-3.5 w-3.5" /> Founding Brand Volunteer · {featured.yearStart}
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-1">{featured.name}</h3>
              {featured.title && (
                <p className="text-gold/90 text-sm mb-2">{featured.title}</p>
              )}
              {featured.highlight && (
                <p className="text-white/80 text-sm md:text-base mb-3">{featured.highlight}</p>
              )}
              {featured.contributions && (
                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                  {featured.contributions.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded-full text-[10px] md:text-xs bg-gold/15 text-gold border border-gold/30"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Filters (full page) */}
        {!compact && (
          <div className="space-y-4 mb-10">
            {/* Role tabs */}
            <div className="flex flex-wrap gap-2">
              {ROLE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveRole(tab.key)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    activeRole === tab.key
                      ? "bg-gold text-charcoal border-gold"
                      : "bg-transparent text-white/70 border-gold/20 hover:border-gold/50 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Year filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveYear("All")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                  activeYear === "All"
                    ? "bg-gold/20 text-gold border-gold"
                    : "bg-transparent text-white/60 border-white/10 hover:border-gold/40"
                )}
              >
                All Years
              </button>
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                    activeYear === y
                      ? "bg-gold/20 text-gold border-gold"
                      : "bg-transparent text-white/60 border-white/10 hover:border-gold/40"
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
            {/* Contribution area filter */}
            <div>
              <p className="text-white/50 text-[11px] uppercase tracking-wider mb-2">
                Contribution Area
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveArea("All")}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
                    activeArea === "All"
                      ? "bg-gold text-charcoal border-gold"
                      : "bg-transparent text-white/60 border-white/10 hover:border-gold/40"
                  )}
                >
                  All Areas
                </button>
                {CONTRIBUTION_AREAS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setActiveArea(a)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
                      activeArea === a
                        ? "bg-gold text-charcoal border-gold"
                        : "bg-transparent text-white/60 border-white/10 hover:border-gold/40"
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4) }}
              className="group relative rounded-xl border border-gold/15 bg-charcoal-light/40 hover:border-gold/60 hover:bg-charcoal-light/70 transition-all p-4 flex flex-col items-center text-center"
            >
              <NomineeImage
                src={c.imageUrl}
                alt={c.name}
                name={c.name}
                type={c.role === "BOA" ? "logo" : "photo"}
                size="lg"
                showBorder
              />
              <div className="mt-3 w-full flex-1 flex flex-col">
                <p className="text-white text-sm font-semibold leading-tight">
                  {c.name}
                </p>
                <p className="text-gold/80 text-[10px] mt-1 uppercase tracking-wider">
                  {c.role}
                  {c.title ? ` · ${c.title}` : ""}
                </p>
                {c.country && (
                  <p className="text-white/50 text-[10px] mt-0.5">
                    {c.country} · {c.yearStart}
                    {c.yearEnd ? `–${c.yearEnd}` : "–Present"}
                  </p>
                )}
                {c.highlight && (
                  <p className="text-white/70 text-[11px] mt-2 line-clamp-3 italic">
                    "{c.highlight}"
                  </p>
                )}
                {c.contributions && c.contributions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1 justify-center">
                    {c.contributions.slice(0, 3).map((a) => (
                      <span
                        key={a}
                        className="px-1.5 py-0.5 rounded text-[9px] bg-gold/10 text-gold/90 border border-gold/20"
                      >
                        {a}
                      </span>
                    ))}
                    {c.contributions.length > 3 && (
                      <span className="text-[9px] text-white/40">
                        +{c.contributions.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Award className="absolute top-2 right-2 h-3.5 w-3.5 text-gold/40 group-hover:text-gold transition-colors" />
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/50">
              No contributors found for this filter.
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center md:justify-start">
          {compact ? (
            <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
              <Link to="/contributors">
                <Award className="mr-2 h-4 w-4" /> View Hall of Fame
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
              <Link to="/volunteer">
                <Sparkles className="mr-2 h-4 w-4" /> Join Our Contributors
              </Link>
            </Button>
          )}
          <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <Link to="/contact">
              Submit Your Testimony <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ContributorsHallSection;
