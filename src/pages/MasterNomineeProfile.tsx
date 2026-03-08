import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, Award, MapPin, Share2, Globe2, BookOpen, Sparkles,
  CheckCircle2, TrendingUp, Quote, Calendar, Shield, FileCheck,
  Building2, ThumbsUp, RotateCcw, Trophy, ChevronRight, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getMasterNomineeBySlug, getAllMasterNominees, WORKFLOW_STATUS_CONFIG, type MasterNominee } from "@/lib/nomineeMasterData";
import { NomineeWorkflowStatusBadge } from "@/components/nominees/NomineeWorkflowStatus";
import { NomineeEDIScores } from "@/components/nominees/NomineeEDIScores";
import { generateEnhancedBiography } from "@/lib/nomineeStoryGenerator";

function isOrg(name: string): boolean {
  const kw = ["bank","group","foundation","university","church","association","network","company","ltd","plc","state","institute","academy","school","college","polytechnic","library","fund","trust","society","ministry","agency","board","hospital","council","ngo"];
  return kw.some(k => name.toLowerCase().includes(k));
}

function getInitials(name: string): string {
  return name.split(/[\s-]+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function isBlueGarnet(category: string): boolean {
  return category.toLowerCase().includes("blue garnet");
}

export default function MasterNomineeProfile() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ? decodeURIComponent(rawSlug) : undefined;
  const nominee = useMemo(() => slug ? getMasterNomineeBySlug(slug) : undefined, [slug]);
  const bio = useMemo(() => nominee ? generateEnhancedBiography(nominee) : null, [nominee]);

  const relatedNominees = useMemo(() => {
    if (!nominee) return [];
    return getAllMasterNominees().filter(n => n.id !== nominee.id && n.categorySlug === nominee.categorySlug).slice(0, 4);
  }, [nominee]);

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast.success("Profile link copied!"); }
    catch { toast.error("Failed to copy link"); }
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
  const blueGarnet = isBlueGarnet(nominee.category);
  const workflowConfig = WORKFLOW_STATUS_CONFIG[nominee.workflowStatus];

  return (
    <>
      <Helmet>
        <title>{nominee.name} — 2025 NESA Africa Nominee</title>
        <meta name="description" content={`${nominee.name} — Nominated for ${nominee.subcategory}. ${nominee.achievement?.slice(0, 120)}`} />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* ========== HERO ========== */}
        <section className="relative border-b border-gold/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/8 via-transparent to-transparent" />

          <div className="container mx-auto px-4 pt-8 pb-10 md:pt-12 md:pb-14 relative z-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-ivory/40 mb-8 flex-wrap">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/directory" className="hover:text-gold transition-colors">Directory</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-ivory/60 truncate max-w-[200px]">{nominee.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image */}
              <div className={`flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-2xl border-2 border-gold/20 overflow-hidden flex items-center justify-center shadow-2xl shadow-black/30 ${org ? "bg-white/90 p-4" : "bg-gold/10"}`}>
                {nominee.imageUrl && !nominee.imageUrl.includes("placeholder") ? (
                  <img src={nominee.imageUrl} alt={nominee.name} className={`w-full h-full ${org ? "object-contain" : "object-cover"}`} loading="eager" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {org ? <Building2 className="w-14 h-14 text-gold/25" /> : <span className="text-gold/40 font-display text-4xl">{getInitials(nominee.name)}</span>}
                  </div>
                )}
              </div>

              {/* Hero Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-ivory font-bold tracking-tight leading-tight">
                      {nominee.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-ivory/50">
                      {nominee.country && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gold/50" />{nominee.country}{nominee.state ? `, ${nominee.state}` : ""}
                        </div>
                      )}
                      {nominee.region !== "N/A" && (
                        <div className="flex items-center gap-1.5">
                          <Globe2 className="w-4 h-4 text-gold/50" />{nominee.region}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gold/50" />2025 Season
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare} className="border-gold/20 text-gold hover:bg-gold/10">
                    <Share2 className="w-4 h-4 mr-1.5" />Share
                  </Button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gold/15 text-gold border-0 font-medium">{nominee.pathway}</Badge>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-400">Existing Nominee</Badge>
                  {blueGarnet && (
                    <Badge className="bg-blue-600/20 text-blue-400 border-0">
                      <ThumbsUp className="w-3 h-3 mr-1" />Voting Open
                    </Badge>
                  )}
                </div>

                {/* NRC Workflow */}
                <NomineeWorkflowStatusBadge status={nominee.workflowStatus} showSteps />

                {/* Primary Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-medium">
                    <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}`}>
                      <Award className="w-4 h-4 mr-2" />Nominate
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                    <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}&renominate=true`}>
                      <RotateCcw className="w-4 h-4 mr-2" />Re-Nominate
                    </Link>
                  </Button>
                  {blueGarnet && (
                    <Button asChild variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                      <Link to={`/vote?nominee=${encodeURIComponent(nominee.name)}`}>
                        <ThumbsUp className="w-4 h-4 mr-2" />Vote
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== MAIN CONTENT ========== */}
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recognition Citation */}
              <Card className="bg-gradient-to-br from-gold/5 to-transparent border-gold/15">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <Quote className="w-10 h-10 text-gold/25 flex-shrink-0 mt-1" />
                    <p className="text-ivory/70 text-sm md:text-base leading-relaxed italic">{bio.recognitionCitation}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contribution Narrative */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-gold" />
                    </div>
                    <h2 className="text-xl font-display text-ivory font-semibold">{bio.contributionNarrative.title}</h2>
                  </div>
                  <div className="space-y-4">
                    {bio.contributionNarrative.paragraphs.map((p, i) => (
                      <p key={i} className="text-ivory/60 leading-relaxed text-sm md:text-base">{p}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Impact Highlights */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-gold" />
                    </div>
                    <h2 className="text-xl font-display text-ivory font-semibold">Key Impact Highlights</h2>
                  </div>
                  <ul className="space-y-3">
                    {bio.impactHighlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-ivory/60 text-sm leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Institutional Significance */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-gold" />
                    </div>
                    <h2 className="text-xl font-display text-ivory font-semibold">Institutional Significance</h2>
                  </div>
                  <div className="space-y-4">
                    {bio.institutionalSignificance.map((s, i) => (
                      <p key={i} className="text-ivory/60 text-sm leading-relaxed">{s}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category & Pathway */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-gold" />
                    </div>
                    <h2 className="text-xl font-display text-ivory font-semibold">Award Classification</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-charcoal/50 border border-gold/5">
                      <span className="text-ivory/40 text-xs uppercase tracking-wider">Main Category</span>
                      <p className="text-ivory/80 text-sm mt-1 font-medium">{nominee.category}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-charcoal/50 border border-gold/5">
                      <span className="text-ivory/40 text-xs uppercase tracking-wider">Subcategory</span>
                      <p className="text-ivory/80 text-sm mt-1 font-medium">{nominee.subcategory}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-charcoal/50 border border-gold/5">
                      <span className="text-ivory/40 text-xs uppercase tracking-wider">Pathway</span>
                      <p className="text-gold text-sm mt-1 font-medium">{nominee.pathway}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Actions */}
              <div className="lg:hidden">
                <MasterActionCTA nominee={nominee} blueGarnet={blueGarnet} />
              </div>
            </div>

            {/* ========== SIDEBAR ========== */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-sm font-display text-ivory/70 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gold" />Nominee Details
                  </h3>
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
              <NomineeEDIScores nomineeId={nominee.id} achievement={nominee.achievement} category={nominee.category} />

              {/* NRC Pipeline */}
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
                          <span className={`text-xs ${config.step <= workflowConfig.step ? "text-ivory/60" : "text-ivory/25"}`}>{config.label}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Desktop Actions */}
              <div className="hidden lg:block">
                <MasterActionCTA nominee={nominee} blueGarnet={blueGarnet} />
              </div>
            </div>
          </div>
        </div>

        {/* ========== RELATED NOMINEES ========== */}
        {relatedNominees.length > 0 && (
          <section className="border-t border-gold/10 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display text-ivory font-semibold">Related Nominees</h2>
                <Button asChild variant="outline" size="sm" className="border-gold/20 text-gold hover:bg-gold/10">
                  <Link to="/directory">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedNominees.map(rn => {
                  const rnOrg = isOrg(rn.name);
                  return (
                    <Link key={rn.id} to={`/directory/${encodeURIComponent(rn.slug)}`} className="group">
                      <Card className="bg-charcoal-light/50 border-gold/10 hover:border-gold/30 transition-all overflow-hidden h-full">
                        <CardContent className="p-0">
                          <div className={`w-full h-40 flex items-center justify-center overflow-hidden ${rnOrg ? "bg-white/90 p-4" : "bg-gold/5"}`}>
                            {rn.imageUrl && !rn.imageUrl.includes("placeholder") ? (
                              <img src={rn.imageUrl} alt={rn.name} className={`w-full h-full ${rnOrg ? "object-contain" : "object-cover"}`} loading="lazy" />
                            ) : (
                              <span className="text-gold/40 font-display text-2xl">{getInitials(rn.name)}</span>
                            )}
                          </div>
                          <div className="p-4 space-y-2">
                            <h3 className="font-display text-ivory text-sm font-semibold leading-tight group-hover:text-gold transition-colors line-clamp-1">{rn.name}</h3>
                            {rn.country && (
                              <div className="flex items-center gap-1 text-ivory/40 text-xs">
                                <MapPin className="w-3 h-3" />{rn.country}
                              </div>
                            )}
                            <p className="text-ivory/50 text-xs leading-relaxed line-clamp-2">{rn.achievement || "Contributing to education across Africa."}</p>
                            <span className="inline-flex items-center text-gold text-xs font-medium group-hover:translate-x-1 transition-transform">
                              View Profile <ChevronRight className="w-3 h-3 ml-0.5" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="border-t border-gold/10 py-12 bg-gradient-to-b from-charcoal to-charcoal-light/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-display text-ivory mb-3">Support African Education Leaders</h2>
            <p className="text-ivory/50 text-sm max-w-lg mx-auto mb-6">
              You can begin a nomination now. Final confirmation requires sign-up or sign-in.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                <Link to="/nominate"><Award className="w-4 h-4 mr-2" />Nominate</Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <Link to="/directory"><Users className="w-4 h-4 mr-2" />Explore Directory</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ========== ACTION CTA CARD ========== */
function MasterActionCTA({ nominee, blueGarnet }: { nominee: MasterNominee; blueGarnet: boolean }) {
  return (
    <Card className="bg-gradient-to-br from-gold/8 to-transparent border-gold/15">
      <CardContent className="p-5 space-y-4">
        <h3 className="text-sm font-display text-ivory/70 font-medium">Nominee Actions</h3>
        <p className="text-ivory/30 text-xs">
          Support this nominee through nomination, re-nomination{blueGarnet ? ", or voting" : ""}.
          {" "}Final confirmation requires sign-in.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full bg-gold hover:bg-gold-dark text-charcoal font-medium">
            <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}`}>
              <Award className="w-4 h-4 mr-2" />Nominate
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-gold/30 text-gold hover:bg-gold/10">
            <Link to={`/nominate?nominee=${encodeURIComponent(nominee.name)}&renominate=true`}>
              <RotateCcw className="w-4 h-4 mr-2" />Re-Nominate
            </Link>
          </Button>
          {blueGarnet && (
            <Button asChild variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
              <Link to={`/vote?nominee=${encodeURIComponent(nominee.name)}`}>
                <ThumbsUp className="w-4 h-4 mr-2" />Vote
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
