import { ExternalLink } from "lucide-react";

type Award = {
  title: string;
  organization: string;
  year: number;
  description: string;
  location?: string;
  sourceUrl: string;
};

export function AwardsList({ awards }: { awards: Award[] }) {
  const sorted = [...awards].sort((a, b) => b.year - a.year);
  
  return (
    <section className="space-y-8">
      <div className="grid gap-4">
        {sorted.map((a) => (
          <article 
            key={`${a.title}-${a.year}`} 
            className="p-4 border border-white/10 bg-secondary/5 rounded-xl shadow-card hover:shadow-lg hover:border-primary/30 transition-all"
          >
            <h3 className="text-lg font-semibold text-white m-0">{a.title}</h3>
            <p className="my-2 text-sm text-white/70">
              <strong className="text-white/90">{a.organization}</strong> • {a.year}
              {a.location ? ` • ${a.location}` : ""}
            </p>
            <p className="my-2 text-sm text-white/60">{a.description}</p>
            <p className="mt-3 mb-0 text-xs">
              <a 
                href={a.sourceUrl} 
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
            {sorted.map((award, index) => (
              <li key={`source-${award.title}-${index}`} className="flex items-start gap-2 text-sm">
                <span className="text-white/40">•</span>
                <div>
                  <span className="text-white/70">{award.title}</span>
                  <span className="text-white/40 mx-2">—</span>
                  <a
                    href={award.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {new URL(award.sourceUrl).hostname}
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
