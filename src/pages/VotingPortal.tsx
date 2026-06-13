import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Vote, Award, Trophy, ShieldCheck, BarChart3, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { celebratePop } from "@/lib/celebrate";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";

const TRACKS = [
  {
    title: "Gold Public Voting",
    description: "Open public voting to recognise the Top 3 nominees per subcategory.",
    href: "/vote/gold",
    icon: Award,
    accent: "from-amber-400 to-amber-600",
    badge: "Public",
  },
  {
    title: "Blue Garnet Finalist Voting",
    description: "Hybrid track — 40% public vote, 60% jury score. Africa’s highest honour.",
    href: "/vote/blue-garnet",
    icon: Trophy,
    accent: "from-blue-500 to-blue-700",
    badge: "Hybrid",
  },
];

const SAFEGUARDS = [
  { Icon: ShieldCheck, label: "Anti-manipulation safeguards", body: "Device fingerprinting, burst detection and per-session unique-vote constraints." },
  { Icon: BarChart3, label: "Real-time auditing", body: "Every cast vote is appended to an immutable audit ledger reviewable by admins." },
  { Icon: Users, label: "Role-based access", body: "Public, judge and admin tracks are firewalled — no cross-track influence." },
];

export default function VotingPortal() {
  const [params] = useSearchParams();
  const justVoted = params.get("just-voted") === "1";

  useEffect(() => {
    if (justVoted) celebratePop();
  }, [justVoted]);

  return (
    <div className="min-h-screen bg-charcoal text-white pb-20">
      <Helmet>
        <title>Voting Portal — NESA-Africa</title>
        <meta
          name="description"
          content="Cast your vote in NESA-Africa's Gold and Blue Garnet recognition tracks. Secure, audited and role-based."
        />
      </Helmet>

      {/* Hero */}
      <section className="border-b border-white/10 bg-gradient-to-b from-charcoal-dark to-charcoal py-14 px-4">
        <div className="max-w-5xl mx-auto space-y-4">
          <Badge variant="outline" className="border-gold/60 text-gold w-fit">
            <Vote className="h-3 w-3 mr-1" /> Voting Portal
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif">Shape Africa’s Education Honours</h1>
          <p className="text-white/70 max-w-2xl">
            One secure home for every NESA-Africa voting track. Choose your category, review EDI-verified
            nominees, and cast a transparent, audited vote.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/vote">Browse all categories</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 hover:bg-white/10">
              <Link to="/guidelines/voters">How voting works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-serif mb-6">Choose a voting track</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {TRACKS.map(({ title, description, href, icon: Icon, accent, badge }) => (
            <Card key={href} className="overflow-hidden bg-white/5 border-white/10 text-white hover:border-gold/40 transition-colors">
              <div className={`h-2 bg-gradient-to-r ${accent}`} />
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-serif">
                  <span className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gold" /> {title}
                  </span>
                  <Badge variant="outline" className="border-white/20 text-white/70 text-[10px]">{badge}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/70">{description}</p>
                <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 w-full">
                  <Link to={href}>
                    Open track <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Safeguards */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-xl font-serif mb-6">Integrity &amp; safeguards</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {SAFEGUARDS.map(({ Icon, label, body }) => (
            <Card key={label} className="bg-white/5 border-white/10 text-white">
              <CardContent className="p-5 space-y-2">
                <Icon className="h-5 w-5 text-gold" />
                <p className="font-medium">{label}</p>
                <p className="text-sm text-white/60">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-white/50 mt-6">
          Vote receipts can be verified at any time on the{" "}
          <Link to="/certificates/verify" className="text-gold underline">verification page</Link>.
        </p>
      </section>
    </div>
  );
}
