import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Vote,
  Scale,
  FileCheck,
  AlertTriangle,
  QrCode,
  Eye,
  UserCheck,
  Ban,
  Lock,
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";
import { SponsorFirewallBanner } from "@/components/governance/SponsorFirewallBanner";

interface Section {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string[];
}

const sections: Section[] = [
  {
    id: "transparency",
    icon: Eye,
    title: "Transparency",
    content: [
      "All award rules, evaluation rubrics, scoring formulas, and timelines are published and version-controlled.",
      "Results are computed using deterministic functions with logged computation IDs that any stakeholder can audit.",
      "Annual integrity reports summarise nominations, votes processed, jury decisions, appeals and outcomes.",
    ],
  },
  {
    id: "conflict-of-interest",
    icon: UserCheck,
    title: "Conflict of Interest (COI)",
    content: [
      "Mandatory COI declarations from every NRC reviewer, judge, sponsor representative and board member before any engagement with nominees.",
      "Automatic recusal when a relationship is declared (employment, board service, family, prior consulting, financial interest).",
      "COI records are retained for the full award cycle and available to auditors on request.",
    ],
  },
  {
    id: "independent-verification",
    icon: Shield,
    title: "Independent Verification (NRC)",
    content: [
      "30 NRC (Nominee Research Corps) volunteers verify every nomination against an 18-point rubric.",
      "2-of-3 quorum rule: two independent reviewers must agree for approval or rejection.",
      "72-hour SLA per reviewer, with automatic escalation to NRC Lead after 96 hours.",
      "All state changes are recorded in an append-only audit log.",
    ],
  },
  {
    id: "voting-integrity",
    icon: Vote,
    title: "Voting Integrity",
    content: [
      "Every vote is recorded with a device fingerprint and timestamp; duplicate-voting attempts are blocked at the database layer.",
      "Gold Certificate voting is 100% public — 1 vote = 1 AGC (Afri-Gold Coin participation credit).",
      "Blue Garnet voting is hybrid: 40% public vote weight + 60% jury evaluation.",
      "Automated fraud detection monitors for burst voting (>10 votes/60s) and device reuse across accounts.",
    ],
  },
  {
    id: "judge-independence",
    icon: Scale,
    title: "Judge Independence",
    content: [
      "27-member jury panel selected through a rigorous application, OTP-secured onboarding and reference check.",
      "Judges sign an independence undertaking and operate under a chair-led, panel-blinded scoring process.",
      "Blue Garnet Final Score = (0.40 × Public Score) + (0.60 × Jury Score), computed deterministically.",
      "All jury scores are locked upon submission and cannot be retrospectively altered.",
    ],
  },
  {
    id: "anti-bribery",
    icon: Ban,
    title: "Anti-Bribery & Anti-Influence",
    content: [
      "NESA-Africa enforces a zero-tolerance policy on bribery, kickbacks, gifts of value and undue influence.",
      "Attempts to influence nominations, voting or judging trigger immediate disqualification and a permanent record in the audit trail.",
      "All financial flows (sponsorship, donations, fees) are settled to the Master Account via approved channels only.",
    ],
  },
  {
    id: "sponsor-firewall",
    icon: ShieldCheck,
    title: "Sponsor Firewall",
    content: [
      "Sponsors, partners, donors and endorsers have zero access to nomination, judging or jury data.",
      "Category sponsorship supports visibility and programme delivery only — it does not influence award results.",
      "Sponsorship, partnership, donations, endorsements and visibility opportunities do not influence nominees, judges, finalists, laureate selection, or winners.",
    ],
  },
  {
    id: "appeals",
    icon: MessageSquareWarning,
    title: "Appeals & Complaints",
    content: [
      "Any nominee, voter or member of the public may file an appeal or complaint via the verification page or support centre.",
      "Appeals are reviewed by an independent panel separate from the original decision-makers.",
      "Outcomes are documented with reasons and logged in the audit trail; vexatious filings are recorded but do not block legitimate review.",
    ],
  },
  {
    id: "data-protection",
    icon: Lock,
    title: "Data Protection & Safeguarding",
    content: [
      "Personal data is processed under the NESA-Africa Privacy Policy with role-based access and row-level security.",
      "PII is masked from unauthorised roles; admin actions on sensitive records are audit-logged.",
      "Safeguarding standards apply to minors, special-needs nominees and vulnerable participants across all programmes.",
    ],
  },
  {
    id: "certificate-security",
    icon: FileCheck,
    title: "Certificate Security",
    content: [
      "Every certificate includes a unique serial number and SHA-256 verification hash.",
      "QR codes link to a public verification page confirming authenticity, tier, category and year.",
      "Certificates are locked until the nominee has accepted and meets the re-nomination threshold.",
      "Revoked certificates are permanently blocked from download and verification.",
    ],
  },
  {
    id: "misuse-reporting",
    icon: AlertTriangle,
    title: "Misuse Reporting",
    content: [
      "Any member of the public can report suspected certificate misuse via the verification page.",
      "Reports are reviewed by the admin team with audit-logged outcomes.",
      "Confirmed misuse triggers certificate revocation and a permanent record in the audit trail.",
    ],
  },
  {
    id: "verification-transparency",
    icon: QrCode,
    title: "Verification & Audit",
    content: [
      "Published results include the computation inputs (weights, timestamps) for independent verification.",
      "All migrations, edge functions and policies are open and reviewable by partner institutions on request.",
      "Sponsors and partners have zero access to nomination, voting or jury data — merit integrity is absolute.",
    ],
  },
];

export default function GovernancePage() {
  return (
    <>
      <Helmet>
        <title>Governance & Integrity | NESA-Africa 2026</title>
        <meta
          name="description"
          content="NESA-Africa governance framework: transparency, conflict of interest, independent verification, voting integrity, judge independence, anti-bribery, sponsor firewall, appeals, data protection and certificate security."
        />
        <link rel="canonical" href="https://www.nesa.africa/governance" />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <section className="py-16 md:py-24">
          <div className="container max-w-5xl">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Governance Framework
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Integrity, Transparency & Accountability
              </h1>
              <p className="text-white/65 max-w-2xl mx-auto">
                NESA-Africa operates under a governance-grade framework ensuring every
                nomination, vote and award is earned on merit alone — credible to
                UNESCO, the African Union, development partners, ministries of
                education and donors.
              </p>
            </div>

            {/* Persistent firewall callout at the top of the hub */}
            <div className="mb-10">
              <SponsorFirewallBanner />
            </div>

            {/* Section anchor index */}
            <nav
              aria-label="Governance sections"
              className="mb-10 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm"
            >
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="px-3 py-2 rounded-lg border border-gold/15 bg-white/3 text-white/70 hover:text-gold hover:border-gold/40 transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </nav>

            <div className="space-y-8">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-32 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                      <h2 className="font-display text-xl md:text-2xl font-bold text-white">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-white/70 text-sm leading-relaxed"
                        >
                          <span className="text-gold mt-1 shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
