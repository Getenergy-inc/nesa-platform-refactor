import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Gavel, ShieldCheck, Star, MapPin } from "lucide-react";
import { listPublicJudges, type PublicJudge } from "@/lib/api/judges.api";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";

export default function JudgesDirectory() {
  const [judges, setJudges] = useState<PublicJudge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<string>("");
  const [expertise, setExpertise] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listPublicJudges()
      .then((d) => mounted && setJudges(d))
      .catch(() => mounted && setJudges([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(judges.map((j) => j.region).filter(Boolean))) as string[],
    [judges],
  );
  const expertises = useMemo(
    () => Array.from(new Set(judges.flatMap((j) => j.expertise_areas || []))).sort(),
    [judges],
  );

  const filtered = useMemo(() => {
    return judges.filter((j) => {
      if (region && j.region !== region) return false;
      if (expertise && !(j.expertise_areas || []).includes(expertise)) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${j.full_name} ${j.organization ?? ""} ${j.professional_title ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [judges, region, expertise, search]);

  return (
    <>
      <Helmet>
        <title>Meet the Judges | NESA-Africa 2026 Jury Panel</title>
        <meta
          name="description"
          content="Browse the NESA-Africa independent jury panel — distinguished educators, policy leaders and experts evaluating Africa's education impact awards."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/judges/directory" />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        {/* Hero */}
        <section className="relative border-b border-gold/20 bg-gradient-to-b from-black to-charcoal">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-gold/15 text-gold border border-gold/30">
                <ShieldCheck className="mr-1 h-3 w-3" /> Independent Jury Panel
              </Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold">
                Meet the Judges
              </h1>
              <p className="mt-4 text-lg text-white/80">
                Africa's most respected educators, researchers and changemakers evaluating
                NESA-Africa 2026 nominees with rigor, transparency and integrity.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                  <Link to="/judgeapply">Apply to be a Judge</Link>
                </Button>
                <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                  <Link to="/about/governance">Governance & Jury Process</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-white/10 bg-black/40">
          <div className="container mx-auto px-4 py-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search by name, organization or title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-charcoal border-white/15 text-white placeholder:text-white/40"
              />
            </div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-md border border-white/15 bg-charcoal px-3 py-2 text-sm text-white"
            >
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              className="rounded-md border border-white/15 bg-charcoal px-3 py-2 text-sm text-white"
            >
              <option value="">All expertise</option>
              {expertises.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-4 py-10">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-16 text-center">
                <Gavel className="mx-auto mb-4 h-10 w-10 text-gold/70" />
                <h3 className="font-serif text-2xl text-white">No judges to display yet</h3>
                <p className="mt-2 text-white/70">
                  Approved jury profiles will appear here as the 2026 panel is finalized.
                </p>
                <Button asChild className="mt-6 bg-gold text-charcoal hover:bg-gold/90">
                  <Link to="/judgeapply">Apply to be a Judge</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((j) => (
                <Link key={j.id} to={`/judges/${j.slug}`} className="group">
                  <Card className="h-full bg-white/5 border-white/10 transition-all group-hover:border-gold/40 group-hover:bg-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 ring-2 ring-gold/30">
                          <AvatarImage src={j.photo_url ?? undefined} alt={j.full_name} />
                          <AvatarFallback className="bg-gold/20 text-gold">
                            {j.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-serif text-lg font-semibold text-white group-hover:text-gold">
                            {j.full_name}
                          </h3>
                          {j.professional_title && (
                            <p className="truncate text-sm text-white/70">{j.professional_title}</p>
                          )}
                          {j.organization && (
                            <p className="truncate text-xs text-white/50">{j.organization}</p>
                          )}
                        </div>
                        {j.featured && (
                          <Badge className="bg-gold/20 text-gold border border-gold/40">
                            <Star className="mr-1 h-3 w-3" /> Featured
                          </Badge>
                        )}
                      </div>

                      {j.bio && (
                        <p className="mt-4 text-sm text-white/70 line-clamp-3">{j.bio}</p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(j.expertise_areas || []).slice(0, 3).map((e) => (
                          <Badge
                            key={e}
                            variant="outline"
                            className="border-gold/30 text-gold/90 text-xs"
                          >
                            {e}
                          </Badge>
                        ))}
                      </div>

                      {(j.country_residence || j.region) && (
                        <div className="mt-4 flex items-center gap-1 text-xs text-white/50">
                          <MapPin className="h-3 w-3" />
                          {[j.country_residence, j.region].filter(Boolean).join(" • ")}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12">
            <ExploreNomineesCTA
              title="The nominees our jury evaluates"
              description="Meet the approved education changemakers whose work the jury is reviewing for NESA-Africa 2026."
            />
          </div>
        </section>
      </div>
    </>
  );
}
