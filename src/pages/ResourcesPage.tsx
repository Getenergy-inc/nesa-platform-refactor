import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileText,
  Gavel,
  GraduationCap,
  ImageIcon,
  LifeBuoy,
  ScrollText,
  Users,
} from "lucide-react";

interface ResourceItem {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

interface ResourceGroup {
  heading: string;
  intro: string;
  items: ResourceItem[];
}

const GROUPS: ResourceGroup[] = [
  {
    heading: "Nominate & Endorse",
    intro: "Start a submission or back an Education Enabler.",
    items: [
      {
        label: "Nominate an Enabler",
        href: "/nominate",
        description: "Guided form with StageGate and category prefill.",
        icon: ClipboardCheck,
      },
      {
        label: "Endorsement Wizard",
        href: "/endorse",
        description: "Organisations back nominees with a 4-stage wizard.",
        icon: Users,
      },
      {
        label: "Nominee & Nominator Guidelines",
        href: "/nominate#nominee-guidelines",
        description: "Eligibility, evidence and integrity expectations.",
        icon: BookOpen,
      },
    ],
  },
  {
    heading: "Governance & Integrity",
    intro: "How NESA-Africa evaluates and protects the process.",
    items: [
      {
        label: "Judging Framework",
        href: "/governance#judging",
        description: "EDI matrix, competitive rubric and verification.",
        icon: Gavel,
      },
      {
        label: "Policies & COI",
        href: "/policies",
        description: "Privacy, terms, conflict-of-interest and voting integrity.",
        icon: ScrollText,
      },
      {
        label: "Certificate Verification",
        href: "/certificates/verify",
        description: "Confirm authenticity of any NESA-Africa credential.",
        icon: FileText,
      },
    ],
  },
  {
    heading: "Learn & Explore",
    intro: "Deep dives on the 2026 Recognition Edition.",
    items: [
      {
        label: "18 Award Categories",
        href: "/awards",
        description: "The full 4-tier · 18-category · 96-subcategory map.",
        icon: GraduationCap,
      },
      {
        label: "Media Library",
        href: "/media",
        description: "Shows, webinars, radio, press and NESA-TV archive.",
        icon: ImageIcon,
      },
      {
        label: "FAQs",
        href: "/faqs",
        description: "Answers to the questions we hear most often.",
        icon: LifeBuoy,
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Helmet>
        <title>Resources & Downloads | NESA-Africa 2026</title>
        <meta
          name="description"
          content="One hub for NESA-Africa 2026 resources — nomination guides, governance policies, judging frameworks, media assets and FAQs for Enablers of Education for All Across Africa."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/resources" />
      </Helmet>

      <div className="bg-charcoal min-h-screen text-white">
        <header className="border-b border-white/10 bg-gradient-to-b from-black/60 to-transparent">
          <div className="container py-12 md:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              Enablers of Education for All Across Africa
            </p>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl">
              Resources & Downloads
            </h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Everything a nominator, nominee, partner or journalist needs to
              engage with the 2026 Recognition Edition — organised into three
              clear tracks.
            </p>
          </div>
        </header>

        <div className="container space-y-12 py-12">
          {GROUPS.map((group) => (
            <section key={group.heading}>
              <div className="mb-5">
                <h2 className="font-serif text-2xl text-white">
                  {group.heading}
                </h2>
                <p className="mt-1 text-sm text-white/60">{group.intro}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {group.items.map(
                  ({ label, href, description, icon: Icon, external }) => {
                    const content = (
                      <>
                        <Icon className="h-6 w-6 text-gold" />
                        <h3 className="mt-3 font-serif text-lg text-white">
                          {label}
                        </h3>
                        <p className="mt-1 text-sm text-white/65">
                          {description}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                          Open{" "}
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                        </span>
                      </>
                    );
                    const className =
                      "group block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-gold/60 hover:bg-white/10";
                    return external ? (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={className}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link key={href} to={href} className={className}>
                        {content}
                      </Link>
                    );
                  },
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
