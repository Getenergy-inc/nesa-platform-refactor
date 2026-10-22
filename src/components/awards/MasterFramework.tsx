import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MASTER_AWARDS, MASTER_TIERS, MASTER_COUNTS } from "@/config/awardMaster2026";
import { getSubpageHeroImage, getTierHeroImage } from "@/config/awards/subpageHeroImages";
import { MasterTierGuidance } from "./MasterAwardGuidance";

export default function MasterFramework() {
  const [tier, setTier] = useState("all");
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visible = MASTER_AWARDS.filter((a) => (tier === "all" || a.tier === tier) && `${a.title} ${a.overview} ${a.subcategories.map((s) => s.title).join(" ")}`.toLowerCase().includes(query));
  return <div className="min-h-screen bg-background text-foreground">
    <Helmet><title>NESA-Africa 2026 | 22 Awards &amp; 90 Subcategories</title><meta name="description" content="Explore the four NESA-Africa 2026 recognition tiers, 22 main awards and 90 subcategories, with evidence guidance and nomination links." /><meta property="og:title" content="NESA-Africa 2026 Award Recognition Framework" /><meta property="og:description" content="Four tiers, 22 main awards and 90 subcategories recognising the Enablers of Education for All Across Africa." /><meta property="og:type" content="website" /><meta name="twitter:card" content="summary_large_image" /></Helmet>
    <header className="relative overflow-hidden border-b border-border">
      <img src={getTierHeroImage("africa-education-icon")} alt="NESA-Africa education recognition" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
        <p className="text-sm font-medium text-primary">Santos Creations Educational Foundation · 2026</p>
        <h1 className="mt-4 max-w-4xl font-playfair text-4xl leading-tight md:text-5xl">NESA-Africa Award Recognition Framework</h1>
        <p className="mt-5 max-w-2xl text-lg text-foreground/85">Recognising the Enablers of Education for All Across Africa.</p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">{[[MASTER_COUNTS.tiers,"Recognition tiers"],[MASTER_COUNTS.categories,"Main awards"],[MASTER_COUNTS.subcategories,"Subcategories"]].map(([value,label]) => <div key={label}><dd className="font-playfair text-3xl text-primary">{value}</dd><dt className="mt-1 text-sm">{label}</dt></div>)}</dl>
        <div className="mt-8 flex flex-wrap gap-3"><Button asChild><a href="#categories">Explore Awards<ArrowRight className="ml-2 h-4 w-4" /></a></Button><Button asChild variant="outline"><Link to="/nominate">Start a Nomination</Link></Button></div>
      </div>
    </header>
    <main id="categories" className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div role="group" aria-label="Filter recognition tier" className="flex flex-wrap gap-2">{[{slug:"all",name:"All awards"},...MASTER_TIERS].map((t) => <Button key={t.slug} variant={tier === t.slug ? "default" : "outline"} size="sm" aria-pressed={tier === t.slug} onClick={() => setTier(t.slug)}>{t.name}</Button>)}</div>
        <div className="relative w-full lg:max-w-xs"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search awards and subcategories" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search awards and subcategories" className="pl-9" /></div>
      </div>
      {MASTER_TIERS.filter((t) => tier === "all" || t.slug === tier).map((t) => {
        const awards = visible.filter((a) => a.tier === t.slug);
        if (!awards.length) return null;
        return <section key={t.slug} className="mb-12" aria-label={t.name}><div className="mb-5 border-b border-border pb-4"><p className="text-xs font-medium uppercase text-primary">Tier {t.number}</p><h2 className="mt-2 font-playfair text-3xl">{t.name}</h2><p className="mt-3 text-sm text-muted-foreground">{awards.length} main awards{t.number > 2 ? ` · ${MASTER_AWARDS.filter((a) => a.tier === t.slug).reduce((sum,a) => sum + a.subcategories.length,0)} subcategories` : " · Direct award classification"}</p></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{awards.map((a) => <article key={a.number} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"><Link to={a.href}><img src={getSubpageHeroImage(a.slug)} alt={a.title} loading="lazy" className="aspect-[16/10] w-full object-cover" /></Link><div className="flex flex-1 flex-col p-5"><p className="text-xs text-primary">Award {String(a.number).padStart(2,"0")} · {a.subcategories.length ? `${a.subcategories.length} subcategories` : "Main award"}</p><h3 className="mt-2 font-playfair text-xl"><Link to={a.href}>{a.title}</Link></h3><p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{a.overview}</p><div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="link" className="h-auto p-0"><Link to={a.href}>Award &amp; subcategories<ArrowRight className="ml-1 h-4 w-4" /></Link></Button><Button asChild variant="link" className="h-auto p-0"><Link to={a.nomineeHref}>Nominees</Link></Button></div></div></article>)}</div>
        </section>;
      })}
      {!visible.length && <p className="py-12 text-muted-foreground" role="status">No awards match your search.</p>}
    </main>
    {tier !== "all" && <MasterTierGuidance tier={tier} />}
    <section className="border-t border-border py-10"><div className="mx-auto max-w-6xl px-4"><h2 className="font-playfair text-2xl">Evidence, not publicity</h2><p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">Explain the nominee’s contribution, who benefited, what changed and how the results can be verified. NESA-Africa 2026 does not use public voting for award recognition. Sponsorship, donations, ticket purchases, follower counts and wallet activity do not influence recognition.</p><p className="mt-4 text-xs text-muted-foreground">Source: NESA-Africa 2026 Complete Award Categories and Subcategory Reference Document; Refactored Master Award Recognition Framework. Existing eligibility and approved review rules apply.</p></div></section>
  </div>;
}