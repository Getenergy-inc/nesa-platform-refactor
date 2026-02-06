import { ExternalLink } from "lucide-react";

type Impact = {
  title: string;
  date: string;
  description: string;
  location?: string;
  sourceUrl: string;
};

export function ImpactList({ items }: { items: Impact[] }) {
  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
  
  return (
    <section>
      <div className="grid gap-4">
        {sorted.map((i) => (
          <article 
            key={`${i.title}-${i.date}`} 
            className="p-4 border border-white/10 bg-secondary/5 rounded-xl shadow-card hover:shadow-lg hover:border-primary/30 transition-all"
          >
            <h3 className="text-lg font-semibold text-white m-0">{i.title}</h3>
            <p className="my-2 text-sm text-white/70">
              <strong className="text-white/90">{i.date}</strong>
              {i.location ? ` • ${i.location}` : ""}
            </p>
            <p className="my-2 text-sm text-white/60">{i.description}</p>
            <p className="mt-3 mb-0 text-xs">
              <a 
                href={i.sourceUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                View Source
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ImpactSources({ items }: { items: Impact[] }) {
  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <ul className="space-y-3 list-none m-0 p-0">
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
