import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSeason } from "@/contexts/SeasonContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Award,
  Building,
  Vote,
  Share2,
  Trophy,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export default function NomineeProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { currentEdition, isStageOpen } = useSeason();
  const votingOpen = isStageOpen("public_voting");

  // Fetch nominee by slug
  const { data: nominee, isLoading, error } = useQuery({
    queryKey: ["nominee", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select(`
          *,
          subcategory:subcategories (
            id,
            name,
            slug,
            category:categories (
              id,
              name,
              slug
            )
          )
        `)
        .eq("slug", slug)
        .in("status", ["approved", "platinum"])
        .single();

      if (error) throw error;
      return data;
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

  const handleShare = async () => {
    const url = window.location.href;
    const title = `Vote for ${nominee?.name} - ${currentEdition.name}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-charcoal">
        <NESAHeader />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-white mb-4">Nominee Not Found</h1>
          <p className="text-white/70 mb-8">The nominee you're looking for doesn't exist or hasn't been approved yet.</p>
          <Link to="/nominees">
            <Button className="bg-gold hover:bg-gold-light text-charcoal">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Nominees
            </Button>
          </Link>
        </div>
        <NESAFooter />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{nominee?.name || "Nominee"} | {currentEdition.name}</title>
        <meta
          name="description"
          content={nominee?.bio || `View the profile and vote for ${nominee?.name} in ${currentEdition.name}.`}
        />
        <meta property="og:title" content={`${nominee?.name} - ${currentEdition.name}`} />
        <meta property="og:description" content={nominee?.bio || ""} />
        {nominee?.photo_url && <meta property="og:image" content={nominee.photo_url} />}
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        <div className="container py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link to="/nominees" className="hover:text-gold transition-colors">
              Nominees
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{nominee?.name || "Loading..."}</span>
          </nav>

          {isLoading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="bg-charcoal-light border-gold/10">
                  <CardContent className="p-8 text-center">
                    <Skeleton className="h-32 w-32 rounded-full mx-auto mb-6" />
                    <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-5 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-32" />
              </div>
            </div>
          ) : nominee ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <Card className="bg-charcoal-light border-gold/10 sticky top-24">
                  <CardContent className="p-8 text-center">
                    <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-gold/30">
                      <AvatarImage src={nominee.photo_url || undefined} alt={nominee.name} />
                      <AvatarFallback className="bg-gold/20 text-gold text-3xl font-bold">
                        {getInitials(nominee.name)}
                      </AvatarFallback>
                    </Avatar>

                    {nominee.is_platinum && (
                      <Badge className="mb-4 bg-gradient-to-r from-slate-400 to-slate-300 text-slate-800 border-0">
                        <Award className="h-3 w-3 mr-1" />
                        Platinum Certified
                      </Badge>
                    )}

                    <h1 className="font-display text-2xl font-bold text-white mb-2">
                      {nominee.name}
                    </h1>

                    {nominee.title && (
                      <p className="text-gold text-lg mb-2">{nominee.title}</p>
                    )}

                    {nominee.organization && (
                      <div className="flex items-center justify-center gap-2 text-white/60 mb-6">
                        <Building className="h-4 w-4" />
                        <span>{nominee.organization}</span>
                      </div>
                    )}

                    {/* Vote Count */}
                    <div className="bg-charcoal/50 rounded-lg p-4 mb-6">
                      <p className="text-4xl font-bold text-gold">
                        {nominee.public_votes?.toLocaleString() || 0}
                      </p>
                      <p className="text-white/60 text-sm">Public Votes</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {votingOpen ? (
                        <Link to="/vote" className="block">
                          <Button className="w-full bg-gold hover:bg-gold-light text-charcoal font-semibold">
                            <Vote className="h-4 w-4 mr-2" />
                            Vote Now
                          </Button>
                        </Link>
                      ) : (
                        <Button className="w-full" disabled>
                          <Vote className="h-4 w-4 mr-2" />
                          Voting Not Open
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="w-full border-gold/30 text-gold hover:bg-gold/10"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Profile
                      </Button>
                    </div>

                    {/* Category Badge */}
                    <div className="mt-6 pt-6 border-t border-gold/10">
                      <Link to={`/categories`}>
                        <Badge 
                          variant="outline" 
                          className="border-gold/30 text-gold hover:bg-gold/10 cursor-pointer"
                        >
                          {nominee.subcategory?.category?.name || "Uncategorized"}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Badge>
                      </Link>
                      <p className="text-white/50 text-sm mt-2">
                        {nominee.subcategory?.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Bio */}
                <Card className="bg-charcoal-light border-gold/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gold" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 leading-relaxed whitespace-pre-line">
                      {nominee.bio || "No biography available for this nominee."}
                    </p>
                  </CardContent>
                </Card>

                {/* Evidence */}
                {nominee.evidence_urls && nominee.evidence_urls.length > 0 && (
                  <Card className="bg-charcoal-light border-gold/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-gold" />
                        Supporting Evidence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {nominee.evidence_urls.map((url: string, index: number) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-charcoal/50 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors group"
                          >
                            <div className="h-10 w-10 rounded bg-gold/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-gold" />
                            </div>
                            <span className="text-white/70 group-hover:text-gold transition-colors flex-1 truncate">
                              Evidence {index + 1}
                            </span>
                            <ExternalLink className="h-4 w-4 text-gold/50 group-hover:text-gold transition-colors" />
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Season Info */}
                <Card className="bg-charcoal-light border-gold/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gold" />
                      Award Season
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">{currentEdition.name}</p>
                        <p className="text-white/60 text-sm">{currentEdition.theme}</p>
                      </div>
                      <Badge className="bg-gold/10 text-gold border-gold/30">
                        {currentEdition.displayYear}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}
        </div>

        <NESAFooter />
      </div>
    </>
  );
}
