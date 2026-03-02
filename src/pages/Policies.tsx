import { Helmet } from "react-helmet-async";
import { 
  Shield, 
  FileText, 
  Scale, 
  Users, 
  Lock, 
  Eye, 
  Database,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Award,
  Download,
  QrCode,
  Clock,
  RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSeason } from "@/contexts/SeasonContext";

const LAST_UPDATED = "January 2025";

export default function Policies() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>{`Policies & Guidelines | ${currentEdition?.name || 'NESA-Africa 2025'}`}</title>
        <meta 
          name="description" 
          content="Review NESA Africa's Privacy Policy, Terms of Service, and Governance Guidelines. Transparency and accountability in recognizing education excellence."
        />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.1),transparent_50%)]" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Shield className="mr-2 h-3 w-3" />
                Transparency & Accountability
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Policies & <span className="text-gold">Guidelines</span>
              </h1>
              <p className="text-white/70 text-lg">
                Our commitment to transparency, integrity, and ethical governance in recognizing 
                Africa's education excellence.
              </p>
              <p className="text-white/50 text-sm mt-4">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </section>

        {/* Policies Content */}
        <section className="py-12 md:py-16">
          <div className="container">
            <Tabs defaultValue="privacy" className="w-full">
              <TabsList className="w-full flex flex-wrap h-auto gap-2 mb-8 bg-muted/50 p-2 rounded-lg">
                <TabsTrigger 
                  value="privacy" 
                  className="flex-1 min-w-[140px] data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Privacy Policy
                </TabsTrigger>
                <TabsTrigger 
                  value="terms" 
                  className="flex-1 min-w-[140px] data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </TabsTrigger>
                <TabsTrigger 
                  value="governance" 
                  className="flex-1 min-w-[140px] data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Governance
                </TabsTrigger>
                <TabsTrigger 
                  value="certificates" 
                  className="flex-1 min-w-[140px] data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Certificates
                </TabsTrigger>
              </TabsList>

              {/* Privacy Policy */}
              <TabsContent value="privacy" className="space-y-6">
                <PolicySection
                  icon={Lock}
                  title="Privacy Policy"
                  description="How we collect, use, and protect your personal information"
                >
                  <PolicyBlock title="1. Information We Collect" icon={Database}>
                    <p className="text-muted-foreground mb-4">
                      We collect information you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Account information (name, email, password)</li>
                      <li>Profile information (organization, title, country)</li>
                      <li>Nomination data (nominee details, supporting evidence)</li>
                      <li>Voting records and preferences</li>
                      <li>Communication preferences and correspondence</li>
                    </ul>
                  </PolicyBlock>

                  <PolicyBlock title="2. How We Use Your Information" icon={Eye}>
                    <p className="text-muted-foreground mb-4">
                      Your information is used to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Process and manage nominations and voting</li>
                      <li>Verify nominee eligibility and credentials</li>
                      <li>Communicate award outcomes and updates</li>
                      <li>Generate certificates and public recognition</li>
                      <li>Improve our platform and services</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </PolicyBlock>

                  <PolicyBlock title="3. Information Sharing" icon={Users}>
                    <p className="text-muted-foreground mb-4">
                      We share information only in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Public nominees:</strong> Approved nominee profiles are publicly visible</li>
                      <li><strong>Award winners:</strong> Winner information is published for recognition</li>
                      <li><strong>Service providers:</strong> Trusted partners who assist our operations</li>
                      <li><strong>Legal requirements:</strong> When required by law or legal process</li>
                    </ul>
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Sponsors and partners <strong>never</strong> have access to nomination, voting, or jury data.</span>
                      </p>
                    </div>
                  </PolicyBlock>

                  <PolicyBlock title="4. Data Security" icon={Shield}>
                    <p className="text-muted-foreground">
                      We implement industry-standard security measures to protect your data, including 
                      encryption in transit and at rest, secure authentication, and regular security audits. 
                      Access to personal data is restricted to authorized personnel only.
                    </p>
                  </PolicyBlock>

                  <PolicyBlock title="5. Your Rights" icon={UserCheck}>
                    <p className="text-muted-foreground mb-4">
                      You have the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate information</li>
                      <li>Request deletion of your data (subject to legal requirements)</li>
                      <li>Withdraw consent for optional processing</li>
                      <li>Export your data in a portable format</li>
                    </ul>
                  </PolicyBlock>
                </PolicySection>
              </TabsContent>

              {/* Terms of Service */}
              <TabsContent value="terms" className="space-y-6">
                <PolicySection
                  icon={FileText}
                  title="Terms of Service"
                  description="Rules and guidelines for using the NESA Africa platform"
                >
                  <PolicyBlock title="1. Acceptance of Terms" icon={CheckCircle2}>
                    <p className="text-muted-foreground">
                      By accessing or using the NESA Africa platform, you agree to be bound by these 
                      Terms of Service and all applicable laws and regulations. If you do not agree 
                      with any of these terms, you are prohibited from using this platform.
                    </p>
                  </PolicyBlock>

                  <PolicyBlock title="2. Eligibility" icon={UserCheck}>
                    <p className="text-muted-foreground mb-4">
                      To use our services, you must:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Be at least 18 years of age</li>
                      <li>Provide accurate and complete registration information</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Accept responsibility for all activities under your account</li>
                    </ul>
                  </PolicyBlock>

                  <PolicyBlock title="3. Nomination Rules" icon={FileText}>
                    <p className="text-muted-foreground mb-4">
                      When submitting nominations, you agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Provide truthful and accurate information about nominees</li>
                      <li>Submit only authentic supporting evidence</li>
                      <li>Not nominate yourself for any award category</li>
                      <li>Respect the nomination review process and decisions</li>
                      <li>Not submit duplicate or fraudulent nominations</li>
                    </ul>
                    <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        <span>Fraudulent nominations will result in immediate disqualification and potential account suspension.</span>
                      </p>
                    </div>
                  </PolicyBlock>

                  <PolicyBlock title="4. Voting Guidelines" icon={Users}>
                    <p className="text-muted-foreground mb-4">
                      Voting participants must:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Vote only once per nominee per voting period</li>
                      <li>Not use automated systems or bots to cast votes</li>
                      <li>Not attempt to manipulate voting outcomes</li>
                      <li>Not purchase or sell votes</li>
                    </ul>
                  </PolicyBlock>

                  <PolicyBlock title="5. Intellectual Property" icon={Shield}>
                    <p className="text-muted-foreground">
                      All content on the NESA Africa platform, including logos, designs, text, and 
                      graphics, is protected by intellectual property rights. You may not reproduce, 
                      distribute, or create derivative works without explicit written permission. 
                      Nominees retain rights to their submitted materials but grant NESA Africa 
                      license to use such materials for award-related purposes.
                    </p>
                  </PolicyBlock>

                  <PolicyBlock title="6. Limitation of Liability" icon={AlertTriangle}>
                    <p className="text-muted-foreground">
                      NESA Africa provides this platform "as is" without warranties of any kind. 
                      We are not liable for any indirect, incidental, or consequential damages 
                      arising from your use of the platform. Award decisions are final and not 
                      subject to appeal except in cases of documented procedural violations.
                    </p>
                  </PolicyBlock>
                </PolicySection>
              </TabsContent>

              {/* Governance Guidelines */}
              <TabsContent value="governance" className="space-y-6">
                <PolicySection
                  icon={Scale}
                  title="Governance Guidelines"
                  description="Our framework for ethical, transparent, and accountable operations"
                >
                  <PolicyBlock title="1. Core Principles" icon={CheckCircle2}>
                    <p className="text-muted-foreground mb-4">
                      NESA Africa operates as a governance-grade education accountability platform, 
                      guided by these principles:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Integrity:</strong> All processes are conducted with honesty and ethical standards</li>
                      <li><strong>Transparency:</strong> Decision-making processes are open and documented</li>
                      <li><strong>Accountability:</strong> All actions are logged and auditable</li>
                      <li><strong>Fairness:</strong> Equal opportunity for all eligible nominees</li>
                      <li><strong>Independence:</strong> Award decisions are free from external influence</li>
                    </ul>
                  </PolicyBlock>

                  <PolicyBlock title="2. National Review Committee (NRC)" icon={Users}>
                    <p className="text-muted-foreground mb-4">
                      The NRC is responsible for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Reviewing and verifying all nominations</li>
                      <li>Ensuring nominees meet eligibility criteria</li>
                      <li>Approving nominees for public voting or Platinum recognition</li>
                      <li>Documenting review decisions with supporting rationale</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      NRC members are bound by strict confidentiality agreements and must disclose 
                      any potential conflicts of interest.
                    </p>
                  </PolicyBlock>

                  <PolicyBlock title="3. Conflict of Interest Policy" icon={AlertTriangle}>
                    <p className="text-muted-foreground mb-4">
                      To maintain integrity, all stakeholders must:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Disclose any personal, professional, or financial relationships with nominees</li>
                      <li>Recuse themselves from decisions where conflicts exist</li>
                      <li>Report any attempts to influence award outcomes</li>
                      <li>Maintain confidentiality of deliberation processes</li>
                    </ul>
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Jury members, NRC reviewers, and staff must complete COI disclosure forms before participating in award processes.</span>
                      </p>
                    </div>
                  </PolicyBlock>

                  <PolicyBlock title="4. Jury Selection & Scoring" icon={Scale}>
                    <p className="text-muted-foreground mb-4">
                      Jury members are selected based on:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Doctoral degree (PhD) or equivalent, OR 15+ years of relevant experience</li>
                      <li>Demonstrated expertise in education or related fields</li>
                      <li>No conflicts of interest with current nominees</li>
                      <li>Commitment to confidentiality and ethical conduct</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Blue Garnet awards are determined by a weighted formula: 60% Jury Score + 40% Public Vote.
                    </p>
                  </PolicyBlock>

                  <PolicyBlock title="5. Audit Trail & Accountability" icon={Database}>
                    <p className="text-muted-foreground mb-4">
                      All sensitive actions are logged for accountability:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Nomination status changes (approval, rejection, escalation)</li>
                      <li>Stage configuration changes (opening/closing voting periods)</li>
                      <li>Vote submissions and jury scoring</li>
                      <li>Certificate issuance and verification</li>
                      <li>User role assignments and changes</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Audit logs include timestamps, user identification, and action details for 
                      complete traceability.
                    </p>
                  </PolicyBlock>

                  <PolicyBlock title="6. Sponsor & Partner Independence" icon={Shield}>
                    <p className="text-muted-foreground">
                      NESA Africa maintains strict separation between sponsors/partners and award 
                      processes. Sponsors and endorsing organizations have no access to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                      <li>Nomination submissions or nominee data</li>
                      <li>Voting records or real-time results</li>
                      <li>Jury deliberations or scoring</li>
                      <li>NRC review processes or decisions</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      This ensures award outcomes reflect genuine merit, not financial influence.
                    </p>
                  </PolicyBlock>
                </PolicySection>
              </TabsContent>

              {/* Certificate Policies */}
              <TabsContent value="certificates" className="space-y-6">
                <PolicySection
                  icon={Award}
                  title="Certificate Policies"
                  description="Guidelines for downloading, verifying, and maintaining your NESA certificates"
                >
                  <PolicyBlock title="1. Platinum Certificate Download" icon={Download}>
                    <p className="text-muted-foreground mb-4">
                      To download your Platinum Certificate, follow these steps:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                      <li>
                        <strong>Log in to your account:</strong> Access your dashboard at{" "}
                        <span className="text-primary font-medium">nesa.africa/dashboard</span>
                      </li>
                      <li>
                        <strong>Navigate to Certificates:</strong> Click on the "My Certificates" section in your dashboard
                      </li>
                      <li>
                        <strong>Select your certificate:</strong> Find your Platinum Certificate from the list
                      </li>
                      <li>
                        <strong>Download:</strong> Click the "Download PDF" button to save your certificate
                      </li>
                    </ol>
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Certificates are available for download immediately after approval by the National Review Committee (NRC).</span>
                      </p>
                    </div>
                  </PolicyBlock>

                  <PolicyBlock title="2. Certificate Validity Periods" icon={Clock}>
                    <p className="text-muted-foreground mb-4">
                      NESA certificates have different validity periods based on award tier:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 shrink-0">Platinum</Badge>
                        <div>
                          <p className="font-medium text-foreground">1 Year Validity</p>
                          <p className="text-sm text-muted-foreground">Renewable annually upon continued excellence demonstration</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 shrink-0">Gold</Badge>
                        <div>
                          <p className="font-medium text-foreground">Season-Based Recognition</p>
                          <p className="text-sm text-muted-foreground">Valid for the award season year</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 shrink-0">Blue Garnet</Badge>
                        <div>
                          <p className="font-medium text-foreground">Lifetime Recognition</p>
                          <p className="text-sm text-muted-foreground">Permanent honor for highest achievement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 shrink-0">Icon</Badge>
                        <div>
                          <p className="font-medium text-foreground">Lifetime Recognition</p>
                          <p className="text-sm text-muted-foreground">Permanent honor for transformational impact</p>
                        </div>
                      </div>
                    </div>
                  </PolicyBlock>

                  <PolicyBlock title="3. Certificate Verification" icon={QrCode}>
                    <p className="text-muted-foreground mb-4">
                      All NESA certificates include QR code authentication for global verification:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Each certificate has a unique verification code</li>
                      <li>Scan the QR code or visit <span className="text-primary font-medium">/certificates/verify</span></li>
                      <li>Enter the verification code to confirm authenticity</li>
                      <li>Verification displays nominee name, award tier, and validity status</li>
                    </ul>
                    <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        <span>Report any fraudulent certificates to <strong>governance@nesa.africa</strong></span>
                      </p>
                    </div>
                  </PolicyBlock>

                  <PolicyBlock title="4. Certificate Renewal (Platinum)" icon={RefreshCw}>
                    <p className="text-muted-foreground mb-4">
                      Platinum certificates require annual renewal. Here's the process:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>45-day reminder:</strong> You'll receive an email notification before expiry</li>
                      <li><strong>Renewal application:</strong> Submit updated evidence of continued excellence</li>
                      <li><strong>NRC review:</strong> Your renewal is reviewed by the National Review Committee</li>
                      <li><strong>New certificate:</strong> Upon approval, a new 1-year certificate is issued</li>
                    </ul>
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Renewal is free of charge. Simply demonstrate continued commitment to education excellence.</span>
                      </p>
                    </div>
                  </PolicyBlock>

                  <PolicyBlock title="5. Certificate Branding Policy" icon={Shield}>
                    <p className="text-muted-foreground mb-4">
                      To maintain brand neutrality and educational integrity:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>NESA branding is <strong>not</strong> displayed on certificates</li>
                      <li>Certificates focus on the recipient's achievement and verification</li>
                      <li>Sponsor logos are never included on certificates</li>
                      <li>This ensures recognition is merit-based, not commercially influenced</li>
                    </ul>
                  </PolicyBlock>

                  <PolicyBlock title="6. Download Troubleshooting" icon={AlertTriangle}>
                    <p className="text-muted-foreground mb-4">
                      If you're unable to download your certificate:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Check approval status:</strong> Ensure your nomination has been approved by NRC</li>
                      <li><strong>Verify email:</strong> Confirm your email address is verified in account settings</li>
                      <li><strong>Browser compatibility:</strong> Try using Chrome, Firefox, or Safari</li>
                      <li><strong>Disable blockers:</strong> Temporarily disable popup blockers or ad blockers</li>
                      <li><strong>Contact support:</strong> Email <span className="text-primary font-medium">support@nesa.africa</span> with your nominee ID</li>
                    </ul>
                  </PolicyBlock>
                </PolicySection>
              </TabsContent>
            </Tabs>

            {/* Contact Section */}
            <Card className="mt-12 bg-muted/30 border-primary/20">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Questions About Our Policies?</h3>
                <p className="text-muted-foreground mb-4">
                  If you have questions about our policies or need to report a concern, please contact us.
                </p>
                <a 
                  href="mailto:governance@nesa.africa" 
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  governance@nesa.africa
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}

// Policy Section Component
interface PolicySectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

function PolicySection({ icon: Icon, title, description, children }: PolicySectionProps) {
  return (
    <div>
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

// Policy Block Component
interface PolicyBlockProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function PolicyBlock({ title, icon: Icon, children }: PolicyBlockProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="w-5 h-5 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
