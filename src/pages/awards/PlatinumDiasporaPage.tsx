import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Globe2,
  Search,
  MapPin,
  Mail,
  Linkedin,
  ExternalLink,
  Users,
  Award,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  DIASPORA_NOMINEES,
  DIASPORA_REGIONS,
  DIASPORA_SUBCATEGORIES,
  type DiasporaNominee,
} from "@/data/diasporaNominees2026";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

const SUB_SHORT: Record<string, string> = {
  "Best Diaspora-Led Educational Infrastructure Project": "Infrastructure",
  "Best Diaspora-Led Educational Program Innovation": "Program Innovation",
  "Best Diaspora-Led Teacher Training & Support Initiative": "Teacher Training",
};

function normalizeWebsite(w: string): string | null {
  if (!w || /not found/i.test(w)) return null;
  const cleaned = w.replace(/\(.*?\)/g, "").trim().replace(/^https?:\/\//, "");
  if (!cleaned) return null;
  return `https://${cleaned}`;
}

function normalizeLinkedIn(l: string): string | null {
  if (!l || /^search/i.test(l)) return null;
  const cleaned = l.trim().replace(/^https?:\/\//, "");
  return `https://${cleaned}`;
}

function NomineeCard({ nominee }: { nominee: DiasporaNominee }) {
  const website = normalizeWebsite(nominee.website);
  const linkedin = normalizeLinkedIn(nominee.linkedin);
  const validEmail = nominee.email && !/not found/i.test(nominee.email);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group relative rounded-2xl border border-gold/15 bg-gradient-to-br from-charcoal-light/80 to-charcoal/60 p-5 hover:border-gold/45 hover:shadow-[0_0_24px_rgba(212,175,55,0.15)] transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ivory text-base leading-snug group-hover:text-gold transition-colors">
            {nominee.name}
          </h3>
          {nominee.location && (
            <p className="mt-1 text-xs text-ivory/60 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gold/70" />
              {nominee.location}
            </p>
          )}
        </div>
        <Badge variant="outline" className="shrink-0 border-gold/30 text-gold bg-gold/5 text-[10px]">
          {SUB_SHORT[nominee.subcategory] ?? "Diaspora"}
        </Badge>
      </div>

      <p className="text-[11px] uppercase tracking-wider text-ivory/40 mb-3">
        {nominee.region} Diaspora
      </p>

      <div className="flex flex-wrap gap-2 text-xs">
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-charcoal/70 border border-gold/20 px-2.5 py-1 text-ivory/80 hover:text-gold hover:border-gold/50 transition"
          >
            <ExternalLink className="h-3 w-3" /> Website
          </a>
        )}
        {validEmail && (
          <a
            href={`mailto:${nominee.email}`}
            className="inline-flex items-center gap-1 rounded-full bg-charcoal/70 border border-gold/20 px-2.5 py-1 text-ivory/80 hover:text-gold hover:border-gold/50 transition"
          >
            <Mail className="h-3 w-3" /> Email
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-charcoal/70 border border-gold/20 px-2.5 py-1 text-ivory/80 hover:text-gold hover:border-gold/50 transition"
          >
            <Linkedin className="h-3 w-3" /> LinkedIn
          </a>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gold/10 flex flex-wrap gap-2">
        <Button
          asChild
          size="sm"
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold flex-1"
          onClick={() =>
            trackEvent("platinum_diaspora_nominate_click", {
              nominee: nominee.name,
              region: nominee.region,
              subcategory: nominee.subcategory,
            })
          }
        >
          <Link
            to={`/nominate?category=excellence-in-diaspora-educational-impact-international&prefill_name=${encodeURIComponent(
              nominee.name,
            )}&prefill_region=${encodeURIComponent(nominee.region)}`}
          >
            Endorse / Nominate
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}

export default function PlatinumDiasporaPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [sub, setSub] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DIASPORA_NOMINEES.filter((n) => {
      if (region !== "all" && n.region !== region) return false;
      if (sub !== "all" && n.subcategory !== sub) return false;
      if (!q) return true;
      return (
        n.name.toLowerCase().includes(q) ||
        n.location.toLowerCase().includes(q) ||
        n.region.toLowerCase().includes(q)
      );
    });
  }, [query, region, sub]);

  const stats = useMemo(
    () => ({
      total: DIASPORA_NOMINEES.length,
      regions: DIASPORA_REGIONS.length,
      sub: DIASPORA_SUBCATEGORIES.length,
    }),
    [],
  );

  return (
    <>
      <Helmet>
        <title>Diaspora Education Impact — Platinum Recognition | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Discover 300 diaspora-led organisations across 8 African regions and 3 subcategories — infrastructure, program innovation, and teacher training — competing for Platinum Recognition at NESA-Africa 2026."
        />
        <link rel="canonical" href="https://nesa.africa/awards/platinum-recognition/diaspora" />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-ivory">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-gold/10 via-charcoal to-charcoal py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Link
              to="/awards/platinum-recognition"
              className="inline-flex items-center gap-2 text-sm text-ivory/70 hover:text-gold mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Platinum Recognition
            </Link>

            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase mb-4">
                  <Sparkles className="h-3 w-3" /> Platinum • Diaspora Track
                </span>
                <h1 className="font-playfair text-4xl md:text-5xl text-ivory leading-tight mb-4">
                  Diaspora Education Impact —{" "}
                  <span className="text-gold">Africa Regions</span>
                </h1>
                <p className="text-ivory/80 text-lg max-w-2xl mb-6">
                  Africa's diaspora is rebuilding classrooms, training teachers and
                  digitising learning from abroad. We have verified{" "}
                  <span className="text-gold font-semibold">300 diaspora-led organisations</span>{" "}
                  across <span className="text-gold font-semibold">8 African regions</span> and{" "}
                  <span className="text-gold font-semibold">3 recognition subcategories</span>{" "}
                  for the 2026 Platinum cycle.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                  >
                    <Link to="/nominate?category=excellence-in-diaspora-educational-impact-international">
                      Nominate a Diaspora Organisation
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-gold/40 text-ivory hover:bg-gold/10"
                  >
                    <Link to="/awards/platinum-recognition">View Platinum Categories</Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Users, label: "Nominees", value: stats.total },
                  { icon: Globe2, label: "Regions", value: stats.regions },
                  { icon: Award, label: "Subcategories", value: stats.sub },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gold/20 bg-charcoal-light/60 p-4 text-center"
                  >
                    <s.icon className="h-5 w-5 text-gold mx-auto mb-2" />
                    <div className="font-playfair text-2xl text-ivory">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-ivory/60">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 border-b border-gold/10 sticky top-[100px] z-20 bg-charcoal/95 backdrop-blur">
          <div className="container mx-auto max-w-6xl space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory/40" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search nominees by name, country or region…"
                className="pl-10 bg-charcoal-light/60 border-gold/20 text-ivory placeholder:text-ivory/40 focus-visible:ring-gold/40"
              />
            </div>

            <Tabs value={sub} onValueChange={setSub}>
              <TabsList className="bg-charcoal-light/60 border border-gold/15 flex flex-wrap h-auto">
                <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-charcoal">
                  All Subcategories
                </TabsTrigger>
                {DIASPORA_SUBCATEGORIES.map((s) => (
                  <TabsTrigger
                    key={s}
                    value={s}
                    className="data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                  >
                    {SUB_SHORT[s]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Tabs value={region} onValueChange={setRegion}>
              <TabsList className="bg-charcoal-light/60 border border-gold/15 flex flex-wrap h-auto">
                <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-charcoal">
                  All Regions
                </TabsTrigger>
                {DIASPORA_REGIONS.map((r) => (
                  <TabsTrigger
                    key={r}
                    value={r}
                    className="data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                  >
                    {r}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={region} />
            </Tabs>
          </div>
        </section>

        {/* Results */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-ivory/65">
                Showing <span className="text-gold font-semibold">{filtered.length}</span> of{" "}
                {DIASPORA_NOMINEES.length} verified diaspora organisations
              </p>
              {(query || region !== "all" || sub !== "all") && (
                <button
                  onClick={() => {
                    setQuery("");
                    setRegion("all");
                    setSub("all");
                  }}
                  className="text-xs text-gold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-gold/15 bg-charcoal-light/40 p-12 text-center">
                <p className="text-ivory/70">
                  No diaspora organisations match your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((n) => (
                  <NomineeCard key={n.id} nominee={n} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-16 px-4 border-t border-gold/15 bg-gradient-to-t from-gold/10 to-charcoal">
          <div className="container mx-auto max-w-3xl text-center">
            <Globe2 className="h-10 w-10 text-gold mx-auto mb-4" />
            <h2 className="font-playfair text-3xl text-ivory mb-3">
              Missing a Diaspora Champion?
            </h2>
            <p className="text-ivory/75 mb-6">
              This directory grows with the community. If a diaspora organisation
              delivering real African education impact is missing, nominate them for
              Platinum Recognition consideration.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"
            >
              <Link to="/nominate?category=excellence-in-diaspora-educational-impact-international">
                Submit a Diaspora Nomination
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
