import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, MapPin, Globe2, Award, Share2, BookOpen, Target, Building2, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getMasterNomineeBySlug, getAllMasterNominees, type MasterNominee } from "@/lib/nomineeMasterData";
import { NomineeWorkflowStatusBadge } from "@/components/nominees/NomineeWorkflowStatus";
import { NomineeStoryCard } from "@/components/nominees/NomineeStoryCard";

function isOrg(name: string): boolean {
  const orgKeywords = ["bank", "group", "foundation", "university", "church", "association", "network", "company", "ltd", "plc", "state", "institute", "academy", "school", "college", "polytechnic", "library", "fund", "trust", "society", "ministry", "agency", "board"];
  return orgKeywords.some(kw => name.toLowerCase().includes(kw));
}

function getInitials(name: string): string {
  return name.split(/[\s-]+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function generateStory(nominee: MasterNominee): string {
  const base = nominee.achievement || "Contributing to the advancement of education across Africa.";
  const parts = [
    `${nominee.name} stands as a testament to the transformative power of education in Africa.`,
    base,
    nominee.region !== "N/A" ? `Operating within the ${nominee.region} region, their work has created lasting impact on educational outcomes.` : "",
    nominee.country ? `Based in ${nominee.country}, they have demonstrated exceptional commitment to education for all.` : "",
    `Their contributions align with the NESA Africa mission of recognizing and elevating education standards across the continent.`,
  ].filter(Boolean);
  return parts.join(" ");
}

export default function MasterNomineeProfile() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ? decodeURIComponent(rawSlug) : undefined;

  const nominee = useMemo(() => {
    if (!slug) return undefined;
    return getMasterNomineeBySlug(slug);
  }, [slug]);

  const relatedNominees = useMemo(() => {
    if (!nominee) return [];
    return getAllMasterNominees()
      .filter(n => n.id !== nominee.id && n.categorySlug === nominee.categorySlug)
      .slice(0, 4);
  }, [nominee]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (!nominee) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
            <Award className="w-8 h-8 text-gold/30" />
          </div>
          <h1 className="text-xl font-display text-ivory mb-2">Nominee Not Found</h1>
          <p className="text-ivory/40 text-sm mb-4">This profile may be under review or the link is incorrect.</p>
          <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
            <Link to="/directory"><ArrowLeft className="w-4 h-4 mr-2" /> Browse Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  const org = isOrg(nominee.name);
  const story = generateStory(nominee);

  return (
    <>
      <Helmet>
        <title>{nominee.name} | NESA Africa Nominee</title>
        <meta name="description" content={`${nominee.name} — Nominated for ${nominee.category}. ${nominee.achievement?.slice(0, 120)}`} />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <div className="relative border-b border-gold/10">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
          <div className="container mx-auto px-4 py-8 md:py-12 relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-ivory/40 text-xs mb-6">
              <Link to="/directory" className="hover:text-gold transition-colors">Directory</Link>
              <span>/</span>
              <span className="text-ivory/60">{nominee.name}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-charcoal-light border border-gold/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {nominee.imageUrl && nominee.imageUrl !== "/images/placeholder.svg" ? (
                  <img src={nominee.imageUrl} alt={nominee.name} className={`w-full h-full ${org ? "object-contain p-4" : "object-cover"}`} />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {org ? (
                      <Building2 className="w-12 h-12 text-gold/30" />
                    ) : (
                      <span className="text-gold/50 font-display text-3xl">{getInitials(nominee.name)}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display text-ivory font-bold">{nominee.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {nominee.country && (
                        <div className="flex items-center gap-1 text-ivory/50 text-sm">
                          <MapPin className="w-3.5 h-3.5" />
                          {nominee.country}{nominee.state ? `, ${nominee.state}` : ""}
                        </div>
                      )}
                      {nominee.region !== "N/A" && (
                        <div className="flex items-center gap-1 text-ivory/50 text-sm">
                          <Globe2 className="w-3.5 h-3.5" />
                          {nominee.region}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare} className="border-gold/20 text-gold hover:bg-gold/10">
                    <Share2 className="w-4 h-4 mr-1.5" /> Share
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gold/10 text-gold border-0">{nominee.pathway}</Badge>
                  <Badge variant="outline" className="border-gold/15 text-ivory/50 text-xs">
                    {nominee.category.length > 60 ? nominee.category.slice(0, 60) + "…" : nominee.category}
                  </Badge>
                </div>

                <NomineeWorkflowStatusBadge status={nominee.workflowStatus} showSteps />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Story Section */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-gold" />
                    <h2 className="text-lg font-display text-ivory font-semibold">Contribution to African Education</h2>
                  </div>
                  <p className="text-ivory/60 leading-relaxed text-sm">{story}</p>
                </CardContent>
              </Card>

              {/* Category & Subcategory */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-gold" />
                    <h2 className="text-lg font-display text-ivory font-semibold">Award Category</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-ivory/40 text-xs uppercase tracking-wider">Main Category</span>
                      <p className="text-ivory/80 text-sm mt-1">{nominee.category}</p>
                    </div>
                    <Separator className="bg-gold/10" />
                    <div>
                      <span className="text-ivory/40 text-xs uppercase tracking-wider">Subcategory</span>
                      <p className="text-ivory/80 text-sm mt-1">{nominee.subcategory}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-medium">
                  <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}`}>
                    <Award className="w-4 h-4 mr-2" /> Nominate
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}&renominate=true`}>
                    Re-Nominate
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to={`/vote?nominee=${encodeURIComponent(nominee.name)}`}>
                    Vote
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-sm font-display text-ivory/70 font-medium">Quick Info</h3>
                  {[
                    { label: "Nominee ID", value: `#${nominee.id}` },
                    { label: "Pathway", value: nominee.pathway },
                    { label: "Region", value: nominee.region },
                    { label: "Country", value: nominee.country || "N/A" },
                    { label: "Year", value: String(nominee.nominationYear) },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-ivory/40 text-xs">{item.label}</span>
                      <span className="text-ivory/70 text-xs font-medium">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* NRC Workflow */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-5">
                  <h3 className="text-sm font-display text-ivory/70 font-medium mb-3">NRC Verification Status</h3>
                  <NomineeWorkflowStatusBadge status={nominee.workflowStatus} showSteps />
                  <p className="text-ivory/30 text-xs mt-3">
                    All nominees undergo automated eligibility screening, documentation verification, and NRC committee review.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Nominees */}
          {relatedNominees.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-display text-ivory font-semibold mb-4">
                Related Nominees in {nominee.category.length > 50 ? nominee.category.slice(0, 50) + "…" : nominee.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedNominees.map(rn => (
                  <NomineeStoryCard key={rn.id} nominee={rn} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
