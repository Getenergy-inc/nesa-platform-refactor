import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, Award, MapPin, Share2, Trophy, Users, Globe2,
  Twitter, Facebook, Linkedin, Link2, BookOpen, Sparkles,
  CheckCircle2, TrendingUp, Quote, Calendar, Shield,
  RotateCcw, ThumbsUp, ChevronRight, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  getNomineeBySlug,
  getRelatedNominees,
  handleImageError,
  isOrganization,
  normalizeYearReferences,
  type EnrichedNominee,
} from "@/lib/nesaData";
import { NomineeActions, EnrichedProfileCard } from "@/components/nominees";
import { NomineeImage } from "@/components/shared/NomineeImage";
import { getResolvedNomineeImage } from "@/hooks/useResolvedNomineeImages";
import { getEnrichedProfile } from "@/hooks/useEnrichedProfiles";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { FollowButton } from "@/components/ui/FollowButton";

// --- helpers ---
function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function getLocationDisplay(n: EnrichedNominee): string {
  const parts: string[] = [];
  if (n.state) parts.push(n.state);
  if (n.country) parts.push(n.country);
  if (n.regionName) parts.push(n.regionName);
  return parts.join(", ") || "Africa";
}

function isBlueGarnet(awardTitle: string): boolean {
  return awardTitle.toLowerCase().includes("blue garnet");
}

function getPathwayLabel(geo: string): string {
  switch (geo) {
    case "diaspora": return "Africans in Diaspora";
    case "friends-of-africa": return "Friends of Africa";
    default: return "Africans Living in Africa";
  }
}

// Generate institutional storytelling from achievement text
function generateStory(nominee: EnrichedNominee) {
  const base = nominee.achievement || "Contributing to the advancement of education across Africa.";
  const org = isOrganization(nominee.name);
  const entity = org ? "organization" : "individual";
  const pronoun = org ? "The organization" : "They";
  const possessive = org ? "The organization's" : "Their";

  return {
    citation: `"In recognition of outstanding contributions to education across Africa, ${nominee.name} is nominated under ${normalizeYearReferences(nominee.subcategoryTitle)} for ${possessive.toLowerCase()} sustained impact on learning outcomes, educational access, and institutional capacity building."`,
    paragraphs: [
      `${nominee.name} has demonstrated transformative leadership in education, ${base.charAt(0).toLowerCase()}${base.slice(1)}`,
      `${pronoun} ha${org ? "s" : "ve"} addressed critical gaps in ${nominee.country || "Africa"}'s education landscape — from infrastructure development to curriculum innovation — creating measurable improvements that extend far beyond immediate beneficiaries.`,
      `Nominated under "${normalizeYearReferences(nominee.subcategoryTitle)}" within "${normalizeYearReferences(nominee.awardTitle)}", ${nominee.name} exemplifies the caliber of ${entity}s that NESA Africa celebrates: those whose contributions create sustainable improvements in educational access, quality, and outcomes across the continent.`,
    ],
    highlights: [
      "Demonstrated measurable impact on educational outcomes",
      "Addressed critical access gaps in underserved communities",
      "Contributed to institutional capacity building",
      "Advanced innovation in pedagogy and curriculum",
      "Created sustainable, scalable educational models",
    ],
    significance: [
      `${possessive} work represents the kind of sustained, evidence-based commitment to education that transforms communities and nations. The nomination reflects recognition by peers and stakeholders of real, tangible impact.`,
      `As Africa continues to address its education challenges, ${entity}s like ${nominee.name.split(" ")[0]} serve as beacons of what is possible when dedication meets innovation in the pursuit of educational excellence for all.`,
    ],
  };
}

