import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import Section from "@/components/Section";
import {
  getSchoolVotingLabel,
  getSnsFormUrl,
  SCHOOL_SUPPORT_DONATION_NOTICE,
  SCHOOL_SUPPORT_NOMINATION_NOTICE,
  SCHOOL_SUPPORT_PARTICIPATION,
  SCHOOL_SUPPORT_PROGRAMME,
  SCHOOL_SUPPORT_ROUTE,
  SCHOOL_SUPPORT_SPONSORSHIP_INTEGRITY,
  VOTING_OPEN,
  type SchoolParticipationId,
} from "@/config/schoolSupport";

export default function SpecialNeedsSchoolParticipate() {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get("participation");
  const selected = SCHOOL_SUPPORT_PARTICIPATION.find((option) => option.id === requested);
  const formUrl = getSnsFormUrl();

  return (
    <>
      <Helmet>
        <title>Participate | Africa Special Needs Education Support Fund 2027</title>
        <meta name="description" content="Choose how to participate in the Africa Special Needs Education Support Fund 2027 through the authorised NESA-Africa participation form." />
        <link rel="canonical" href={`https://nesa.africa${SCHOOL_SUPPORT_ROUTE}/participate`} />
      </Helmet>

      <Section className="border-b border-gold/20 pt-10 md:pt-14">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ivory/55">
            <Link to={SCHOOL_SUPPORT_ROUTE} className="hover:text-gold">Support a Special-Needs School</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Participate</span>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{SCHOOL_SUPPORT_PROGRAMME.presenters}</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ivory md:text-5xl">Participate in the {SCHOOL_SUPPORT_PROGRAMME.name}</h1>
          <p className="mt-5 max-w-3xl leading-relaxed text-ivory/75">Choose one of eight ways to take part. The authorised NESA-Africa form opens in a new tab.</p>
        </div>
      </Section>

      <Section aria-labelledby="participation-question">
        <div className="mx-auto max-w-6xl">
          <h2 id="participation-question" className="font-display text-3xl font-bold text-gold md:text-4xl">How would you like to participate?</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {SCHOOL_SUPPORT_PARTICIPATION.map((option) => {
              const isSelected = selected?.id === option.id;
              const isVoting = option.id === "vote";
              return (
                <article
                  key={option.id}
                  id={`participation-${option.id}`}
                  aria-current={isSelected ? "true" : undefined}
                  className={`scroll-mt-36 rounded-xl border p-6 ${isSelected ? "border-gold bg-gold/10" : "border-gold/20 bg-ivory/[0.03]"}`}
                >
                  <h3 className="font-display text-xl font-bold text-ivory">{isVoting && !VOTING_OPEN ? getSchoolVotingLabel() : option.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">{option.description}</p>
                  {isVoting && !VOTING_OPEN && <p className="mt-3 text-sm text-gold">Voting is not currently available.</p>}
                  {option.id === "nominate" && <p className="mt-3 text-sm leading-relaxed text-ivory/65">{SCHOOL_SUPPORT_NOMINATION_NOTICE}</p>}
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/10 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-ivory">NESA-Africa participation form</h2>
            <p className="mt-3 text-sm leading-relaxed text-ivory/75">The first question is “How would you like to participate?” Use the form’s conditional sections to continue with your selected option.</p>
            {selected && <p className="mt-3 text-sm text-gold">Selected: {selected.id === "vote" && !VOTING_OPEN ? getSchoolVotingLabel() : selected.label}</p>}
            {formUrl ? (
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-gold px-6 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Open the NESA-Africa Participation Form
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <div className="mt-6" role="status">
                <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-lg border border-gold/40 px-6 py-3 text-sm font-semibold text-gold opacity-80" aria-disabled="true">Open the NESA-Africa Participation Form</span>
                <p className="mt-3 font-semibold text-gold">CONTENT REQUIRED</p>
                <p className="mt-1 text-sm text-ivory/70">The authorised NESA-Africa participation form URL has not been supplied.</p>
              </div>
            )}
            <p className="mt-5 text-sm leading-relaxed text-ivory/70">Both forms may feed one controlled master register, but each response must record its website source.</p>
          </div>
        </div>
      </Section>

      <Section aria-labelledby="participation-safeguards" className="border-t border-gold/20 bg-charcoal-light">
        <div className="mx-auto max-w-5xl">
          <h2 id="participation-safeguards" className="font-display text-3xl font-bold text-gold">Participation safeguards</h2>
          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ivory/80">
            <p>Public participation applies only to the Africa Special Needs Education Support Fund and must not be presented as voting for the NESA-Africa 2026 awards.</p>
            <p>Do not sell votes. Donations and sponsorships must not purchase additional votes or influence vote totals.</p>
            <p>{SCHOOL_SUPPORT_SPONSORSHIP_INTEGRITY}</p>
            <p>The Google Form may collect donation or sponsorship interest, but it must not collect card numbers, PINs, passwords, banking credentials or verification codes.</p>
            <p>{SCHOOL_SUPPORT_DONATION_NOTICE}</p>
            <p>Do not publish children’s names, diagnoses, identity documents, personal contacts or unapproved school information.</p>
          </div>
          <Link to={SCHOOL_SUPPORT_ROUTE} className="mt-8 inline-flex min-h-11 items-center rounded-lg border border-gold/40 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">Return to the programme</Link>
        </div>
      </Section>
    </>
  );
}
