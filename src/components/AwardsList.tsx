import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ExternalLink, MapPin } from "lucide-react";
import type { Award as AwardType } from "@/data/awards";

interface AwardCardProps {
  award: AwardType;
}

export function AwardCard({ award }: AwardCardProps) {
  return (
    <Card className="h-full border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-white/50">{award.organization}</span>
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
      {awards.map((award, index) => (
        <AwardCard key={`${award.title}-${index}`} award={award} />
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
        {awards.map((award, index) => (
          <li key={`${award.title}-${index}`} className="flex items-start gap-3">
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
