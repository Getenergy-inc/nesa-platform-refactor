import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  ShieldCheck,
  Star,
  MapPin,
  Gavel,
} from "lucide-react";
import { getJudgeBySlug, type PublicJudge } from "@/lib/api/judges.api";

const SOCIAL_ICONS: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  website: Globe,
  other: Globe,
};

export default function JudgeProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [judge, setJudge] = useState<PublicJudge | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setLoading(true);
    getJudgeBySlug(slug)
      .then((d) => {
        if (!mounted) return;
        if (!d) setNotFound(true);
        else setJudge(d);
      })
      .catch(() => mounted && setNotFound(true))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal">
        <div className="container mx-auto px-4 py-16 animate-pulse">
          <div className="h-8 w-40 bg-white/10 rounded mb-6" />
          <div className="h-48 w-full bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (notFound || !judge) {
    return (
      <div className="min-h-screen bg-charcoal text-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <Gavel className="mx-auto h-12 w-12 text-gold/70 mb-4" />
          <h1 className="font-serif text-3xl text-gold mb-2">Judge profile not found</h1>
          <p className="text-white/70 mb-6">This profile may be private or not yet approved.</p>
          <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to="/judges/directory">Browse all judges</Link>
          </Button>
        </div>
      </div>
    );
  }

  const social = judge.social_links || {};
  const socialEntries = Object.entries(social).filter(([, v]) => v);

  return (
    <>
      <Helmet>
        <title>{`${judge.full_name} | NESA-Africa Judge`}</title>
        <meta
          name="description"
          content={
            judge.bio?.slice(0, 155) ??
            `${judge.full_name} serves on the NESA-Africa 2026 independent jury panel.`
          }
        />
        <link rel="canonical" href={`https://nesaafrica.lovable.app/judges/${judge.slug}`} />
        <meta property="og:title" content={`${judge.full_name} — NESA-Africa Judge`} />
        {judge.photo_url && <meta property="og:image" content={judge.photo_url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: judge.full_name,
            jobTitle: judge.professional_title,
            worksFor: judge.organization ? { "@type": "Organization", name: judge.organization } : undefined,
            description: judge.bio,
            image: judge.photo_url,
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link
            to="/judges/directory"
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to judges
          </Link>

          {/* Header */}
          <Card className="bg-gradient-to-br from-black to-charcoal border-gold/20 overflow-hidden">
            <CardContent className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-gold/40">
                  <AvatarImage src={judge.photo_url ?? undefined} alt={judge.full_name} />
                  <AvatarFallback className="bg-gold/20 text-gold text-3xl">
                    {judge.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {judge.verification_status === "verified" && (
                      <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                    {judge.featured && (
                      <Badge className="bg-gold/20 text-gold border border-gold/40">
                        <Star className="mr-1 h-3 w-3" /> Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-white/20 text-white/70 capitalize">
                      {judge.judge_status}
                    </Badge>
                  </div>

                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-gold">
                    {judge.full_name}
                  </h1>
                  {judge.professional_title && (
                    <p className="mt-1 text-lg text-white/90">{judge.professional_title}</p>
                  )}
                  {judge.organization && (
                    <p className="text-white/60">{judge.organization}</p>
                  )}

                  {(judge.country_residence || judge.region) && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-white/60">
                      <MapPin className="h-4 w-4" />
                      {[judge.country_residence, judge.region].filter(Boolean).join(" • ")}
                    </div>
                  )}

                  {socialEntries.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {socialEntries.map(([key, url]) => {
                        const Icon = SOCIAL_ICONS[key] ?? Globe;
                        return (
                          <a
                            key={key}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/10"
                            aria-label={key}
                          >
                            <Icon className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="bio" className="mt-8">
            <TabsList className="bg-black/40 border border-white/10">
              <TabsTrigger value="bio">Biography</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="contribution">Contribution</TabsTrigger>
            </TabsList>

            <TabsContent value="bio" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 prose prose-invert max-w-none">
                  {judge.bio ? (
                    <p className="text-white/85 whitespace-pre-line">{judge.bio}</p>
                  ) : (
                    <p className="text-white/50">No biography provided.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expertise" className="mt-6 grid gap-6 md:grid-cols-2">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-gold">Areas of Expertise</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {(judge.expertise_areas || []).length === 0 ? (
                    <span className="text-white/50">Not specified.</span>
                  ) : (
                    (judge.expertise_areas || []).map((e) => (
                      <Badge
                        key={e}
                        variant="outline"
                        className="border-gold/30 text-gold/90"
                      >
                        {e}
                      </Badge>
                    ))
                  )}
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-gold">Languages</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {(judge.languages || []).length === 0 ? (
                    <span className="text-white/50">Not specified.</span>
                  ) : (
                    (judge.languages || []).map((l) => (
                      <Badge key={l} variant="outline" className="border-white/20 text-white/80">
                        {l}
                      </Badge>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contribution" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-gold">Contribution to NESA-Africa</CardTitle>
                </CardHeader>
                <CardContent>
                  {judge.public_contribution_statement ? (
                    <p className="text-white/85 whitespace-pre-line">
                      {judge.public_contribution_statement}
                    </p>
                  ) : (
                    <p className="text-white/50">No public contribution statement.</p>
                  )}
                  <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
                    <Star className="h-4 w-4 text-gold" />
                    Contribution score: <span className="text-white">{judge.contribution_score ?? 0}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer CTA */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/judgeapply">
                <Gavel className="mr-2 h-4 w-4" /> Apply to be a Judge
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/about/governance">Governance & Integrity</Link>
            </Button>
            <Button asChild variant="ghost" className="text-white/70 hover:text-white">
              <a href="mailto:judges@nesa.africa">
                <Mail className="mr-2 h-4 w-4" /> Contact Jury Office
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
