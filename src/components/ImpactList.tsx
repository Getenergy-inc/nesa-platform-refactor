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
    <section className="space-y-8">
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
      
      {/* Sources Section */}
      <div className="border-t border-white/10 pt-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-primary" />
          Sources & Citations
        </h2>
        <div className="bg-muted/30 rounded-lg p-4">
          <ul className="space-y-2 list-none m-0 p-0">
            {sorted.map((item, index) => (
              <li key={`source-${item.title}-${index}`} className="flex items-start gap-2 text-sm">
                <span className="text-white/40">•</span>
                <div>
                  <span className="text-white/70">{item.title}</span>
                  <span className="text-white/40 mx-2">—</span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {new URL(item.sourceUrl).hostname}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
