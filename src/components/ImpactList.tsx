import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, MapPin, TrendingUp } from "lucide-react";
import type { ImpactItem } from "@/data/impact";

const typeLabels: Record<ImpactItem['type'], string> = {
  program: "Program",
  milestone: "Milestone",
  partnership: "Partnership",
  initiative: "Initiative",
  campaign: "Campaign",
};

const typeColors: Record<ImpactItem['type'], string> = {
  program: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  milestone: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  partnership: "bg-green-500/20 text-green-400 border-green-500/30",
  initiative: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  campaign: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

interface ImpactCardProps {
  item: ImpactItem;
}

export function ImpactCard({ item }: ImpactCardProps) {
  return (
    <Card className="h-full border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge 
            variant="outline" 
            className={typeColors[item.type]}
          >
            {typeLabels[item.type]}
          </Badge>
          <span className="text-sm text-white/50">{item.year}</span>
        </div>
        <CardTitle className="text-lg text-white mt-2">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-white/60">{item.description}</p>
        
        {item.metrics && item.metrics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.metrics.map((metric, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs"
              >
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">{metric.value}</span>
                <span className="text-primary/70">{metric.label}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-3 text-xs text-white/50">
          <span className="flex items-center gap-1">
            {item.organization}
          </span>
          {item.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {item.location}
            </span>
          )}
          {item.date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {item.date}
            </span>
          )}
        </div>
        
        <a
          href={item.sourceUrl}
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

interface ImpactListProps {
  items: ImpactItem[];
  columns?: 1 | 2 | 3;
}

export function ImpactList({ items, columns = 3 }: ImpactListProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {items.map((item) => (
        <ImpactCard key={item.id} item={item} />
      ))}
    </div>
  );
}

interface ImpactSourcesProps {
  items: ImpactItem[];
}

export function ImpactSources({ items }: ImpactSourcesProps) {
  return (
    <div className="bg-white/5 rounded-lg p-6">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="text-white/40">•</span>
            <div>
              <span className="text-white/80">{item.title}</span>
              <span className="text-white/40 mx-2">—</span>
              <a
                href={item.sourceUrl}
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
