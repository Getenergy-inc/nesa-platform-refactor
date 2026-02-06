import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ArrowLeft, Award, MapPin, Share2, 
  Twitter, Facebook, Linkedin, Link2, 
  Trophy, Users, Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FollowButton } from "@/components/ui/FollowButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  getNomineeBySlug, 
  getRelatedNominees, 
  handleImageError,
  isOrganization,
  normalizeYearReferences,
  type EnrichedNominee 
} from "@/lib/nesaData";
import { NomineeCard, type NomineeCardData } from "@/components/nesa/NomineeCard";
import { RenominateCard } from "@/components/nesa/RenominateCard";
import { NomineeReferralCard } from "@/components/nesa/NomineeReferralCard";
import { NomineeActions, EnrichedProfileCard } from "@/components/nominees";
import { getResolvedNomineeImage } from "@/hooks/useResolvedNomineeImages";
import { getEnrichedProfile } from "@/hooks/useEnrichedProfiles";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export default function NomineeProfile() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const [dbNomineeId, setDbNomineeId] = useState<string | null>(null);
  const [renominationCount, setRenominationCount] = useState(0);
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Decode the URL-encoded slug
  const slug = rawSlug ? decodeURIComponent(rawSlug) : undefined;

  // Get nominee from CSV data
  const nominee = useMemo(() => {
    if (!slug) return undefined;
    return getNomineeBySlug(slug);
  }, [slug]);

  // Track recently viewed
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
  }, [nominee?.id]); // Only trigger when nominee ID changes

  // Fetch the actual nominee ID and renomination count from database
  // Note: DB lookup uses name-based slug for compatibility
  useEffect(() => {
    async function fetchNomineeData() {
      if (!nominee) return;
      
      // Try to find by the full unique slug first, then fall back to name-based slug
      const nameSlug = nominee.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      
      const { data } = await supabase
        .from("nominees")
        .select("id, renomination_count")
        .or(`slug.eq.${slug},slug.eq.${nameSlug}`)
        .maybeSingle();
      
      if (data) {
        setDbNomineeId(data.id);
        setRenominationCount(data.renomination_count ?? 0);
      }
    }
    
    fetchNomineeData();
  }, [slug, nominee]);

  // Get related nominees
  const relatedNominees = useMemo(() => {
    if (!nominee) return [];
    return getRelatedNominees(nominee, 4);
  }, [nominee]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = nominee 
    ? `Check out ${nominee.name} - nominated for the NESA Africa Awards! 🏆`
    : "NESA Africa Awards";

  const handleShare = async (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
      }
      return;
    }

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  // Get display location
  const getLocationDisplay = (n: EnrichedNominee): string => {
    const parts: string[] = [];
    if (n.state) parts.push(n.state);
    if (n.country) parts.push(n.country);
    if (n.regionName) parts.push(n.regionName);
    return parts.join(", ") || "Africa";
  };

  // Get geographic badge
  const getGeographicBadge = (category: string): { label: string; icon: React.ReactNode } => {
    switch (category) {
      case "diaspora":
        return { label: "Diaspora", icon: <Globe2 className="w-3 h-3 mr-1" /> };
      case "friends-of-africa":
        return { label: "Friends of Africa", icon: <Globe2 className="w-3 h-3 mr-1" /> };
      default:
        return { label: "Africa", icon: <MapPin className="w-3 h-3 mr-1" /> };
    }
  };

  if (!nominee) {
    return (
      <div className="min-h-screen bg-charcoal">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
              <Users className="w-12 h-12 text-gold/40" />
            </div>
            <h1 className="text-3xl font-display text-ivory mb-4">Profile Not Available</h1>
            <p className="text-ivory/60 mb-4 max-w-md mx-auto">
              This nominee profile may be under review, pending approval, or the link may be incorrect.
            </p>
            <p className="text-ivory/40 text-sm mb-8 max-w-md mx-auto">
              Only approved nominees appear in our public directory. If you believe this is an error, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                <Link to="/nominees">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Browse All Nominees
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <Link to="/nominate">
                  Nominate Someone
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const geoBadge = getGeographicBadge(nominee.geographicCategory);

  return (
    <>
      <Helmet>
        <title>{nominee.name} | NESA-Africa Nominee</title>
        <meta name="description" content={`${nominee.name} - Nominated for ${nominee.awardTitle} in ${nominee.subcategoryTitle}. Vote and support this NESA-Africa nominee.`} />
      </Helmet>
      
      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumbs */}
            <Breadcrumbs 
              items={[
                { label: "Nominees", href: "/nominees" },
                { label: nominee.awardTitle, href: `/categories/${nominee.awardSlug}` },
                { label: nominee.name },
              ]}
              className="mb-6"
            />

            {/* Back Link */}
            <Link 
              to="/nominees" 
              className="inline-flex items-center gap-2 text-ivory/60 hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Nominees
            </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <Card className="bg-charcoal-light border-gold/20">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar / Logo */}
                    <div className="flex-shrink-0">
                    {(() => {
                        // Use resolved image which respects admin overrides
                        const resolved = getResolvedNomineeImage(
                          nominee.slug,
                          nominee.name,
                          nominee.imageUrl
                        );
                        const isLogo = resolved.kind === "organization";
                        const altText = isLogo ? `${nominee.name} logo` : `${nominee.name} photo`;
                        
                        return (
                          <div className={`relative w-32 h-32 rounded-full border-4 border-gold/30 overflow-hidden flex items-center justify-center ${isLogo ? "bg-white/90 p-3" : "bg-gold/20"}`}>
                            {resolved.imageUrl && resolved.source !== "fallback" ? (
                              <img 
                                src={resolved.imageUrl} 
                                alt={altText}
                                className={isLogo ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full"}
                                onError={handleImageError}
                              />
                            ) : (
                              <span className="text-gold text-3xl font-semibold">
                                {getInitials(nominee.name)}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className="bg-gold/20 text-gold border-gold/30">
                          {geoBadge.icon}
                          {geoBadge.label}
                        </Badge>
                        <Badge variant="outline" className="border-gold/20 text-gold/80">
                          {normalizeYearReferences(nominee.awardTitle)}
                        </Badge>
                      </div>

                      <h1 className="font-display text-3xl md:text-4xl text-ivory mb-2">
                        {normalizeYearReferences(nominee.name)}
                      </h1>

                      {nominee.achievement && (
                        <p className="text-lg text-ivory/70 mb-3">{normalizeYearReferences(nominee.achievement)}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-ivory/60">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gold/60" />
                          <span>{getLocationDisplay(nominee)}</span>
                        </div>
                        {/* Follow Button */}
                        <FollowButton
                          item={{
                            id: nominee.id,
                            slug: nominee.slug,
                            name: normalizeYearReferences(nominee.name),
                            type: "nominee",
                            imageUrl: nominee.imageUrl,
                            subtitle: normalizeYearReferences(nominee.awardTitle),
                          }}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6 bg-gold/10" />

                  {/* Category */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-ivory/50 uppercase tracking-wider mb-2">
                      Award Category
                    </h3>
                    <div className="inline-flex items-center gap-2 text-gold">
                      <Trophy className="w-5 h-5" />
                      <span className="text-lg font-medium">
                        {normalizeYearReferences(nominee.awardTitle)}
                      </span>
                      <span className="text-ivory/50">—</span>
                      <span className="text-ivory/70">{normalizeYearReferences(nominee.subcategoryTitle)}</span>
                    </div>
                  </div>

                  {/* Region info if available */}
                  {nominee.regionName && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-ivory/50 uppercase tracking-wider mb-2">
                        Region
                      </h3>
                      <div className="flex items-center gap-2 text-ivory/80">
                        <Globe2 className="w-5 h-5 text-gold/60" />
                        <span>{nominee.regionName}</span>
                      </div>
                    </div>
                  )}

                  {/* Achievement/Bio - only show if no enriched profile */}
                  {nominee.achievement && !getEnrichedProfile(nominee.slug)?.summary_2025 && (
                    <div>
                      <h3 className="text-sm font-medium text-ivory/50 uppercase tracking-wider mb-3">
                        Achievement
                      </h3>
                      <p className="text-ivory/80 leading-relaxed whitespace-pre-line">
                        {normalizeYearReferences(nominee.achievement)}
                      </p>
                    </div>
                  )}
                  
                  {/* Enriched Profile Content */}
                  {(() => {
                    const enrichedProfile = getEnrichedProfile(nominee.slug);
                    if (enrichedProfile && enrichedProfile.status === "approved") {
                      return (
                        <div className="mt-6">
                          <EnrichedProfileCard 
                            profile={enrichedProfile} 
                            nomineeName={nominee.name} 
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
                  {/* Primary Actions - Vote & Renominate */}
                  {dbNomineeId && (
                    <div className="mt-6 flex flex-wrap gap-3">
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
                          renominationCount: renominationCount,
                        }}
                        onRenominateSuccess={() => setRenominationCount(c => c + 1)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Referral Card - Share & Support */}
              <NomineeReferralCard
                nomineeName={nominee.name}
                nomineeSlug={nominee.slug}
              />

              {/* Renominate Card - Primary CTA */}
              {dbNomineeId && (
                <RenominateCard
                  nomineeId={dbNomineeId}
                  nomineeName={nominee.name}
                  initialRenominationCount={renominationCount}
                />
              )}

              {/* Share Card */}
              <Card className="bg-charcoal-light border-gold/20">
                <CardHeader>
                  <CardTitle className="text-ivory flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-gold" />
                    Share This Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ivory/60 mb-4">
                    Help spread the word about {nominee.name.split(" ")[0]}'s nomination!
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("twitter")}
                      className="border-gold/30 text-gold hover:bg-gold/10"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("facebook")}
                      className="border-gold/30 text-gold hover:bg-gold/10"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("linkedin")}
                      className="border-gold/30 text-gold hover:bg-gold/10"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("copy")}
                      className="border-gold/30 text-gold hover:bg-gold/10"
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Nominate CTA Card */}
              <Card className="bg-charcoal-light border-gold/20">
                <CardHeader>
                  <CardTitle className="text-ivory flex items-center gap-2">
                    <Award className="w-5 h-5 text-gold" />
                    Know Someone Deserving?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-ivory/60">
                    Recognize an education champion who's making a difference in Africa.
                  </p>
                  <Button asChild className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                    <Link to="/nominate">
                      <Award className="w-4 h-4 mr-2" />
                      Nominate Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Nominees Section */}
      {relatedNominees.length > 0 && (
        <section className="py-12 bg-charcoal">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display text-ivory mb-6">
              More in {nominee.subcategoryTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedNominees.map((related) => {
                const cardData: NomineeCardData = {
                  id: related.id,
                  name: related.name,
                  slug: related.slug,
                  title: related.achievement || undefined,
                  photoUrl: related.imageUrl,
                  isPlatinum: false,
                  publicVotes: 0,
                  categoryName: related.subcategoryTitle,
                  region: related.regionName,
                  country: related.country,
                };
                return (
                  <NomineeCard 
                    key={related.id} 
                    nominee={cardData}
                    showVotes={false}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  );
}