export default function NomineeProfile() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const [dbNomineeId, setDbNomineeId] = useState<string | null>(null);
  const [renominationCount, setRenominationCount] = useState(0);
  const { addToRecentlyViewed } = useRecentlyViewed();

  const slug = rawSlug ? decodeURIComponent(rawSlug) : undefined;

  const nominee = useMemo(() => {
    if (!slug) return undefined;
    return getNomineeBySlug(slug);
  }, [slug]);

  useEffect(() => {
    if (nominee) {
      addToRecentlyViewed({
        id: nominee.id,
        slug: nominee.slug,
        name: nominee.name,
        type: "nominee",
        imageUrl: nominee.imageUrl,
        subtitle: nominee.awardTitle,
      });
    }
  }, [nominee?.id]);

  useEffect(() => {
    async function fetchOrCreateNomineeData() {
      if (!nominee) return;
      const nameSlug = nominee.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
      const { data } = await (supabase as any)
        .from("public_nominees")
        .select("id, renomination_count")
        .or(`slug.eq.${slug},slug.eq.${nameSlug}`)
        .maybeSingle();
      if (data) {
        setDbNomineeId(data.id);
        setRenominationCount(data.renomination_count ?? 0);
        return;
      }
      try {
        const { ensureNomineeInDb } = await import("@/lib/ensureNomineeInDb");
        const created = await ensureNomineeInDb(nominee);
        if (created) {
          setDbNomineeId(created.id);
          setRenominationCount(created.renomination_count ?? 0);
        }
      } catch (err) {
        console.warn("Could not auto-create nominee in DB:", err);
      }
    }
    fetchOrCreateNomineeData();
  }, [slug, nominee]);

  const relatedNominees = useMemo(() => {
    if (!nominee) return [];
    return getRelatedNominees(nominee, 4);
  }, [nominee]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = nominee ? `Check out ${nominee.name} – nominated for the NESA Africa Awards! 🏆` : "NESA Africa Awards";

  const handleShare = async (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };
    if (platform === "copy") {
      try { await navigator.clipboard.writeText(shareUrl); toast.success("Link copied!"); }
      catch { toast.error("Failed to copy link"); }
      return;
    }
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  // --- 404 ---
  if (!nominee) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gold/10 flex items-center justify-center">
            <Users className="w-10 h-10 text-gold/30" />
          </div>
          <h1 className="text-2xl font-display text-ivory mb-3">Profile Not Available</h1>
          <p className="text-ivory/50 text-sm mb-6">This nominee profile may be under review or the link may be incorrect.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
              <Link to="/nominees"><ArrowLeft className="w-4 h-4 mr-2" />Browse Nominees</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
              <Link to="/nominate">Nominate Someone</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const resolved = getResolvedNomineeImage(nominee.slug, nominee.name, nominee.imageUrl);
  const isLogo = resolved.kind === "organization";
  const story = generateStory(nominee);
  const enrichedProfile = getEnrichedProfile(nominee.slug);
  const blueGarnet = isBlueGarnet(nominee.awardTitle);
  const pathway = getPathwayLabel(nominee.geographicCategory);

  return (
    <>
      <Helmet>
        <title>{nominee.name} | NESA-Africa Nominee</title>
        <meta name="description" content={`${nominee.name} – Nominated for ${nominee.awardTitle} in ${nominee.subcategoryTitle}. Explore their impact on African education.`} />
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
              <Link to="/nominees" className="hover:text-gold transition-colors">Nominees</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to={`/categories/${nominee.awardSlug}`} className="hover:text-gold transition-colors truncate max-w-[180px]">
                {normalizeYearReferences(nominee.awardTitle)}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-ivory/60 truncate max-w-[180px]">{nominee.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image */}
              <div className={`flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-2xl border-2 border-gold/20 overflow-hidden flex items-center justify-center shadow-2xl shadow-black/30 ${isLogo ? "bg-white/90 p-4" : "bg-gold/10"}`}>
                {resolved.imageUrl && resolved.source !== "fallback" ? (
                  <img
                    src={resolved.imageUrl}
                    alt={`${nominee.name} ${isLogo ? "logo" : "photo"}`}
                    className={isLogo ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full"}
                    onError={handleImageError}
                    loading="eager"
                  />
                ) : (
                  <span className="text-gold text-4xl font-display font-semibold">{getInitials(nominee.name)}</span>
                )}
              </div>

              {/* Hero Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-ivory font-bold tracking-tight leading-tight">
                      {normalizeYearReferences(nominee.name)}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-ivory/50">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gold/50" />
                        <span>{getLocationDisplay(nominee)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gold/50" />
                        <span>2025 Season</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FollowButton
                      item={{ id: nominee.id, slug: nominee.slug, name: normalizeYearReferences(nominee.name), type: "nominee", imageUrl: nominee.imageUrl, subtitle: normalizeYearReferences(nominee.awardTitle) }}
                      size="sm"
                    />
                    <Button variant="outline" size="sm" onClick={() => handleShare("copy")} className="border-gold/20 text-gold hover:bg-gold/10">
                      <Share2 className="w-4 h-4 mr-1.5" />Share
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gold/15 text-gold border-0 font-medium">{pathway}</Badge>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-400">Existing Nominee</Badge>
                  {blueGarnet && (
                    <Badge className="bg-blue-600/20 text-blue-400 border-0">
                      <ThumbsUp className="w-3 h-3 mr-1" />Voting Open
                    </Badge>
                  )}
                  {renominationCount > 0 && (
                    <Badge variant="outline" className="border-gold/20 text-gold/70">
                      <RotateCcw className="w-3 h-3 mr-1" />{renominationCount} Re-nomination{renominationCount > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                {/* Quick Achievement */}
                {nominee.achievement && (
                  <p className="text-ivory/60 text-sm md:text-base leading-relaxed max-w-2xl">
                    {normalizeYearReferences(nominee.achievement)}
                  </p>
                )}

                {/* Primary Actions */}
                {dbNomineeId && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    <NomineeActions
                      nominee={{
                        nomineeId: dbNomineeId,
                        nomineeSlug: nominee.slug,
                        nomineeName: nominee.name,
                        awardSlug: nominee.awardSlug,
                        awardTitle: nominee.awardTitle,
                        subcategorySlug: nominee.subcategorySlug,
                        subcategoryTitle: nominee.subcategoryTitle,
                        groupSlug: nominee.geographicCategory,
                        groupName: nominee.regionName,
                        country: nominee.country,
                        renominationCount,
                      }}
                      showVote={blueGarnet}
                      onRenominateSuccess={() => setRenominationCount(c => c + 1)}
                    />
                    <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-medium">
                      <Link to={`/nominate?category=${nominee.awardSlug}&subcategory=${nominee.subcategorySlug}`}>
                        <Award className="w-4 h-4 mr-2" />Nominate
                      </Link>
                    </Button>
                  </div>
                )}
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
                    <p className="text-ivory/70 text-sm md:text-base leading-relaxed italic">
                      {story.citation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contribution Summary */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-gold" />
                    </div>
                    <h2 className="text-xl font-display text-ivory font-semibold">Contribution to African Education</h2>
                  </div>
                  <div className="space-y-4">
                    {story.paragraphs.map((p, i) => (
                      <p key={i} className="text-ivory/60 leading-relaxed text-sm md:text-base">{p}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enriched Profile (if approved) */}
              {enrichedProfile && enrichedProfile.status === "approved" && (
                <EnrichedProfileCard profile={enrichedProfile} nomineeName={nominee.name} />
              )}

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
                    {story.highlights.map((h, i) => (
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
                    {story.significance.map((s, i) => (
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
                      <p className="text-ivory/80 text-sm mt-1 font-medium">{normalizeYearReferences(nominee.awardTitle)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-charcoal/50 border border-gold/5">
                      <span className="text-ivory/40 text-xs uppercase tracking-wider">Subcategory</span>
                      <p className="text-ivory/80 text-sm mt-1 font-medium">{normalizeYearReferences(nominee.subcategoryTitle)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-charcoal/50 border border-gold/5">
                      <span className="text-ivory/40 text-xs uppercase tracking-wider">Pathway</span>
                      <p className="text-gold text-sm mt-1 font-medium">{pathway}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Action Bar */}
              <div className="lg:hidden">
                <ActionCTABar
                  nominee={nominee}
                  dbNomineeId={dbNomineeId}
                  blueGarnet={blueGarnet}
                  renominationCount={renominationCount}
                  onRenominateSuccess={() => setRenominationCount(c => c + 1)}
                />
              </div>
            </div>

            {/* ========== SIDEBAR ========== */}
            <div className="space-y-6">
              {/* Nominee Details Card */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-5 space-y-4">
                  <h3 className="text-sm font-display text-ivory/70 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gold" />Nominee Details
                  </h3>
                  {[
                    { label: "Pathway", value: pathway },
                    { label: "Region", value: nominee.regionName || "—" },
                    { label: "Country", value: nominee.country || "—" },
                    { label: "Season", value: "2025" },
                    { label: "Status", value: "Existing Nominee" },
                    { label: "Re-nominations", value: String(renominationCount) },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-ivory/40 text-xs">{item.label}</span>
                      <span className="text-ivory/70 text-xs font-medium">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Desktop Action CTA */}
              <div className="hidden lg:block">
                <ActionCTABar
                  nominee={nominee}
                  dbNomineeId={dbNomineeId}
                  blueGarnet={blueGarnet}
                  renominationCount={renominationCount}
                  onRenominateSuccess={() => setRenominationCount(c => c + 1)}
                />
              </div>

              {/* Share Card */}
              <Card className="bg-charcoal-light/50 border-gold/10">
                <CardContent className="p-5">
                  <h3 className="text-sm font-display text-ivory/70 font-medium mb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-gold" />Share This Profile
                  </h3>
                  <p className="text-xs text-ivory/40 mb-4">Help spread the word about {nominee.name.split(" ")[0]}'s nomination!</p>
                  <div className="flex gap-2">
                    {[
                      { icon: Twitter, platform: "twitter" },
                      { icon: Facebook, platform: "facebook" },
                      { icon: Linkedin, platform: "linkedin" },
                      { icon: Link2, platform: "copy" },
                    ].map(({ icon: Icon, platform }) => (
                      <Button key={platform} variant="outline" size="icon" onClick={() => handleShare(platform)} className="border-gold/20 text-gold hover:bg-gold/10">
                        <Icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Nominate CTA */}
              <Card className="bg-gradient-to-br from-gold/8 to-transparent border-gold/15">
                <CardContent className="p-5 text-center">
                  <Award className="w-10 h-10 text-gold/30 mx-auto mb-3" />
                  <h3 className="text-sm font-display text-ivory/80 font-medium mb-1">Know Someone Deserving?</h3>
                  <p className="text-ivory/40 text-xs mb-4">Recognize an education champion making a difference in Africa.</p>
                  <Button asChild className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                    <Link to="/nominate"><Award className="w-4 h-4 mr-2" />Nominate Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* ========== RELATED NOMINEES ========== */}
        {relatedNominees.length > 0 && (
          <section className="border-t border-gold/10 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display text-ivory font-semibold">
                  More in {normalizeYearReferences(nominee.subcategoryTitle)}
                </h2>
                <Button asChild variant="outline" size="sm" className="border-gold/20 text-gold hover:bg-gold/10">
                  <Link to="/nominees">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedNominees.map(related => {
                  const relImg = getResolvedNomineeImage(related.slug, related.name, related.imageUrl);
                  const relIsLogo = relImg.kind === "organization";
                  return (
                    <Link key={related.id} to={`/nominees/${encodeURIComponent(related.slug)}`} className="group">
                      <Card className="bg-charcoal-light/50 border-gold/10 hover:border-gold/30 transition-all overflow-hidden h-full">
                        <CardContent className="p-0">
                          {/* Image */}
                          <div className={`w-full h-40 flex items-center justify-center overflow-hidden ${relIsLogo ? "bg-white/90 p-4" : "bg-gold/5"}`}>
                            {relImg.imageUrl && relImg.source !== "fallback" ? (
                              <img src={relImg.imageUrl} alt={related.name} className={relIsLogo ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full"} loading="lazy" />
                            ) : (
                              <span className="text-gold/40 font-display text-2xl">{getInitials(related.name)}</span>
                            )}
                          </div>
                          {/* Info */}
                          <div className="p-4 space-y-2">
                            <h3 className="font-display text-ivory text-sm font-semibold leading-tight group-hover:text-gold transition-colors line-clamp-1">
                              {normalizeYearReferences(related.name)}
                            </h3>
                            {related.country && (
                              <div className="flex items-center gap-1 text-ivory/40 text-xs">
                                <MapPin className="w-3 h-3" />{related.country}
                              </div>
                            )}
                            <p className="text-ivory/50 text-xs leading-relaxed line-clamp-2">
                              {normalizeYearReferences(related.achievement) || "Contributing to education across Africa."}
                            </p>
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

        {/* ========== BOTTOM CTA ========== */}
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
                <Link to="/nominees"><Users className="w-4 h-4 mr-2" />Explore Nominees</Link>
              </Button>
              {blueGarnet && (
                <Button asChild variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  <Link to="/vote"><ThumbsUp className="w-4 h-4 mr-2" />Vote</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ========== ACTION CTA BAR (reused in sidebar + mobile) ========== */
function ActionCTABar({
  nominee,
  dbNomineeId,
  blueGarnet,
  renominationCount,
  onRenominateSuccess,
}: {
  nominee: EnrichedNominee;
  dbNomineeId: string | null;
  blueGarnet: boolean;
  renominationCount: number;
  onRenominateSuccess: () => void;
}) {
  return (
    <Card className="bg-gradient-to-br from-gold/5 to-transparent border-gold/15">
      <CardContent className="p-5 space-y-4">
        <h3 className="text-sm font-display text-ivory/70 font-medium">Nominee Actions</h3>
        <p className="text-ivory/30 text-xs">
          Support this nominee through nomination, re-nomination{blueGarnet ? ", or voting" : ""}.
          {" "}Final confirmation requires sign-in.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full bg-gold hover:bg-gold-dark text-charcoal font-medium">
            <Link to={`/nominate?category=${nominee.awardSlug}&subcategory=${nominee.subcategorySlug}`}>
              <Award className="w-4 h-4 mr-2" />Nominate
            </Link>
          </Button>
          {dbNomineeId && (
            <NomineeActions
              nominee={{
                nomineeId: dbNomineeId,
                nomineeSlug: nominee.slug,
                nomineeName: nominee.name,
                awardSlug: nominee.awardSlug,
                awardTitle: nominee.awardTitle,
                subcategorySlug: nominee.subcategorySlug,
                subcategoryTitle: nominee.subcategoryTitle,
                groupSlug: nominee.geographicCategory,
                groupName: nominee.regionName,
                country: nominee.country,
                renominationCount,
              }}
              showVote={blueGarnet}
              onRenominateSuccess={onRenominateSuccess}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
