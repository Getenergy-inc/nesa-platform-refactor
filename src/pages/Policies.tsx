import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSeason } from "@/contexts/SeasonContext";
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  Lock, 
  Users,
  Scale,
  ChevronRight
} from "lucide-react";

interface Policy {
  slug: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  lastUpdated: string;
  sections: {
    title: string;
    content: string;
  }[];
}

const policies: Policy[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    icon: Lock,
    lastUpdated: "2025-01-01",
    sections: [
      {
        title: "Information We Collect",
        content: "We collect information you provide directly to us, including name, email address, country, and any nomination or voting data you submit. We also collect usage data automatically through cookies and similar technologies."
      },
      {
        title: "How We Use Your Information",
        content: "We use your information to provide, maintain, and improve our services; process nominations and votes; communicate with you about awards, events, and updates; ensure platform security and prevent fraud; and comply with legal obligations."
      },
      {
        title: "Information Sharing",
        content: "We do not sell your personal information. We may share information with service providers who assist in platform operations, when required by law, or to protect the rights and safety of NESA-Africa and our users. Sponsor access is strictly isolated from personal data and voting information."
      },
      {
        title: "Data Security",
        content: "We implement industry-standard security measures to protect your data, including encryption, access controls, and regular security audits. All sensitive actions are logged in immutable audit trails."
      },
      {
        title: "Your Rights",
        content: "You have the right to access, correct, or delete your personal information. You may opt out of marketing communications at any time. Contact privacy@nesa.africa to exercise these rights."
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    icon: FileText,
    lastUpdated: "2025-01-01",
    sections: [
      {
        title: "Acceptance of Terms",
        content: "By accessing or using the NESA-Africa platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services."
      },
      {
        title: "User Accounts",
        content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information during registration and keep it updated."
      },
      {
        title: "Nominations and Voting",
        content: "All nominations must be submitted in good faith with accurate supporting evidence. Fraudulent nominations, vote manipulation, or any attempt to game the system will result in immediate disqualification and account suspension."
      },
      {
        title: "Intellectual Property",
        content: "All content, trademarks, and intellectual property on this platform are owned by NESA-Africa or its licensors. You may not use, reproduce, or distribute any content without express permission."
      },
      {
        title: "Limitation of Liability",
        content: "NESA-Africa provides this platform 'as is' without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform."
      },
    ],
  },
  {
    slug: "governance",
    title: "Governance Framework",
    icon: Shield,
    lastUpdated: "2025-01-01",
    sections: [
      {
        title: "Sponsor Isolation Firewall",
        content: "Sponsors have no access to nomination data, voting systems, jury scoring, or results until public announcement. Sponsor branding is never displayed on certificates or voting interfaces. This ensures complete separation between financial support and award decisions."
      },
      {
        title: "Stage Locking",
        content: "All platform actions are gated by the current season stage. Nominations, voting, jury scoring, and results access are only available during their designated periods. Stage transitions are logged and immutable."
      },
      {
        title: "Audit Trail",
        content: "Every sensitive action on the platform is recorded in an immutable audit log, including timestamps, user IDs, IP addresses, and action details. These logs are retained for compliance and can be reviewed upon request."
      },
      {
        title: "Conflict of Interest",
        content: "All NRC members, jury members, and platform administrators must disclose any potential conflicts of interest. Individuals with COI are recused from decisions involving related nominations."
      },
    ],
  },
  {
    slug: "coi",
    title: "Conflict of Interest Policy",
    icon: Scale,
    lastUpdated: "2025-01-01",
    sections: [
      {
        title: "Definition",
        content: "A conflict of interest exists when an individual's personal, financial, or professional relationships could influence or appear to influence their judgment in award-related decisions."
      },
      {
        title: "Disclosure Requirements",
        content: "All NRC members, jury members, chapter leads, and administrators must disclose any relationships with nominees, including family connections, business partnerships, or institutional affiliations."
      },
      {
        title: "Recusal Process",
        content: "Individuals with disclosed conflicts must recuse themselves from reviewing, scoring, or voting on related nominations. The recusal is documented in the audit trail."
      },
      {
        title: "Enforcement",
        content: "Failure to disclose conflicts of interest may result in removal from governance roles and invalidation of affected decisions. Serious violations may result in permanent ban from the platform."
      },
    ],
  },
  {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    icon: Users,
    lastUpdated: "2025-01-01",
    sections: [
      {
        title: "Respectful Engagement",
        content: "All users must engage respectfully with nominees, other users, and platform staff. Harassment, discrimination, or abusive behavior will not be tolerated."
      },
      {
        title: "Honest Participation",
        content: "Submit only truthful nominations with verifiable evidence. Do not attempt to manipulate votes, create fake accounts, or engage in any form of fraud."
      },
      {
        title: "Confidentiality",
        content: "Jury members and NRC reviewers must maintain confidentiality about nomination details, scores, and deliberations until official announcement."
      },
      {
        title: "Reporting Violations",
        content: "If you witness violations of this code, report them to conduct@nesa.africa. All reports are investigated confidentially."
      },
    ],
  },
];

export default function Policies() {
  const { currentEdition } = useSeason();
  const { slug } = useParams<{ slug?: string }>();

  const selectedPolicy = slug ? policies.find(p => p.slug === slug) : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Policy Detail View
  if (selectedPolicy) {
    const Icon = selectedPolicy.icon;

    return (
      <>
        <Helmet>
          <title>{selectedPolicy.title} | {currentEdition.name}</title>
          <meta
            name="description"
            content={`Read the ${selectedPolicy.title} for NESA-Africa.`}
          />
        </Helmet>

        <div className="min-h-screen bg-charcoal">
          <NESAHeader />

          <div className="container py-12 sm:py-16 max-w-4xl">
            <Link
              to="/policies"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Policies</span>
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">
                    {selectedPolicy.title}
                  </h1>
                  <p className="text-white/50 text-sm">
                    Last updated: {formatDate(selectedPolicy.lastUpdated)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {selectedPolicy.sections.map((section, index) => (
                <Card key={index} className="bg-charcoal-light border-gold/10">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gold/10 text-center">
              <p className="text-white/50 text-sm">
                Questions about this policy? Contact us at{" "}
                <a href="mailto:legal@nesa.africa" className="text-gold hover:text-gold-light">
                  legal@nesa.africa
                </a>
              </p>
            </div>
          </div>

          <NESAFooter />
        </div>
      </>
    );
  }

  // Policy Index View
  return (
    <>
      <Helmet>
        <title>Policies | {currentEdition.name}</title>
        <meta
          name="description"
          content="Read NESA-Africa's policies including Privacy Policy, Terms of Service, Governance Framework, and Code of Conduct."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal py-16 sm:py-20">
          <div className="container">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to About</span>
            </Link>

            <div className="max-w-3xl">
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                <FileText className="h-3 w-3 mr-1" />
                Legal & Governance
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Platform <span className="text-gold">Policies</span>
              </h1>
              <p className="text-white/70 text-lg">
                Our commitment to transparency, fairness, and accountability. 
                Review our policies that govern the NESA-Africa platform.
              </p>
            </div>
          </div>
        </section>

        {/* Policies Grid */}
        <section className="py-12 sm:py-16">
          <div className="container max-w-4xl">
            <div className="grid sm:grid-cols-2 gap-6">
              {policies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <Link key={policy.slug} to={`/policies/${policy.slug}`}>
                    <Card className="bg-charcoal-light border-gold/10 hover:border-gold/30 transition-all duration-300 group h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                            <Icon className="h-6 w-6 text-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-lg font-semibold text-white group-hover:text-gold transition-colors mb-1">
                              {policy.title}
                            </h3>
                            <p className="text-white/50 text-sm">
                              Last updated: {formatDate(policy.lastUpdated)}
                            </p>
                            <p className="text-white/60 text-sm mt-2">
                              {policy.sections.length} sections
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gold/50 group-hover:text-gold transition-colors shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
