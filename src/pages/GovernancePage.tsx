import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Shield, Vote, Scale, FileCheck, AlertTriangle, QrCode } from "lucide-react";

const sections = [
  {
    icon: Vote,
    title: "Public Vote Integrity",
    content: [
      "Every vote is recorded with a device fingerprint and timestamp to prevent duplicate voting.",
      "Gold Certificate voting is 100% public — 1 vote = 1 AGC (Afrigold Participation Credit).",
      "Blue Garnet voting is hybrid: 40% public vote weight + 60% jury evaluation.",
      "Automated fraud detection monitors for burst voting (>10 votes/60s) and device reuse across accounts.",
    ],
  },
  {
    icon: Scale,
    title: "Jury Evaluation Structure",
    content: [
      "27-member jury panel selected through a rigorous application and onboarding process.",
      "Mandatory Conflict of Interest (COI) declarations required before scoring any nominee.",
      "Blue Garnet Final Score = (0.40 × Public Score) + (0.60 × Jury Score), computed deterministically.",
      "All jury scores are locked upon submission and cannot be retrospectively altered.",
    ],
  },
  {
    icon: Shield,
    title: "NRC Verification & Audit",
    content: [
      "30 NRC (Nominee Research Corps) volunteers verify every nomination using an 18-point rubric.",
      "2-of-3 quorum rule: two independent reviewers must agree for approval or rejection.",
      "72-hour SLA for reviewer action, with automatic escalation to NRC Lead after 96 hours.",
      "All state changes are recorded in an append-only audit log for full institutional transparency.",
    ],
  },
  {
    icon: FileCheck,
    title: "Certificate Security",
    content: [
      "Every certificate includes a unique serial number and SHA-256 verification hash.",
      "QR codes link to a public verification page confirming authenticity, tier, category, and year.",
      "Certificates are locked until the nominee has accepted and meets the re-nomination threshold.",
      "Revoked certificates are permanently blocked from download and verification.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Misuse Reporting",
    content: [
      "Any member of the public can report suspected certificate misuse via the verification page.",
      "Reports are reviewed by the admin team with audit-logged outcomes.",
      "Confirmed misuse triggers certificate revocation and a permanent record in the audit trail.",
    ],
  },
  {
    icon: QrCode,
    title: "Verification & Transparency",
    content: [
      "All results are computed using deterministic scoring functions with logged computation IDs.",
      "Published results include the computation inputs (weights, timestamps) for independent verification.",
      "Sponsors and partners have zero access to nomination, voting, or jury data — merit integrity is absolute.",
    ],
  },
];

export default function GovernancePage() {
  return (
    <>
      <Helmet>
        <title>Governance | NESA-Africa — The African Blue-Garnet Awards for Education</title>
        <meta name="description" content="NESA-Africa governance framework: public vote integrity, jury evaluation, NRC verification, certificate security, and misuse reporting." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <section className="py-16 md:py-24">
          <div className="container max-w-4xl">
            <div className="text-center mb-14">
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Governance Framework
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Integrity & Transparency
              </h1>
              <p className="text-white/60 max-w-2xl mx-auto">
                NESA-Africa operates under a governance-grade framework ensuring every nomination, vote, and award is earned on merit alone.
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((section, idx) => {
                const Icon = section.icon;
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                      <h2 className="font-display text-xl font-bold text-white">{section.title}</h2>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex gap-3 text-white/70 text-sm leading-relaxed">
                          <span className="text-gold mt-1 shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
