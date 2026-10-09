// "Meet the NRC" — public directory section.
//
// Renders only REAL opted-in members from `nrc_public_members`. Until onboarding
// completes the section shows an honest empty state; no placeholder people,
// slots, avatars or names are ever rendered.

import { Users2, ShieldCheck, ArrowRight } from "lucide-react";
import { SmartLink } from "@/components/navigation/SmartLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePublicNRCMembers } from "@/hooks/useNRCPublicMembers";

export function PublicNRCDirectorySection({ limit }: { limit?: number }) {
  const { data, isLoading } = usePublicNRCMembers();
  const members = limit ? (data ?? []).slice(0, limit) : data ?? [];

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80">Nominee Research Corps</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-gold">Meet the NRC</h2>
            <p className="mt-2 max-w-2xl text-white/70">
              Verification is carried out by named, accountable researchers. Members appear here
              only after onboarding is complete and they have opted into public listing.
            </p>
          </div>
          <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <SmartLink to="/judgeapply/nrc">
              Join the NRC <ArrowRight className="ml-2 h-4 w-4" />
            </SmartLink>
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl border border-white/10 bg-white/5" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-gold/25 bg-white/[0.03] p-8 text-center">
            <Users2 className="mx-auto h-8 w-8 text-gold/70" aria-hidden />
            <p className="mt-3 font-display text-lg font-semibold text-white">
              NRC members will be introduced here as onboarding completes
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
              We do not publish placeholder profiles. Each researcher is listed only once their
              identity, conflict-of-interest declaration and training are verified.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <SmartLink to="/judgeapply/nrc">Apply to join the NRC</SmartLink>
              </Button>
              <Button asChild variant="ghost" className="text-white/80 hover:text-gold">
                <SmartLink to="/judgeapply/about/integrity">How verification works</SmartLink>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <SmartLink
                key={m.id}
                to={`/nrc/member/${m.slug}`}
                className="group rounded-xl border border-white/10 bg-arena-panel p-5 transition-colors hover:border-gold/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-gold/30">
                    {m.photo_url ? <AvatarImage src={m.photo_url} alt={m.display_name} /> : null}
                    <AvatarFallback className="bg-arena-bg text-gold">
                      {m.display_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white group-hover:text-gold">
                      {m.display_name}
                    </p>
                    {m.country && <p className="truncate text-xs text-white/60">{m.country}</p>}
                  </div>
                </div>
                {m.bio && <p className="mt-3 line-clamp-3 text-sm text-white/65">{m.bio}</p>}
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold/80">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Verified NRC member
                </p>
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PublicNRCDirectorySection;
