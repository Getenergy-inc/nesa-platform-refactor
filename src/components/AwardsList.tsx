import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, Calendar, MapPin } from "lucide-react";
import type { Award as AwardType } from "@/data/awards";

const categoryLabels: Record<AwardType['category'], string> = {
  international: "International",
  continental: "Continental",
  regional: "Regional",
  national: "National",
  partner: "Partner",
};

const categoryColors: Record<AwardType['category'], string> = {
  international: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  continental: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  regional: "bg-green-500/20 text-green-400 border-green-500/30",
  national: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  partner: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

interface AwardCardProps {
  award: AwardType;
}

export function AwardCard({ award }: AwardCardProps) {
  return (
    <Card className="h-full border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge 
            variant="outline" 
            className={categoryColors[award.category]}
          >
            {categoryLabels[award.category]}
          </Badge>
          <span className="text-sm text-white/50">{award.year}</span>
        </div>
        <CardTitle className="text-lg text-white mt-2">{award.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-white/60">{award.description}</p>
        
        <div className="flex flex-wrap gap-3 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {award.organization}
          </span>
          {award.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {award.location}
            </span>
          )}
          {award.date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {award.date}
            </span>
          )}
        </div>
        
        <a
          href={award.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
        >
          Learn More
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}

interface AwardsListProps {
  awards: AwardType[];
  columns?: 1 | 2 | 3;
}

export function AwardsList({ awards, columns = 3 }: AwardsListProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {awards.map((award) => (
        <AwardCard key={award.id} award={award} />
      ))}
    </div>
  );
}

interface AwardsSourcesProps {
  awards: AwardType[];
}

export function AwardsSources({ awards }: AwardsSourcesProps) {
  return (
    <div className="bg-white/5 rounded-lg p-6">
      <ul className="space-y-3">
        {awards.map((award) => (
          <li key={award.id} className="flex items-start gap-3">
            <span className="text-white/40">•</span>
            <div>
              <span className="text-white/80">{award.title}</span>
              <span className="text-white/40 mx-2">—</span>
              <a
                href={award.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                View Source
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
