// Support a Special-Needs School — inclusive-education pathway.
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Section from "@/components/Section";
import { SPECIAL_NEEDS_FIELDS } from "@/config/educationSocialImpact";
import { useImpactSchools } from "@/hooks/useImpactSchools";
import {
  buildSchoolParticipationHref,
  canPublishSupportSchool,
  getSchoolVotingLabel,
  SCHOOL_SUPPORT_CATEGORIES,
  SCHOOL_SUPPORT_DASHBOARD_FIELDS,
  SCHOOL_SUPPORT_DONATION_NOTICE,
  SCHOOL_SUPPORT_DONATION_STATUSES,
  SCHOOL_SUPPORT_DUE_DILIGENCE,
  SCHOOL_SUPPORT_INTERVENTIONS,
  SCHOOL_SUPPORT_NOMINATION_NOTICE,
  SCHOOL_SUPPORT_PARTICIPATE_ROUTE,
  SCHOOL_SUPPORT_PARTNERSHIP_OPPORTUNITIES,
  SCHOOL_SUPPORT_POSSIBILITIES,
  SCHOOL_SUPPORT_PROCESS,
  SCHOOL_SUPPORT_PROGRAMME,
  SCHOOL_SUPPORT_ROUTE,
  SCHOOL_SUPPORT_SPONSOR_TYPES,
  SCHOOL_SUPPORT_SPONSORSHIP_INTEGRITY,
  SCHOOL_SUPPORT_SPONSORSHIP_OPPORTUNITIES,
  SCHOOL_SUPPORT_TIMETABLE,
  SCHOOL_SUPPORT_TIMETABLE_NOTICE,
  SCHOOL_SUPPORT_VOTING_REQUIREMENTS,
  SCHOOL_SUPPORT_VOTING_SAFEGUARDS,
  VOTING_OPEN,
  type SchoolParticipationId,
} from "@/config/schoolSupport";

const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));

const actionClass = "inline-flex min-h-11 items-center justify-center rounded-lg border border-gold/40 px-5 py-3 text-center text-sm font-semibold text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";
const primaryActionClass = "inline-flex min-h-11 items-center justify-center rounded-lg bg-gold px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

function ParticipationLink({ id, children, primary = false }: { id: SchoolParticipationId; children: ReactNode; primary?: boolean }) {
  return <Link to={buildSchoolParticipationHref(id)} className={primary ? primaryActionClass : actionClass}>{children}</Link>;
}

function BulletList({ items, columns = false }: { items: readonly string[]; columns?: boolean }) {
  return (
    <ul className={`mt-5 space-y-2 text-sm leading-relaxed text-ivory/75 ${columns ? "sm:grid sm:grid-cols-2 sm:gap-x-8 sm:space-y-0 sm:gap-y-3" : ""}`}>
      {items.map((item) => <li key={item} className="flex gap-2"><span className="text-gold" aria-hidden>•</span><span>{item}</span></li>)}
    </ul>
  );
}

