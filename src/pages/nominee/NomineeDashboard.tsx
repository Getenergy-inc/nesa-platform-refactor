import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Home,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  FileText,
  LifeBuoy,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NomineeDashboardHeader,
  NomineeStatsGrid,
  NomineeCategoriesCard,
  NomineeEngagementHub,
  NomineeProfileForm,
  NomineeCertificateCard,
} from "@/components/nominee-dashboard";

type Pathway = "social_media" | "sports" | "music" | null;

const PATHWAY_LABEL: Record<Exclude<Pathway, null>, string> = {
  social_media: "Social Media Education Champion",
  sports: "Sports Icon Supporting Education",
  music: "Music Icon Supporting Education",
};

interface CategoryRow {
  category: string;
  subcategory: string;
  justification?: string;
  status?: "pending" | "nrc_verified" | "jury_review";
}

interface NomineeData {
  id: string;
  name: string;
  slug: string;
  title?: string;
  organization?: string;
  country?: string;
  region?: string;
  bio?: string;
  photo_url?: string;
  logo_url?: string;
  acceptance_status: string;
  renomination_count: number;
  public_votes: number;
  nrc_verified: boolean;
  publication_status?: string;
  evidence_urls?: string[] | null;
  recognition_pathway: Pathway;
  categories: CategoryRow[];
  certificate: {
    id: string;
    tier: string;
    status: string;
    download_locked: boolean;
    verification_code: string;
    issued_at: string;
    expires_at?: string;
  } | null;
  referral_code?: string;
}

const RECOGNITION_STEPS = [
  { key: "submitted", label: "Nomination Submitted" },
  { key: "accepted", label: "Nomination Accepted" },
  { key: "nrc_review", label: "NRC Review" },
  { key: "nrc_verified", label: "NRC Verified" },
  { key: "governance", label: "Governance Approval" },
  { key: "published", label: "Public Publication" },
] as const;

type StepKey = (typeof RECOGNITION_STEPS)[number]["key"];

function computeRecognitionState(n: NomineeData): Record<StepKey, "done" | "active" | "todo"> {
  const state: Record<StepKey, "done" | "active" | "todo"> = {
    submitted: "done",
    accepted: n.acceptance_status === "ACCEPTED" ? "done" : "active",
    nrc_review: "todo",
    nrc_verified: "todo",
    governance: "todo",
    published: "todo",
  };
  if (n.acceptance_status === "ACCEPTED") {
    state.nrc_review = n.nrc_verified ? "done" : "active";
    state.nrc_verified = n.nrc_verified ? "done" : "todo";
    if (n.nrc_verified) {
      state.governance =
        n.publication_status === "published" || n.publication_status === "approved"
          ? "done"
          : "active";
      state.published = n.publication_status === "published" ? "done" : "todo";
    }
  }
  return state;
}

function computeProfileCompletion(n: NomineeData): { pct: number; missing: string[] } {
  const checks: Array<[string, boolean]> = [
    ["Photo or logo", Boolean(n.photo_url || n.logo_url)],
    ["Title / role", Boolean(n.title && n.title.trim().length > 0)],
    ["Organisation", Boolean(n.organization && n.organization.trim().length > 0)],
    ["Country", Boolean(n.country && n.country.trim().length > 0)],
    ["Impact narrative", Boolean(n.bio && n.bio.trim().length >= 80)],
    ["Evidence link", Array.isArray(n.evidence_urls) && n.evidence_urls.length > 0],
    [
      "Category justification",
      n.categories.some((c) => c.justification && c.justification.trim().length >= 40),
    ],
  ];
  const done = checks.filter(([, ok]) => ok).length;
  return {
    pct: Math.round((done / checks.length) * 100),
    missing: checks.filter(([, ok]) => !ok).map(([label]) => label),
  };
}

