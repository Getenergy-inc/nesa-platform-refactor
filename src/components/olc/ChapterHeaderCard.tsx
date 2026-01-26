import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Wallet, MapPin } from "lucide-react";
import type { Chapter } from "@/types/olc";

interface ChapterHeaderCardProps {
  chapter: Chapter | null;
  loading?: boolean;
}

export function ChapterHeaderCard({ chapter, loading }: ChapterHeaderCardProps) {
  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-emerald-500/10 via-primary/5 to-background border-emerald-500/20">
        <CardContent className="flex items-center gap-4 p-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const initials = chapter?.name
    ? chapter.name.substring(0, 2).toUpperCase()
    : "CH";

  return (
    <Card className="bg-gradient-to-r from-emerald-500/10 via-primary/5 to-background border-emerald-500/20">
      <CardContent className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16 border-2 border-emerald-500/30">
          <AvatarImage src={chapter?.logo_url || undefined} alt={chapter?.name} />
          <AvatarFallback className="bg-emerald-500/20 text-emerald-600 text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Wallet className="h-5 w-5 text-emerald-600" />
            <h2 className="font-display text-xl font-bold">GFA Wallet for NESA-Africa</h2>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <MapPin className="mr-1 h-3 w-3" />
              {chapter?.name || "Chapter"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {chapter?.country}{chapter?.region && `, ${chapter.region}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
