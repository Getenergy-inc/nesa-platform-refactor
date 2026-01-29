import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
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
    description: "Sponsors never access nominations, voting, or jury processes.",
    details: ["No branding on certificates", "No influence on category selection", "No access to nominee data"],
  },
  {
    icon: Lock,
    title: "Stage Locking",
    description: "Each stage is locked/unlocked via config — no manual override possible.",
    details: ["Nominations stage-gated", "Voting windows enforced", "Results sealed until ceremony"],
  },
  {
    icon: Eye,
    title: "Full Audit Trail",
    description: "Every action is logged with timestamp, user, and IP address.",
    details: ["NRC review logs", "Vote timestamps", "Certificate issuance records"],
  },
  {
    icon: Scale,
    title: "Conflict of Interest",
    description: "Mandatory COI disclosure for NRC, Jury, and Chapter leads.",
    details: ["Recusal requirements", "Third-party verification", "Public COI register"],
  },
];

const roles = [
  { name: "Public", access: "View categories, nominees, vote (when open)", level: "Open" },
  { name: "User", access: "Submit nominations, track certificates, wallet", level: "Authenticated" },
  { name: "NRC", access: "Review nominations, validate evidence", level: "Verified" },
  { name: "Jury", access: "Score finalists, access sealed results", level: "Appointed" },
  { name: "Chapter", access: "Manage local events, regional nominations", level: "Regional" },
  { name: "Admin", access: "Stage control, CMS, audit logs, compliance", level: "Staff" },
];

export default function Governance() {
  return (
    <>
      <Helmet>
        <title>Governance & Firewalls | NESA-Africa Integrity Framework</title>
        <meta
          name="description"
          content="NESA-Africa's governance framework ensures sponsor independence, voting integrity, and full accountability through multiple firewalls."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <Link
              to="/about"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to About
            </Link>
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Integrity Framework
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Governance & Firewalls
              </h1>
              <p className="text-lg text-white/70">
                NESA-Africa is a governance-grade platform. Our multi-layered firewall system ensures
                sponsor independence, voting integrity, and full operational accountability.
              </p>
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
              10 distinct user roles with graduated permissions — from public viewing to full administrative control.
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
                { label: "Privacy Policy", href: "/policies/privacy" },
                { label: "Terms of Service", href: "/policies/terms" },
                { label: "Conflict of Interest Policy", href: "/policies/coi" },
                { label: "Voting Integrity Policy", href: "/policies/voting-integrity" },
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
