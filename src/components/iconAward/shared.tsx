import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import {
  ICON_AWARD,
  ICON_CLASSIFICATIONS,
  IconClassification,
  IconClassificationSlug,
  IconNominee,
  IconSubcategory,
  IconSubcategorySlug,
  classificationUrl,
  profileUrl,
  subcategoryUrl,
} from "@/data/iconAward";

export function IconBreadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="text-xs text-white/60 mb-4 flex flex-wrap items-center gap-1.5">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {it.href ? (
            <Link to={it.href} className="hover:text-gold transition-colors">
              {it.label}
            </Link>
          ) : (
            <span className="text-white/80">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="text-white/30">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function IconHero({
  eyebrow,
  title,
  subtitle,
  meta,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: { label: string; value: string | number }[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-black via-charcoal to-charcoal-light">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, hsl(42 85% 52%) 0, transparent 40%), radial-gradient(circle at 80% 90%, hsl(42 85% 52%) 0, transparent 40%)",
        }}
      />
      <div className="container relative mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <Badge
              variant="outline"
              className="mb-4 border-gold/40 bg-gold/5 px-3 py-1 text-gold"
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              {eyebrow}
            </Badge>
          )}
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base md:text-lg text-white/70">
              {subtitle}
            </p>
          )}
          {meta && meta.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {meta.map((m) => (
                <span
                  key={m.label}
                  className="rounded-full border border-gold/20 bg-white/5 px-3 py-1 text-xs text-white/80"
                >
                  <span className="text-gold mr-1">{m.value}</span>
                  {m.label}
                </span>
              ))}
            </div>
          )}
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primary && (
                <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                  <Link to={primary.href}>
                    {primary.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {secondary && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-white hover:bg-gold/10"
                >
                  <Link to={secondary.href}>{secondary.label}</Link>
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function SubcategoryCard({
  sub,
  count,
}: {
  sub: IconSubcategory;
  count: number;
}) {
  return (
    <Link
      to={subcategoryUrl(sub.slug)}
      className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-gradient-to-b from-charcoal-light to-charcoal p-6 transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10"
    >
      <Badge className="mb-4 bg-gold/15 text-gold border-gold/30">
        {count} {count === 1 ? "Nominee" : "Nominees"}
      </Badge>
      <h3 className="font-display text-xl md:text-2xl font-bold text-white group-hover:text-gold transition-colors">
        {sub.title}
      </h3>
      <p className="mt-3 text-sm text-white/65 leading-relaxed">{sub.description}</p>
      <div className="mt-6 flex items-center text-sm font-medium text-gold">
        Explore subcategory <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  );
}

export function ClassificationCard({
  sub,
  classification,
  count,
}: {
  sub: IconSubcategorySlug;
  classification: IconClassification;
  count: number;
}) {
  return (
    <Link
      to={classificationUrl(sub, classification.slug)}
      className="group rounded-xl border border-gold/15 bg-charcoal-light p-5 transition-all hover:border-gold/40 hover:bg-charcoal-light/80"
    >
      <div className="flex items-center justify-between mb-3">
        <Users className="h-5 w-5 text-gold/80" />
        <span className="text-xs text-white/50">{count} nominees</span>
      </div>
      <h4 className="font-display text-lg font-semibold text-white group-hover:text-gold transition-colors">
        {classification.title}
      </h4>
      <p className="mt-2 text-xs text-white/60 leading-relaxed">
        {classification.description}
      </p>
    </Link>
  );
}

export function NomineeCard({
  nominee,
  showSubBadge,
}: {
  nominee: IconNominee;
  showSubBadge?: boolean;
}) {
  return (
    <Link
      to={profileUrl(nominee.slug)}
      className="group flex flex-col overflow-hidden rounded-xl border border-gold/15 bg-charcoal-light transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        <img
          src={nominee.image_url}
          alt={nominee.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {nominee.verification_status === "verified" && (
          <Badge className="absolute top-3 right-3 bg-gold/90 text-charcoal text-[10px]">
            <ShieldCheck className="mr-1 h-3 w-3" /> Verified
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-base font-semibold text-white group-hover:text-gold transition-colors line-clamp-2">
          {nominee.name}
        </h4>
        <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
          <MapPin className="h-3 w-3" /> {nominee.country} · {nominee.region}
        </div>
        <p className="mt-2 text-xs text-white/65 leading-relaxed line-clamp-3 flex-1">
          {nominee.impact_summary}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {showSubBadge && (
            <Badge variant="outline" className="text-[10px] border-gold/30 text-gold/90">
              {nominee.award_subcategory_slug.replace(/-/g, " ")}
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] border-white/20 text-white/70">
            {nominee.years_of_contribution}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] border-purple-500/30 text-purple-300/90 capitalize"
          >
            {nominee.jury_status.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

export function FinalCTA() {
  return (
    <section className="bg-charcoal py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
          Know another Education Icon?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/65">
          Help us recognise the legends shaping {ICON_AWARD.yearRange} African education.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to="/nominate?category=africa-education-icon-award">
              Nominate an Education Icon
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gold/40 text-white hover:bg-gold/10"
          >
            <Link to="/nominees/africa-education-icon-award">Explore All Icon Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function RelatedClassifications({
  sub,
  current,
}: {
  sub: IconSubcategorySlug;
  current: IconClassificationSlug;
}) {
  const others = ICON_CLASSIFICATIONS.filter((c) => c.slug !== current);
  return (
    <section className="bg-charcoal py-12">
      <div className="container mx-auto px-4">
        <h3 className="font-display text-xl font-semibold text-white mb-6">
          Related Classifications
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {others.map((c) => (
            <Link
              key={c.slug}
              to={classificationUrl(sub, c.slug)}
              className="rounded-xl border border-gold/15 bg-charcoal-light p-5 hover:border-gold/40 transition-all"
            >
              <h4 className="font-display text-base font-semibold text-white">
                {c.title}
              </h4>
              <p className="mt-2 text-xs text-white/60">{c.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
