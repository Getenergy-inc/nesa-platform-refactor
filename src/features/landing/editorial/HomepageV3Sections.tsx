import { ArrowRight, Check, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { SNS_CATEGORIES } from "@/config/schoolSupport";
import { IconPathwayCards } from "./IconFlagshipSection";

const SCHOOL = "/impact/special-needs-schools";
const SHARE_TEXT = "Who opened a door to learning for you? Nominate them at nesa.africa https://nesa.africa";

const nominationProps = {
  href: PUBLIC_ACTIONS_2026.nominate.href,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function HomeHookSection() {
  const { t } = useTranslation("pages");
  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`,
      icon: MessageCircle,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://nesa.africa")}&summary=${encodeURIComponent(SHARE_TEXT)}`,
      icon: Linkedin,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`,
      icon: Twitter,
    },
  ];

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="home-hook-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <h2 id="home-hook-heading" className="ed-section-title">
            {t("landingV3.hook.title", "Think of the person who opened a door to learning for you.")}
          </h2>
          <p className="ed-section-sub">
            {t(
              "landingV3.hook.body",
              "They may be an educator, philanthropist, author, curriculum advocate, technical trainer, influencer, company, NGO, media organisation, institution or community leader. Across Africa, they are everywhere.",
            )}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="ed-card">
            <p className="ed-card-badge">01</p>
            <h3>{t("landingV3.hook.meet", "Meet them")}</h3>
            <Link to="/nominees" className="ed-link-inline">
              {t("landingV3.hook.meet", "Meet them")} →
            </Link>
          </article>
          <article className="ed-card">
            <p className="ed-card-badge">02</p>
            <h3>{t("landingV3.hook.name", "Name them")}</h3>
            <p>{t("landingV3.hook.nameBody", "Put their education impact forward for research and review.")}</p>
            <a {...nominationProps} className="ed-link-inline">
              {t("landingV3.hook.name", "Name them")} →
            </a>
          </article>
          <article className="ed-card">
            <p className="ed-card-badge">03</p>
            <h3>{t("landingV3.hook.share", "Share them")}</h3>
            <p>{t("landingV3.hook.shareBody", "Invite someone else to recognise the person who opened a door to learning.")}</p>
            <div className="flex flex-wrap gap-2" aria-label={t("landingV3.hook.shareLabel", "Share this nomination invitation")}>
              {shareLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("landingV3.hook.shareOn", `Share on ${label}`, { platform: label })}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function HomeIconSection() {
  const { t } = useTranslation("pages");
  const bullets = [
    t("landingV3.icon.bullets.access", "Expanded access to education"),
    t("landingV3.icon.bullets.funding", "Funded schools, scholarships or learning programmes"),
    t("landingV3.icon.bullets.literacy", "Advanced literacy, books or curriculum development"),
    t("landingV3.icon.bullets.skills", "Built technical, vocational, scientific or digital skills"),
    t("landingV3.icon.bullets.inclusion", "Improved education quality, inclusion or opportunity"),
    t("landingV3.icon.bullets.model", "Created an education model with lasting impact"),
  ];

  return (
    <section className="ed-section" aria-labelledby="home-icon-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{t("landingV3.icon.eyebrow", "Tier 1 · Africa's highest education honour")}</div>
          <h2 id="home-icon-heading" className="ed-section-title">
            {t("landingV3.icon.title", "Who Is an Africa Education Icon?")}
          </h2>
          <p className="ed-section-sub">
            {t(
              "landingV3.icon.body",
              "An Africa Education Icon is a person whose sustained and verifiable work has made an exceptional contribution to education in Africa over the decade 2006–2026.",
            )}
          </p>
        </div>
        <div className="mx-auto mb-10 max-w-4xl">
          <h3 className="text-center font-serif text-xl text-white">{t("landingV3.icon.mayHave", "An Icon may have:")}</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 rounded-xl border border-gold/15 bg-white/[0.03] p-4 text-sm text-white/75">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <IconPathwayCards homeV3 />
        <p className="mx-auto mt-8 max-w-4xl text-center text-sm leading-relaxed text-white/65">
          {t(
            "landingV3.icon.note",
            "Public visibility alone does not make someone an Icon. Recognition is based on evidence of meaningful and sustained education impact. Nine independent judges · Icons announced online on 28 December 2026.",
          )}
        </p>
        <div className="mt-7 text-center">
          <Link to="/awards/africa-education-icon" className="ed-btn-primary">
            {t("landingV3.icon.explore", "Explore Tier 1 — Africa Education Icons")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeEligibilitySection() {
  const { t } = useTranslation("pages");
  const cards = [
    {
      title: t("landingV3.eligibility.africa.title", "Africans Living in Africa"),
      body: t(
        "landingV3.eligibility.africa.body",
        "African citizens and residents whose work is advancing education within their countries, communities, regions or across the continent.",
      ),
    },
    {
      title: t("landingV3.eligibility.diaspora.title", "Africans in the Diaspora"),
      body: t(
        "landingV3.eligibility.diaspora.body",
        "Africans living outside the continent whose knowledge, funding, advocacy, partnerships, technology or professional contribution supports education in Africa.",
      ),
    },
    {
      title: t("landingV3.eligibility.friends.title", "Friends of Africa"),
      body: t(
        "landingV3.eligibility.friends.body",
        "People who are not African by nationality or heritage but have shown a genuine, sustained and verifiable commitment to improving education in Africa. They may include international educators, philanthropists, researchers, development partners, volunteers, advocates and institutional leaders.",
      ),
    },
  ];

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="home-eligibility-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <h2 id="home-eligibility-heading" className="ed-section-title">{t("landingV3.eligibility.title", "Who Is Eligible?")}</h2>
          <p className="ed-section-sub">{t("landingV3.eligibility.intro", "NESA-Africa welcomes nominations for education impact across Africa from:")}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="ed-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-4xl text-center text-sm font-semibold leading-relaxed text-gold">
          {t(
            "landingV3.eligibility.rule",
            "Being associated with Africa is not enough. The contribution must benefit African learners, educators, schools or education systems and must be supported by credible evidence.",
          )}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/awards" className="ed-btn-ghost">{t("landingV3.eligibility.pathways", "Check the Recognition Pathways")}</Link>
          <a {...nominationProps} className="ed-btn-primary">{t("landingV3.eligibility.nominate", "Submit a Nomination")}</a>
        </div>
      </div>
    </section>
  );
}

export function HomeRecognitionProcessSection() {
  const { t } = useTranslation("pages");
  return (
    <section className="ed-section" aria-labelledby="home-process-heading">
      <div className="ed-wrap text-center">
        <h2 id="home-process-heading" className="ed-section-title">{t("landingV3.process.title", "How Recognition Works")}</h2>
        <p className="mt-6 font-serif text-xl text-gold sm:text-2xl">
          {t("landingV3.process.flow", "Identify → Nominate → Verify → Document → Assess → Recognise")}
        </p>
        <p className="mx-auto mt-6 max-w-4xl leading-relaxed text-white/70">
          {t(
            "landingV3.process.body",
            "Submitting a nomination begins a review process. It does not automatically confirm identity verification, eligibility, judging or recognition. Tier 1 candidates are researched and independently assessed. The other tiers follow their approved research, review and documentary-recognition pathways.",
          )}
        </p>
        <Link to="/awards#how" className="ed-link-inline mt-6 inline-flex items-center gap-2">
          {t("landingV3.process.link", "How Recognition Works")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function HomeSchoolImpactSection() {
  const { t } = useTranslation("pages");
  const categories = SNS_CATEGORIES.filter((category) => category.image).slice(0, 8);
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="home-school-impact-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <h2 id="home-school-impact-heading" className="ed-section-title">{t("landingV3.school.title", "From Recognition to Education Impact")}</h2>
          <p className="ed-section-sub">
            {t("landingV3.school.bodyBefore", "Recognition should inspire further action. Through EduAid-Africa and Rebuild My School Africa, SCEF and NESA-Africa connect education recognition with the post-award ")}
            <strong className="text-gold">{t("landingV3.school.programmeName", "Support a Special-Needs School Across Africa")}</strong>
            {t("landingV3.school.bodyAfter", " programme.")}
          </p>
          <p className="ed-section-sub">
            {t(
              "landingV3.school.actions",
              "Individuals and organisations can nominate verified schools, give professional services, donate equipment, sponsor interventions or support accessible and inclusive education — one supported school in each of Africa's eight regions in 2027.",
            )}
          </p>
        </div>
        <ul className="flex max-w-full list-none snap-x gap-3 overflow-x-auto pb-3" aria-label={t("landingV3.school.categories", "School support category pictures")}>
          {categories.map((category) => (
            <li key={category.title} className="w-[112px] shrink-0 snap-start">
              <img
                src={category.image!.src}
                alt={t(`landingV3.school.categoryAlt.${category.title}`, category.image!.alt)}
                width={112}
                height={112}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-lg border border-gold/15 object-cover"
              />
              <span className="mt-1.5 block text-[10px] leading-tight text-white/65">{t(`landingV3.school.category.${category.title}`, category.title)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={SCHOOL} className="ed-btn-primary">{t("landingV3.school.support", "Support a Special-Needs School")}</Link>
          <Link to={`${SCHOOL}#partner`} className="ed-btn-ghost">{t("landingV3.school.partner", "Sponsor or Partner")}</Link>
        </div>
        <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-relaxed text-white/55">
          {t(
            "landingV3.school.independence",
            "Support for schools is separate from award recognition. Donations, sponsorships, partnerships and publicity do not influence eligibility, assessment or recognition decisions.",
          )}
        </p>
      </div>
    </section>
  );
}

export function HomeActionSection() {
  const { t } = useTranslation("pages");
  return (
    <section className="ed-section" aria-labelledby="home-action-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <h2 id="home-action-heading" className="ed-section-title">{t("landingV3.action.title", "Start With One Action")}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <article className="ed-card flex flex-col">
            <h3>{t("landingV3.action.nominate.title", "Know an Education Enabler?")}</h3>
            <p className="flex-1">{t("landingV3.action.nominate.body", "Nominate a person or organisation whose work deserves to be researched and documented.")}</p>
            <a {...nominationProps} className="ed-btn-primary self-start">{t("landingV3.action.nominate.cta", "Submit a Nomination")}</a>
          </article>
          <article className="ed-card flex flex-col">
            <h3>{t("landingV3.action.school.title", "Want to Help a School?")}</h3>
            <p className="flex-1">{t("landingV3.action.school.body", "Join the effort to support inclusive and special-needs education across Africa.")}</p>
            <Link to={SCHOOL} className="ed-btn-ghost self-start">{t("landingV3.action.school.cta", "Support a School")}</Link>
          </article>
          <article className="ed-card flex flex-col">
            <h3>{t("landingV3.action.involved.title", "Want to Contribute Your Skills or Resources?")}</h3>
            <p className="flex-1">{t("landingV3.action.involved.body", "Participate as a volunteer, sponsor, partner, researcher or member of an approved local chapter.")}</p>
            <Link to="/get-involved" className="ed-btn-ghost self-start">{t("landingV3.action.involved.cta", "Get Involved")}</Link>
          </article>
        </div>
      </div>
    </section>
  );
}
