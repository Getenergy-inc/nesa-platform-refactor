/**
 * NESA-Africa Judges & NRC Portal Registry
 *
 * Central registry for the /judgeapply dropdown portal. Powers:
 *  - The three-area dropdown header (About ▼ · Judges ▼ · NRC ▼)
 *  - The main destination selector on /judgeapply
 *  - Area landing pages (About / Judges / NRC)
 *  - Auto-generated supporting pages from `pages[]`
 *
 * IMPORTANT: This registry is public navigation content only. It does NOT
 * grant NRC, judge, governance or administrator permissions.
 */

import {
  Info,
  ShieldCheck,
  HelpCircle,
  Users,
  Gavel,
  Scale,
  Award,
  UserPlus,
  Lock,
  Workflow,
  Layers,
  ClipboardCheck,
  Handshake,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type PortalAreaId = "about" | "judges" | "nrc";

export interface PortalPageContent {
  slug: string;             // last URL segment, e.g. "structure"
  title: string;            // <h1> and menu label
  short: string;            // short descriptor for cards / dropdown
  icon: LucideIcon;
  eyebrow?: string;
  sections: {
    heading: string;
    body: string;
    bullets?: string[];
  }[];
  cta?: {
    label: string;
    to: string;              // absolute route
    variant?: "primary" | "secondary";
  }[];
}

export interface PortalArea {
  id: PortalAreaId;
  label: string;             // dropdown label
  path: string;              // area landing path
  icon: LucideIcon;
  tagline: string;
  intro: string;
  landing: {
    highlights: { title: string; body: string; icon: LucideIcon }[];
    ctas: { label: string; to: string; variant?: "primary" | "secondary" }[];
  };
  pages: PortalPageContent[];
}

// ---------------------------------------------------------------------------
// ABOUT
// ---------------------------------------------------------------------------

const ABOUT: PortalArea = {
  id: "about",
  label: "About",
  path: "/judgeapply/about",
  icon: Info,
  tagline: "One portal. Two integrity engines.",
  intro:
    "NESA-Africa 2026 is verified by two independent integrity engines — the Nominee Research Corps (NRC) and the Judges Panels. This portal explains how they are structured, how they safeguard integrity, and how you can serve.",
  landing: {
    highlights: [
      {
        title: "Independent by design",
        body: "The NRC verifies evidence. The Judges deliberate on merit. Neither can override the other.",
        icon: ShieldCheck,
      },
      {
        title: "Two-phase NRC pipeline",
        body: "Phase One is automated intake, screening, classification and routing. Phase Two is human research, verification, quality review and handover.",
        icon: Workflow,
      },
      {
        title: "Audited & transparent",
        body: "Every access, edit, score and handover is logged. Results are independently verifiable.",
        icon: ClipboardCheck,
      },
    ],
    ctas: [
      { label: "How it works", to: "/judgeapply/about/structure", variant: "primary" },
      { label: "Read the FAQ", to: "/judgeapply/about/faq", variant: "secondary" },
    ],
  },
  pages: [
    {
      slug: "structure",
      title: "Portal Structure",
      short: "How the portal is organised across About, Judges and NRC.",
      icon: Layers,
      sections: [
        {
          heading: "One portal, three destinations",
          body:
            "The /judgeapply portal groups everything volunteers, recommenders and applicants need across three destinations — About, Judges and NRC. Each destination has a landing page and a set of supporting pages.",
        },
        {
          heading: "Judges and NRC are separate",
          body:
            "Judges deliberate on shortlisted nominees. The Nominee Research Corps (NRC) verifies evidence before shortlisting. These are separate rosters with separate governance, service standards and access controls.",
          bullets: [
            "Judges are recommended, screened and invited — never self-appointed.",
            "NRC members are trained researchers who follow a documented two-phase process.",
            "Dashboards for both are gated behind authenticated, role-based routes.",
          ],
        },
      ],
    },
    {
      slug: "integrity",
      title: "Integrity Framework",
      short: "The rules, firewalls and audit trails that protect the process.",
      icon: ShieldCheck,
      sections: [
        {
          heading: "Firewalled decision-making",
          body:
            "Evidence review (NRC) and merit deliberation (Judges) are firewalled. NRC members do not score. Judges do not curate evidence. Conflicts of interest are declared and enforced at the assignment layer.",
        },
        {
          heading: "Auditable at every step",
          body:
            "Every sign-in, assignment, evidence access, score edit and handover is recorded in an immutable audit log. Results include deterministic hashes so that no ranking can be silently altered.",
        },
      ],
    },
    {
      slug: "faq",
      title: "Frequently Asked Questions",
      short: "Common questions from applicants, recommenders and the public.",
      icon: HelpCircle,
      sections: [
        {
          heading: "Can I apply to be a judge directly?",
          body:
            "Judges are recommended and invited. You can submit your interest and be recommended by an accredited institution or existing judge.",
        },
        {
          heading: "Is joining the NRC the same as becoming a judge?",
          body:
            "No. The NRC is a separate research corps. Members verify evidence and never issue scores. Judges deliberate on shortlisted nominees.",
        },
        {
          heading: "Does this portal grant me access to dashboards?",
          body:
            "No. This portal is public navigation only. Dashboards remain behind authenticated, role-based routes with independent access controls.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// JUDGES
// ---------------------------------------------------------------------------

const JUDGES: PortalArea = {
  id: "judges",
  label: "Judges",
  path: "/judgeapply/judges",
  icon: Gavel,
  tagline: "Recommended. Screened. Invited.",
  intro:
    "The 2026 Judges Panels are formed by recommendation and rigorous screening. This section explains how judges are selected, the pathways available, the service standards expected, and how to recommend an expert.",
  landing: {
    highlights: [
      {
        title: "Selection by recommendation",
        body: "Judges are recommended by accredited institutions, alumni panels and existing judges — not self-nominated.",
        icon: UserPlus,
      },
      {
        title: "Multiple pathways",
        body: "Panels cover Africa Education Icon, Gold-Blue Garnet, Platinum and Influencer Impact tiers.",
        icon: Award,
      },
      {
        title: "Service standards",
        body: "Confidentiality, availability windows, conflict-of-interest declarations and audit compliance are mandatory.",
        icon: Scale,
      },
    ],
    ctas: [
      { label: "Recommend a judge", to: "/judgeapply/judges/recommend", variant: "primary" },
      { label: "Selection process", to: "/judgeapply/judges/selection", variant: "secondary" },
    ],
  },
  pages: [
    {
      slug: "selection",
      title: "Selection Process",
      short: "How candidates move from recommendation to invitation.",
      icon: ClipboardCheck,
      sections: [
        {
          heading: "Six-stage flow",
          body: "Recommendation → eligibility screening → conflict-of-interest review → panel matching → invitation → onboarding.",
        },
      ],
    },
    {
      slug: "pathways",
      title: "Judge Pathways",
      short: "The panels that judges may be invited to serve on.",
      icon: Award,
      sections: [
        {
          heading: "Four tier panels",
          body: "Africa Education Icon (Tier 1), Gold-Blue Garnet (Tier 2), Platinum Recognition (Tier 3) and Influencer Education Impact (Tier 4).",
        },
      ],
    },
    {
      slug: "service",
      title: "Service Standards",
      short: "What judges commit to during the 2026 cycle.",
      icon: Scale,
      sections: [
        {
          heading: "Commitments",
          body: "Confidentiality, availability during deliberation windows, conflict-of-interest declaration, and adherence to the deterministic scoring rubric.",
        },
      ],
    },
    {
      slug: "recommend",
      title: "Recommend a Judge",
      short: "Submit an accredited recommendation for the 2026 Judges Panel.",
      icon: UserPlus,
      sections: [
        {
          heading: "Who can recommend",
          body:
            "Accredited institutions, alumni panels of prior cycles and existing 2026 judges can submit recommendations. Recommenders must include contactable references.",
        },
        {
          heading: "How to submit",
          body:
            "Use the standard judges recommendation form. Submissions are reviewed by the Judges Selection Committee and are subject to conflict-of-interest checks.",
        },
      ],
      cta: [
        { label: "Open recommendation form", to: "/judge-apply", variant: "primary" },
      ],
    },
    {
      slug: "access",
      title: "Judges Access",
      short: "Secure sign-in for invited and onboarded judges.",
      icon: Lock,
      sections: [
        {
          heading: "Restricted access",
          body:
            "Only invited and onboarded judges may sign in. Access is protected by OTP and role-based checks. This public page does not grant access on its own.",
        },
      ],
      cta: [
        { label: "Go to Judges Sign-In", to: "/judge", variant: "primary" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// NRC
// ---------------------------------------------------------------------------

const NRC: PortalArea = {
  id: "nrc",
  label: "NRC",
  path: "/judgeapply/nrc",
  icon: Users,
  tagline: "Verification. Evidence. Integrity. Impact.",
  intro:
    "The Nominee Research Corps (NRC) verifies, curates and validates every nomination before it reaches the Judges. Our two-phase process combines automated intake with rigorous human review.",
  landing: {
    highlights: [
      {
        title: "Phase One — Automated",
        body: "Intake, screening, classification and routing are automated to remove noise and duplicates.",
        icon: Workflow,
      },
      {
        title: "Phase Two — Human",
        body: "Trained NRC members research, verify, quality-check and hand over qualified dossiers.",
        icon: ClipboardCheck,
      },
      {
        title: "Tiered teams",
        body: "NRC teams are aligned to the four recognition tiers, with dedicated leads for evidence and quality.",
        icon: Building2,
      },
    ],
    ctas: [
      { label: "Join the NRC", to: "/judgeapply/nrc/join", variant: "primary" },
      { label: "Our process", to: "/judgeapply/nrc/process", variant: "secondary" },
    ],
  },
  pages: [
    {
      slug: "process",
      title: "Our Process",
      short: "The two-phase NRC pipeline in detail.",
      icon: Workflow,
      sections: [
        {
          heading: "Phase One — Automated intake",
          body:
            "Nominations are ingested, de-duplicated, screened for eligibility, classified by tier and category and routed to the correct NRC team.",
        },
        {
          heading: "Phase Two — Human verification",
          body:
            "NRC members research the nominee, verify evidence, run a documented quality review and hand over the dossier to the appropriate Judges panel.",
          bullets: [
            "Lead reviewer, evidence reviewer and quality reviewer roles per case.",
            "Every action is logged in the NRC audit trail.",
            "Handovers to Judges are gated on quality-review sign-off.",
          ],
        },
      ],
    },
    {
      slug: "tiers",
      title: "NRC Teams by Tier",
      short: "How NRC teams map to the four recognition tiers.",
      icon: Layers,
      sections: [
        {
          heading: "Aligned to recognition tiers",
          body:
            "Dedicated NRC teams serve Africa Education Icon (Tier 1), Gold-Blue Garnet (Tier 2), Platinum Recognition (Tier 3) and Influencer Education Impact (Tier 4).",
        },
      ],
    },
    {
      slug: "service",
      title: "NRC Service Standards",
      short: "The commitments every NRC member makes.",
      icon: Scale,
      sections: [
        {
          heading: "Commitments",
          body:
            "Confidentiality, adherence to the evidence protocol, timely case turnaround, and full audit-trail compliance.",
        },
      ],
    },
    {
      slug: "join",
      title: "Join the NRC",
      short: "Submit your interest in joining the Nominee Research Corps.",
      icon: Handshake,
      sections: [
        {
          heading: "Who we look for",
          body:
            "Researchers, evaluators, educators and analysts committed to evidence-based recognition. Prior research or M&E experience is preferred.",
        },
        {
          heading: "How to apply",
          body:
            "Submit your interest via the standard NRC application form. Selected candidates are trained on the NRC protocol before receiving assignments.",
        },
      ],
      cta: [
        { label: "Open NRC application form", to: "/judge-apply", variant: "primary" },
      ],
    },
    {
      slug: "access",
      title: "NRC Access",
      short: "Secure sign-in for onboarded NRC members.",
      icon: Lock,
      sections: [
        {
          heading: "Restricted access",
          body:
            "Only onboarded NRC members may sign in. Access is protected by authenticated role-based checks. This public page does not grant access on its own.",
        },
      ],
      cta: [
        { label: "Go to NRC Sign-In", to: "/nrc", variant: "primary" },
      ],
    },
  ],
};

export const PORTAL_AREAS: PortalArea[] = [ABOUT, JUDGES, NRC];

export function getArea(id: PortalAreaId): PortalArea | undefined {
  return PORTAL_AREAS.find((a) => a.id === id);
}

export function getPage(areaId: PortalAreaId, slug: string): PortalPageContent | undefined {
  return getArea(areaId)?.pages.find((p) => p.slug === slug);
}
