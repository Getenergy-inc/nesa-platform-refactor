import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NomineeAvatar } from "@/components/nominees/NomineeAvatar";
import {
  NGO_SUBCATEGORIES,
  NGORegion,
  getNGORegionMeta,
  getNGOsByRegion,
} from "@/data/ngoEducationAfrica";

const VALID: NGORegion[] = ["west-africa", "east-africa", "north-africa", "central-africa", "southern-africa"];

export default function NGORegionalPage() {
  const { region } = useParams<{ region: string }>();
  const [q, setQ] = useState("");

  if (!region || !VALID.includes(region as NGORegion)) {
    return <Navigate to="/nominees/best-ngo-contribution-to-education" replace />;
  }

  const r = region as NGORegion;
  const meta = getNGORegionMeta(r);
  const nominees = getNGOsByRegion(r);
  const URL = `https://nesaafrica.lovable.app/nominees/best-ngo-contribution-to-education/${r}`;

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return nominees;
    return nominees.filter(
      (n) => n.name.toLowerCase().includes(term) || n.country.toLowerCase().includes(term),
    );
  }, [q, nominees]);

  const bySub = (sub: string) => filtered.filter((n) => n.subcategory === sub);

  return (
    <>
      <Helmet>
        <title>{`${meta.name} NGO Education Nominees | NESA Africa`}</title>
        <meta
          name="description"
          content={`Discover NGOs in ${meta.name} driving education infrastructure, teacher and student support, learning aid, and youth and girls' empowerment.`}
        />
        <link rel="canonical" href={URL} />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-foreground">
        <div className="container mx-auto px-4 py-10">
          <Button asChild variant="ghost" className="mb-6 text-white/70 hover:text-gold">
            <Link to="/nominees/best-ngo-contribution-to-education">
              <ArrowLeft className="mr-2 h-4 w-4" /> All Regions
            </Link>
          </Button>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-3 bg-gold/15 text-gold border-gold/30">5-Africa Regional</Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
              {meta.name} NGOs
            </h1>
            <p className="text-white/70 max-w-2xl mb-6">
              {nominees.length} NGOs across {meta.countries.length} {meta.name} countries advancing
              education for all.
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by NGO or country…"
              className="pl-10 bg-white/5 border-gold/10 text-white placeholder:text-white/40"
            />
          </div>

          {/* Tabs by subcategory */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white/5 border border-gold/10 mb-6 flex-wrap h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                All NGOs ({filtered.length})
              </TabsTrigger>
              {NGO_SUBCATEGORIES.map((s) => (
                <TabsTrigger
                  key={s.slug}
                  value={s.slug}
                  className="data-[state=active]:bg-gold data-[state=active]:text-black"
                >
                  {s.name} ({bySub(s.slug).length})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <NomineeGrid items={filtered} region={r} />
            </TabsContent>
            {NGO_SUBCATEGORIES.map((s) => (
              <TabsContent key={s.slug} value={s.slug}>
                <p className="text-white/60 mb-4 text-sm">{s.description}</p>
                <NomineeGrid items={bySub(s.slug)} region={r} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}

function NomineeGrid({ items, region }: { items: ReturnType<typeof getNGOsByRegion>; region: NGORegion }) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed border-gold/20 bg-white/5 p-10 text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gold/60" />
        <h3 className="font-serif text-xl font-bold text-white mb-2">No NGOs yet in this view</h3>
        <p className="text-white/60 mb-4">
          Help us recognise more NGOs across {getNGORegionMeta(region).name}.
        </p>
        <Button asChild className="bg-gold text-black hover:bg-gold/90">
          <Link to="/nominate">Nominate an NGO</Link>
        </Button>
      </Card>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((n) => (
        <Link key={n.id} to={`/nominees/best-ngo-contribution-to-education/profile/${n.slug}`}>
          <Card className="group h-full overflow-hidden border-gold/10 bg-white/5 hover:border-gold/40 hover:bg-white/[0.08] transition flex flex-col">
            {/* Visual identity */}
            <div className="relative h-40">
              <NomineeAvatar
                name={n.name}
                src={n.logoUrl || n.imageUrl}
                kind="organization"
                shape="square"
                interactive
                context={n.country}
              />
              <div className="absolute top-2 left-2">
                {n.verificationStatus === "verified" ? (
                  <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/40 backdrop-blur-sm">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-400/50 text-amber-200 bg-black/40 backdrop-blur-sm">
                    Under review
                  </Badge>
                )}
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="border-gold/40 text-gold text-xs bg-black/40 backdrop-blur-sm">
                  {n.country}
                </Badge>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-serif text-lg font-bold text-white mb-1 group-hover:text-gold transition">
                {n.name}
              </h3>
              <p className="text-xs text-white/50 mb-3 uppercase tracking-wide">
                {NGO_SUBCATEGORIES.find((s) => s.slug === n.subcategory)?.name}
              </p>
              <p className="text-sm text-white/70 line-clamp-3 mb-4 flex-1">{n.impactSummary}</p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-gold text-black hover:bg-gold/90 flex-1">
                  Vote
                </Button>
                <Button size="sm" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 flex-1">
                  Profile
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