export default function NomineeDashboard() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nominee, setNominee] = useState<NomineeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNomineeData() {
      if (!token) {
        setError("Invalid dashboard link");
        setLoading(false);
        return;
      }

      try {
        const { data: nomineeData, error: fetchError } = await (supabase as any)
          .from("nominees")
          .select(`
            id, name, slug, title, organization, country, region, bio,
            photo_url, logo_url, acceptance_status, renomination_count,
            public_votes, nrc_verified, referral_code, publication_status,
            evidence_urls, recognition_pathway,
            certificates (
              id, tier, status, download_locked, verification_code,
              issued_at, expires_at
            )
          `)
          .eq("acceptance_token", token)
          .maybeSingle();

        if (fetchError || !nomineeData) {
          setError("Nominee not found or invalid access token");
          setLoading(false);
          return;
        }

        if (nomineeData.acceptance_status !== "ACCEPTED") {
          navigate(`/nominee/accept/${token}`);
          return;
        }

        const { data: nominations } = await supabase
          .from("nominations")
          .select(`
            id, justification, status,
            subcategories (
              name,
              categories (name)
            )
          `)
          .eq("created_nominee_id", nomineeData.id);

        const categories: CategoryRow[] = (nominations || []).map((nom: any) => ({
          category: nom.subcategories?.categories?.name || "Unknown",
          subcategory: nom.subcategories?.name || "Unknown",
          justification: nom.justification,
          status: (nom.status === "approved" ? "nrc_verified" : "pending") as
            | "pending"
            | "nrc_verified"
            | "jury_review",
        }));

        setNominee({
          ...nomineeData,
          categories,
          certificate: nomineeData.certificates?.[0]
            ? {
                id: nomineeData.certificates[0].id,
                tier: nomineeData.certificates[0].tier,
                status: nomineeData.certificates[0].status,
                download_locked: nomineeData.certificates[0].download_locked,
                verification_code: nomineeData.certificates[0].verification_code,
                issued_at: nomineeData.certificates[0].issued_at,
                expires_at: nomineeData.certificates[0].expires_at,
              }
            : null,
          referral_code: nomineeData.referral_code ?? undefined,
          recognition_pathway: (nomineeData.recognition_pathway as Pathway) ?? null,
        } as NomineeData);

        const channel = supabase
          .channel(`nominee-${nomineeData.id}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "nominees",
              filter: `id=eq.${nomineeData.id}`,
            },
            (payload) => {
              const next = payload.new as {
                renomination_count?: number;
                nrc_verified?: boolean;
                publication_status?: string;
              };
              setNominee((prev) =>
                prev
                  ? {
                      ...prev,
                      renomination_count:
                        typeof next.renomination_count === "number"
                          ? next.renomination_count
                          : prev.renomination_count,
                      nrc_verified:
                        typeof next.nrc_verified === "boolean"
                          ? next.nrc_verified
                          : prev.nrc_verified,
                      publication_status:
                        next.publication_status ?? prev.publication_status,
                    }
                  : prev,
              );
            },
          )
          .subscribe();
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error("Error loading nominee data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadNomineeData();
  }, [token, navigate]);

  const handleProfileSave = async (data: any) => {
    if (!nominee) return;
    const { error: updateError } = await supabase
      .from("nominees")
      .update({
        title: data.title,
        organization: data.organization,
        country: data.country,
        bio: data.bio,
        photo_url: data.photoUrl,
        logo_url: data.logoUrl,
      })
      .eq("id", nominee.id);
    if (updateError) throw updateError;
    setNominee((prev) =>
      prev
        ? {
            ...prev,
            title: data.title,
            organization: data.organization,
            country: data.country,
            bio: data.bio,
            photo_url: data.photoUrl,
            logo_url: data.logoUrl,
          }
        : null,
    );
  };

  const isInfluencer = !!nominee?.recognition_pathway;
  const completion = useMemo(
    () => (nominee ? computeProfileCompletion(nominee) : null),
    [nominee],
  );
  const recognitionState = useMemo(
    () => (nominee ? computeRecognitionState(nominee) : null),
    [nominee],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal">
        <div className="border-b">
          <div className="container flex h-16 items-center justify-between px-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="container px-4 py-8 space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-center">
              <div className="bg-destructive/10 p-4 rounded-full">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Access Denied</h2>
              <p className="text-muted-foreground">
                {error || "Unable to load dashboard"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const endorsementGoal = 200;

  return (
    <div className="min-h-screen bg-charcoal">
      <NomineeDashboardHeader
        nomineeName={nominee.name}
        photoUrl={nominee.photo_url}
        acceptanceStatus={nominee.acceptance_status}
      />

      <main className="container px-4 md:px-6 py-8 space-y-8">
        {/* Welcome */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-display font-bold">
              Welcome, {nominee.name.split(" ")[0]}!
            </h1>
            {isInfluencer && nominee.recognition_pathway && (
              <Badge className="bg-gold text-charcoal">
                {PATHWAY_LABEL[nominee.recognition_pathway]}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Your nominee dashboard — track your recognition status, complete your
            profile, and share your impact.
          </p>
          {isInfluencer && (
            <p className="text-xs text-muted-foreground">
              <strong>There is no public voting for the Influencer Education
              Impact Award.</strong>{" "}
              Recognition is based on verified impact and governance approval.
            </p>
          )}
        </div>

        {/* Stats (public_votes hidden for Influencer) */}
        <NomineeStatsGrid
          endorsementCount={nominee.renomination_count}
          endorsementGoal={endorsementGoal}
          publicVotes={isInfluencer ? 0 : nominee.public_votes}
          referralClicks={0}
          profileViews={0}
          certificateStatus={
            nominee.certificate?.download_locked === false
              ? "unlocked"
              : nominee.certificate
                ? "locked"
                : "pending"
          }
        />

        {/* Profile completion */}
        {completion && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Profile completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {completion.pct}% complete
                </span>
                <span className="text-xs text-muted-foreground">
                  {completion.missing.length === 0
                    ? "All set"
                    : `${completion.missing.length} item(s) remaining`}
                </span>
              </div>
              <Progress value={completion.pct} />
              {completion.missing.length > 0 && (
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                  {completion.missing.slice(0, 4).map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {/* Six-section tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="impact">Education Impact</TabsTrigger>
            <TabsTrigger value="evidence">Evidence & Media</TabsTrigger>
            <TabsTrigger value="status">Recognition Status</TabsTrigger>
            <TabsTrigger value="support">Messages & Support</TabsTrigger>
          </TabsList>

          {/* 1. Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <NomineeCategoriesCard categories={nominee.categories} />
              {isInfluencer ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Share your recognition</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Your Influencer profile appears in the public directory once
                      governance approves it. Share the link below so your audience
                      can view your nomination page.
                    </p>
                    <div className="rounded-md border bg-muted/30 p-2 font-mono text-xs break-all">
                      {typeof window !== "undefined" ? window.location.origin : ""}
                      /nominee/{nominee.slug}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <NomineeEngagementHub
                  nomineeSlug={nominee.slug}
                  nomineeName={nominee.name}
                  referralCode={nominee.referral_code}
                />
              )}
            </div>
          </TabsContent>

          {/* 2. My Profile */}
          <TabsContent value="profile">
            <NomineeProfileForm
              initialData={{
                name: nominee.name,
                title: nominee.title,
                organization: nominee.organization,
                country: nominee.country,
                bio: nominee.bio,
                photoUrl: nominee.photo_url,
                logoUrl: nominee.logo_url,
              }}
              onSave={handleProfileSave}
            />
          </TabsContent>

          {/* 3. Education Impact */}
          <TabsContent value="impact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Impact narrative</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                {nominee.bio && nominee.bio.trim().length > 0 ? (
                  nominee.bio
                ) : (
                  <span className="italic">
                    No impact narrative yet. Add one under <strong>My Profile</strong>{" "}
                    (minimum 80 characters recommended).
                  </span>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Category justifications ({nominee.categories.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nominee.categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No nominations linked yet.
                  </p>
                ) : (
                  nominee.categories.map((c, i) => (
                    <div key={i} className="rounded-md border p-3 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="secondary">{c.category}</Badge>
                        <span className="text-muted-foreground">{c.subcategory}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {c.justification && c.justification.trim().length > 0
                          ? c.justification
                          : "No justification provided."}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Evidence & Media */}
          <TabsContent value="evidence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Evidence links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.isArray(nominee.evidence_urls) &&
                nominee.evidence_urls.length > 0 ? (
                  <ul className="space-y-2">
                    {nominee.evidence_urls.map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline break-all"
                        >
                          <ExternalLink className="h-3 w-3" /> {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No evidence links attached yet. Contact your NRC reviewer via{" "}
                    <strong>Messages & Support</strong> to add proof of impact
                    (articles, videos, case studies, links to programmes).
                  </p>
                )}
              </CardContent>
            </Card>
            {isInfluencer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Media tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p>Recommended evidence for {PATHWAY_LABEL[nominee.recognition_pathway!]}:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    <li>Verified social profile links and campaign metrics</li>
                    <li>Press coverage or partner acknowledgements</li>
                    <li>Videos or photos of education-focused activations</li>
                    <li>Numbers reached (students, schools, communities)</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 5. Recognition Status */}
          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recognition timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {RECOGNITION_STEPS.map((step) => {
                    const s = recognitionState?.[step.key] ?? "todo";
                    const Icon =
                      s === "done" ? CheckCircle2 : s === "active" ? Clock : Circle;
                    const color =
                      s === "done"
                        ? "text-emerald-500"
                        : s === "active"
                          ? "text-gold"
                          : "text-muted-foreground";
                    return (
                      <li key={step.key} className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {s === "done"
                              ? "Complete"
                              : s === "active"
                                ? "In progress"
                                : "Pending"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>

            {!isInfluencer && (
              <NomineeCertificateCard
                certificate={
                  nominee.certificate
                    ? {
                        ...nominee.certificate,
                        tier: nominee.certificate.tier as any,
                        status: nominee.certificate.status as any,
                        downloadLocked: nominee.certificate.download_locked,
                        verificationCode: nominee.certificate.verification_code,
                        issuedAt: nominee.certificate.issued_at,
                        expiresAt: nominee.certificate.expires_at,
                      }
                    : null
                }
                endorsementCount={nominee.renomination_count}
                endorsementGoal={endorsementGoal}
              />
            )}
          </TabsContent>

          {/* 6. Messages & Support */}
          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <LifeBuoy className="h-4 w-4" /> Get help from the NESA team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Reach the NRC or governance team about your nomination, evidence,
                  or profile. Please quote your nominee slug{" "}
                  <code className="text-xs">{nominee.slug}</code> in every message.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <a href="mailto:support@nesaafrica.org">
                      <Mail className="h-4 w-4 mr-2" /> Email support
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/contact">Contact form</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/faqs">Nominee FAQs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
