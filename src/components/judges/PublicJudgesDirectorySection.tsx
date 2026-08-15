// "Meet the Judges" — public directory section.
//
// Renders only REAL judge records exposed by the PII-masked `judges_public`
// view (opt-in public visibility, approved status). Until judges are appointed
// and opt in, an honest empty state is shown — never placeholder people.
// Nothing from scoring, ballots or deliberation tables is ever surfaced here.

import { useEffect, useState } from "react";
import { Gavel, ShieldCheck, ArrowRight, MapPin } from "lucide-react";
import { SmartLink } from "@/components/navigation/SmartLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { listPublicJudges, type PublicJudge } from "@/lib/api/judges.api";

export function PublicJudgesDirectorySection({ limit = 6 }: { limit?: number }) {
  const [judges, setJudges] = useState<PublicJudge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listPublicJudges()
      .then((d) => mounted && setJudges(d.slice(0, limit)))
      .catch(() => mounted && setJudges([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [limit]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a24a]/80">The Jury</p>
          <h2 className="mt-2 font-serif text-3xl">Meet the Judges</h2>
          <p className="mt-2 max-w-2xl text-white/70">
            Judges are appointed on merit, screened for conflicts of interest and firewalled from
            sponsors and operators. Profiles appear here only when a judge is confirmed and has
            opted into public listing.
          </p>
        </div>
        <Button asChild variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10">
          <SmartLink to="/judges/directory">
            Full judges directory <ArrowRight className="ml-2 h-4 w-4" />
          </SmartLink>
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : judges.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-[#c9a24a]/30 bg-white/[0.03] p-8 text-center">
          <Gavel className="mx-auto h-8 w-8 text-[#c9a24a]/80" aria-hidden />
          <p className="mt-3 font-serif text-xl">
            Judges will be introduced here as appointments are confirmed
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
            We publish no placeholder jurors. Each judge is listed only after appointment,
            conflict-of-interest screening and their own consent to be shown publicly.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-[#c9a24a] text-[#050b1a] hover:bg-[#e0b96b]">
              <SmartLink to="/judgeapply">Judge nomination & application pathway</SmartLink>
            </Button>
            <Button asChild variant="ghost" className="text-white/80 hover:text-[#c9a24a]">
              <SmartLink to="/judgeapply/about/integrity">How judging integrity works</SmartLink>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {judges.map((j) => (
            <SmartLink
              key={j.id}
              to={`/judges/directory/${j.slug}`}
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#c9a24a]/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-[#c9a24a]/30">
                  {j.photo_url ? <AvatarImage src={j.photo_url} alt={j.full_name} /> : null}
                  <AvatarFallback className="bg-[#0b1a3a] text-[#c9a24a]">
                    {j.full_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold group-hover:text-[#c9a24a]">{j.full_name}</p>
                  {j.professional_title && (
                    <p className="truncate text-xs text-white/60">{j.professional_title}</p>
                  )}
                </div>
              </div>
              {j.country_residence && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/60">
                  <MapPin className="h-3.5 w-3.5" aria-hidden /> {j.country_residence}
                </p>
              )}
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#c9a24a]/85">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Confirmed judge
              </p>
            </SmartLink>
          ))}
        </div>
      )}
    </section>
  );
}

export default PublicJudgesDirectorySection;
