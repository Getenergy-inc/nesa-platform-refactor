// EduAid-Africa Journal — the quarterly impact, evidence and policy hub.
//
// Data discipline (identical to the rest of the Education Social Impact
// section): nothing on this page is fabricated. Streams with no backend
// content render an explicit, intentional empty state; statistics come from
// the existing `education_impact_public_stats` / `education_impact_public_schools`
// RPCs through the canonical hooks — no second data layer is introduced here.

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Globe2,
  Mic,
  PenLine,
  School,
  Sparkles,
  Users,
} from "lucide-react";
import {
  IMPACT_BRAND,
  IMPACT_REPORT_FIELDS,
  IMPACT_TRUST_STATEMENTS,
  FRIENDS_BRAND,
  FRIENDS_CTAS,
  FRIENDS_ROLE_CLARITY,
} from "@/config/educationSocialImpact";
import {
  JOURNAL_BRAND,
  JOURNAL_STREAMS,
  JOURNAL_HOW_IT_WORKS,
  JOURNAL_CONTACT,
} from "@/config/journal";
import {
  EDUAID_WEBINAR_SERIES_2026,
  EDUAID_SERIES_META,
} from "@/data/eduaidWebinarSeries2026";
import { useImpactSchools } from "@/hooks/useImpactSchools";
import EducationImpactStatsGrid from "@/components/impact/EducationImpactStatsGrid";

const fundIntervention =
  FRIENDS_CTAS.find((c) => c.label === "Fund an Education Intervention")?.href ??
  "/eduaid-africa/rebuild-my-school";
const becomeFriend =
  FRIENDS_CTAS.find((c) => c.label.startsWith("Become a Friend"))?.href ?? "/donate";

