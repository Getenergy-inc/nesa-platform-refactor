import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  GROUP_META,
  INTEGRITY_DISCLAIMER,
  getCategoriesByGroup,
  type CategoryGroup,
} from "@/config/awardCategories";

interface Props {
  group: CategoryGroup;
  seoTitle: string;
  metaDescription: string;
  intro: string;
}

const SITE = "https://nesaafrica.lovable.app";

export function GroupIndexPage({ group, seoTitle, metaDescription, intro }: Props) {
  const meta = GROUP_META[group];
  const categories = getCategoriesByGroup(group);
  const canonical = `${SITE}${meta.indexUrl}`;

  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonical} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards/categories" },
          { name: meta.label, path: meta.indexUrl },
        ]}
      />

      <section className="py-16 border-b border-gold/20">
        <div className="container mx-auto max-w-5xl px-4">
          <Badge variant="outline" className="border-gold/40 text-gold mb-4">
            {meta.tone}
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl text-gold mb-4">{meta.label}</h1>
          <p className="text-foreground/80 text-lg max-w-3xl">{intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/nominate">
                <Sparkles className="mr-2 h-4 w-4" />
                Nominate Now
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/awards/categories">All Award Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="h-full border-gold/20 bg-charcoal-light/60 hover:border-gold/60 transition">
                <CardContent className="p-6 flex flex-col h-full">
                  <Award className="h-6 w-6 text-gold mb-3" />
                  <h2 className="font-playfair text-xl text-foreground mb-2">{c.finalName}</h2>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4 flex-1">
                    {c.shortDescription}
                  </p>
                  <Link
                    to={c.url}
                    className="inline-flex items-center gap-1 text-gold text-sm font-medium hover:underline"
                  >
                    View category <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-charcoal-light/30">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="border-gold/30 bg-charcoal-light/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gold mb-2">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-semibold">Integrity Statement</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{INTEGRITY_DISCLAIMER}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
