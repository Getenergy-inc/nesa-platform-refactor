import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Award,
  MapPin,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Trophy,
  Users,
  Globe2,
  Vote,
  RotateCcw,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FollowButton } from "@/components/ui/FollowButton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSeason } from "@/contexts/SeasonContext";

import {
  NomineeCard,
  type NomineeCardData,
} from "@/components/nesa/NomineeCard";
import { RenominateCard } from "@/components/nesa/RenominateCard";
import { NomineeReferralCard } from "@/components/nesa/NomineeReferralCard";
import { NomineeActions } from "@/components/nominees/NomineeActions";
import { Skeleton } from "@/components/ui/skeleton";
import { nominationApi } from "@/api/nomination";

// Types based on your backend response
export interface NomineeProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  country: string;
  stateRegion: string;
  impactSummary: string;
  achievementDescription: string;
  linkedInProfile: string | null;
  website: string | null;
  evidenceUrl: string[];
  accountType: "INDIVIDUAL" | "ORGANIZATION";
  appproved: string;
  category: {
    id: string;
    title: string;
    awardType: string;
    scope: string;
  };
  subCategory: {
    id: string;
    title: string;
  } | null;
  nominationCount: number;
  categoryName: string;
  categoryId: string;
  subCategoryName: string;
  subCategoryId: string;
  categoryAwardType: string;
}

// Helper to determine tier from award type
function getTierFromAwardType(
  awardType: string,
): "platinum" | "blue-garnet" | "gold" | "icon" | "gold-special" {
  switch (awardType) {
    case "PLATINUM_CERTIFICATE":
      return "platinum";
    case "BLUE_GARNET_AND_GOLD_CERTIFICATE":
      return "blue-garnet";
    case "GOLD_CERTIFICATE":
      return "gold";
    case "GOLD_SPECIAL":
      return "gold-special";
    case "AFRICA_ICON_BLUE_GARNET":
      return "icon";
    default:
      return "platinum";
  }
}

