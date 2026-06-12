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
  Users,
  GraduationCap,
  Lightbulb,
  Building2,
  HeartHandshake,
  Accessibility,
  Megaphone,
  HandCoins,
  Leaf,
  School,
  ArrowRight,
  CheckCircle2,
  Handshake,
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
  type AwardCategoryConfig,
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

/** Premium descriptors for the four recognition pathways. */
const PATHWAY_CARDS: Array<{
  group: CategoryGroup;
  title: string;
  tagline: string;
  description: string;
  qualifies: string;
  cta: string;
  href: string;
}> = [
  {
    group: "icon",
    title: "Africa Education Icon",
    tagline: "Lifetime Impact Recognition",
    description:
      "Hall-of-fame recognition for two decades (2006–2026) of measurable, continental contribution to African education.",
    qualifies:
      "Lifetime educators, founders, statespersons, and pioneers with verifiable long-term impact.",
    cta: "Explore Icon Recognition",
    href: "/awards/africa-education-icon",
  },
  {
    group: "blue_garnet",
    title: "Blue Garnet Awards",
    tagline: "Competitive Excellence Recognition",
    description:
      "The competitive, voting-enabled track. NRC eligibility, jury shortlist, then a combined public vote and final jury score.",
    qualifies:
      "NGOs, CSR programs, EduTech, STEM, Media, Creative Arts and State leadership.",
    cta: "Explore Blue Garnet",
    href: "/awards/blue-garnet-categories",
  },
  {
    group: "platinum",
    title: "Platinum Recognition",
    tagline: "Verified Institutional Recognition",
    description:
      "Elite institutional recognition decided by independent jury review — no public vote.",
    qualifies:
      "Libraries, research bodies, faith education, political leaders, international and diaspora institutions.",
    cta: "Explore Platinum",
    href: "/awards/platinum-certificate-categories",
  },
  {
    group: "influencers",
    title: "Influencer Education Impact",
    tagline: "Education Through Influence",
    description:
      "Sports, music, and social media voices using their platforms to measurably advance African education.",
    qualifies: "Athletes, musicians, and digital creators with verifiable education campaigns.",
    cta: "Explore Influencer Awards",
    href: "/awards/influencers-education-impact",
  },
];

/** Themed buckets surfaced above the filterable grid. */
type ThemeKey =
  | "leadership"
  | "teachers"
  | "innovation"
  | "institutions"
  | "community"
  | "inclusion"
  | "youth"
  | "media"
  | "csr"
  | "sustainability";

const THEMES: Array<{
  key: ThemeKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  slugs: string[];
}> = [
  {
    key: "leadership",
    label: "Education Leadership & Governance",
    description: "State, ministerial and political leadership advancing education policy and reform.",
    icon: Crown,
    slugs: ["education-state-nigeria", "political-leaders-nigeria", "africa-education-icon"],
  },
  {
    key: "teachers",
    label: "Teachers & Learning Excellence",
    description: "Educators, faith-based and faculty programs delivering classroom impact.",
    icon: GraduationCap,
    slugs: ["christian-education-africa", "islamic-education-africa", "international-education"],
  },
  {
    key: "innovation",
    label: "Education Innovation & Technology",
    description: "EduTech builders, STEM programs and R&D advancing how Africa learns.",
    icon: Lightbulb,
    slugs: ["edutech-africa", "stem-education-africa", "rd-nigeria"],
  },
  {
    key: "institutions",
    label: "School & Institutional Development",
    description: "Libraries, schools and institutional systems strengthening education delivery.",
    icon: Building2,
    slugs: ["library-nigeria", "international-education"],
  },
  {
    key: "community",
    label: "Community & Social Impact",
    description: "NGOs and grassroots programs widening access and equity in African education.",
    icon: HeartHandshake,
    slugs: ["ngo-education-africa", "ngo-education-nigeria"],
  },
  {
    key: "inclusion",
    label: "Women, Inclusion & Special Needs Education",
    description: "Programs serving girls, women, persons with disabilities and underserved learners.",
    icon: Accessibility,
    slugs: ["ngo-education-africa", "diaspora-impact"],
  },
  {
    key: "youth",
    label: "Youth Development & Mentorship",
    description: "Mentorship, sports and music platforms shaping the next generation.",
    icon: Users,
    slugs: ["sports", "music", "stem-education-africa"],
  },
  {
    key: "media",
    label: "Media, Advocacy & Public Engagement",
    description: "Journalists, broadcasters, creators and advocates amplifying education impact.",
    icon: Megaphone,
    slugs: ["media-advocacy-nigeria", "creative-arts-nigeria", "social-media"],
  },
  {
    key: "csr",
    label: "CSR, Funding & Partnerships",
    description: "Corporates and funders channelling capital into measurable education outcomes.",
    icon: HandCoins,
    slugs: ["csr-education-africa", "csr-education-nigeria"],
  },
  {
    key: "sustainability",
    label: "Sustainability & Future Education",
    description: "Diaspora, international and forward-looking programs building Africa's education future.",
    icon: Leaf,
    slugs: ["diaspora-impact", "international-education", "edutech-africa"],
  },
];

