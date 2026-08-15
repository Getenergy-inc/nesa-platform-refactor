// /nrc/member/:slug — public profile for an opted-in NRC member.
//
// Template renders exclusively from `nrc_public_members` (public opt-in fields).
// Nothing from queues, reviews, evidence or private notes is exposed here.

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { ArrowLeft, MapPin, ShieldCheck, Users2 } from "lucide-react";
import { SmartLink } from "@/components/navigation/SmartLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePublicNRCMember } from "@/hooks/useNRCPublicMembers";

export default function PublicNRCMemberProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: member, isLoading } = usePublicNRCMember(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal">
        <div className="mx-auto max-w-4xl animate-pulse px-4 py-20">
          <div className="mb-6 h-8 w-40 rounded bg-white/10" />
          <div className="h-56 w-full rounded-xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-charcoal text-white">
        <Helmet>
          <title>NRC profile not found · NESA-Africa</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <Users2 className="mx-auto mb-4 h-12 w-12 text-gold/70" aria-hidden />
          <h1 className="font-display text-3xl font-bold text-gold">NRC profile not found</h1>
          <p className="mt-2 text-white/70">
            This profile may be private, or the member has not completed public onboarding.
          </p>
          <Button asChild className="mt-6 bg-gold text-charcoal hover:bg-gold/90">
            <SmartLink to="/nrc">Back to the NRC Arena</SmartLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Helmet>
        <title>{`${member.display_name} · NRC · NESA-Africa`}</title>
        <meta
          name="description"
          content={
            member.bio?.slice(0, 155) ??
            `${member.display_name} is a member of the NESA-Africa Nominee Research Corps.`
          }
        />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <SmartLink
          to="/nrc"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to the NRC Arena
        </SmartLink>

        <header className="mt-6 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24 border-2 border-gold/40">
            {member.photo_url ? <AvatarImage src={member.photo_url} alt={member.display_name} /> : null}
            <AvatarFallback className="bg-charcoal text-2xl text-gold">
              {member.display_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold text-gold">{member.display_name}</h1>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/70">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden /> Nominee Research Corps · 2026 cycle
            </p>
            {member.country && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/60">
                <MapPin className="h-4 w-4" aria-hidden /> {member.country}
              </p>
            )}
          </div>
        </header>

        {member.specialization && member.specialization.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-semibold text-white">Research focus</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {member.specialization.map((s) => (
                <Badge key={s} variant="outline" className="border-gold/30 text-gold">
                  {s}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {member.bio && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-semibold text-white">About</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-white/75">{member.bio}</p>
          </section>
        )}

        <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">
          NRC members verify identity, eligibility and evidence. Individual case work, reviewer
          notes and verification outcomes remain confidential and are never published on profiles.
        </section>
      </div>
    </div>
  );
}
