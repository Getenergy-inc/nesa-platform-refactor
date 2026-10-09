import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight, Award, BookOpen, Wrench } from "lucide-react";

// Canonical Icon category slugs = DB subcategories.slug (source of truth).
const CATEGORIES = [
  {
    slug: "icon-philanthropy",
    title: "Africa Education Philanthropy Icon",
    blurb: "Lifetime philanthropic contribution to African education.",
    icon: Award,
  },
  {
    slug: "icon-literary",
    title: "Literary & New Curriculum Advocate Icon",
    blurb: "Lifetime literary, curriculum, and pedagogy reform impact.",
    icon: BookOpen,
  },
  {
    slug: "icon-technical",
    title: "Africa Technical Educator Icon",
    blurb: "Lifetime technical, STEM, and TVET educator impact.",
    icon: Wrench,
  },
] as const;

// The memo's three recognition tracks, encoded via ?class= on the link.
const GROUPS = [
  { key: "africa-resident", label: "Africans in Africa" },
  { key: "diaspora", label: "Diaspora Africans" },
  { key: "friend", label: "Friends of Africa" },
] as const;

const FAMILY = "africa-education-icon";

function nominateHref(categorySlug: string, groupKey: string) {
  return `/nominate/official/${FAMILY}/${categorySlug}?class=${groupKey}`;
}

export default function IconNominatePage() {
  return (
    <>
      <Helmet>
        <title>Nominate — Africa Education Icon Award | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Nominate an Africa Education Icon: Philanthropy, Literary & Curriculum, or Technical Educator — across Africans in Africa, Diaspora, and Friends of Africa."
        />
      </Helmet>

      <div className="bg-charcoal min-h-screen">
        <div className="container max-w-5xl py-12 md:py-16">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold/80 text-sm font-medium tracking-wide uppercase">
              NESA-Africa 2026 · Call for Nominations
            </p>
            <h1 className="text-3xl md:text-5xl font-playfair text-gold mt-3">
              Africa Education Icon Award
            </h1>
            <p className="text-white/60 mt-4 max-w-2xl">
              Recognising lifetime enablers of education across the continent. Choose a category,
              then the recognition group that fits your nominee. Each link opens a ready-to-fill
              nomination form.
            </p>
          </motion.div>

          <div className="mt-10 space-y-6">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Card className="p-6 md:p-7 border-gold/20 bg-charcoal-light/40">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 grid place-items-center">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-playfair text-white">{cat.title}</h2>
                        <p className="text-sm text-white/60 mt-1">{cat.blurb}</p>

                        <div className="grid sm:grid-cols-3 gap-3 mt-5">
                          {GROUPS.map((g) => (
                            <Link
                              key={g.key}
                              to={nominateHref(cat.slug, g.key)}
                              className="group flex items-center justify-between gap-2 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm text-white hover:bg-gold/15 hover:border-gold/50 transition-colors"
                            >
                              <span>{g.label}</span>
                              <ArrowRight className="w-4 h-4 text-gold opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs text-white/60 mt-8">
            Nominations are free. Each nominee is verified by the Nomination Review Committee before
            publication.
          </p>
        </div>
      </div>
    </>
  );
}
