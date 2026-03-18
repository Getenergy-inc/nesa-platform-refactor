import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  NomineeDashboardHeader,
  NomineeStatsGrid,
  NomineeCategoriesCard,
  NomineeEngagementHub,
  NomineeProfileForm,
  NomineeCertificateCard,
} from "@/components/nominee-dashboard";

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
  categories: Array<{
    category: string;
    subcategory: string;
    justification?: string;
    status?: "pending" | "nrc_verified" | "jury_review";
  }>;
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
        // Fetch nominee by acceptance token
        const { data: nomineeData, error: fetchError } = await supabase
          .from("nominees")
          .select(`
            id, name, slug, title, organization, country, region, bio, 
            photo_url, logo_url, acceptance_status, renomination_count, 
            public_votes, nrc_verified,
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

        // Check acceptance status
        if (nomineeData.acceptance_status !== "ACCEPTED") {
          // Redirect to acceptance page if not yet accepted
          navigate(`/nominee/accept/${token}`);
          return;
        }

        // Fetch nominations for categories
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

        // Extract categories
        const categories = (nominations || []).map((nom: any) => ({
          category: nom.subcategories?.categories?.name || "Unknown",
          subcategory: nom.subcategories?.name || "Unknown",
          justification: nom.justification,
          status: (nom.status === "approved" ? "nrc_verified" : "pending") as "pending" | "nrc_verified" | "jury_review",
        }));

        // Get referral code
        const { data: referralData } = await supabase
          .from("referrals")
          .select("referral_code")
          .eq("owner_type", "USER")
          .eq("owner_id", nomineeData.id)
          .maybeSingle();

        setNominee({
          ...nomineeData,
          categories,
          certificate: nomineeData.certificates?.[0] ? {
            id: nomineeData.certificates[0].id,
            tier: nomineeData.certificates[0].tier,
            status: nomineeData.certificates[0].status,
            download_locked: nomineeData.certificates[0].download_locked,
            verification_code: nomineeData.certificates[0].verification_code,
            issued_at: nomineeData.certificates[0].issued_at,
            expires_at: nomineeData.certificates[0].expires_at,
          } : null,
          referral_code: referralData?.referral_code,
        } as NomineeData);
      } catch (err: any) {
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
        : null
    );
  };

  // Loading state
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

  // Error state
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
              <p className="text-muted-foreground">{error || "Unable to load dashboard"}</p>
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
        {/* Welcome Message */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Welcome, {nominee.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Your nominee dashboard — track progress, update your profile, and engage your community.
          </p>
        </div>

        {/* Stats Grid */}
        <NomineeStatsGrid
          endorsementCount={nominee.renomination_count}
          endorsementGoal={endorsementGoal}
          publicVotes={nominee.public_votes}
          referralClicks={0} // TODO: Track referral clicks
          profileViews={0} // TODO: Track profile views
          certificateStatus={
            nominee.certificate?.download_locked === false
              ? "unlocked"
              : nominee.certificate
              ? "locked"
              : "pending"
          }
        />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="engage">Engage</TabsTrigger>
            <TabsTrigger value="certificate">Certificate</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <NomineeCategoriesCard categories={nominee.categories} />
              <NomineeEngagementHub
                nomineeSlug={nominee.slug}
                nomineeName={nominee.name}
                referralCode={nominee.referral_code}
              />
            </div>
          </TabsContent>

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

          <TabsContent value="engage">
            <NomineeEngagementHub
              nomineeSlug={nominee.slug}
              nomineeName={nominee.name}
              referralCode={nominee.referral_code}
            />
          </TabsContent>

          <TabsContent value="certificate">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
