import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Users, Coins } from "lucide-react";
import type { ChapterPerformance, AmbassadorPerformance } from "@/types/admin";

interface TopPerformersCardProps {
  chapters: ChapterPerformance[];
  ambassadors: AmbassadorPerformance[];
  loading?: boolean;
}

export function TopPerformersCard({ chapters, ambassadors, loading }: TopPerformersCardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top Chapters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Top Chapters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chapters.slice(0, 5).map((chapter, idx) => (
              <div 
                key={chapter.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{chapter.name}</p>
                    <p className="text-xs text-muted-foreground">{chapter.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{chapter.total_signups} signups</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Coins className="h-3 w-3" />
                    {chapter.total_agc_earned.toLocaleString()} AGC
                  </p>
                </div>
              </div>
            ))}
            {chapters.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No chapter data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Ambassadors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Top Ambassadors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ambassadors.slice(0, 5).map((ambassador, idx) => (
              <div 
                key={ambassador.user_id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {ambassador.full_name?.charAt(0) ?? ambassador.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{ambassador.full_name ?? 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{ambassador.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{ambassador.total_referrals} referrals</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Coins className="h-3 w-3" />
                    {ambassador.total_agc_earned.toLocaleString()} AGC
                  </p>
                </div>
              </div>
            ))}
            {ambassadors.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No ambassador data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
