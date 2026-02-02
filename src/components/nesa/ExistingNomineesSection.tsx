import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { renominateNominee } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  Users, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  ExternalLink,
  UserPlus,
  Loader2,
  Heart
} from "lucide-react";

interface ExistingNominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  photo_url: string | null;
  is_platinum: boolean;
  public_votes: number;
  renomination_count: number;
}

interface ExistingNomineesSectionProps {
  subcategoryId: string;
  subcategoryName?: string;
  categoryName?: string;
}

export function ExistingNomineesSection({ 
  subcategoryId, 
  subcategoryName,
  categoryName 
}: ExistingNomineesSectionProps) {
  const { user } = useAuth();
  const [nominees, setNominees] = useState<ExistingNominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [renominatingId, setRenominatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNominees() {
      if (!subcategoryId) {
        setNominees([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from("nominees")
        .select(`
          id,
          name,
          slug,
          title,
          organization,
          photo_url,
          is_platinum,
          public_votes,
          renomination_count
        `)
        .eq("subcategory_id", subcategoryId)
        .in("status", ["approved", "platinum"])
        .order("public_votes", { ascending: false })
        .limit(20);

      if (!error && data) {
        setNominees(data);
      }
      setLoading(false);
    }

    fetchNominees();
  }, [subcategoryId]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRenominate = async (nominee: ExistingNominee) => {
    if (!user) {
      toast.error("Please log in to endorse", {
        action: {
          label: "Log In",
          onClick: () => window.location.href = "/auth/login",
        },
      });
      return;
    }

    setRenominatingId(nominee.id);
    try {
      await renominateNominee(nominee.id, `Quick endorsement from nomination page`);
      toast.success(`Endorsed ${nominee.name}!`, {
        description: "Your support has been recorded.",
      });
      // Update local state to reflect the change
      setNominees(prev => prev.map(n => 
        n.id === nominee.id 
          ? { ...n, renomination_count: n.renomination_count + 1 }
          : n
      ));
    } catch (error: any) {
      if (error.message?.includes("200")) {
        toast.error("Maximum endorsement limit reached");
      } else {
        toast.error("Failed to endorse", {
          description: error.message || "Please try again",
        });
      }
    } finally {
      setRenominatingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (nominees.length === 0) {
    return (
      <Card className="border-dashed border-muted-foreground/30 bg-muted/20">
        <CardContent className="py-6 text-center">
          <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            No approved nominees in this subcategory yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Be the first to nominate someone!
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedNominees = expanded ? nominees : nominees.slice(0, 3);
  const hasMore = nominees.length > 3;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            Existing Nominees
            <Badge variant="secondary" className="ml-1">
              {nominees.length}
            </Badge>
          </CardTitle>
          {categoryName && subcategoryName && (
            <Badge variant="outline" className="text-xs font-normal">
              {subcategoryName}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          View nominees already in this category. You can endorse them or nominate someone new.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <ScrollArea className={expanded && nominees.length > 5 ? "h-[300px]" : ""}>
          <div className="space-y-2">
            {displayedNominees.map((nominee) => (
              <div 
                key={nominee.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background transition-colors group"
              >
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src={nominee.photo_url || undefined} alt={nominee.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getInitials(nominee.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{nominee.name}</span>
                    {nominee.is_platinum && (
                      <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {nominee.organization && (
                      <span className="truncate">{nominee.organization}</span>
                    )}
                    {nominee.title && !nominee.organization && (
                      <span className="truncate">{nominee.title}</span>
                    )}
                    <span className="shrink-0">• {nominee.public_votes} votes</span>
                    {nominee.renomination_count > 0 && (
                      <span className="shrink-0 flex items-center gap-0.5">
                        <UserPlus className="h-3 w-3" />
                        {nominee.renomination_count}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => handleRenominate(nominee)}
                    disabled={renominatingId === nominee.id}
                    title={user ? "Endorse this nominee" : "Log in to endorse"}
                  >
                    {renominatingId === nominee.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Heart className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Link 
                    to={`/nominees/${encodeURIComponent(nominee.slug)}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Button size="sm" variant="ghost" className="h-8 px-2">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {hasMore && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                View All {nominees.length} Nominees
              </>
            )}
          </Button>
        )}

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Want to support an existing nominee?{" "}
            <Link to="/nominees" className="text-primary hover:underline">
              Visit their profile
            </Link>{" "}
            to endorse them.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
