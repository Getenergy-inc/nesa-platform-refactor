import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Trophy,
  Users,
  Building2,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TIERS_META,
  NOMINATION_FORMS,
  getFormsByTier,
  type TierSlug,
  type NominationFormMeta,
} from "@/config/nominate2026/forms";
import { EDI_MATRIX_GENERIC } from "@/config/nominate2026/ediMatrix";

const TIER_ICONS: Record<TierSlug, typeof Trophy> = {
  "africa-education-icon": Trophy,
  "influencer-education-impact": Users,
  platinum: Landmark,
  "gold-blue-garnet": Building2,
};

function TierCard({ tier }: { tier: (typeof TIERS_META)[number] }) {
  const Icon = TIER_ICONS[tier.slug];
  const forms = getFormsByTier(tier.slug);
  const first = forms[0];
  const primaryHref =
    tier.slug === "africa-education-icon" || tier.slug === "influencer-education-impact"
      ? first?.route ?? "#nominate-directory"
      : "#nominate-directory";

  return (
    <Card className="relative overflow-hidden border-gold/25 bg-charcoal-light/40 backdrop-blur transition hover:border-gold/60">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/40">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gold/70">
                Tier {tier.order}
              </div>
              <CardTitle className="font-playfair text-xl leading-tight text-gold">
                {tier.name}
              </CardTitle>
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              tier.competitive
                ? "border-gold/60 text-gold"
                : "border-foreground/25 text-foreground/70"
            }
          >
            {tier.competitive ? "Judged" : "NRC-verified"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-foreground/80">
          {tier.tagline}
        </CardDescription>
        <div className="rounded-lg border border-gold/15 bg-black/20 p-3 text-xs text-foreground/70">
          <div className="mb-1 font-semibold text-foreground/85">Verification route</div>
          <div className="leading-relaxed">
            {tier.verificationRoute.join(" → ")}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="bg-gold/10 text-gold">
            {tier.formsCount} {tier.formsCount === 1 ? "form" : "forms"}
          </Badge>
          <span className="text-foreground/60">{tier.hubBadge}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            asChild
            size="sm"
            className="bg-gold text-charcoal hover:bg-gold/90"
          >
            <Link to={primaryHref}>
              {tier.cta}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            <a href="#nominate-directory">Browse categories</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FormCard({ form }: { form: NominationFormMeta }) {
  const tier = TIERS_META.find((t) => t.slug === form.tier)!;
  return (
    <Card className="flex h-full flex-col border-gold/20 bg-charcoal-light/30 transition hover:border-gold/50">
      <CardHeader className="pb-3">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="border-gold/40 text-gold text-[10px]">
            Tier {tier.order}
          </Badge>
          {form.judged ? (
            <Badge className="bg-gold text-charcoal text-[10px]">Judged</Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px]">NRC-verified</Badge>
          )}
          {form.regionScope === "africa" && (
            <Badge variant="outline" className="text-[10px]">Africa Regional</Badge>
          )}
          {form.regionScope === "nigeria" && (
            <Badge variant="outline" className="text-[10px]">Nigeria</Badge>
          )}
        </div>
        <CardTitle className="text-base leading-snug text-foreground">
          {form.title}
        </CardTitle>
        <CardDescription className="text-xs">{form.purpose}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-3">
        <div className="text-xs text-foreground/65">{form.selectorLabel}</div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to={form.route}>
              Start nomination
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            <Link to={form.route}>View category</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const NOMINEE_TYPES = [
  { value: "all", label: "All nominee types" },
  { value: "individual", label: "Individual" },
  { value: "organisation", label: "Organisation" },
  { value: "institution", label: "Institution" },
  { value: "programme", label: "Programme" },
  { value: "government", label: "Government" },
  { value: "public-figure", label: "Public figure" },
] as const;

export default function NominateHub2026() {
  const [query, setQuery] = useState("");
  const [tierTab, setTierTab] = useState<"all" | TierSlug>("all");
  const [nomineeType, setNomineeType] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NOMINATION_FORMS.filter((f) => {
      if (tierTab !== "all" && f.tier !== tierTab) return false;
      if (nomineeType !== "all" && f.nomineeType !== nomineeType) return false;
      if (!q) return true;
      return (
        f.title.toLowerCase().includes(q) ||
        f.purpose.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    });
  }, [query, tierTab, nomineeType]);

  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>Nominate an Enabler of Education for All Across Africa | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Nominate individuals, organisations, institutions, governments, programmes or public figures across four recognition tiers and 18 categories. NESA-Africa 2026."
        />
      </Helmet>

      {/* Announcement */}
      <div className="border-b border-gold/20 bg-black/40">
        <div className="container mx-auto px-4 py-2 text-center text-xs sm:text-sm text-gold">
          NESA-Africa 2026 Recognition Gala • 22 October 2026 • Lagos, Nigeria
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-gold/15 bg-gradient-to-b from-black/60 to-charcoal">
        <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            New Education Standard Award Africa 2026
          </div>
          <h1 className="font-playfair text-3xl leading-tight text-gold sm:text-4xl md:text-5xl">
            Nominate an Enabler of Education for All Across Africa
          </h1>
          <p className="mt-4 max-w-3xl text-base text-foreground/80 sm:text-lg">
            Identify an individual, organisation, institution, government,
            programme or public figure making a verified contribution to
            education across Africa.
          </p>
          <p className="mt-2 max-w-3xl text-sm text-foreground/65">
            Four Recognition Tiers • Eighteen Main Categories • Category-Specific EDI Matrices • One Verified Recognition Standard
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <a href="#nominate-directory">
                Start a nomination
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/nominees">Explore existing nominees</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <a href="#tiers">Understand the four tiers</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-gold hover:bg-gold/10"
            >
              <a href="#edi-standards">View EDI Matrix standards</a>
            </Button>
          </div>

          {/* Integrity + no-account notices */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-lg border border-gold/20 bg-black/30 p-3 text-xs text-foreground/75">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                Sponsorship, partnerships, donations, endorsements and visibility opportunities do not influence nominee verification, judging, Governance approval, recognition or certificate issuance.
              </span>
            </div>
            <div className="flex gap-3 rounded-lg border border-gold/20 bg-black/30 p-3 text-xs text-foreground/75">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                No account is required to begin. You will create or confirm your free account only when submitting your nomination.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Four Recognition Tier Cards */}
      <section id="tiers" className="border-b border-gold/10 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
              The four recognition tiers
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              One judged tier, three NRC-verified tiers — eighteen main forms in total.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {TIERS_META.map((tier) => (
              <TierCard key={tier.slug} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* 18 Category Forms Directory */}
      <section id="nominate-directory" className="border-b border-gold/10 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
                Eighteen category forms
              </h2>
              <p className="mt-1 text-sm text-foreground/70">
                Filter by tier, nominee type or search to find the right form.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full pl-9 sm:w-64"
                />
              </div>
              <select
                value={nomineeType}
                onChange={(e) => setNomineeType(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Filter by nominee type"
              >
                {NOMINEE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Tabs value={tierTab} onValueChange={(v) => setTierTab(v as typeof tierTab)}>
            <TabsList className="mb-6 flex flex-wrap gap-1 bg-transparent">
              <TabsTrigger value="all">All (18)</TabsTrigger>
              {TIERS_META.map((t) => (
                <TabsTrigger key={t.slug} value={t.slug}>
                  Tier {t.order} ({t.formsCount})
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={tierTab} className="mt-0">
              {filtered.length === 0 ? (
                <div className="rounded-lg border border-gold/20 bg-charcoal-light/30 p-6 text-center text-sm text-foreground/70">
                  No categories match your filters.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((form) => (
                    <FormCard key={form.id} form={form} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* EDI standards */}
      <section id="edi-standards" className="border-b border-gold/10 bg-black/30 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
            Education Development Index (EDI) Matrix
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground/70">
            Every category is assessed against ten evidence-driven indicators.
            Category-specific matrices adapt the emphasis, but the standard
            below is the shared foundation.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {EDI_MATRIX_GENERIC.map((i, idx) => (
              <div
                key={i.id}
                className="rounded-lg border border-gold/20 bg-charcoal-light/30 p-4"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-gold/80">
                  <span className="font-mono">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="font-semibold">{i.label}</span>
                </div>
                <p className="text-xs text-foreground/70">{i.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
            Ready to nominate?
          </h2>
          <p className="mt-3 text-sm text-foreground/75">
            The New Education Standard Award Africa recognises Enablers of
            Education for All Across Africa through verified educational
            impact — not popularity. Only the Africa Education Icon Award
            involves independent judges.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <a href="#nominate-directory">
                Choose a category
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/nominees">Browse existing nominees</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
