import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, FileVideo, Mic, Newspaper, Play, Radio, Tv } from "lucide-react";

const CANONICAL = "https://nesa.africa/media";
const MEDIA_CARDS = [
  { title: "NESA-Africa TV", description: "Interviews, documentaries, education news and programme coverage.", href: "/media/tv", icon: Tv },
  { title: "Webinars", description: "Structured discussions with approved speakers and institutions.", href: "/media/webinars", icon: Mic },
  { title: "Africa Education Enablers Podcast", description: "Education journeys, contributions, challenges and solutions.", href: "/media/podcast", icon: Radio },
  { title: "Interviews and documentaries", description: "Authorised stories about enablers and verified programmes.", href: "#documentaries", icon: FileVideo },
  { title: "News and press", description: "Approved announcements, releases and media resources.", href: "#news", icon: Newspaper },
  { title: "EduAid-Africa E-Journal", description: "Documented learning, interventions and impact stories.", href: "/journal", icon: FileVideo },
];
const FILTERS = {
  type: ["All", "NESA-Africa TV", "Webinars", "Podcast", "Documentaries", "Interviews", "News", "E-Journal"],
  year: ["All", "2026", "2027"],
  language: ["All", "English", "French", "Arabic", "Portuguese", "Swahili"],
};
const PUBLICATION_FIELDS = ["Title", "Date", "Author or producer", "Consent status", "Fact-check status", "Captions or transcript", "Rights status", "Correction route", "Sponsorship disclosure where relevant"];

export default function MediaHub() {
  const [filter, setFilter] = useState({ type: "All", year: "All", language: "All" });
  return (
    <>
      <Helmet>
        <title>NESA-Africa Media | Education Impact in View</title>
        <meta name="description" content="Education contributions, challenges, ideas and learning through responsible, evidence-based storytelling." />
        <link rel="canonical" href={CANONICAL} /><meta property="og:title" content="NESA-Africa Media | Education Impact in View" /><meta property="og:description" content="Responsible, evidence-based education storytelling across NESA-Africa media." /><meta property="og:url" content={CANONICAL} /><meta property="og:type" content="website" /><meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="min-h-screen bg-charcoal">
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28"><div className="container mx-auto px-4"><div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2"><Radio className="h-6 w-6 text-primary" /><span className="text-sm font-medium uppercase tracking-wider text-primary">NESA-Africa Media</span></div>
          <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">Education Impact <span className="text-primary">in View</span></h1>
          <p className="mb-8 text-lg text-white/70">NESA-Africa Media documents education contributions, challenges, ideas and learning through responsible, evidence-based storytelling. Media participation does not influence recognition.</p>
          <div className="flex flex-wrap gap-4"><Button asChild size="lg" className="bg-primary text-primary-foreground"><Link to="/media/tv"><Play className="mr-2 h-5 w-5" />Watch NESA-Africa TV</Link></Button><Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10"><Link to="/contact?subject=media">Receive Updates</Link></Button></div>
        </div></div></section>
        <section className="bg-charcoal/95 py-16 lg:py-24" aria-labelledby="media-content"><div className="container mx-auto px-4"><h2 id="media-content" className="mb-12 text-center font-display text-3xl font-bold text-white">Explore Content</h2><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{MEDIA_CARDS.map((category) => { const Icon = category.icon; const content = <Card className="h-full border-white/10 bg-white/5 transition-all hover:border-primary/50 hover:bg-white/10"><CardHeader><Icon className="h-8 w-8 text-primary" /><CardTitle className="mt-4 flex items-center justify-between text-white">{category.title}<ChevronRight className="h-5 w-5 text-white/40" /></CardTitle><CardDescription className="text-white/60">{category.description}</CardDescription></CardHeader></Card>; return category.href.startsWith("#") ? <a key={category.title} href={category.href} className="group">{content}</a> : <Link key={category.title} to={category.href} className="group">{content}</Link>; })}</div></div></section>
        <section className="bg-charcoal py-16" aria-labelledby="media-library"><div className="container mx-auto max-w-5xl px-4"><h2 id="media-library" className="font-display text-3xl font-bold text-white">Published media library</h2><p className="mt-3 text-white/70">Filter approved published items by type, year and language.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{(["type", "year", "language"] as const).map((key) => <label key={key} className="text-sm capitalize text-white/80">{key}<select className="mt-2 min-h-11 w-full rounded-md border border-white/20 bg-charcoal px-3 text-white" value={filter[key]} onChange={(event) => setFilter((current) => ({ ...current, [key]: event.target.value }))}>{FILTERS[key].map((option) => <option key={option}>{option}</option>)}</select></label>)}</div><p role="status" className="mt-6 rounded-xl border border-dashed border-gold/30 p-6 text-white/70">Published items appear after editorial approval. Empty filters are never filled with invented programme titles or viewing figures.</p></div></section>
        <section id="documentaries" className="scroll-mt-28 border-t border-gold/15 bg-charcoal-light/20 px-4 py-16 text-center"><div className="mx-auto max-w-4xl"><h2 className="text-3xl font-bold text-gold">Interviews & Documentaries</h2><p className="mt-4 text-white/80">Authorised stories about education enablers and verified programmes publish after consent and editorial approval.</p></div></section>
        <section id="news" className="scroll-mt-28 border-t border-gold/15 bg-charcoal px-4 py-16 text-center"><div className="mx-auto max-w-4xl"><h2 className="text-3xl font-bold text-gold">News and press</h2><p className="mt-4 text-white/80">Approved announcements, releases and media resources appear after publication approval.</p></div></section>
        <section className="border-t border-gold/15 bg-charcoal-light/20 py-16"><div className="container mx-auto max-w-4xl px-4"><h2 className="font-display text-3xl font-bold text-white">Publication standards</h2><p className="mt-3 text-white/70">Every published item shows:</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{PUBLICATION_FIELDS.map((field) => <li key={field} className="rounded-lg border border-white/10 p-3 text-sm text-white/70">• {field}</li>)}</ul></div></section>
        <section className="border-t border-gold/15 bg-charcoal-light/20 py-16"><div className="container mx-auto max-w-4xl px-4 text-center"><h2 className="font-display text-3xl font-bold text-white">Media integrity</h2><p className="mt-4 text-white/75">Never present interviews as awards, call prospects verified nominees, publish unconfirmed speakers or private evidence, claim a programme was completed without evidence, or use popularity as a criterion.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Button asChild className="bg-gold text-charcoal hover:bg-gold/90"><Link to="/media/webinars">Join a Webinar</Link></Button><Button asChild variant="outline" className="border-gold/40 text-gold"><Link to="/media/podcast">Listen to the Podcast</Link></Button></div><Link to="/contact?subject=media" className="mt-5 inline-block text-sm text-white/70 underline hover:text-gold">Media Enquiries</Link></div></section>
      </div>
    </>
  );
}
