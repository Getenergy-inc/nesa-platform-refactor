import { Award, Vote, Users, Check, ArrowRight, Trophy, Star, Shield, Globe, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { useRegion } from "@/contexts/RegionContext";
import { useRegionNomineeCounts } from "@/hooks/useRegionNomineeCounts";
import { motion } from "framer-motion";

export function NominationPathsCards() {
  const { currentEdition } = useSeason();

  const paths = [
    {
      icon: Star,
      badge: "Lifetime Achievement",
      title: "Africa Icon",
      subtitle: "Blue Garnet Award (2005–" + currentEdition.displayYear + ")",
      features: [
        "10+ years institutional achievements",
        "Legacy recognition",
        "Expert panel selection"
      ],
      cta: { label: "Nominate an Icon", href: "/nominate?tier=icon" },
      accent: "blue",
    },
    {
      icon: Vote,
      badge: "Public Voting",
      title: "Blue Garnet & Gold",
      subtitle: "Annual Competition",
      features: [
        "Earn voting points through participation",
        "Vote with AGC during official windows",
        "Jury + public weighting (Blue Garnet)"
      ],
      cta: { label: "Nominate for Voting", href: "/nominate?tier=voting" },
      secondaryCta: { label: "How Voting Works", href: "/about-agc" },
      accent: "gold",
      featured: true,
    },
    {
      icon: Shield,
      badge: "Expert Selection",
      title: "Platinum Certificate",
      subtitle: "Merit-Based Recognition",
      features: [
        "Baseline recognition",
        "No public voting required",
        "Governance verification"
      ],
      cta: { label: "Submit Platinum Nomination", href: "/nominate?tier=platinum" },
      accent: "slate",
    },
  ];

  const getAccentClasses = (accent: string, featured?: boolean) => {
    switch (accent) {
      case 'blue':
        return {
          border: featured ? 'border-blue-500/50' : 'border-blue-500/20',
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          button: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20',
          glow: 'group-hover:shadow-blue-500/10',
        };
      case 'gold':
        return {
          border: featured ? 'border-gold/50 ring-2 ring-gold/15' : 'border-gold/20',
          bg: 'bg-gold/10',
          text: 'text-gold',
          button: 'bg-gold hover:bg-gold-dark text-charcoal shadow-lg shadow-gold/20',
          glow: 'group-hover:shadow-gold/15',
        };
      default:
        return {
          border: 'border-white/15',
          bg: 'bg-white/5',
          text: 'text-white/70',
          button: 'bg-white/10 hover:bg-white/20 text-white',
          glow: 'group-hover:shadow-white/5',
        };
    }
  };

  return (
    <section className="bg-gradient-to-b from-charcoal to-charcoal-light/20 py-16 md:py-22">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold font-medium text-sm uppercase tracking-wider mb-4">
            Choose Your Path
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
            Start Your Nomination Journey
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Select the appropriate award category based on the nominee's achievements.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {paths.map((path, index) => {
            const classes = getAccentClasses(path.accent, path.featured);
            
            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative bg-white/4 backdrop-blur-sm rounded-2xl p-7 border ${classes.border} flex flex-col hover:bg-white/8 transition-all duration-300 shadow-xl ${classes.glow}`}
              >
                {/* Featured Badge */}
                {path.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold rounded-full text-charcoal text-xs font-bold shadow-lg shadow-gold/30">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`h-14 w-14 rounded-2xl ${classes.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <path.icon className={`h-7 w-7 ${classes.text}`} />
                  </div>
                </div>

                <span className={`text-xs font-bold ${classes.text} uppercase tracking-widest mb-2`}>
                  {path.badge}
                </span>

                <h3 className="text-xl font-bold text-white mb-1.5">{path.title}</h3>
                <p className="text-white/45 text-sm mb-5">{path.subtitle}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-grow">
                  {path.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/65">
                      <Check className={`h-4 w-4 ${classes.text} flex-shrink-0 mt-0.5`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="space-y-2.5 mt-auto">
                  <Link to={path.cta.href} className="block">
                    <Button className={`w-full ${classes.button} font-semibold rounded-full gap-2 h-11`}>
                      {path.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {path.secondaryCta && (
                    <Link to={path.secondaryCta.href} className="block">
                      <Button 
                        variant="ghost" 
                        className={`w-full ${classes.text} hover:bg-white/5 rounded-full text-sm`}
                      >
                        {path.secondaryCta.label}
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Regional Nomination Options */}
        <RegionNominateStrip />
      </div>
    </section>
  );
}

const REGION_EMOJIS: Record<string, string> = {
  "west-africa": "🌍",
  "east-africa": "🌍",
  "central-africa": "🌍",
  "southern-africa": "🌍",
  "north-africa": "🌍",
  "sahel-region": "🏜️",
  "horn-of-africa": "🦏",
  "indian-ocean-islands": "🏝️",
  "diaspora": "✈️",
  "friends-of-africa": "🤝",
};

function RegionNominateStrip() {
  const { regions } = useRegion();
  const { data } = useRegionNomineeCounts();
  const { regionCounts = [], totalCount = 0 } = data || {};

  const getCount = (slug: string) => {
    const found = regionCounts.find(r => r.region_slug === slug);
    return found?.nominee_count || 0;
  };

  const friendsRegion = regions.find(r => r.slug === "friends-of-africa");
  const africanRegions = regions.filter(r => r.slug !== "friends-of-africa" && r.slug !== "diaspora");
  const diasporaRegion = regions.find(r => r.slug === "diaspora");

  // Nigeria count from West Africa nominees with country filter (approximate)
  const nigeriaCount = getCount("west-africa"); // best approximation without country-level query

  return (
    <motion.div
      className="mt-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 font-medium text-sm">
          <Globe className="h-4 w-4 text-gold" />
          Nominate by Region
          <span className="ml-2 px-2 py-0.5 rounded-full bg-gold/15 text-gold text-xs font-bold">
            {totalCount.toLocaleString()} nominees
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
        {/* All Africa */}
        <Link to="/nominate">
          <Button
            variant="outline"
            size="sm"
            className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 rounded-full gap-1.5 font-medium"
          >
            <span>🌍</span>
            All Africa
            <CountBadge count={totalCount} variant="gold" />
          </Button>
        </Link>

        {/* Nigeria */}
        <Link to="/nominate?region=nigeria">
          <Button
            variant="outline"
            size="sm"
            className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 rounded-full gap-1.5 font-medium"
          >
            🇳🇬 Nigeria
            <CountBadge count={nigeriaCount} variant="gold" />
          </Button>
        </Link>

        {/* Each African Region */}
        {africanRegions.map((region) => (
          <Link key={region.id} to={`/nominate?region=${region.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30 rounded-full gap-1.5 text-xs"
            >
              <span>{REGION_EMOJIS[region.slug] || "🌍"}</span>
              {region.name}
              <CountBadge count={getCount(region.slug)} variant="default" />
            </Button>
          </Link>
        ))}

        {/* Diaspora */}
        {diasporaRegion && (
          <Link to={`/nominate?region=${diasporaRegion.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500/25 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 rounded-full gap-1.5 text-xs"
            >
              <span>✈️</span>
              {diasporaRegion.name}
              <CountBadge count={getCount(diasporaRegion.slug)} variant="blue" />
            </Button>
          </Link>
        )}

        {/* Friends of Africa */}
        {friendsRegion && (
          <Link to={`/nominate?region=${friendsRegion.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 rounded-full gap-1.5 text-xs"
            >
              <span>🤝</span>
              {friendsRegion.name}
              <CountBadge count={getCount(friendsRegion.slug)} variant="green" />
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function CountBadge({ count, variant = "default" }: { count: number; variant?: "gold" | "blue" | "green" | "default" }) {
  if (count === 0) return null;
  
  const variantClasses = {
    gold: "bg-gold/20 text-gold",
    blue: "bg-blue-500/20 text-blue-300",
    green: "bg-emerald-500/20 text-emerald-300",
    default: "bg-white/10 text-white/60",
  };

  return (
    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${variantClasses[variant]}`}>
      {count.toLocaleString()}
    </span>
  );
}
