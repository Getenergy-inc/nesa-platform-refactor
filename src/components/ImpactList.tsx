import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Calendar, MapPin } from "lucide-react";
import type { ImpactItem } from "@/data/impact";

interface ImpactCardProps {
  item: ImpactItem;
}

export function ImpactCard({ item }: ImpactCardProps) {
  return (
    <Card className="h-full border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <span className="flex items-center gap-1 text-xs text-white/50">
            <Calendar className="h-3 w-3" />
            {item.date}
          </span>
        </div>
        <CardTitle className="text-lg text-white mt-2">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-white/60">{item.description}</p>
        
        {item.location && (
          <div className="flex items-center gap-1 text-xs text-white/50">
            <MapPin className="h-3 w-3" />
            {item.location}
          </div>
        )}
        
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
      {items.map((item, index) => (
        <ImpactCard key={`${item.title}-${index}`} item={item} />
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
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="flex items-start gap-3">
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
