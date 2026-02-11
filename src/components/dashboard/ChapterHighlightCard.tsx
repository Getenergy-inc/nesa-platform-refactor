import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ChapterHighlightCard() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile-chapter", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("country, referred_by_chapter_id")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: chapter } = useQuery({
    queryKey: ["chapter-info", profile?.referred_by_chapter_id],
    queryFn: async () => {
      if (!profile?.referred_by_chapter_id) return null;
      const { data } = await supabase
        .from("chapters")
        .select("name, country, region")
        .eq("id", profile.referred_by_chapter_id)
        .maybeSingle();
      return data;
    },
    enabled: !!profile?.referred_by_chapter_id,
  });

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-6 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!chapter) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">You are currently viewing</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <MapPin className="h-3 w-3 mr-1" />
                {chapter.name} Chapter
              </Badge>
              {chapter.region && (
                <Badge variant="secondary" className="bg-accent/50 border-accent">
                  <Globe className="h-3 w-3 mr-1" />
                  {chapter.region}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="shrink-0">
            <Link to="/chapters">
              All Chapters
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
