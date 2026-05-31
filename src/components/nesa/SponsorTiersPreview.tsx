// Compact mobile-friendly sponsor tier preview shown on the landing page.
// Single-sources from SPONSOR_PRICING_ROWS so amounts and limits stay
// consistent with the full Sponsor Hub.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Diamond, Gem, Sparkles, Trophy, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPONSOR_PRICING_ROWS } from "@/config/sponsorPricing";

// 6 highlight tiers, in the order requested in the spec
const HIGHLIGHT_SLUGS = [
  "blue-diamond",
  "gala-main",
  "gold-blue-garnet-main",
  "africa-icon-main",
  "platinum-main",
  "influencers-main",
] as const;

const TIER_ICON: Record<string, JSX.Element> = {
  "blue-diamond": <Diamond className="h-4 w-4" />,
  "gala-main": <Crown className="h-4 w-4" />,
  "gold-blue-garnet-main": <Gem className="h-4 w-4" />,
  "africa-icon-main": <Trophy className="h-4 w-4" />,
  "platinum-main": <Sparkles className="h-4 w-4" />,
  "influencers-main": <Wand2 className="h-4 w-4" />,
};

export function SponsorTiersPreview() {
  const tiers = HIGHLIGHT_SLUGS.map((slug) =>
    SPONSOR_PRICING_ROWS.find((r) => r.slug === slug),
  ).filter(Boolean) as typeof SPONSOR_PRICING_ROWS;

  return (
    <section
      aria-labelledby="sponsor-tiers-preview-heading"
      className="bg-charcoal border-y border-gold/10 py-10 sm:py-14"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-6 sm:mb-8"
        >
          <Badge className="bg-gold/15 text-gold border border-gold/30 mb-3">
            Partnership Opportunities
          </Badge>
          <h2
            id="sponsor-tiers-preview-heading"
            className="font-display font-bold text-white"
          >
            Sponsor NESA-Africa 2026
          </h2>
          <p className="text-white/70 mt-2 max-w-xl mx-auto">
            Headline tiers connecting your brand to Africa's education recognition,
            visibility, and legacy impact across 8 regions.
          </p>
        </motion.div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <li key={tier.slug}>
              <Link
                to={tier.href || "/sponsor"}
                className="group block h-full rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 hover:border-gold/40 hover:bg-gold/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              >
                <div className="flex items-center gap-2 text-gold mb-2">
                  {TIER_ICON[tier.slug || ""] ?? <Trophy className="h-4 w-4" />}
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {tier.amount}
                  </span>
                </div>
                <h3 className="font-display text-white leading-snug">
                  {tier.lane}
                </h3>
                <p className="text-white/65 mt-1.5 line-clamp-2">
                  {tier.purpose}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-white/50">{tier.limit}</span>
                  <span className="inline-flex items-center gap-1 text-gold text-sm font-medium">
                    Details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-gold text-charcoal hover:bg-gold/90 font-semibold"
          >
            <Link to="/sponsorship-packages">View Full Sponsorship Packages</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            <Link to="/partners">Become a Partner</Link>
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-white/50 max-w-2xl mx-auto">
          Sponsorship and partnership do not influence nominations, judging,
          voting, finalist selection, honourees, or winners.
        </p>
      </div>
    </section>
  );
}

export default SponsorTiersPreview;