// Helper to get geographic badge
function getGeographicBadge(scope: string): {
  label: string;
  icon: React.ReactNode;
  color: string;
} {
  switch (scope) {
    case "INTERNATIONAL":
      return {
        label: "International",
        icon: <Globe2 className="w-3 h-3 mr-1" />,
        color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
      };
    case "NIGERIA":
      return {
        label: "Nigeria",
        icon: <MapPin className="w-3 h-3 mr-1" />,
        color: "border-orange-500/30 text-orange-400 bg-orange-500/10",
      };
    case "ICON":
      return {
        label: "Lifetime",
        icon: <Trophy className="w-3 h-3 mr-1" />,
        color: "border-purple-500/30 text-purple-400 bg-purple-500/10",
      };
    case "AFRICA_REGIONAL":
    default:
      return {
        label: "Africa Regional",
        icon: <Globe2 className="w-3 h-3 mr-1" />,
        color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      };
  }
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-charcoal">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-charcoal-light border-gold/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="w-32 h-32 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-64 bg-white/10" />
                    <Skeleton className="h-4 w-48 bg-white/10" />
                    <Skeleton className="h-4 w-32 bg-white/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full bg-white/10" />
            <Skeleton className="h-32 w-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NomineeProfile() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const {
    isStageOpen,
    currentEdition,
    getStage,
    loading: seasonLoading,
  } = useSeason();

  const [nominee, setNominee] = useState<NomineeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedNominees, setRelatedNominees] = useState<NomineeProfileData[]>(
    [],
  );

  // Fetch nominee data
  useEffect(() => {
    async function fetchNominee() {
      if (!id || !accessToken) return;

      try {
        setLoading(true);
        // You'll need to create this endpoint
        const data = await nominationApi.fetchNomineeProfile(accessToken, id);
        setNominee(data);

        // Fetch related nominees (same subcategory)
        if (data.subCategoryId) {
          const related = await nominationApi.fetchSubCategoryNominees(
            accessToken,
            data.subCategoryId,
          );
          // Filter out current nominee and limit to 4
          const filtered = related
            .filter((n: any) => n.id !== data.id)
            .slice(0, 4);
          setRelatedNominees(filtered);
        }
      } catch (err: any) {
        console.error("Failed to fetch nominee:", err);
        setError(err.message || "Failed to load nominee profile");
      } finally {
        setLoading(false);
      }
    }

    fetchNominee();
  }, [id, accessToken]);

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = nominee
      ? `Check out ${nominee.fullName} - nominated for the NESA Africa Awards! 🏆`
      : "NESA Africa Awards";

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading || seasonLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !nominee) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gold/10 flex items-center justify-center">
            <Users className="w-10 h-10 text-gold/30" />
          </div>
          <h1 className="text-2xl font-display text-white mb-3">
            Profile Not Available
          </h1>
          <p className="text-white/50 text-sm mb-6">
            {error ||
              "This nominee profile may be under review or the link may be incorrect."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-gold hover:bg-gold-dark text-charcoal"
            >
              <Link to="/nominees">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse Nominees
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              <Link to="/nominate">Nominate Someone</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tier = getTierFromAwardType(nominee.categoryAwardType);
  const geoBadge = getGeographicBadge(nominee.category.scope);
  const isPlatinum = tier === "platinum";

  // Check if voting is active using the season context
  const isVotingActive = isStageOpen("public_voting");

  // Check if nominations are active (for renomination)
  const isNominationsActive = isStageOpen("nominations");

  // Blue Garnet and Gold tiers can vote when voting is active
  const canVote = (tier === "blue-garnet" || tier === "gold") && isVotingActive;

  // Only Platinum tier can be renominated, and only when nominations are active
  const canRenominate = isPlatinum && isNominationsActive;

  // Get voting stage details for display
  const votingStage = getStage("public_voting");
  const nominationsStage = getStage("nominations");

  return (
    <>
      <Helmet>
        <title>{nominee.fullName} | NESA-Africa Nominee</title>
        <meta
          name="description"
          content={`${nominee.fullName} - Nominated for ${nominee.categoryName}. Support this NESA-Africa nominee.`}
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative pt-20 pb-12 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/8 via-transparent to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { label: "Nominees", href: "/nominees" },
                {
                  label: nominee.categoryName,
                  href: `/categories/${nominee.categoryId}`,
                },
                { label: nominee.fullName },
              ]}
              className="mb-6 text-white/60"
            />

            {/* Back Link */}
            <Link
              to="/nominees"
              className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors mb-8"
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
                        <div
                          className={`relative w-32 h-32 rounded-full border-4 border-gold/30 overflow-hidden flex items-center justify-center ${
                            nominee.accountType === "ORGANIZATION"
                              ? "bg-white/90 p-3"
                              : "bg-gold/20"
                          }`}
                        >
                          {nominee.profileImage ? (
                            <img
                              src={nominee.profileImage}
                              alt={nominee.fullName}
                              className={
                                nominee.accountType === "ORGANIZATION"
                                  ? "object-contain max-h-full max-w-full"
                                  : "object-cover w-full h-full"
                              }
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <span className="text-gold text-3xl font-semibold">
                              {getInitials(nominee.fullName)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={geoBadge.color}>
                            {geoBadge.icon}
                            {geoBadge.label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gold/20 text-gold/80"
                          >
                            {tier === "platinum"
                              ? "Platinum"
                              : tier === "blue-garnet"
                                ? "Blue Garnet"
                                : tier === "gold"
                                  ? "Gold"
                                  : tier === "gold-special"
                                    ? "Gold Special"
                                    : "Lifetime"}
                          </Badge>
                        </div>

                        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-white mb-2">
                          {nominee.fullName}
                        </h1>

                        {nominee.impactSummary && (
                          <p className="text-lg text-white/70 mb-3">
                            {nominee.impactSummary}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gold/60" />
                            <span>
                              {nominee.country}
                              {nominee.stateRegion
                                ? `, ${nominee.stateRegion}`
                                : ""}
                            </span>
                          </div>
                          <FollowButton
                            item={{
                              id: nominee.id,
                              slug: nominee.id,
                              name: nominee.fullName,
                              type: "nominee",
                              imageUrl: nominee.profileImage,
                              subtitle: nominee.categoryName,
                            }}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6 bg-gold/10" />

                    {/* Category */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">
                        Award Category
                      </h3>
                      <div className="inline-flex items-center gap-2 text-gold">
                        <Trophy className="w-5 h-5" />
                        <span className="text-lg font-medium">
                          {nominee.categoryName}
                        </span>
                        {nominee.subCategoryName && (
                          <>
                            <span className="text-white/50">—</span>
                            <span className="text-white/70">
                              {nominee.subCategoryName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Achievement */}
                    {nominee.achievementDescription && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                          Achievement
                        </h3>
                        <p className="text-white/80 leading-relaxed whitespace-pre-line">
                          {nominee.achievementDescription}
                        </p>
                      </div>
                    )}

                    {/* Voting/Renomination Info */}
                    <div className="mt-6 p-4 bg-black/40 rounded-lg border border-gold/20">
                      <div className="flex items-center gap-3 mb-3">
                        {isPlatinum ? (
                          <RotateCcw className="w-5 h-5 text-gold" />
                        ) : (
                          <Vote className="w-5 h-5 text-gold" />
                        )}
                        <h3 className="font-medium text-white">
                          {isPlatinum ? "Renomination Status" : "Voting Status"}
                        </h3>
                      </div>
                      <p className="text-sm text-white/60 mb-2">
                        {isPlatinum ? (
                          <>
                            This nominee has received{" "}
                            <span className="text-gold font-semibold">
                              {nominee.nominationCount}
                            </span>{" "}
                            nominations
                          </>
                        ) : canVote ? (
                          <>
                            Voting is currently{" "}
                            <span className="text-green-400 font-semibold">
                              active
                            </span>{" "}
                            for this category
                          </>
                        ) : (
                          <>
                            Voting for this category is currently{" "}
                            <span className="text-amber-400 font-semibold">
                              inactive
                            </span>
                          </>
                        )}
                      </p>
                      {!isPlatinum && !canVote && votingStage && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Voting{" "}
                            {votingStage.opensAt
                              ? `opens ${new Date(votingStage.opensAt).toLocaleDateString()}`
                              : "season TBA"}
                          </span>
                        </div>
                      )}
                      {isPlatinum && !canRenominate && nominationsStage && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Nominations{" "}
                            {nominationsStage.opensAt
                              ? `open until ${new Date(nominationsStage.closesAt!).toLocaleDateString()}`
                              : "season closed"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Primary Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <NomineeActions
                        nominee={{
                          nomineeId: nominee.id,
                          nomineeSlug: nominee.id,
                          nomineeName: nominee.fullName,
                          awardSlug: nominee.categoryId,
                          awardTitle: nominee.categoryName,
                          subcategorySlug: nominee.subCategoryId,
                          subcategoryTitle: nominee.subCategoryName,
                          groupSlug: nominee.category.scope,
                          groupName: nominee.stateRegion,
                          country: nominee.country,
                          renominationCount: nominee.nominationCount,
                        }}
                        showVote={!isPlatinum && canVote}
                        showRenominate={isPlatinum && canRenominate}
                        onRenominateSuccess={() => {
                          setNominee((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  nominationCount: prev.nominationCount + 1,
                                }
                              : null,
                          );
                        }}
                      />
                    </div>

                    {/* Links */}
                    {(nominee.linkedInProfile || nominee.website) && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                          Links
                        </h3>
                        <div className="flex gap-3">
                          {nominee.linkedInProfile && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(nominee.linkedInProfile, "_blank")
                              }
                              className="border-gold/30 text-gold hover:bg-gold/10"
                            >
                              LinkedIn
                            </Button>
                          )}
                          {nominee.website && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(nominee.website, "_blank")
                              }
                              className="border-gold/30 text-gold hover:bg-gold/10"
                            >
                              Website
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Referral Card */}
                <NomineeReferralCard
                  nomineeName={nominee.fullName}
                  nomineeSlug={nominee.id}
                />

                {/* Renominate Card - Only for Platinum and when nominations are active */}
                {isPlatinum && canRenominate && (
                  <RenominateCard
                    nomineeId={nominee.id}
                    nomineeName={nominee.fullName}
                    initialRenominationCount={nominee.nominationCount}
                  />
                )}

                {/* Share Card */}
                <Card className="bg-charcoal-light border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-gold" />
                      Share This Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/60 mb-4">
                      Help spread the word about{" "}
                      {nominee.fullName.split(" ")[0]}'s nomination!
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
                    <CardTitle className="text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-gold" />
                      Know Someone Deserving?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-white/60">
                      Recognize an education champion who's making a difference
                      in Africa.
                    </p>
                    <Button
                      asChild
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                    >
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
              <h2 className="text-2xl font-display text-white mb-6">
                More in {nominee.subCategoryName || nominee.categoryName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedNominees.map((related) => {
                  const cardData: NomineeCardData = {
                    id: related.id,
                    name: related.fullName,
                    slug: related.id,
                    title: related.impactSummary || undefined,
                    photoUrl: related.profileImage || "/placeholder.svg",
                    isPlatinum:
                      getTierFromAwardType(related.categoryAwardType) ===
                      "platinum",
                    publicVotes: related.nominationCount,
                    categoryName: related.categoryName,
                    subcategoryName: related.subCategoryName,
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