export default function SpecialNeedsSchools() {
  const { schools, loading, error } = useImpactSchools();
  const specialNeeds = schools.filter(
    (school) => canPublishSupportSchool(school) && ((school.schoolType || "").toLowerCase().includes("special") || (school.description || "").toLowerCase().includes("special needs")),
  );

  return (
    <>
      <Helmet>
        <title>Africa Special Needs Education Support Fund 2027 | NESA-Africa</title>
        <meta name="description" content="Support One Special-Needs School in Each African Region through the Africa Special Needs Education Support Fund 2027, jointly presented by NESA-Africa and EduAid-Africa." />
        <link rel="canonical" href={`https://nesa.africa${SCHOOL_SUPPORT_ROUTE}`} />
      </Helmet>

      <Section className="border-b border-gold/20 pt-10 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ivory/55">
            <Link to="/" className="hover:text-gold">NESA-Africa</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Support a Special-Needs School</span>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{SCHOOL_SUPPORT_PROGRAMME.presenters}</p>
          <h1 className="mt-4 max-w-5xl font-display text-4xl font-bold leading-tight text-ivory md:text-6xl">Support a Special-Needs School Across Africa</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ivory/65">{SCHOOL_SUPPORT_PROGRAMME.serviceLine}</p>
          <h2 className="mt-10 max-w-4xl font-display text-3xl font-bold leading-tight text-gold md:text-4xl">{SCHOOL_SUPPORT_PROGRAMME.headline}</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-ivory/85">{SCHOOL_SUPPORT_PROGRAMME.introduction}</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-ivory/85">{SCHOOL_SUPPORT_PROGRAMME.selection}</p>
          <p className="mt-6 max-w-3xl text-sm font-semibold text-ivory">{SCHOOL_SUPPORT_PROGRAMME.supportQualifier}</p>
          <BulletList items={SCHOOL_SUPPORT_POSSIBILITIES} columns />
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gold">{SCHOOL_SUPPORT_PROGRAMME.supportWarning}</p>

          <div className="mt-8 flex flex-wrap gap-3" aria-label="Primary programme actions">
            <ParticipationLink id="nominate" primary>Nominate a Special-Needs School</ParticipationLink>
            <a href="#verified-schools" className={actionClass}>View Verified Schools</a>
            {VOTING_OPEN ? (
              <ParticipationLink id="vote">{getSchoolVotingLabel()}</ParticipationLink>
            ) : (
              <span className={`${actionClass} cursor-not-allowed opacity-80`} aria-disabled="true">{getSchoolVotingLabel()}</span>
            )}
            <ParticipationLink id="donate">Donate to the Support Fund</ParticipationLink>
            <ParticipationLink id="sponsor">Sponsor a Regional School</ParticipationLink>
            <ParticipationLink id="partner">Become a Programme Partner</ParticipationLink>
            <ParticipationLink id="volunteer">Volunteer Your Skills</ParticipationLink>
          </div>
          <aside className="mt-6 max-w-3xl rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm leading-relaxed text-ivory/85">
            {SCHOOL_SUPPORT_NOMINATION_NOTICE} Only verified and approved schools may be publicly profiled or admitted to regional selection.
          </aside>
        </div>
      </Section>

      <Section aria-labelledby="programme-process">
        <div className="mx-auto max-w-6xl">
          <h2 id="programme-process" className="font-display text-3xl font-bold text-gold">How the programme works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {SCHOOL_SUPPORT_PROCESS.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-xl border border-gold/20 bg-ivory/[0.03] p-5">
                <span className="font-display text-2xl font-bold text-gold" aria-hidden>{index + 1}</span>
                <p className="text-sm leading-relaxed text-ivory/80"><strong className="text-ivory">{step.title}</strong> {step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section aria-labelledby="regional-selection" className="border-y border-gold/20 bg-charcoal-light">
        <div className="mx-auto max-w-6xl">
          <h2 id="regional-selection" className="font-display text-3xl font-bold text-gold">2027 regional selection structure</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-ivory/85">Use an approved eight-region framework covering Africa’s 54 countries.</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-ivory/85">Do not publish a country-to-region mapping until it has received written programme approval.</p>
          <blockquote className="mt-6 border-l-2 border-gold pl-5 font-display text-2xl text-ivory">One approved beneficiary school from each of the eight African programme regions.</blockquote>
          <p className="mt-6 max-w-3xl leading-relaxed text-ivory/85">Authorised regional selection is subject to verification, consent, needs assessment, safeguarding review and final due diligence. Selection is not an automatic grant award.</p>
          <h3 className="mt-6 font-semibold text-ivory">Final support remains subject to:</h3>
          <BulletList items={SCHOOL_SUPPORT_DUE_DILIGENCE} columns />
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ivory/70">If the highest-voted school fails due diligence, the programme may assess the next eligible school in that region. This decision and its reasons must be documented.</p>
        </div>
      </Section>

      <Section aria-labelledby="eligible-categories">
        <div className="mx-auto max-w-6xl">
          <h2 id="eligible-categories" className="font-display text-3xl font-bold text-gold">Eligible school categories</h2>
          <p className="mt-3 text-ivory/75">Streamline the public categories into the following eight support groups:</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {SCHOOL_SUPPORT_CATEGORIES.map((category, index) => (
              <article key={category.title} className="rounded-xl border border-gold/20 p-5">
                <h3 className="font-display text-xl font-bold text-ivory"><span className="mr-2 text-gold">{index + 1}.</span>{category.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{category.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ivory/80">Schools may select more than one support category, but each school must state its principal service category.</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ivory/80">The regional selection must not be divided into eight disability-category winners. The objective is one approved school per African region, regardless of its disability category.</p>
        </div>
      </Section>

      <Section aria-labelledby="intervention-classifications" className="border-y border-gold/20 bg-charcoal-light">
        <div className="mx-auto max-w-6xl">
          <h2 id="intervention-classifications" className="font-display text-3xl font-bold text-gold">Intervention classifications</h2>
          <p className="mt-4 text-ivory/80">Each nominated school should identify its most urgent intervention needs:</p>
          <BulletList items={SCHOOL_SUPPORT_INTERVENTIONS} columns />
        </div>
      </Section>

      <Section id="verified-schools" aria-labelledby="verified-schools-heading" className="scroll-mt-32">
        <div className="mx-auto max-w-6xl">
          <h2 id="verified-schools-heading" className="font-display text-3xl font-bold text-gold">View Verified Schools</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ivory/65">Each record shows {SPECIAL_NEEDS_FIELDS.join(" · ")} where verified data exists. Fields not yet verified display as “—”.</p>
          {loading ? (
            <p className="mt-8 text-sm text-ivory/60" role="status">Loading verified school records…</p>
          ) : error ? (
            <p className="mt-8 text-sm text-ivory/60" role="status">School records are temporarily unavailable. Please try again shortly.</p>
          ) : specialNeeds.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-gold/20 bg-ivory/[0.03] p-8 text-center">
              <p className="text-ivory/80">No verified and explicitly approved school profiles are currently available.</p>
              <p className="mt-2 text-sm text-ivory/60">Only verified and approved schools may be publicly profiled or admitted to regional selection.</p>
              <div className="mt-5"><ParticipationLink id="nominate" primary>Nominate a Special-Needs School</ParticipationLink></div>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {specialNeeds.map((school) => (
                <article key={school.id} className="rounded-2xl border border-gold/20 bg-ivory/[0.03] p-5">
                  <h3 className="font-display text-lg font-bold text-ivory">{school.name}</h3>
                  <dl className="mt-3 space-y-2 text-xs text-ivory/70">
                    <div className="flex justify-between gap-3"><dt>Country</dt><dd className="text-ivory/90">{dash(school.country)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Region</dt><dd className="text-ivory/90">{dash(school.region?.name)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Learner population</dt><dd className="text-ivory/90">{school.studentCount === null ? "—" : school.studentCount.toLocaleString()}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Identified need</dt><dd className="text-right text-ivory/90">{dash(school.description)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Intervention</dt><dd className="text-right text-ivory/90">{dash(school.interventionNotes)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Progress</dt><dd className="text-ivory/90">{dash(school.interventionStatus)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Outcome</dt><dd className="text-ivory/90">{school.endDate ? "Delivered" : "—"}</dd></div>
                  </dl>
                  <div className="mt-5"><ParticipationLink id="sponsor">Sponsor a Verified School</ParticipationLink></div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section aria-labelledby="voting-rules" className="border-y border-gold/20 bg-charcoal-light">
        <div className="mx-auto max-w-6xl">
          <h2 id="voting-rules" className="font-display text-3xl font-bold text-gold">Voting rules</h2>
          <p className="mt-5 max-w-3xl font-semibold text-gold">{getSchoolVotingLabel()}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-ivory/85">Public participation applies only to the Africa Special Needs Education Support Fund and must not be presented as voting for the NESA-Africa 2026 awards.</p>
          <h3 className="mt-6 font-semibold text-ivory">Voting may begin in September 2027 only after:</h3>
          <BulletList items={SCHOOL_SUPPORT_VOTING_REQUIREMENTS} columns />
          <h3 className="mt-8 font-semibold text-ivory">Implement:</h3>
          <BulletList items={SCHOOL_SUPPORT_VOTING_SAFEGUARDS} columns />
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ivory/80">Do not sell votes. Donations and sponsorships must not purchase additional votes or influence vote totals.</p>
        </div>
      </Section>

      <Section aria-labelledby="sponsorship-partnership">
        <div className="mx-auto max-w-6xl">
          <h2 id="sponsorship-partnership" className="font-display text-3xl font-bold text-gold">Sponsorship and partnership</h2>
          <h3 className="mt-6 font-display text-2xl font-bold text-ivory">Sponsor or Partner With the Programme</h3>
          <p className="mt-4 font-semibold text-ivory/85">Sponsorship and partnership are open to:</p>
          <BulletList items={SCHOOL_SUPPORT_SPONSOR_TYPES} columns />
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div><h3 className="font-display text-2xl font-bold text-ivory">Sponsorship opportunities</h3><p className="mt-3 text-sm text-ivory/70">Individuals and organisations may support:</p><BulletList items={SCHOOL_SUPPORT_SPONSORSHIP_OPPORTUNITIES} /></div>
            <div><h3 className="font-display text-2xl font-bold text-ivory">Partnership opportunities</h3><p className="mt-3 text-sm text-ivory/70">Partners may provide:</p><BulletList items={SCHOOL_SUPPORT_PARTNERSHIP_OPPORTUNITIES} /></div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ParticipationLink id="sponsor">Sponsor a Verified School</ParticipationLink>
            <ParticipationLink id="region">Support an African Region</ParticipationLink>
            <ParticipationLink id="donate">Fund an Intervention</ParticipationLink>
            <ParticipationLink id="equipment">Donate Equipment</ParticipationLink>
            <ParticipationLink id="volunteer">Offer Professional Services</ParticipationLink>
            <ParticipationLink id="partner">Become a Corporate Partner</ParticipationLink>
            <ParticipationLink id="partner">Request a Partnership Discussion</ParticipationLink>
          </div>
          <blockquote className="mt-10 rounded-xl border border-gold/30 bg-gold/10 p-6 font-display text-xl leading-relaxed text-ivory">{SCHOOL_SUPPORT_SPONSORSHIP_INTEGRITY}</blockquote>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">Do not publish a company as a confirmed partner until a written partnership agreement or verified contribution has been received and approved.</p>
        </div>
      </Section>

      <Section aria-labelledby="donation-controls" className="border-y border-gold/20 bg-charcoal-light">
        <div className="mx-auto max-w-6xl">
          <h2 id="donation-controls" className="font-display text-3xl font-bold text-gold">Donation controls</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-ivory/85">The Google Form may collect donation or sponsorship interest, but it must not collect card numbers, PINs, passwords, banking credentials or verification codes.</p>
          <h3 className="mt-6 font-semibold text-ivory">Separate these statuses:</h3>
          <BulletList items={SCHOOL_SUPPORT_DONATION_STATUSES} columns />
          <p className="mt-6 max-w-3xl rounded-xl border border-gold/30 p-5 text-sm leading-relaxed text-ivory/85">{SCHOOL_SUPPORT_DONATION_NOTICE}</p>
          <div className="mt-6"><ParticipationLink id="donate" primary>Donate to the Support Fund</ParticipationLink></div>
        </div>
      </Section>

      <Section aria-labelledby="programme-timetable">
        <div className="mx-auto max-w-6xl">
          <h2 id="programme-timetable" className="font-display text-3xl font-bold text-gold">2027 Regional Special-Needs Education Support Programme</h2>
          <div className="mt-8 overflow-x-auto rounded-xl border border-gold/20">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-gold/10 text-gold"><tr><th scope="col" className="p-4 font-semibold">Period</th><th scope="col" className="p-4 font-semibold">Activity</th></tr></thead>
              <tbody>{SCHOOL_SUPPORT_TIMETABLE.map((row) => <tr key={row.period} className="border-t border-gold/15"><th scope="row" className="whitespace-nowrap p-4 font-semibold text-ivory">{row.period}</th><td className="p-4 leading-relaxed text-ivory/75">{row.activity}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ivory/75">{SCHOOL_SUPPORT_TIMETABLE_NOTICE}</p>
        </div>
      </Section>

      <Section aria-labelledby="public-accountability" className="border-y border-gold/20 bg-charcoal-light">
        <div className="mx-auto max-w-6xl">
          <h2 id="public-accountability" className="font-display text-3xl font-bold text-gold">Public accountability</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-ivory/85">Publish a regional dashboard showing only approved information:</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCHOOL_SUPPORT_DASHBOARD_FIELDS.map((field) => <div key={field} className="rounded-lg border border-gold/20 p-4"><p className="text-sm capitalize text-ivory/80">{field}</p><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gold">CONTENT REQUIRED</p></div>)}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ivory/75">Do not publish children’s names, diagnoses, identity documents, personal contacts or unapproved school information.</p>
        </div>
      </Section>

      <Section className="text-center">
        <div className="mx-auto max-w-4xl">
          <p className="font-display text-3xl font-bold leading-tight text-gold md:text-4xl">{SCHOOL_SUPPORT_PROGRAMME.campaignLine}</p>
          <p className="mt-4 text-ivory/75">{SCHOOL_SUPPORT_PROGRAMME.supportingLine}</p>
          <Link to={SCHOOL_SUPPORT_PARTICIPATE_ROUTE} className={`${primaryActionClass} mt-8`}>How would you like to participate?</Link>
        </div>
      </Section>
    </>
  );
}
