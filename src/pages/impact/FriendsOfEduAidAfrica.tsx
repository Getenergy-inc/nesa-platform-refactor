// Friends of EduAid-Africa — the global funding, solidarity and participation
// movement behind NESA-Africa Education Social Impact.
//
// Role separation is locked (see FRIENDS_ROLE_CLARITY): Friends fund, EduAid
// delivers, SCEF anchors, NESA-Africa communicates. Funding never influences
// award or recognition outcomes. All payment CTAs route to the existing
// EduAid-Africa support flow — never a NESA-Africa payment surface.

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Users,
  Sparkles,
} from "lucide-react";
import {
  IMPACT_BRAND,
  IMPACT_TRUST_STATEMENTS,
  FRIENDS_BRAND,
  FRIENDS_ECOSYSTEM_CHAIN,
  FRIENDS_ROLE_CLARITY,
  FRIENDS_SUPPORT_AREAS,
  FRIENDS_WHO_CAN_JOIN,
  FRIENDS_CTAS,
} from "@/config/educationSocialImpact";
import EducationImpactStatsGrid from "@/components/impact/EducationImpactStatsGrid";

export default function FriendsOfEduAidAfrica() {
  return (
    <>
      <Helmet>
        <title>Friends of EduAid-Africa · Education for All Across Africa</title>
        <meta
          name="description"
          content="Friends of EduAid-Africa is the global funding and support movement helping advance Education for All across Africa — individuals, families, diaspora, companies and foundations backing verified education interventions."
        />
        <link rel="canonical" href="https://nesa.africa/impact/friends-of-eduaid-africa" />
      </Helmet>

      {/* Hero */}
      <section className="bg-charcoal text-white px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-gold">NESA-Africa</Link>
            <span className="mx-2">/</span>
            <Link to="/impact" className="hover:text-gold">Education Social Impact</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Friends of EduAid-Africa</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-gold">
            {FRIENDS_BRAND.name}
          </h1>
          <p className="mt-3 font-playfair text-xl md:text-2xl text-white/90">
            {FRIENDS_BRAND.headline}
          </p>
          <p className="mt-5 max-w-4xl text-sm md:text-base leading-relaxed text-white/70">
            {FRIENDS_BRAND.body}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {FRIENDS_CTAS.map((c, i) => (
              <Link
                key={c.label}
                to={c.href}
                className={
                  i === 0
                    ? "inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90"
                    : "inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold hover:bg-gold/10"
                }
              >
                {c.label} <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature message */}
      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto rounded-2xl border border-gold/25 bg-gold/[0.06] p-6 md:p-8">
          <Sparkles className="h-6 w-6 text-gold" aria-hidden />
          <p className="mt-3 font-playfair text-lg md:text-2xl leading-snug text-white">
            {FRIENDS_BRAND.featureMessage}
          </p>
        </div>
      </section>

      {/* Live impact stats — null renders as "—", never fabricated */}
      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <EducationImpactStatsGrid />
        </div>
      </section>

      {/* Ecosystem chain */}
      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">How the Ecosystem Works</h2>
          <ol className="grid gap-3 md:grid-cols-3">
            {FRIENDS_ECOSYSTEM_CHAIN.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="text-xs font-semibold tracking-widest text-gold/80">
                  STEP {i + 1}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-white/60">{step.note}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-white/50">
            {IMPACT_BRAND.eduaidPositioning}
          </p>
        </div>
      </section>

      {/* Role clarity */}
      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">Who Does What</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FRIENDS_ROLE_CLARITY.map((r) => (
              <div key={r.actor} className="rounded-xl border border-white/10 p-5">
                <ShieldCheck className="h-5 w-5 text-gold" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold text-white">{r.actor}</h3>
                <p className="mt-1 text-sm text-white/60">{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Friends support */}
      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">What Friends Support</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {FRIENDS_SUPPORT_AREAS.map((a) => (
              <li
                key={a}
                className="flex items-start gap-3 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/75"
              >
                <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who can become a Friend */}
      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-2">Who Can Become a Friend</h2>
          <p className="mb-5 max-w-3xl text-sm text-white/65">
            Everyone can participate. The movement is measured by shared ownership of impact — not by
            the size of any individual contribution.
          </p>
          <ul className="flex flex-wrap gap-2">
            {FRIENDS_WHO_CAN_JOIN.map((w) => (
              <li
                key={w}
                className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/[0.03] px-4 py-2 text-sm text-white/75"
              >
                <Users className="h-3.5 w-3.5 text-gold" aria-hidden />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust & governance */}
      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">Trust and Governance</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {IMPACT_TRUST_STATEMENTS.map((t) => (
              <div key={t.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-sm font-semibold text-gold">{t.title}</h3>
                <p className="mt-2 text-sm text-white/65">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA cards */}
      <section className="bg-charcoal text-white px-4 pb-20">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-3">
          {FRIENDS_CTAS.map((c) => (
            <Link
              key={c.label}
              to={c.href}
              className="group rounded-2xl border border-gold/25 bg-white/[0.03] p-6 transition-colors hover:border-gold/60 hover:bg-gold/[0.06]"
            >
              <h3 className="font-playfair text-lg font-bold text-gold">{c.label}</h3>
              <p className="mt-2 text-sm text-white/65">{c.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
          <p className="md:col-span-3 text-xs text-white/45">
            Support given through Friends of EduAid-Africa is received by EduAid-Africa under Santos
            Creations Educational Foundation. It never influences NESA-Africa nomination, judging or
            recognition outcomes.
          </p>
        </div>
      </section>
    </>
  );
}
