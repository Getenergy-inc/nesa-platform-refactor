// NESA-Africa Contributors Hall of Fame Section
// Used on landing page (compact) and standalone /contributors page (full)

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NomineeImage } from "@/components/shared/NomineeImage";
import {
  CONTRIBUTORS,
  ROLE_TABS,
  type Contributor,
  type ContributorRole,
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

  const filtered = useMemo(() => {
    let list: Contributor[] = CONTRIBUTORS;
    if (activeRole !== "All") list = list.filter((c) => c.role === activeRole);
    if (activeYear !== "All") {
      list = list.filter(
        (c) => c.yearStart <= activeYear && (c.yearEnd ?? 9999) >= activeYear
      );
    }
    return compact ? list.slice(0, limit) : list;
  }, [activeRole, activeYear, compact, limit]);

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
            advisors whose contributions have powered the NESA-Africa mission across the continent —
            from 2021 to today.
          </p>
        </div>

        {/* Filters */}
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
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4) }}
              className="group relative aspect-square rounded-xl border border-gold/15 bg-charcoal-light/40 hover:border-gold/60 hover:bg-charcoal-light/70 transition-all p-3 flex flex-col items-center justify-center text-center"
            >
              <NomineeImage
                src={c.imageUrl}
                alt={c.name}
                name={c.name}
                type={c.role === "BOA" ? "logo" : "photo"}
                size="lg"
                showBorder
              />
              <div className="mt-3 w-full">
                <p className="text-white text-xs md:text-sm font-semibold leading-tight line-clamp-2">
                  {c.name}
                </p>
                <p className="text-gold/80 text-[10px] md:text-xs mt-1 uppercase tracking-wider">
                  {c.role}
                </p>
                {c.country && (
                  <p className="text-white/50 text-[10px] mt-0.5">{c.country}</p>
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