/** Shared, deliberately-empty state — reads as intentional, never broken. */
function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6 sm:p-8 text-center">
      <Icon className="mx-auto h-7 w-7 text-gold/70" aria-hidden />
      <p className="mt-3 font-playfair text-lg font-bold text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-white/60">{body}</p>
      {action && (
        <Link
          to={action.href}
          className="mt-4 inline-block rounded-lg border border-gold/40 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold/10"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

function SectionHeading({ id, title, note }: { id?: string; title: string; note?: string }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gold">{title}</h2>
      {note && <p className="mt-2 max-w-3xl text-sm text-white/60">{note}</p>}
    </div>
  );
}

export default function EduAidJournal() {
  const { schools, loading, error } = useImpactSchools();
  const reported = schools.filter((s) => s.isSupported);

  // A webinar report can only exist once an episode has aired.
  const today = new Date().toISOString().slice(0, 10);
  const airedEpisodes = EDUAID_WEBINAR_SERIES_2026.filter((e) => e.isoDate <= today);
  const upcomingEpisodes = EDUAID_WEBINAR_SERIES_2026.filter((e) => e.isoDate > today).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>EduAid-Africa Journal | Documenting Education Impact Across Africa</title>
        <meta
          name="description"
          content="Quarterly impact, evidence and policy publication of EduAid-Africa. Explore verified school interventions, webinar reports, regional impact, policy columns, and the growing movement of Friends of EduAid-Africa."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/journal" />
        <meta property="og:title" content="EduAid-Africa Journal" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nesaafrica.lovable.app/journal" />
      </Helmet>

      {/* 1 — HERO */}
      <section className="bg-charcoal text-white px-4 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-gold">NESA-Africa</Link>
            <span className="mx-2">/</span>
            <Link to="/impact" className="hover:text-gold">Education Social Impact</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Journal</span>
          </nav>

          <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
            {JOURNAL_BRAND.cadence} publication
          </p>
          <h1 className="mt-2 font-playfair text-3xl md:text-5xl font-bold text-gold">
            {JOURNAL_BRAND.name}
          </h1>
          <p className="mt-3 max-w-3xl font-playfair text-lg md:text-2xl text-white/90">
            {JOURNAL_BRAND.tagline}
          </p>
          <p className="mt-4 max-w-3xl text-sm md:text-base text-white/70">
            {JOURNAL_BRAND.intro}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <a
              href="#latest-issue"
              className="rounded-lg bg-gold px-5 py-3 text-center text-sm font-semibold text-charcoal hover:bg-gold/90"
            >
              Explore Latest Issue
            </a>
            <Link
              to="/impact/stories"
              className="rounded-lg border border-gold/40 px-5 py-3 text-center text-sm font-semibold text-gold hover:bg-gold/10"
            >
              Read Impact Stories
            </Link>
            <Link
              to={fundIntervention}
              className="rounded-lg border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white/85 hover:border-gold/40 hover:text-gold"
            >
              Support an Intervention
            </Link>
          </div>

          <p className="mt-6 text-xs uppercase tracking-wider text-white/50">
            {JOURNAL_BRAND.secondaryLine}
          </p>
          <p className="mt-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            {IMPACT_BRAND.fundingLine}
          </p>
        </div>
      </section>

      {/* 2 — CONTENT STREAMS */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Content Streams" note="Every stream below is either live, or openly marked as in preparation." />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNAL_STREAMS.map((s) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-playfair text-lg font-bold text-white">{s.title}</h3>
                    <span
                      className={
                        s.live
                          ? "shrink-0 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gold"
                          : "shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/50"
                      }
                    >
                      {s.live ? "Live" : "In preparation"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/65">{s.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                    {s.live ? "Open" : "See status"} <ArrowRight className="h-3 w-3" aria-hidden />
                  </span>
                </>
              );
              const className =
                "block rounded-2xl border border-gold/20 bg-white/[0.03] p-5 transition hover:border-gold/50 hover:bg-white/[0.06]";
              return s.href.startsWith("#") ? (
                <a key={s.id} href={s.href} className={className}>{inner}</a>
              ) : (
                <Link key={s.id} to={s.href} className={className}>{inner}</Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 — LATEST ISSUE */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <SectionHeading id="latest-issue" title="Latest Issue" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
            <div className="aspect-[3/4] rounded-2xl border border-dashed border-gold/30 bg-white/[0.03] flex flex-col items-center justify-center p-6 text-center">
              <BookOpen className="h-8 w-8 text-gold/70" aria-hidden />
              <p className="mt-3 font-playfair text-lg font-bold text-white">Issue —</p>
              <p className="mt-1 text-xs text-white/55">Cover artwork publishes with the first issue.</p>
            </div>
            <div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 px-4 py-3">
                  <dt className="text-[11px] uppercase tracking-wider text-white/50">Issue number</dt>
                  <dd className="mt-1 text-white/90">—</dd>
                </div>
                <div className="rounded-xl border border-white/10 px-4 py-3">
                  <dt className="text-[11px] uppercase tracking-wider text-white/50">Publication date</dt>
                  <dd className="mt-1 text-white/90">—</dd>
                </div>
              </dl>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="rounded-xl border border-dashed border-white/15 px-4 py-5">
                    <p className="text-[11px] uppercase tracking-wider text-white/40">Featured article {n}</p>
                    <p className="mt-1 text-sm text-white/60">Awaiting first issue.</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <span
                  aria-disabled="true"
                  className="inline-block cursor-not-allowed rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white/40"
                >
                  Read Full Issue — first issue in preparation
                </span>
              </div>
              <p className="mt-3 text-xs text-white/55">
                No issue has been published yet. The first edition is in preparation and will appear here
                once its interventions, stories and columns have been verified — nothing is previewed early.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — LIVE DATA DASHBOARD */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            id="impact-data"
            title="Education Impact Data"
            note="Read directly from verified programme records. “—” means not yet captured — it never means zero."
          />
          <div className="mt-6">
            <EducationImpactStatsGrid
              only={["schools", "learners", "teachers", "communities", "regions", "completed"]}
            />
          </div>
        </div>
      </section>

      {/* 5a — WEBINAR REPORTS */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            id="webinar-reports"
            title="Recent Webinar Reports"
            note={`${EDUAID_SERIES_META.name} · ${EDUAID_SERIES_META.strapline}`}
          />
          <div className="mt-6">
            <EmptyState
              icon={Mic}
              title="No webinar report has been published yet"
              body={
                airedEpisodes.length === 0
                  ? `The series begins on ${EDUAID_SERIES_META.seriesStartLabel}. A written report is published only after an episode has aired and been reviewed.`
                  : "Reports for aired episodes are being finalised. Each report publishes only after review — no summaries are drafted in advance."
              }
              action={{ label: "See the webinar schedule", href: JOURNAL_CONTACT.webinarsHref }}
            />
            {upcomingEpisodes.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {upcomingEpisodes.map((e) => (
                  <div key={e.id} className="rounded-xl border border-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/45">
                      Episode {e.episode} · {e.dateLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/90">{e.title}</p>
                    <p className="mt-1 text-xs text-white/55">Report publishes after the episode airs.</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5b — IMPACT STORIES */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            id="impact-stories"
            title="Latest Impact Stories"
            note="Stories are curated and published on the Impact Stories & Media page — this Journal links to that single source rather than keeping a second copy."
          />
          <div className="mt-6">
            <EmptyState
              icon={Sparkles}
              title="Story publishing is in preparation"
              body="School, teacher, learner and community stories publish alongside verified interventions. Explore the story strands and documentation standards on the Impact Stories page."
              action={{ label: "Go to Impact Stories & Media", href: "/impact/stories" }}
            />
          </div>
        </div>
      </section>

      {/* 5c — SCHOOL TRANSFORMATION / IMPACT REPORTS */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            id="impact-reports"
            title="Impact Reports & School Transformation"
            note="Every published intervention is reported against a fixed disclosure set."
          />

          <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {IMPACT_REPORT_FIELDS.map((f) => (
              <li key={f} className="rounded-lg border border-white/10 px-4 py-3 text-sm text-white/75">
                {f}
              </li>
            ))}
          </ul>

          <div id="school-transformation" className="mt-8 scroll-mt-24">
            {loading ? (
              <p className="text-sm text-white/60">Loading published reports…</p>
            ) : error ? (
              <p className="text-sm text-white/60">
                Reports are temporarily unavailable. Please try again shortly.
              </p>
            ) : reported.length === 0 ? (
              <EmptyState
                icon={School}
                title="No intervention report has been published yet"
                body="Reports publish only after delivery, verification and governance sign-off. No projected or estimated figures appear anywhere in the Journal."
                action={{ label: "Support a school intervention", href: fundIntervention }}
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {reported.map((s) => (
                  <article key={s.id} className="rounded-2xl border border-gold/20 bg-white/[0.03] p-5">
                    <h3 className="font-playfair text-lg font-bold text-white">{s.name}</h3>
                    <p className="text-xs text-white/60">
                      {s.country ?? "—"} · {s.region?.name ?? "—"}
                    </p>
                    <dl className="mt-3 space-y-1 text-xs text-white/70">
                      <div className="flex justify-between gap-3"><dt>Intervention delivered</dt><dd className="text-right text-white/90">{s.interventionNotes ?? "—"}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Beneficiaries</dt><dd className="text-white/90">{s.studentCount === null ? "—" : s.studentCount.toLocaleString()}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Status</dt><dd className="text-white/90">{s.interventionStatus ?? "—"}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Started</dt><dd className="text-white/90">{s.startDate ?? "—"}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Completed</dt><dd className="text-white/90">{s.endDate ?? "—"}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5d — REGIONAL IMPACT */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6 sm:p-8">
            <Globe2 className="h-7 w-7 text-gold/80" aria-hidden />
            <h2 className="mt-3 font-playfair text-2xl font-bold text-gold">Regional Impact</h2>
            <p className="mt-2 max-w-3xl text-sm text-white/70">
              Interventions are grouped across the canonical African regions and the Diaspora. The
              region browser lives on one page only — the Journal links to it rather than duplicating it.
            </p>
            <Link
              to="/impact/regional"
              className="mt-4 inline-block rounded-lg border border-gold/40 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10"
            >
              Explore Regional Impact →
            </Link>
          </div>
        </div>
      </section>

      {/* 5e — POLICY COLUMNS */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            id="policy-columns"
            title="Policy & White Paper Columns"
            note="Continental education policy analysis, evidence notes and invited columns."
          />
          <div className="mt-6">
            <EmptyState
              icon={PenLine}
              title="No column has been published yet"
              body="The editorial call for columns and white papers is open. Contributions are reviewed before publication — no placeholder or sample columns are displayed."
              action={{ label: "Contribute a column", href: JOURNAL_CONTACT.partnerHref }}
            />
          </div>
        </div>
      </section>

      {/* 5f — FRIENDS */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6 sm:p-8">
            <Users className="h-7 w-7 text-gold/80" aria-hidden />
            <h2 className="mt-3 font-playfair text-2xl font-bold text-gold">{FRIENDS_BRAND.name}</h2>
            <p className="mt-2 max-w-3xl text-sm text-white/70">{FRIENDS_BRAND.shortDescription}</p>
            <Link
              to="/impact/friends-of-eduaid-africa"
              className="mt-4 inline-block rounded-lg border border-gold/40 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10"
            >
              Meet the movement →
            </Link>
          </div>
        </div>
      </section>

      {/* 6 — HOW THE JOURNAL WORKS */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="How the Journal Works" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {JOURNAL_HOW_IT_WORKS.map((b) => (
              <div key={b.title} className="rounded-xl border border-gold/20 bg-white/[0.03] p-5">
                <h3 className="text-sm font-semibold text-gold">{b.title}</h3>
                <p className="mt-2 text-sm text-white/70">{b.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 p-5 sm:p-6">
            <h3 className="font-playfair text-lg font-bold text-white">Who does what</h3>
            <p className="mt-2 text-sm text-white/65">{IMPACT_BRAND.overviewMessage}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {FRIENDS_ROLE_CLARITY.map((r) => (
                <li key={r.actor} className="rounded-lg border border-white/10 px-4 py-3 text-sm">
                  <span className="font-semibold text-gold">{r.actor}</span>
                  <span className="text-white/70"> — {r.role}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-white/55">{IMPACT_BRAND.eduaidPositioning}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {IMPACT_TRUST_STATEMENTS.map((t) => (
              <div key={t.title} className="rounded-xl border border-gold/20 bg-white/[0.03] p-5">
                <h3 className="text-sm font-semibold text-gold">{t.title}</h3>
                <p className="mt-2 text-sm text-white/70">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — CTA BAND */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto rounded-2xl border border-gold/30 bg-gold/[0.06] p-6 sm:p-10">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gold">
            Become part of the story
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-white/70">{FRIENDS_BRAND.featureMessage}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link to={becomeFriend} className="rounded-lg bg-gold px-4 py-3 text-center text-sm font-semibold text-charcoal hover:bg-gold/90">
              Become a Friend of EduAid-Africa
            </Link>
            <Link to={fundIntervention} className="rounded-lg border border-gold/40 px-4 py-3 text-center text-sm font-semibold text-gold hover:bg-gold/10">
              Support a School Intervention
            </Link>
            <Link to={JOURNAL_CONTACT.partnerHref} className="rounded-lg border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white/85 hover:border-gold/40 hover:text-gold">
              Contribute a Column
            </Link>
            <Link to={JOURNAL_CONTACT.webinarsHref} className="rounded-lg border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white/85 hover:border-gold/40 hover:text-gold">
              Watch Upcoming Webinars
            </Link>
          </div>
        </div>
      </section>

      {/* 8 — JOURNAL FOOTER */}
      <section className="bg-charcoal text-white px-4 pb-20">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div id="archive" className="scroll-mt-24 rounded-xl border border-white/10 p-5">
            <FileText className="h-5 w-5 text-gold/70" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold text-gold">Archive of past issues</h3>
            <p className="mt-2 text-sm text-white/60">
              No issues have been archived yet. The archive opens with the second edition.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <PenLine className="h-5 w-5 text-gold/70" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold text-gold">Submit a column / partner</h3>
            <a href={JOURNAL_CONTACT.columnMailto} className="mt-2 inline-block text-sm text-white/75 underline hover:text-gold">
              Email the editorial desk
            </a>
            <Link to={JOURNAL_CONTACT.partnerHref} className="mt-1 block text-sm text-white/60 hover:text-gold">
              Partner enquiry →
            </Link>
          </div>
          <div id="annual-review" className="scroll-mt-24 rounded-xl border border-white/10 p-5">
            <BookOpen className="h-5 w-5 text-gold/70" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold text-gold">Annual Impact Review</h3>
            <p className="mt-2 text-sm text-white/60">
              No annual review is available for download yet. The first review publishes at the close of
              the current cycle.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <Users className="h-5 w-5 text-gold/70" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold text-gold">Contact the journal editor</h3>
            <a href={JOURNAL_CONTACT.editorMailto} className="mt-2 inline-block text-sm text-white/75 underline hover:text-gold">
              journal@nesa.africa
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