/** EDX matrix pills inferred lightly from the category group. */
function edxPillsFor(c: AwardCategoryConfig): string[] {
  const base = ["Education Impact", "Reach"];
  switch (c.group) {
    case "blue_garnet":
      return [...base, "Innovation", "Community Impact"];
    case "platinum":
      return [...base, "Leadership", "Sustainability"];
    case "icon":
      return [...base, "Leadership", "Sustainability", "Inclusion"];
    case "influencers":
      return [...base, "Reach", "Community Impact"];
    default:
      return base;
  }
}

const MASTER_FAQS = [
  {
    q: "What is the NESA-Africa 2026 award structure?",
    a: "Four canonical groups: Blue Garnet (competitive, public voting + jury), Platinum Certificate (jury-only institutional recognition), Africa Education Icon Lifetime Achievement (2006–2026, hall-of-fame), and Influencers Education Impact 2026 (jury-led with a public engagement signal).",
  },
  {
    q: "How do I find the right category to nominate in?",
    a: "Start with the recognition pathway that fits your candidate, then pick a theme or use the filters to narrow by sector, role, country, institution type or impact area.",
  },
  {
    q: "How does the EDX Matrix evaluate categories?",
    a: "Every category is mapped to the Education Development & Impact (EDX) Matrix across Education Impact, Community Impact, Innovation, Inclusion, Sustainability, Leadership and Reach. The matrix anchors fair, comparable evaluation.",
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
        <title>NESA-Africa 2026 Award Categories | Recognition Directory</title>
        <meta
          name="description"
          content="Africa's education impact recognition directory. Discover NESA-Africa 2026 award categories across Blue Garnet, Platinum, Icon and Influencer pathways — nominate, explore nominees, and sponsor."
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
            NESA-Africa 2026 · Recognition Directory
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl text-gold mb-4">
            Explore NESA-Africa Award Categories
          </h1>
          <p className="text-foreground/80 text-lg max-w-3xl">
            Discover the categories recognising educators, innovators, institutions, advocates,
            creators, policymakers, funders, mentors, technology leaders, community changemakers and
            organisations advancing education across Africa and beyond.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/nominate?source=categories-master">
                <Sparkles className="mr-2 h-4 w-4" />
                Nominate for 2026
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/sponsor">Sponsor a Category</Link>
            </Button>
          </div>
          <div className="mt-8">
            <ExistingNomineesInline
              limit={9}
              title="Explore Existing Nominees"
              subtitle="A snapshot of approved nominees recognised across all categories."
            />

            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/sponsor">Sponsor a Category</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recognition pathways */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <Badge variant="outline" className="border-gold/40 text-gold mb-3">
              Recognition Pathways
            </Badge>
            <h2 className="font-playfair text-2xl md:text-3xl text-foreground mb-2">
              Four ways NESA-Africa recognises education impact
            </h2>
            <p className="text-foreground/70 max-w-3xl text-sm md:text-base">
              Before browsing categories, understand the four pathways. Each has its own qualification,
              evaluation and participation model.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PATHWAY_CARDS.map((p, i) => {
              const Icon = GROUP_ICON[p.group];
              return (
                <motion.div
                  key={p.group}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full border-gold/25 bg-gradient-to-br from-charcoal-light/70 to-charcoal hover:border-gold/70 transition">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-11 w-11 rounded-xl bg-gold/15 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-gold" />
                        </div>
                        <Badge variant="outline" className="border-gold/30 text-gold/80 text-[10px]">
                          {GROUP_META[p.group].tone}
                        </Badge>
                      </div>
                      <h3 className="font-playfair text-lg text-foreground mb-1">{p.title}</h3>
                      <p className="text-gold/90 text-xs font-medium mb-3">{p.tagline}</p>
                      <p className="text-sm text-foreground/70 leading-relaxed mb-4">{p.description}</p>
                      <div className="text-xs text-foreground/60 mb-4">
                        <span className="text-foreground/80 font-semibold">Who qualifies: </span>
                        {p.qualifies}
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="mt-auto border-gold/40 text-gold hover:bg-gold/10"
                      >
                        <Link to={p.href}>
                          {p.cta} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Themed discovery (mobile-first swipe, grid on desktop) */}
      <section className="py-12 border-t border-gold/15 bg-charcoal-light/20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <Badge variant="outline" className="border-gold/40 text-gold mb-3">
              Discover by Theme
            </Badge>
            <h2 className="font-playfair text-2xl md:text-3xl text-foreground mb-2">
              Categories grouped by impact theme
            </h2>
            <p className="text-foreground/70 max-w-3xl text-sm md:text-base">
              Ten impact themes connect every category to a clear recognition purpose. Tap a theme to
              jump straight to matching categories.
            </p>
          </div>

          {/* Mobile: horizontal swipe */}
          <div className="md:hidden -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {THEMES.map((t) => (
              <ThemeCard key={t.key} theme={t} />
            ))}
          </div>

          {/* Tablet/desktop grid */}
          <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {THEMES.map((t) => (
              <ThemeCard key={t.key} theme={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Filter + search */}
      <section
        id="filters"
        className="sticky top-16 z-30 py-5 border-y border-gold/20 bg-charcoal/95 backdrop-blur supports-[backdrop-filter]:bg-charcoal/80"
      >
        <div className="container mx-auto max-w-6xl px-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
              <Input
                aria-label="Search award categories"
                placeholder="Search by sector, role, country or impact"
                className="pl-9 pr-9 bg-charcoal border-gold/20 h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-foreground/60 hover:text-gold"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger
                className="w-[160px] h-11 bg-charcoal border-gold/20"
                aria-label="Sort categories"
              >
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Curated order</SelectItem>
                <SelectItem value="az">Name A → Z</SelectItem>
                <SelectItem value="za">Name Z → A</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-11 border-gold/40 text-gold hover:bg-gold/10"
              >
                <X className="mr-1 h-4 w-4" /> Clear
              </Button>
            )}
          </div>

          <div className="-mx-4 px-4 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 min-w-max">
              {(["all", ...groupsList] as Array<CategoryGroup | "all">).map((g) => {
                const active = groupFilter === g;
                const label = g === "all" ? "All groups" : GROUP_META[g].label.replace(/ Categories?$/i, "");
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGroupFilter(g)}
                    aria-pressed={active}
                    className={cn(
                      "shrink-0 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                      active
                        ? "bg-gold text-charcoal border-gold shadow-sm"
                        : "bg-charcoal-light/60 text-foreground/80 border-gold/25 hover:border-gold/60 hover:text-gold"
                    )}
                  >
                    <span>{label}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[10px] leading-4",
                        active ? "bg-charcoal/20 text-charcoal" : "bg-gold/15 text-gold"
                      )}
                    >
                      {groupCounts[g] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-foreground/60">
            <span>
              Showing <span className="text-gold font-semibold">{filtered.length}</span> of{" "}
              {ALL_CATEGORIES.length} categories
            </span>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="text-gold hover:underline">
                Reset filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category list — richer cards */}
      <section id="categories" className="py-12">
        <div className="container mx-auto max-w-6xl px-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
          {filtered.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <Card className="border-dashed border-gold/30 bg-charcoal-light/40">
                <CardContent className="p-10 text-center flex flex-col items-center gap-3">
                  <Search className="h-8 w-8 text-gold/60" />
                  <h3 className="font-playfair text-xl text-foreground">No categories match</h3>
                  <p className="text-sm text-foreground/60 max-w-md">
                    Try a different keyword or remove a filter. You can also browse every group
                    individually.
                  </p>
                  <Button onClick={clearFilters} className="mt-2 bg-gold text-charcoal hover:bg-gold/90">
                    Reset filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Sponsorship band */}
      <section className="py-12 border-t border-gold/15 bg-charcoal-light/20">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="border-gold/30 bg-gradient-to-br from-charcoal-light/70 to-charcoal">
            <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="h-14 w-14 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <Handshake className="h-6 w-6 text-gold" />
              </div>
              <div className="flex-1">
                <h2 className="font-playfair text-2xl text-foreground mb-2">Sponsor a Category</h2>
                <p className="text-sm md:text-base text-foreground/75 leading-relaxed mb-3">
                  Support recognition and education impact within any NESA-Africa category. Sponsorship
                  funds visibility, ceremonies and programme delivery.
                </p>
                <p className="text-xs text-foreground/55 italic">
                  Sponsorship does not influence nominations, judging, voting, finalists or winners.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                  <Link to="/sponsor">Sponsor a Category</Link>
                </Button>
                <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                  <Link to="/sponsor#packages">View Packages</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <CategoryFaqSection faqs={MASTER_FAQS} title="Category FAQs" />

      {/* Governance & Trust */}
      <section id="integrity" className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="border-gold/30 bg-charcoal-light/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gold mb-3">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-semibold">Recognition Integrity</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                NESA-Africa categories recognise measurable education impact through verification,
                governance standards, public participation and the EDX Matrix framework.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Transparency", icon: ShieldCheck },
                  { label: "Conflict of Interest", icon: CheckCircle2 },
                  { label: "Verification", icon: School },
                  { label: "Fairness", icon: Award },
                ].map(({ label, icon: I }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg border border-gold/20 bg-charcoal/40 px-3 py-2"
                  >
                    <I className="h-4 w-4 text-gold" />
                    <span className="text-xs text-foreground/80 font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-foreground/55 mt-4 leading-relaxed">{INTEGRITY_DISCLAIMER}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function ThemeCard({ theme }: { theme: (typeof THEMES)[number] }) {
  const Icon = theme.icon;
  const matched = ALL_CATEGORIES.filter((c) => theme.slugs.includes(c.slug));
  return (
    <Link
      to="#categories"
      className="snap-start shrink-0 w-[78vw] max-w-[320px] md:w-auto md:max-w-none group"
    >
      <Card className="h-full border-gold/20 bg-charcoal-light/60 hover:border-gold/60 transition">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="h-10 w-10 rounded-lg bg-gold/15 flex items-center justify-center mb-3">
            <Icon className="h-5 w-5 text-gold" />
          </div>
          <h3 className="font-playfair text-base text-foreground mb-1.5 leading-tight">
            {theme.label}
          </h3>
          <p className="text-xs text-foreground/65 leading-relaxed mb-3 flex-1">
            {theme.description}
          </p>
          <div className="flex items-center justify-between text-[11px] text-gold/80 mt-auto">
            <span>{matched.length} categories</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CategoryCard({ category: c }: { category: AwardCategoryConfig }) {
  const Icon = GROUP_ICON[c.group];
  const pills = edxPillsFor(c);
  return (
    <Card className="h-full border-gold/20 bg-charcoal-light/60 hover:border-gold/60 transition flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-gold" />
          <Badge variant="outline" className="border-gold/30 text-gold/90 text-[10px]">
            {GROUP_META[c.group].label.replace(/ Categories?$/i, "")}
          </Badge>
        </div>
        <h3 className="font-playfair text-lg text-foreground mb-2 leading-tight">{c.finalName}</h3>
        <p className="text-sm text-foreground/70 leading-relaxed mb-3">{c.shortDescription}</p>

        <div className="text-xs text-foreground/65 mb-2">
          <span className="text-gold/90 font-semibold">Why this matters: </span>
          {c.eligibilitySummary}
        </div>
        <div className="text-xs text-foreground/65 mb-3">
          <span className="text-gold/90 font-semibold">Who can be nominated: </span>
          {c.whoCanBeNominated}
        </div>

        {/* EDX pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pills.map((p) => (
            <span
              key={p}
              className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold/90 border border-gold/20"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <Button asChild size="sm" className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to={c.url}>View Category</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold">
            <Link to={`/nominate?category=${encodeURIComponent(c.slug)}`}>Nominate</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold">
            <Link to={`/nominees?category=${encodeURIComponent(c.slug)}`}>Explore Nominees</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="text-gold hover:bg-gold/10">
            <Link to={`/sponsor?category=${encodeURIComponent(c.slug)}`}>Sponsor</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
