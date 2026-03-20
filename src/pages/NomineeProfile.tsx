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
  ChevronRight,
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
import { cn } from "@/lib/utils";

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
        icon: <Globe2 className="w-3 h-3 mr-1 flex-shrink-0" />,
        color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
      };
    case "NIGERIA":
      return {
        label: "Nigeria",
        icon: <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />,
        color: "border-orange-500/30 text-orange-400 bg-orange-500/10",
      };
    case "ICON":
      return {
        label: "Lifetime",
        icon: <Trophy className="w-3 h-3 mr-1 flex-shrink-0" />,
        color: "border-purple-500/30 text-purple-400 bg-purple-500/10",
      };
    case "AFRICA_REGIONAL":
    default:
      return {
        label: "Africa Regional",
        icon: <Globe2 className="w-3 h-3 mr-1 flex-shrink-0" />,
        color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      };
  }
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-charcoal">
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-charcoal-light border-gold/20">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-white/10 mx-auto sm:mx-0" />
                  <div className="flex-1 space-y-3 sm:space-y-4 text-center sm:text-left">
                    <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mx-auto sm:mx-0 bg-white/10" />
                    <Skeleton className="h-4 w-40 sm:w-48 mx-auto sm:mx-0 bg-white/10" />
                    <Skeleton className="h-4 w-32 sm:w-36 mx-auto sm:mx-0 bg-white/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4 sm:space-y-6 mt-6 lg:mt-0">
            <Skeleton className="h-40 sm:h-48 w-full bg-white/10" />
            <Skeleton className="h-28 sm:h-32 w-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NomineeProfile() {
  const { id } = useParams<{ id: string }>();
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
      if (!id) return;

      try {
        setLoading(true);
        // You'll need to create this endpoint
        const data = await nominationApi.fetchNomineeProfile(id);
        setNominee(data);

        // Fetch related nominees (same subcategory)
        if (data.subCategoryId) {
          const related = await nominationApi.fetchSubCategoryNominees(
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
  }, [id]);

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
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-full bg-gold/10 flex items-center justify-center">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gold/30" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display text-white mb-2 sm:mb-3">
            Profile Not Available
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mb-4 sm:mb-6">
            {error ||
              "This nominee profile may be under review or the link may be incorrect."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <Button
              asChild
              className="bg-gold hover:bg-gold-dark text-charcoal w-full sm:w-auto"
            >
              <Link to="/nominees">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse Nominees
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 w-full sm:w-auto"
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

  // Truncate long text for mobile
  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

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
        <section className="relative pt-16 sm:pt-20 pb-8 sm:pb-12 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/8 via-transparent to-transparent" />

          <div className="container mx-auto px-3 sm:px-4 relative z-10">
            {/* Breadcrumbs - Hidden on mobile, visible on tablet/desktop */}
            <div className="hidden sm:block">
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
            </div>

            {/* Back Link - Mobile friendly */}
            <Link
              to="/nominees"
              className="inline-flex items-center gap-1 sm:gap-2 text-white/60 hover:text-gold transition-colors mb-4 sm:mb-8 text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Back to Nominees
            </Link>

            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Main Profile Card */}
              <div className="lg:col-span-2">
                <Card className="bg-charcoal-light border-gold/20 overflow-hidden">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Avatar / Logo - Centered on mobile */}
                      <div className="flex-shrink-0 flex justify-center sm:justify-start">
                        <div
                          className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-3 sm:border-4 border-gold/30 overflow-hidden flex items-center justify-center ${
                            nominee.accountType === "ORGANIZATION"
                              ? "bg-white/90 p-2 sm:p-3"
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
                            <span className="text-gold text-xl sm:text-2xl md:text-3xl font-semibold">
                              {getInitials(nominee.fullName)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-2">
                          <Badge
                            className={cn(
                              geoBadge.color,
                              "text-[10px] sm:text-xs py-0.5",
                            )}
                          >
                            {geoBadge.icon}
                            <span className="truncate max-w-[100px] sm:max-w-none">
                              {geoBadge.label}
                            </span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gold/20 text-gold/80 text-[10px] sm:text-xs py-0.5"
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

                        <h1 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white mb-1 sm:mb-2 break-words">
                          {nominee.fullName}
                        </h1>

                        {nominee.impactSummary && (
                          <p className="text-sm sm:text-base text-white/70 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">
                            {nominee.impactSummary}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gold/60 flex-shrink-0" />
                            <span className="truncate max-w-[120px] sm:max-w-none">
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
                            className="text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4 sm:my-6 bg-gold/10" />

                    {/* Category - IMPROVED MOBILE DISPLAY */}
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider mb-2 sm:mb-3">
                        Award Category
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 text-gold bg-gold/5 p-2 sm:p-3 rounded-lg border border-gold/10">
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                            <span className="text-sm sm:text-base font-medium break-words">
                              {nominee.categoryName}
                            </span>
                            {nominee.subCategoryName && (
                              <>
                                <ChevronRight className="hidden sm:block w-4 h-4 text-white/30" />
                                <span className="text-xs sm:text-sm text-white/70 break-words pl-6 sm:pl-0">
                                  {nominee.subCategoryName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mobile subcategory display (alternative layout) */}
                      {nominee.subCategoryName && (
                        <div className="mt-2 sm:hidden">
                          <Badge
                            variant="outline"
                            className="border-gold/20 text-gold/80 text-xs"
                          >
                            Subcategory: {nominee.subCategoryName}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Achievement */}
                    {nominee.achievementDescription && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider mb-2 sm:mb-3">
                          Achievement
                        </h3>
                        <p className="text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-line break-words">
                          {nominee.achievementDescription}
                        </p>
                      </div>
                    )}

                    {/* Voting/Renomination Info - Mobile optimized */}
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black/40 rounded-lg border border-gold/20">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        {isPlatinum ? (
                          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0" />
                        ) : (
                          <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0" />
                        )}
                        <h3 className="font-medium text-white text-sm sm:text-base">
                          {isPlatinum ? "Renomination Status" : "Voting Status"}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-white/60 mb-2">
                        {isPlatinum ? (
                          <>
                            This nominee has received{" "}
                            <span className="text-gold font-semibold">
                              {nominee.nominationCount}
                            </span>{" "}
                            nomination{nominee.nominationCount !== 1 ? "s" : ""}
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
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/40">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            Voting{" "}
                            {votingStage.opensAt
                              ? `opens ${new Date(votingStage.opensAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                              : "season TBA"}
                          </span>
                        </div>
                      )}
                      {isPlatinum && !canRenominate && nominationsStage && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/40">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            Nominations{" "}
                            {nominationsStage.opensAt
                              ? `open until ${new Date(nominationsStage.closesAt!).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                              : "season closed"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Primary Actions - Stack on mobile */}
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                        className="w-full sm:w-auto"
                      />
                    </div>

                    {/* Links */}
                    {(nominee.linkedInProfile || nominee.website) && (
                      <div className="mt-4 sm:mt-6">
                        <h3 className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider mb-2 sm:mb-3">
                          Links
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {nominee.linkedInProfile && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(nominee.linkedInProfile, "_blank")
                              }
                              className="border-gold/30 text-gold hover:bg-gold/10 text-xs sm:text-sm h-8 sm:h-9"
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
                              className="border-gold/30 text-gold hover:bg-gold/10 text-xs sm:text-sm h-8 sm:h-9"
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

              {/* Sidebar - Reorders on mobile */}
              <div className="space-y-4 sm:space-y-6 mt-6 lg:mt-0">
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
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0" />
                      Share This Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
                      Help spread the word about{" "}
                      {nominee.fullName.split(" ")[0]}'s nomination!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare("twitter")}
                        className="border-gold/30 text-gold hover:bg-gold/10 h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Twitter className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare("facebook")}
                        className="border-gold/30 text-gold hover:bg-gold/10 h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare("linkedin")}
                        className="border-gold/30 text-gold hover:bg-gold/10 h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare("copy")}
                        className="border-gold/30 text-gold hover:bg-gold/10 h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Nominate CTA Card */}
                <Card className="bg-charcoal-light border-gold/20">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0" />
                      Know Someone Deserving?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
                    <p className="text-xs sm:text-sm text-white/60">
                      Recognize an education champion who's making a difference
                      in Africa.
                    </p>
                    <Button
                      asChild
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold text-xs sm:text-sm h-9 sm:h-10"
                    >
                      <Link to="/nominate">
                        <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
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
          <section className="py-8 sm:py-12 bg-charcoal">
            <div className="container mx-auto px-3 sm:px-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-display text-white mb-4 sm:mb-6">
                More in {nominee.subCategoryName || nominee.categoryName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
