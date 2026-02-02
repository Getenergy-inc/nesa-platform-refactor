import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, Award, Building2, MapPin, Vote, Share2, 
  Twitter, Facebook, Linkedin, Link2, Calendar, Trophy,
  Users, ExternalLink, CheckCircle2, UserPlus, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { renominateNominee } from "@/lib/api";

interface NomineeDetails {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  status: string;
  is_platinum: boolean;
  public_votes: number;
  jury_score: number;
  final_score: number;
  evidence_urls: string[] | null;
  renomination_count: number;
  created_at: string;
  subcategories: {
    name: string;
    slug: string;
    description: string | null;
    categories: {
      id: string;
      name: string;
      slug: string;
    };
    chapters: {
      name: string;
      region: string | null;
      country: string;
    } | null;
  };
  seasons: {
    name: string;
    year: number;
  };
}

export default function NomineeProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRenominating, setIsRenominating] = useState(false);

  const { data: nominee, isLoading, error } = useQuery({
    queryKey: ["nominee", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select(`
          id,
          name,
          slug,
          title,
          organization,
          bio,
          photo_url,
          status,
          is_platinum,
          public_votes,
          jury_score,
          final_score,
          evidence_urls,
          renomination_count,
          created_at,
          subcategories!inner(
            name,
            slug,
            description,
            categories!inner(id, name, slug),
            chapters(name, region, country)
          ),
          seasons!inner(name, year)
        `)
        .eq("slug", slug)
        .in("status", ["approved", "platinum"])
        .maybeSingle();

      if (error) throw error;
      return data as NomineeDetails | null;
    },
    enabled: !!slug,
  });

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
    ? `Vote for ${nominee.name} in the NESA Africa Awards! 🏆`
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

  const handleRenominate = async () => {
    if (!user) {
      toast.error("Please log in to renominate", {
        action: {
          label: "Log In",
          onClick: () => window.location.href = "/auth/login",
        },
      });
      return;
    }

    if (!nominee) return;

    setIsRenominating(true);
    try {
      await renominateNominee(nominee.id, `Renomination from profile page by user ${user.id}`);
      toast.success(`Successfully endorsed ${nominee.name}!`, {
        description: "Your support has been recorded.",
      });
      // Refresh nominee data to show updated count
      queryClient.invalidateQueries({ queryKey: ["nominee", slug] });
    } catch (error: any) {
      if (error.message?.includes("200")) {
        toast.error("Maximum renomination limit reached for this nominee");
      } else {
        toast.error("Failed to renominate", {
          description: error.message || "Please try again later",
        });
      }
    } finally {
      setIsRenominating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal">
        <div className="container mx-auto px-4 py-24">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error || !nominee) {
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

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
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
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <Avatar className="w-32 h-32 border-4 border-gold/30">
                          <AvatarImage src={nominee.photo_url || undefined} alt={nominee.name} />
                          <AvatarFallback className="bg-gold/20 text-gold text-3xl font-semibold">
                            {getInitials(nominee.name)}
                          </AvatarFallback>
                        </Avatar>
                        {nominee.is_platinum && (
                          <div className="absolute -bottom-2 -right-2 bg-gold rounded-full p-2 shadow-lg">
                            <Award className="w-5 h-5 text-charcoal" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {nominee.is_platinum && (
                          <Badge className="bg-gold/20 text-gold border-gold/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Platinum Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-gold/20 text-gold/80">
                          {nominee.seasons.name}
                        </Badge>
                      </div>

                      <h1 className="font-display text-3xl md:text-4xl text-ivory mb-2">
                        {nominee.name}
                      </h1>

                      {nominee.title && (
                        <p className="text-lg text-ivory/70 mb-3">{nominee.title}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-ivory/60">
                        {nominee.organization && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-gold/60" />
                            <span>{nominee.organization}</span>
                          </div>
                        )}
                        {nominee.subcategories?.chapters && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gold/60" />
                            <span>
                              {nominee.subcategories.chapters.country}
                              {nominee.subcategories.chapters.region && `, ${nominee.subcategories.chapters.region} Africa`}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gold/60" />
                          <span>Nominated {new Date(nominee.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6 bg-gold/10" />

                  {/* Category */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-ivory/50 uppercase tracking-wider mb-2">
                      Award Category
                    </h3>
                    <Link 
                      to={`/categories`}
                      className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                    >
                      <Trophy className="w-5 h-5" />
                      <span className="text-lg font-medium">
                        {nominee.subcategories?.categories?.name}
                      </span>
                      <span className="text-ivory/50">—</span>
                      <span className="text-ivory/70">{nominee.subcategories?.name}</span>
                    </Link>
                    {nominee.subcategories?.description && (
                      <p className="text-sm text-ivory/50 mt-2">
                        {nominee.subcategories.description}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  {nominee.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-ivory/50 uppercase tracking-wider mb-3">
                        About
                      </h3>
                      <p className="text-ivory/80 leading-relaxed whitespace-pre-line">
                        {nominee.bio}
                      </p>
                    </div>
                  )}

                  {/* Evidence/Achievements */}
                  {nominee.evidence_urls && nominee.evidence_urls.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-ivory/50 uppercase tracking-wider mb-3">
                        Supporting Evidence
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {nominee.evidence_urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-charcoal rounded-md text-sm text-ivory/70 hover:text-gold hover:bg-charcoal/80 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Evidence {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card className="bg-charcoal-light border-gold/20">
                <CardHeader>
                  <CardTitle className="text-ivory flex items-center gap-2">
                    <Vote className="w-5 h-5 text-gold" />
                    Voting Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-charcoal rounded-lg">
                    <div className="text-4xl font-bold text-gold mb-1">
                      {nominee.public_votes.toLocaleString()}
                    </div>
                    <div className="text-sm text-ivory/60">Public Votes</div>
                  </div>
                  
                  {nominee.jury_score > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-charcoal rounded-lg">
                        <div className="text-2xl font-bold text-ivory">
                          {nominee.jury_score.toFixed(1)}
                        </div>
                        <div className="text-xs text-ivory/50">Jury Score</div>
                      </div>
                      <div className="text-center p-3 bg-charcoal rounded-lg">
                        <div className="text-2xl font-bold text-gold">
                          {nominee.final_score.toFixed(1)}
                        </div>
                        <div className="text-xs text-ivory/50">Final Score</div>
                      </div>
                    </div>
                  )}

                  <Button asChild className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                    <Link to="/vote">
                      <Vote className="w-4 h-4 mr-2" />
                      Vote Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Renominate Card */}
              <Card className="bg-charcoal-light border-gold/20">
                <CardHeader>
                  <CardTitle className="text-ivory flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-gold" />
                    Endorse Nominee
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Renomination Count Display */}
                  <div className="p-4 bg-charcoal rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ivory/60">Endorsements</span>
                      <span className="text-sm font-medium text-ivory/80">
                        {nominee.renomination_count} / 200
                      </span>
                    </div>
                    <Progress 
                      value={(nominee.renomination_count / 200) * 100} 
                      className="h-2 bg-charcoal-light [&>div]:bg-gradient-to-r [&>div]:from-gold [&>div]:to-gold-light"
                    />
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gold">
                        {Math.round((nominee.renomination_count / 200) * 100)}%
                      </span>
                      <span className="text-sm text-ivory/50 ml-1">complete</span>
                    </div>
                    {nominee.renomination_count >= 200 && (
                      <div className="text-center text-xs text-gold/80 bg-gold/10 rounded-md py-1.5">
                        🎉 Maximum endorsements reached!
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-ivory/60">
                    Believe in {nominee.name.split(" ")[0]}'s work? Renominate to show your support!
                  </p>
                  <Button
                    onClick={handleRenominate}
                    disabled={isRenominating}
                    variant="outline"
                    className="w-full border-gold/30 text-gold hover:bg-gold/10 hover:text-gold font-semibold"
                  >
                    {isRenominating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Endorsing...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Renominate
                      </>
                    )}
                  </Button>
                  {!user && (
                    <p className="text-xs text-ivory/40 text-center">
                      You must be logged in to renominate
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Share Card */}
              <Card className="bg-charcoal-light border-gold/20">
                <CardHeader>
                  <CardTitle className="text-ivory flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-gold" />
                    Share Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ivory/60 mb-4">
                    Help {nominee.name.split(" ")[0]} win by sharing their profile!
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("twitter")}
                      className="border-gold/20 text-ivory hover:bg-gold/10 hover:text-gold"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("facebook")}
                      className="border-gold/20 text-ivory hover:bg-gold/10 hover:text-gold"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("linkedin")}
                      className="border-gold/20 text-ivory hover:bg-gold/10 hover:text-gold"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("copy")}
                      className="border-gold/20 text-ivory hover:bg-gold/10 hover:text-gold"
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Status Badge */}
              {nominee.is_platinum && (
                <Card className="bg-gradient-to-br from-gold/20 to-gold/5 border-gold/30">
                  <CardContent className="p-6 text-center">
                    <Award className="w-12 h-12 text-gold mx-auto mb-3" />
                    <h3 className="font-display text-lg text-ivory mb-2">
                      Platinum Verified
                    </h3>
                    <p className="text-sm text-ivory/60">
                      This nominee has been verified by the NRC and meets all eligibility criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8 pt-8">
      <div className="lg:col-span-2">
        <Card className="bg-charcoal-light border-gold/10">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-48" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
            <Separator className="my-6 bg-gold/10" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="bg-charcoal-light border-gold/10">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
