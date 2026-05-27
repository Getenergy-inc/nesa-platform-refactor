import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Crown,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFaqSection } from "@/components/awards/CategoryFaqSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { cn } from "@/lib/utils";
import {
  ALL_CATEGORIES,
  GROUP_META,
  INTEGRITY_DISCLAIMER,
  type CategoryGroup,
} from "@/config/awardCategories";

type SortKey = "default" | "az" | "za";

const SITE = "https://nesaafrica.lovable.app";

const GROUP_ICON: Record<CategoryGroup, React.ComponentType<{ className?: string }>> = {
  blue_garnet: Trophy,
  platinum: Crown,
  icon: Award,
  influencers: TrendingUp,
  special_recognition: Sparkles,
};

const MASTER_FAQS = [
  {
    q: "What is the NESA-Africa 2026 award structure?",
    a: "Four canonical groups: Blue Garnet (competitive, public voting + jury), Platinum Certificate (jury-only institutional recognition), Africa Education Icon Lifetime Achievement (2006–2026, hall-of-fame), and Influencers Education Impact 2026 (jury-led with a public engagement signal).",
  },
  {
    q: "How do I find the right category to nominate in?",
    a: "Use the filters above to narrow by group, then search by sector, role, country, institution type or impact area. Each category page lists eligibility, evidence, review method and CTAs in one place.",
  },
  {
    q: "Can a single nominee appear in multiple categories?",
    a: "Yes, when their work clearly fits each category's eligibility. Duplicate submissions are de-duplicated by the NRC engine; only the strongest entry per category is reviewed.",
  },
  {
    q: "Can sponsors influence which categories win?",
    a: "No. Sponsorship supports visibility and programme delivery only. Sponsors, partners, endorsers and donors cannot nominate, shortlist, vote, judge or determine winners.",
  },
];

export default function CategoryMasterIndex() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<CategoryGroup | "all">("all");
  const [sort, setSort] = useState<SortKey>("default");

  const groupsList = (Object.keys(GROUP_META) as CategoryGroup[]).filter(
    (g) => g !== "special_recognition"
  );

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ALL_CATEGORIES.length };
    for (const g of groupsList) counts[g] = ALL_CATEGORIES.filter((c) => c.group === g).length;
    return counts;
  }, [groupsList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = ALL_CATEGORIES.filter((c) => {
      if (groupFilter !== "all" && c.group !== groupFilter) return false;
      if (!q) return true;
      return (
        c.finalName.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.eligibilitySummary.toLowerCase().includes(q) ||
        c.whoCanBeNominated.toLowerCase().includes(q)
      );
    });
    if (sort === "az") return [...list].sort((a, b) => a.finalName.localeCompare(b.finalName));
    if (sort === "za") return [...list].sort((a, b) => b.finalName.localeCompare(a.finalName));
    return list;
  }, [search, groupFilter, sort]);

  const hasActiveFilters = search.trim() !== "" || groupFilter !== "all" || sort !== "default";
  const clearFilters = () => {
    setSearch("");
    setGroupFilter("all");
    setSort("default");
  };

  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>NESA-Africa 2026 Award Categories | Nominate & Vote</title>
        <meta
          name="description"
          content="Explore every NESA-Africa 2026 award category: Blue Garnet, Platinum Certificate, Africa Education Icon, and Influencers Education Impact. Filter by sector, role, country, institution and impact."
        />
        <link rel="canonical" href={`${SITE}/awards/categories`} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Award Categories", path: "/awards/categories" },
        ]}
      />

      {/* Hero */}
      <section className="py-16 border-b border-gold/20">
        <div className="container mx-auto max-w-5xl px-4">
          <Badge variant="outline" className="border-gold/40 text-gold mb-4">
            NESA-Africa 2026
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl text-gold mb-4">Award Categories</h1>
          <p className="text-foreground/80 text-lg max-w-3xl">
            One home for every NESA-Africa 2026 award category. Filter, search, learn the eligibility
            and evidence rules, and nominate the people and institutions reshaping African education.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/nominate">
                <Sparkles className="mr-2 h-4 w-4" />
                Nominate Now
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/vote">Vote in Blue Garnet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Group explainers */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {groupsList.map((g) => {
            const Icon = GROUP_ICON[g];
            const meta = GROUP_META[g];
            return (
              <motion.div
                key={g}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link to={meta.indexUrl}>
                  <Card className="h-full border-gold/20 bg-charcoal-light/60 hover:border-gold/60 transition">
                    <CardContent className="p-6">
                      <Icon className="h-7 w-7 text-gold mb-3" />
                      <h2 className="font-playfair text-lg text-foreground mb-2">{meta.label}</h2>
                      <p className="text-sm text-foreground/70 leading-relaxed">{meta.tagline}</p>
                      <Badge variant="outline" className="mt-3 border-gold/30 text-gold/90 text-xs">
                        {meta.tone}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Filter + search */}
      <section className="py-8 border-y border-gold/20 bg-charcoal-light/30">
        <div className="container mx-auto max-w-6xl px-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <Input
              placeholder="Search by sector, role, country, institution or impact area"
              className="pl-9 bg-charcoal border-gold/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gold" />
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-[240px] bg-charcoal border-gold/20">
                <SelectValue placeholder="All groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All groups</SelectItem>
                {groupsList.map((g) => (
                  <SelectItem key={g} value={g}>
                    {GROUP_META[g].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Category list */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const Icon = GROUP_ICON[c.group];
            return (
              <Card
                key={c.slug}
                className="h-full border-gold/20 bg-charcoal-light/60 hover:border-gold/60 transition"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-gold" />
                    <Badge variant="outline" className="border-gold/30 text-gold/90 text-xs">
                      {GROUP_META[c.group].label}
                    </Badge>
                  </div>
                  <h3 className="font-playfair text-lg text-foreground mb-2">{c.finalName}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4 flex-1">
                    {c.shortDescription}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="bg-gold text-charcoal hover:bg-gold/90">
                      <Link to={c.url}>View category</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold">
                      <Link to={`/nominate?category=${encodeURIComponent(c.slug)}`}>Nominate</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-foreground/60">No categories match your filters.</p>
          )}
        </div>
      </section>

      <CategoryFaqSection faqs={MASTER_FAQS} title="Category FAQs" />

      {/* Integrity */}
      <section id="integrity" className="py-12">
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
