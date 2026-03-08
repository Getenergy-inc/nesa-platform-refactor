import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, MapPin, Globe2, Award, Share2, BookOpen, Target, Building2, ThumbsUp, RotateCcw, Calendar, Shield, FileCheck, Sparkles, Quote, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getMasterNomineeBySlug, getAllMasterNominees, type MasterNominee, WORKFLOW_STATUS_CONFIG } from "@/lib/nomineeMasterData";
import { NomineeWorkflowStatusBadge } from "@/components/nominees/NomineeWorkflowStatus";
import { NomineeStoryCard } from "@/components/nominees/NomineeStoryCard";
import { NomineeEDIScores } from "@/components/nominees/NomineeEDIScores";
import { generateEnhancedBiography } from "@/lib/nomineeStoryGenerator";

function isOrg(name: string): boolean {
  const orgKeywords = ["bank", "group", "foundation", "university", "church", "association", "network", "company", "ltd", "plc", "state", "institute", "academy", "school", "college", "polytechnic", "library", "fund", "trust", "society", "ministry", "agency", "board", "hospital", "council", "ngo"];
  return orgKeywords.some(kw => name.toLowerCase().includes(kw));
}

function getInitials(name: string): string {
  return name.split(/[\s-]+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function MasterNomineeProfile() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ? decodeURIComponent(rawSlug) : undefined;

  const nominee = useMemo(() => slug ? getMasterNomineeBySlug(slug) : undefined, [slug]);
  const bio = useMemo(() => nominee ? generateEnhancedBiography(nominee) : null, [nominee]);

  const relatedNominees = useMemo(() => {
    if (!nominee) return [];
    return getAllMasterNominees()
      .filter(n => n.id !== nominee.id && n.categorySlug === nominee.categorySlug)
      .slice(0, 4);
  }, [nominee]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    } catch { toast.error("Failed to copy link"); }
  };

  if (!nominee || !bio) {
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
  const workflowConfig = WORKFLOW_STATUS_CONFIG[nominee.workflowStatus];

  return (
    <>
      <Helmet>
        <title>{nominee.name} — 2025 NESA Africa Nominee</title>
        <meta name="description" content={`${nominee.name} — Nominated for ${nominee.subcategory}. ${nominee.achievement?.slice(0, 120)}`} />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <div className="relative border-b border-gold/10">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
          <div className="container mx-auto px-4 py-8 md:py-12 relative">
            <div className="flex items-center gap-2 text-ivory/40 text-xs mb-6">
              <Link to="/directory" className="hover:text-gold transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Directory
              </Link>
              <span>/</span>
              <span className="text-ivory/60 truncate max-w-[200px]">{nominee.name}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-charcoal-light border-2 border-gold/15 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl shadow-black/20">
                {nominee.imageUrl && !nominee.imageUrl.includes("placeholder") ? (
                  <img src={nominee.imageUrl} alt={nominee.name} className={`w-full h-full ${org ? "object-contain p-4" : "object-cover"}`} loading="lazy" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {org ? <Building2 className="w-14 h-14 text-gold/25" /> : <span className="text-gold/40 font-display text-4xl">{getInitials(nominee.name)}</span>}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-display text-ivory font-bold tracking-tight">{nominee.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {nominee.country && (
                        <div className="flex items-center gap-1 text-ivory/50 text-sm">
                          <MapPin className="w-3.5 h-3.5" />{nominee.country}{nominee.state ? `, ${nominee.state}` : ""}
                        </div>
                      )}
                      {nominee.region !== "N/A" && (
                        <div className="flex items-center gap-1 text-ivory/50 text-sm">
                          <Globe2 className="w-3.5 h-3.5" />{nominee.region}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-ivory/50 text-sm">
                        <Calendar className="w-3.5 h-3.5" />2025 Season
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare} className="border-gold/20 text-gold hover:bg-gold/10">
                    <Share2 className="w-4 h-4 mr-1.5" /> Share
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gold/10 text-gold border-0">{nominee.pathway}</Badge>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 text-xs">Existing Nominee</Badge>
                  <Badge variant="outline" className="border-gold/15 text-ivory/50 text-xs">
                    {nominee.category.length > 55 ? nominee.category.slice(0, 55) + "…" : nominee.category}
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
            <div className="lg:col-span-2 space-y-6">
              {/* Recognition Citation */}
              <Card className="bg-gradient-to-br from-gold/5 to-transparent border-gold/15">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Quote className="w-8 h-8 text-gold/30 flex-shrink-0 mt-1" />
                    <p className="text-ivory/70 text-sm leading-relaxed italic">
                      {bio.recognitionCitation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contribution Narrative */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-gold" />
                    <h2 className="text-lg font-display text-ivory font-semibold">{bio.contributionNarrative.title}</h2>
                  </div>
                  <div className="space-y-4">
                    {bio.contributionNarrative.paragraphs.map((p, i) => (
                      <p key={i} className="text-ivory/60 leading-relaxed text-sm">{p}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Impact Highlights */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <h2 className="text-lg font-display text-ivory font-semibold">Key Impact Highlights</h2>
                  </div>
                  <ul className="space-y-3">
                    {bio.impactHighlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-ivory/60 text-sm leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Institutional Significance */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-gold" />
                    <h2 className="text-lg font-display text-ivory font-semibold">Institutional Significance</h2>
                  </div>
                  <div className="space-y-4">
                    {bio.institutionalSignificance.map((s, i) => (
                      <p key={i} className="text-ivory/60 text-sm leading-relaxed">{s}</p>
                    ))}
                  </div>
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

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 p-6 bg-charcoal-light/30 rounded-xl border border-gold/10">
                <div className="w-full mb-2">
                  <h3 className="text-sm font-display text-ivory/70 font-medium">Nominee Actions</h3>
                  <p className="text-ivory/30 text-xs mt-0.5">Support this nominee through voting or re-nomination</p>
                </div>
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-medium">
                  <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}`}>
                    <Award className="w-4 h-4 mr-2" /> Nominate
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}&renominate=true`}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Re-Nominate
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to={`/vote?nominee=${encodeURIComponent(nominee.name)}`}>
                    <ThumbsUp className="w-4 h-4 mr-2" /> Vote
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-sm font-display text-ivory/70 font-medium">Nominee Details</h3>
                  {[
                    { label: "Nominee ID", value: bio.overview.nomineeId },
                    { label: "Pathway", value: nominee.pathway },
                    { label: "Region", value: nominee.region },
                    { label: "Country", value: nominee.country || "N/A" },
                    { label: "Season", value: "2025" },
                    { label: "Status", value: "Existing Nominee" },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-ivory/40 text-xs">{item.label}</span>
                      <span className="text-ivory/70 text-xs font-medium">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* EDI Scores */}
              <NomineeEDIScores
                nomineeId={nominee.id}
                achievement={nominee.achievement}
                category={nominee.category}
              />

              {/* NRC Workflow */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-gold" />
                    <h3 className="text-sm font-display text-ivory/70 font-medium">NRC Verification Pipeline</h3>
                  </div>
                  <NomineeWorkflowStatusBadge status={nominee.workflowStatus} showSteps />
                  <div className="mt-4 p-3 bg-charcoal/50 rounded-lg border border-gold/5">
                    <p className="text-ivory/40 text-xs leading-relaxed">
                      <strong className="text-ivory/60">Current Stage:</strong> {workflowConfig.description}
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {Object.entries(WORKFLOW_STATUS_CONFIG)
                      .filter(([key]) => key !== "rejected")
                      .map(([key, config]) => (
                        <div key={key} className="flex items-center gap-2">
                          <FileCheck className={`w-3 h-3 ${config.step <= workflowConfig.step ? "text-emerald-400" : "text-ivory/20"}`} />
                          <span className={`text-xs ${config.step <= workflowConfig.step ? "text-ivory/60" : "text-ivory/25"}`}>
                            {config.label}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Re-nomination CTA */}
              <Card className="bg-gradient-to-br from-gold/5 to-transparent border-gold/15">
                <CardContent className="p-5 text-center">
                  <RotateCcw className="w-8 h-8 text-gold/40 mx-auto mb-3" />
                  <h3 className="text-sm font-display text-ivory/80 font-medium mb-1">Support This Nominee</h3>
                  <p className="text-ivory/40 text-xs mb-4">
                    Re-nomination adds updated evidence and triggers a new NRC review cycle.
                  </p>
                  <Button asChild size="sm" className="bg-gold hover:bg-gold-dark text-charcoal w-full">
                    <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}&renominate=true`}>
                      Re-Nominate with Evidence
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Nominees */}
          {relatedNominees.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-display text-ivory font-semibold mb-4">Related Nominees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedNominees.map(rn => <NomineeStoryCard key={rn.id} nominee={rn} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
