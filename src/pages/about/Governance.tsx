import { AboutSeo } from "@/pages/about/AboutSeo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Ban,
  CheckCircle,
  Eye,
  FileText,
  Lock,
  Scale,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";

const firewalls = [
  {
    icon: Ban,
    title: "Sponsor Isolation",
    description: "Sponsors, donors, partners and media participants receive no nomination, scoring, judging or recognition advantage.",
    details: ["No branding on certificates", "No influence on category selection", "No access to nominee data"],
  },
  {
    icon: Lock,
    title: "Stage Locking",
    description: "Every significant status change records the responsible user, date and time, previous status, new status, supporting evidence and reason.",
    details: ["Nominations stage-gated", "Review permissions enforced", "Results secured until formal approval"],
  },
  {
    icon: Eye,
    title: "Full Audit Trail",
    description: "All relevant reviewers and judges must disclose actual, potential or perceived conflicts and recuse themselves from affected cases.",
    details: ["NRRC review logs", "Assessment timestamps", "Certificate issuance records"],
  },
  {
    icon: Scale,
    title: "Conflict of Interest",
    description: "Mandatory COI disclosure for NRRC, Jury, and Chapter leads.",
    details: ["Recusal requirements", "Third-party verification", "Public COI register"],
  },
];

const roles = [
  { name: "Public", access: "View approved categories, profiles and programme information", level: "Open" },
  { name: "Programme team", access: "Programme administration, approved communications and delivery", level: "Authorised" },
  { name: "Nominee Research and Review Corps", access: "Contact verification, consent, interviews, evidence review, preliminary eligibility review, profiles and dossiers", level: "Appointed" },
  { name: "Independent Icon judges", access: "Assess eligible Africa Education Icon dossiers", level: "Appointed" },
  { name: "SCEF governance", access: "Organisational oversight, policy control and process assurance", level: "Governance" },
  { name: "Admin", access: "Stage control, CMS, audit logs, compliance", level: "Staff" },
];

export default function Governance() {
  return (
    <>
      <AboutSeo
        title="Governance, Integrity and Independence | NESA-Africa Integrity Framework"
        description="NESA-Africa's governance framework ensures sponsor independence, judging integrity, and full accountability through multiple firewalls across every recognition tier."
        path="/about/governance"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Governance", path: "/about/governance" },
        ]}
      />

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Integrity Framework
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Independent, Evidence-Led and Accountable
              </h1>
              <p className="text-lg text-white/70">
                SCEF provides governance oversight. The NRRC handles research, contact checks, consent, interviews and profiles; nine independent Icon judges assess eligible Icon dossiers without performing the research role. Technical, programme and media teams have separate responsibilities.
              </p>
              <div className="mt-8 flex flex-wrap gap-3"><Button asChild className="bg-primary text-primary-foreground"><Link to="/nominate">Submit a Nomination</Link></Button><Button asChild variant="outline" className="border-primary/50 text-primary"><Link to="/contact?subject=concern">Report a Concern</Link></Button></div>
            </div>
          </div>
        </section>

        {/* Firewalls Grid */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Four Governance Firewalls
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {firewalls.map((fw) => (
                <Card key={fw.title} className="border-white/10 bg-white/5">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <fw.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-white">{fw.title}</CardTitle>
                    <CardDescription className="text-white/60">{fw.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {fw.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Role-Based Access */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center font-display text-3xl font-bold text-white">
              Role-Based Access Control
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-white/60">
              Responsibilities are limited by role and appointment. Selecting a workspace never grants access.
            </p>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-white/10">
              <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 text-sm font-medium text-white/80">
                <span>Role</span>
                <span>Access Level</span>
                <span>Permissions</span>
              </div>
              {roles.map((role) => (
                <div
                  key={role.name}
                  className="grid grid-cols-3 gap-4 border-t border-white/10 p-4 text-sm"
                >
                  <span className="font-medium text-white">{role.name}</span>
                  <Badge variant="outline" className="w-fit border-white/20 text-white/70">
                    {role.level}
                  </Badge>
                  <span className="text-white/60">{role.access}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Policies */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-white">
              Policy Documents
            </h2>
            <div className="mx-auto grid max-w-2xl gap-4">
              {[
                { label: "Privacy Policy", href: "/policies#privacy" },
                { label: "Terms of Service", href: "/policies#terms" },
                { label: "Conflict of Interest Policy", href: "/policies#conflicts" },
                { label: "Report a Concern", href: "/contact?subject=concern" },
              ].map((doc) => (
                <Link
                  key={doc.href}
                  to={doc.href}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-primary/50"
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-white">{doc.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
