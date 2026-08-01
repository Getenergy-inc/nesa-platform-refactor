import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import Nominees from "./pages/Nominees";

import NomineeSlugDispatcher from "./pages/nominees/NomineeSlugDispatcher";
import CategoryLandingPage from "./pages/nominees/CategoryLandingPage";
import CatalogueIndexPage from "./pages/nominees/CatalogueIndexPage";
import SubcategoryPage from "./pages/nominees/SubcategoryPage";
import GoldHubPage from "./pages/nominees/gold/GoldHubPage";
import GoldCategoryPage from "./pages/nominees/gold/GoldCategoryPage";
import GoldNomineeProfilePage from "./pages/nominees/gold/GoldNomineeProfilePage";
import NomineeSlugRedirect from "./pages/nominees/gold/NomineeSlugRedirect";
import NGOHubPage from "./pages/nominees/ngo/NGOHubPage";
import NGORegionalPage from "./pages/nominees/ngo/NGORegionalPage";
import NGONomineeProfile from "./pages/nominees/ngo/NGONomineeProfile";
import RegionNomineesHubPage from "./pages/nominees/regional/RegionNomineesHubPage";
import RegionCategoryPage from "./pages/nominees/regional/RegionCategoryPage";
import IconAwardMain from "./pages/nominees/icon/IconAwardMain";
import IconSubcategoryPage from "./pages/nominees/icon/IconSubcategoryPage";
import IconClassificationPage from "./pages/nominees/icon/IconClassificationPage";
import { Navigate, useParams } from "react-router-dom";
import { isValidRegionSlug, resolveLegacyRegionSlug } from "@/lib/regionClassifier";

/** 301-style redirect that preserves the :slug param and query string. */
const SlugRedirect = ({ to }: { to: (slug: string) => string }) => {
  const { slug = "" } = useParams();
  const search = typeof window !== "undefined" ? window.location.search : "";
  return <Navigate to={`${to(slug)}${search}`} replace />;
};

/** /nominees/region/:region — canonical 8-region + diaspora landing dispatcher.
 *  Resolves legacy short slugs (west, east, north, south, central, horn, sahel,
 *  indian-ocean, african-diaspora) to their canonical slug via a 301-style
 *  Navigate; canonical slugs render the RegionNomineesHubPage directly. */
const RegionSlugGate = () => {
  const { region = "" } = useParams();
  const search = typeof window !== "undefined" ? window.location.search : "";
  const alias = resolveLegacyRegionSlug(region);
  if (alias && alias !== region) {
    return <Navigate to={`/nominees/region/${alias}${search}`} replace />;
  }
  if (!isValidRegionSlug(region)) {
    return <Navigate to="/nominees" replace />;
  }
  return <RegionNomineesHubPage region={region} />;
};
import NomineeDirectory from "./pages/NomineeDirectory";
import MasterNomineeProfile from "./pages/MasterNomineeProfile";
import CertificateVerify from "./pages/CertificateVerify";
import VerifyCertificate from "./pages/VerifyCertificate";
import Policies from "./pages/Policies";
import FAQPage from "./pages/FAQ";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { SeasonProvider } from "@/contexts/SeasonContext";
import { RegionProvider } from "@/contexts/RegionContext";
import { RegionPickerModal } from "@/components/region/RegionPickerModal";
import { RegionConfirmationPopup } from "@/components/region/RegionConfirmationPopup";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CustomerCareChat } from "@/components/support/CustomerCareChat";

// Pages
import NESALandingPage from "./features/landing/NESALandingPage";
import UpcomingEventsPage from "./pages/UpcomingEvents";
import EventsPage from "./pages/EventsPage";
import ResourcesPage from "./pages/ResourcesPage";
import Categories from "./pages/Categories";
import Programs from "./pages/Programs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OTPVerification from "./pages/auth/OTPVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NominateFlow from "./pages/NominateFlow";
import NominateOfficial from "./pages/NominateOfficial";
import NominateMvp from "./pages/NominateMvp";
import NGOChooser from "./pages/nominate/NGOChooser";
import IconNominatePage from "./pages/nominate/IconNominatePage";
import NominateHub2026 from "./pages/nominate/NominateHub2026";
import NominateCategoryShell from "./pages/nominate/NominateCategoryShell";
import NominateSchool from "./pages/impact/NominateSchool";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { IconJudgeGate } from "./features/iconJudges/IconJudgeGate";
import IconJuryLayout from "./features/iconJudges/IconJuryLayout";
import IconJurySignIn from "./pages/iconJury/SignIn";
import IconJuryDashboard from "./pages/iconJury/Dashboard";
import IconJuryAssignments from "./pages/iconJury/Assignments";
import IconJuryNomineeReview from "./pages/iconJury/NomineeReview";
import IconJuryConflicts from "./pages/iconJury/Conflicts";
import IconJuryScoringGuide from "./pages/iconJury/ScoringGuide";
import IconJuryNotes from "./pages/iconJury/Notes";
import IconJuryResults from "./pages/iconJury/Results";
import IconJuryProfile from "./pages/iconJury/Profile";
import IconJuryHelp from "./pages/iconJury/Help";
import IconJuryAdminDashboard from "./pages/iconJury/AdminDashboard";
import IconJuryAuditTrailPage from "./pages/iconJury/AuditTrail";
import IconJuryAdminAuditTrailPage from "./pages/iconJury/AdminAuditTrail";
import JudgesArenaLanding from "./pages/judges/JudgesArenaLanding";
import JudgesEntry from "./pages/judges/JudgesEntry";
import GrandJuryVotingHub from "./pages/judges/GrandJuryVotingHub";
import GrandJuryGroupBallot from "./pages/judges/GrandJuryGroupBallot";
import GovernanceReviewDashboard from "./pages/judges/GovernanceReviewDashboard";
import MyPanel from "./pages/judges/MyPanel";
import PathwaysPage from "./pages/PathwaysPage";
import AwardPathwayPage from "./pages/AwardPathwayPage";
import EcosystemPage from "./pages/EcosystemPage";
import MovementPage from "./pages/MovementPage";
import CategoryDetail from "./pages/CategoryDetail";
import NomineeAccept from "./pages/NomineeAccept";
import NomineeDecline from "./pages/NomineeDecline";
import NomineeDashboard from "./pages/nominee/NomineeDashboard";
import VolunteerDashboardMerged from "./pages/dashboard/VolunteerDashboard";
import JudgeDashboardMerged from "./pages/dashboard/JudgeDashboardMerged";
import NotificationsPage from "./pages/dashboard/Notifications";
import ProfilePage from "./pages/dashboard/Profile";
import SettingsPage from "./pages/dashboard/Settings";

// About Pages
import About from "./pages/about/About";
import Vision2035 from "./pages/about/Vision2035";
import Governance from "./pages/about/Governance";
import Timeline from "./pages/about/Timeline";
import SCEF from "./pages/about/SCEF";
import Awards from "./pages/Awards";
import Impact from "./pages/Impact";
import Videos from "./pages/Videos";
import EarnVotingCoins from "./pages/EarnVotingCoins";

// Award Pages
import PlatinumAward from "./pages/awards/PlatinumAward";
import PlatinumDiasporaPage from "./pages/awards/PlatinumDiasporaPage";
import IconAward from "./pages/awards/IconAward";
import AfricaEducationIconRefactored from "./pages/awards/AfricaEducationIconRefactored";
import GoldAward from "./pages/awards/GoldAward";
import BlueGarnetAward from "./pages/awards/BlueGarnetAward";
import GoldSpecialRecognition from "./pages/awards/GoldSpecialRecognition";
import InfluencerImpact2026 from "./pages/awards/InfluencerImpact2026";
import InfluencerNomineesDirectoryPage from "./pages/awards/InfluencerNomineesDirectoryPage";
import InfluencerSubcategoryPage from "./pages/awards/InfluencerSubcategoryPage";
import DigitalVoices from "./pages/awards/DigitalVoices";
import Winners from "./pages/awards/Winners";
import GovernancePage from "./pages/GovernancePage";
import EDXMatrixPage from "./pages/EDXMatrixPage";
import { SponsorFirewallBanner } from "@/components/governance/SponsorFirewallBanner";
import { NominateGate } from "@/components/nominate/NominateGate";

/** Wraps a page with a top compact sponsor-firewall banner for governance visibility. */
const WithFirewall = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className="container mx-auto max-w-6xl px-4 pt-3">
      <SponsorFirewallBanner variant="compact" />
    </div>
    {children}
  </>
);

// Category Pages (data-driven)
import {
  CSREducationAfrica,
  CSREducationNigeria,
  EduTechAfrica,
  MediaAdvocacyNigeria,
  NGOEducationNigeria,
  NGOEducationAfrica,
  STEMEducationAfrica,
  CreativeArtsNigeria,
  EducationFriendlyStateNigeria,
  LibraryNigeria,
  ResearchDevelopmentNigeria,
  ChristianEducationAfrica,
  IslamicEducationAfrica,
  PoliticalLeadersNigeria,
  InternationalEducation,
  DiasporaEducation,
  AfricaEducationIcon,
} from "./pages/categories/index";

// Refactored Award Category architecture (Phase 18B)
import CategoryMasterIndex from "./pages/awards/CategoryMasterIndex";
import BlueGarnetCategoriesIndex from "./pages/awards/BlueGarnetCategoriesIndex";
import PlatinumCategoriesIndex from "./pages/awards/PlatinumCategoriesIndex";
import InfluencersCategoriesIndex from "./pages/awards/InfluencersCategoriesIndex";
import AwardCategoryRoute from "./pages/awards/AwardCategoryRoute";
import AwardsRegionPage from "./pages/awards/AwardsRegionPage";
import PillarsHub from "./pages/awards/PillarsHub";
import PillarPage from "./pages/awards/PillarPage";
import AwardSpinePage from "./pages/awards/AwardSpinePage";
import EighteenCategoriesPage from "./pages/awards/EighteenCategoriesPage";
import CategoryDetailPage from "./pages/awards/CategoryDetailPage";
import TierCategorySubcategoryPage from "./pages/awards/TierCategorySubcategoryPage";
import TierClusterPage from "./pages/awards/cluster/TierClusterPage";
import RecognitionHubPage from "./pages/recognition/RecognitionHubPage";
import AwardSubpageRoute from "./pages/recognition/AwardSubpageRoute";
import CategoryPage2026 from "./components/recognition2026/CategoryPage";
import RedirectRoute from "./components/routing/RedirectRoute";
import LegacyCategoryRedirect from "./components/routing/LegacyCategoryRedirect";
import { LEGACY_RECOGNITION_REDIRECTS } from "./config/legacyRecognitionRedirects";
import { REFACTOR_REDIRECTS_2026 } from "./config/refactorRedirects2026";

import { ICON_CATEGORY, buildRedirectMap as buildCategoryRedirects } from "./config/awardCategories";

// Media Pages
import MediaHub from "./pages/media/MediaHub";
import GalleryLanding from "./pages/gallery/GalleryLanding";
import GalleryCollection from "./pages/gallery/GalleryCollection";
import NESATV from "./pages/media/NESATV";
import Shows from "./pages/media/Shows";
import Webinars from "./pages/media/Webinars";
import Gala from "./pages/media/Gala";

// Support Pages
import Donate from "./pages/Donate";
import EduAid from "./pages/EduAid";
import Rebuild from "./pages/Rebuild";
import RebuildHubPage from "./pages/eduaid/RebuildHubPage";
import RebuildRegionalPortal from "./pages/eduaid/RebuildRegionalPortal";
import Judges from "./pages/Judges";
import JudgesDirectory from "./pages/judges/JudgesDirectory";
import JudgeProfile from "./pages/judges/JudgeProfile";
import NomineePipeline from "./pages/judges/NomineePipeline";
import PathwayWorkspace from "./pages/judges/PathwayWorkspace";
import Install from "./pages/Install";

// 22-page canonical consolidators (2026 final refactor)
import AboutConsolidated from "./pages/about/AboutConsolidated";
import AboutCycle2026 from "./pages/about/AboutCycle2026";
import AboutCycle2027 from "./pages/about/AboutCycle2027";
import AboutCycle2028_2030 from "./pages/about/AboutCycle2028_2030";
import EduAidAfricaImpact from "./pages/eduaid/EduAidAfricaImpact";
import MediaHubConsolidated from "./pages/media/MediaHubConsolidated";
import GalaConsolidated from "./pages/gala/GalaConsolidated";
import SupportConsolidated from "./pages/support/SupportConsolidated";
import ImpactHub from "./pages/impact/ImpactHub";
import SponsorsPartners from "./pages/sponsors/SponsorsPartners";
import EndorsementsPage from "./pages/endorsements/EndorsementsPage";
import ChaptersConsolidated from "./pages/chapters/ChaptersConsolidated";

// Judge Portal Pages
import {
  JudgeApply,
  JudgeStatus,
  JudgeSignup,
  JudgeVerify,
  JudgeDashboard,
  JudgePortal,
  JuryScoring,
  JuryCOI,
  JudgeRubric,
  JudgeGuidelines,
  JudgePanel,
  JudgeHelp,
  JudgeSettings,
  JudgeChatRoom,
  JudgeIconLifetime,
} from "./pages/judge";
import JudgeOnboarding from "./pages/judge/JudgeOnboarding";
import JudgeApplyPortalLayout from "./pages/judgeapply/PortalLayout";
import JudgeApplyPortalHome from "./pages/judgeapply/PortalHome";
import JudgeApplyAreaLanding from "./pages/judgeapply/AreaLanding";
import JudgeApplySupportingPage from "./pages/judgeapply/SupportingPage";
import MyCertificates from "./pages/MyCertificates";
import CertificateGuide from "./pages/CertificateGuide";

import { JudgeArenaGuard } from "./components/judge/JudgeArenaGuard";
import ArenaShellLayout from "./components/judge/ArenaShellLayout";
import ArenaDashboard from "./pages/judges-arena/ArenaDashboard";
import ArenaNominees from "./pages/judges-arena/ArenaNominees";
import ArenaReview from "./pages/judges-arena/ArenaReview";
import ArenaDiscussion from "./pages/judges-arena/ArenaDiscussion";
import Partners from "./pages/Partners";
import ProspectiveOrgPage from "./pages/partners/ProspectiveOrgPage";
import Chapters from "./pages/Chapters";
import Vacancies from "./pages/Vacancies";
import Volunteer from "./pages/Volunteer";
import Volunteers from "./pages/Volunteers";
import VolunteerProfile from "./pages/volunteers/VolunteerProfile";
import VolunteerTeams from "./pages/volunteers/VolunteerTeams";
import VolunteerLeaderboard from "./pages/volunteers/VolunteerLeaderboard";
import VolunteerStories from "./pages/volunteers/VolunteerStories";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import {
  VolunteerProfileEdit,
  VolunteerReferralsPage,
  VolunteerTasksPage,
  VolunteerAnalyticsPage,
  VolunteerSettingsPage,
} from "./pages/volunteer/VolunteerSubPages";
import VolunteerShareAssets from "./pages/volunteer/VolunteerShareAssets";
import VolunteerChaptersHub from "./pages/volunteers/Chapters";
import JoinLocalChapter from "./pages/volunteers/JoinLocalChapter";
import VolunteerCommandCenter from "./pages/volunteers/CommandCenter";
import Ambassadors from "./pages/Ambassadors";
import Contributors from "./pages/Contributors";
import ContributorProfile from "./pages/ContributorProfile";
import Contact from "./pages/Contact";
import {
  EDIMatrix,
  ForNominators,
  ForNominees,
  ForJudges,
  ForVoters,
  ContinueRecognition,
  ImpactStorytelling,
} from "./pages/guidelines";
import { VOTING_SUNSET_REDIRECT } from "./config/featureFlags";
import AboutAGC from "./pages/AboutAGC";
import Trending from "./pages/Trending";
import Tickets from "./pages/Tickets";
import BuyYourTicket from "./pages/BuyYourTicket";
import GFAWzipWallet from "./pages/GFAWzipWallet";
import GFAWzipLinks from "./pages/GFAWzipLinks";
import {
  Shop,
  ProductDetail,
  Cart,
  Checkout,
  OrderConfirmation,
  BulkOrders,
} from "./pages/shop";
import { SponsorLanding, SponsorsHub } from "./pages/sponsors";
import SponsorHub from "./pages/sponsor/SponsorHub";
import SponsorCategoryPage from "./pages/sponsor/SponsorCategoryPage";
import SponsorshipPackages from "./pages/sponsor/SponsorshipPackages";

import Wallet from "./pages/Wallet";
import EndorseNESA from "./pages/EndorseNESA";
import RegionDashboard from "./pages/region/RegionDashboard";
import NigeriaChapterTrack from "./pages/region/NigeriaChapterTrack";
import RegionHubPage from "./pages/region/RegionHubPage";
import RegionsIndexPage from "./pages/region/RegionsIndexPage";
import AfriEduTourismPage from "./pages/AfriEduTourismPage";

// OLC Pages
import {
  OLCDashboard,
  OLCMembers,
  OLCSettlements,
  OLCWallet,
} from "./pages/olc";

// NRC Portal Pages
import {
  NRCPortal,
  NRCMyQueue,
  NRCMembers as NRCMembersPage,
  NRCSettings,
  NRCScoringDashboard,
} from "./pages/nrc";

// NRC Arena — Foundation shell (Phase 1)
import { NRCProtectedRoute } from "@/components/nrc/arena/NRCProtectedRoute";
import NRCArenaIndex from "./pages/nrc/arena/NRCArenaIndex";
import NRCSignIn from "./pages/nrc/arena/NRCSignIn";
import NRCOnboarding from "./pages/nrc/arena/NRCOnboarding";
import NRCProfile from "./pages/nrc/arena/NRCProfile";
import NRCDirectory from "./pages/nrc/arena/NRCDirectory";
import NRCTeams from "./pages/nrc/arena/NRCTeams";
import NRCTeamDetail from "./pages/nrc/arena/NRCTeamDetail";
import NRCArenaDashboard from "./pages/nrc/arena/NRCDashboard";
import NRCCases from "./pages/nrc/arena/NRCCases";
import NRCCaseDetail from "./pages/nrc/arena/NRCCaseDetail";
import NRCEvidence from "./pages/nrc/arena/NRCEvidence";
import NRCDuplicates from "./pages/nrc/arena/NRCDuplicates";
import NRCEndorsements from "./pages/nrc/arena/NRCEndorsements";
import NRCHandoverJudges from "./pages/nrc/arena/NRCHandoverJudges";
import NRCHandoverGovernance from "./pages/nrc/arena/NRCHandoverGovernance";
import NRCReportsPage from "./pages/nrc/arena/NRCReportsPage";
import NRCAuditLog from "./pages/nrc/arena/NRCAuditLog";
import NRCAutomation from "./pages/nrc/arena/NRCAutomation";
import {
  NRCDashboardHome,
  NRCNomineeTable,
  NRCNomineeReview,
  NRCReports,
  NRCFlaggedCases,
  NRCMyReviews,
  EDIAnalyticsDashboard,
  NRCIntakeQueue,
  NRCIntakeReview,
  NRCMergeTool,
} from "./pages/nrc/dashboard";

// Admin Pages
import {
  AdminDashboard,
  AdminOrders,
  AdminImpact,
  AdminNomineeImages,
  AdminNomineeMediaLibrary,
  AdminNomineeProfiles,
  AdminVotingGovernance,
  AdminRebuild,
  AdminEDXAnalytics,
  AdminContributorPhotos,
  AdminContributorsCMS,
  AdminPathwaysCMS,
  AdminGalleryCMS,
  AdminIconMigrationVerification,
  AdminIconPortraitGaps,
} from "./pages/admin";
import BulkSeedNominees from "./pages/admin/BulkSeedNominees";
import AdminVolunteersCMS from "./pages/admin/AdminVolunteersCMS";

// Optimized QueryClient with caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Wrapper component that applies PublicLayout
const WithLayout = ({
  children,
  showFooter = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) => <PublicLayout showFooter={showFooter}>{children}</PublicLayout>;

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SeasonProvider>
            <RegionProvider>
              <Toaster />
              <Sonner />
              <CustomerCareChat />
              <RegionPickerModal />
              <RegionConfirmationPopup />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Landing - has its own header/footer */}
                  <Route path="/" element={<NESALandingPage />} />
                  <Route
                    path="/programs/nesa-africa"
                    element={<NESALandingPage />}
                  />
                  <Route
                    path="/upcoming-events"
                    element={
                      <WithLayout>
                        <UpcomingEventsPage />
                      </WithLayout>
                    }
                  />

                  {/* Programs */}
                  <Route
                    path="/programs"
                    element={
                      <WithLayout>
                        <Programs />
                      </WithLayout>
                    }
                  />

                  {/* AGC — Afri-Gold Coin Rewards */}
                  <Route
                    path="/earn-agc"
                    element={
                      <WithLayout>
                        <EarnVotingCoins />
                      </WithLayout>
                    }
                  />
                  <Route path="/agc-rewards" element={<Navigate to="/earn-agc" replace />} />
                  <Route path="/earn-voting-coins" element={<Navigate to="/earn-agc" replace />} />

                  {/* === 301 LEGACY REDIRECTS === */}
                  {/* Auth legacy */}
                  <Route path="/auth" element={<Navigate to="/login" replace />} />
                  <Route path="/auth/login" element={<Navigate to="/login" replace />} />
                  <Route path="/auth/register" element={<Navigate to="/register" replace />} />
                  <Route path="/auth/forgot-password" element={<Navigate to="/forgot-password" replace />} />
                  <Route path="/auth/reset-password" element={<Navigate to="/reset-password" replace />} />
                  <Route path="/signin" element={<Navigate to="/login" replace />} />
                  <Route path="/signup" element={<Navigate to="/register" replace />} />

                  {/* Sponsor NESA-Africa 2026 — premium partnership ecosystem */}
                  <Route path="/sponsor" element={<SponsorHub />} />
                  <Route path="/sponsorship-packages" element={<SponsorshipPackages />} />
                  <Route path="/sponsorship" element={<Navigate to="/sponsorship-packages" replace />} />
                  <Route path="/sponsor/packages" element={<Navigate to="/sponsorship-packages" replace />} />
                  <Route path="/sponsor/:slug" element={<SponsorCategoryPage />} />
                  {/* Sponsor legacy */}
                  <Route path="/our-sponsors" element={<Navigate to="/sponsors" replace />} />
                  <Route path="/our-partners" element={<Navigate to="/sponsors" replace />} />
                  <Route path="/partner" element={<Navigate to="/sponsors" replace />} />
                  {/* /partners has its own dedicated page — do not redirect */}
                  <Route path="/partnerships" element={<Navigate to="/sponsors" replace />} />
                  <Route path="/become-a-sponsor" element={<Navigate to="/sponsor" replace />} />
                  <Route path="/become-sponsor" element={<Navigate to="/sponsor" replace />} />


                  {/* Master-register canonical aliases → existing implementations
                      (Stage B: make the register's short/canonical paths resolve). */}
                  <Route path="/awards/influencer" element={<Navigate to="/awards/influencer-education-impact" replace />} />
                  <Route path="/judges/apply" element={<Navigate to="/judgeapply" replace />} />
                  <Route path="/gala/tickets" element={<Navigate to="/tickets" replace />} />
                  <Route path="/gala/attendance" element={<Navigate to="/tickets" replace />} />
                  <Route path="/prenominate" element={<Navigate to="/nominate" replace />} />
                  <Route path="/verify" element={<Navigate to="/certificates/verify" replace />} />
                  <Route path="/membership" element={<Navigate to="/get-involved" replace />} />

                  {/* Nominee legacy */}
                  <Route path="/nominee" element={<Navigate to="/nominees" replace />} />
                  <Route path="/nominee-directory" element={<Navigate to="/nominees" replace />} />
                  <Route path="/nominees-directory" element={<Navigate to="/nominees" replace />} />
                  <Route path="/profile/:slug" element={<SlugRedirect to={(s) => `/nominee/${s}`} />} />
                  <Route path="/nominees/profile/:slug" element={<SlugRedirect to={(s) => `/nominee/${s}`} />} />

                  {/* Category / award legacy */}
                  <Route path="/award" element={<Navigate to="/awards" replace />} />
                  <Route path="/award-categories" element={<Navigate to="/categories" replace />} />
                  <Route path="/category" element={<Navigate to="/categories" replace />} />
                  <Route path="/category/:slug" element={<SlugRedirect to={(s) => `/categories/${s}`} />} />
                  <Route path="/awards/category/:slug" element={<SlugRedirect to={(s) => `/awards/${s}`} />} />
                  {/* /nominees/category/:categorySlug is handled by the canonical CategoryLandingPage route below */}

                  {/* Region legacy — /region is now an alias of canonical /regions */}
                  <Route path="/region/nigeria" element={<Navigate to="/regions/nigeria" replace />} />
                  <Route path="/region" element={<Navigate to="/regions" replace />} />
                  <Route path="/region/:slug" element={<SlugRedirect to={(s) => `/regions/${s}`} />} />
                  <Route path="/nominees/region/:region" element={<RegionSlugGate />} />
                  {/* Legacy 5-region short-slugs redirect to canonical 8-region URLs */}
                  <Route path="/nominees/region" element={<Navigate to="/nominees#regions" replace />} />



                  {/* Misc legacy paths flagged in audit */}
                  <Route path="/jury" element={<Navigate to="/judges" replace />} />
                  <Route path="/music" element={<Navigate to="/media" replace />} />
                  <Route path="/media/nesa-tv" element={<Navigate to="/media/tv" replace />} />
                  <Route path="/dashboard/wallet" element={<Navigate to="/wallet" replace />} />
                  <Route path="/earn-credits" element={<Navigate to="/earn-agc" replace />} />
                  <Route path="/volunteer-bod" element={<Navigate to="/volunteer" replace />} />
                  <Route path="/policies/coi" element={<Navigate to="/policies" replace />} />
                  <Route path="/policies/privacy" element={<Navigate to="/policies" replace />} />
                  <Route path="/policies/terms" element={<Navigate to="/policies" replace />} />
                  <Route path="/policies/voting-integrity" element={<Navigate to="/policies" replace />} />
                  <Route path="/get-involved" element={<Navigate to="/support" replace />} />
                  <Route path="/press" element={<Navigate to="/media" replace />} />

                  {/* === 2026 nav ecosystem — new hrefs preserved via redirect to nearest live page === */}
                  {/* About sub-pages -> consolidated About with hash anchors */}
                  <Route path="/about/vision-mission" element={<Navigate to="/about#vision" replace />} />
                  <Route path="/about/how-it-works" element={<Navigate to="/about#how-it-works" replace />} />
                  <Route path="/about/judges" element={<Navigate to="/judges" replace />} />
                  <Route path="/about/integrity" element={<Navigate to="/governance" replace />} />
                  <Route path="/about/verification" element={<Navigate to="/governance#verification" replace />} />
                  <Route path="/about/eligibility" element={<Navigate to="/awards/eligibility" replace />} />
                  <Route path="/about/partners" element={<Navigate to="/sponsors" replace />} />
                  {/* /faqs is canonical (Phase D); /faq legacy points to it */}
                  <Route path="/faq" element={<Navigate to="/faqs" replace />} />

                  {/* Awards sub-pages */}
                  <Route path="/awards/eligibility" element={<Navigate to="/awards#eligibility" replace />} />
                  <Route path="/awards/judging" element={<Navigate to="/governance#judging" replace />} />
                  <Route path="/guidelines/nominees" element={<Navigate to="/nominate#nominee-guidelines" replace />} />
                  <Route path="/guidelines/nominators" element={<Navigate to="/nominate#nominator-guidelines" replace />} />

                  {/* Education Enablers taxonomy -> directory (routed pages can back-fill later) */}
                  <Route path="/education-enablers/regions" element={<Navigate to="/regions" replace />} />
                  <Route path="/education-enablers/regions/:slug" element={<SlugRedirect to={(s) => `/regions?rec=${s}`} />} />
                  <Route path="/education-enablers/sectors" element={<Navigate to="/education-enablers?view=sectors" replace />} />
                  <Route path="/education-enablers/sectors/:slug" element={<SlugRedirect to={(s) => `/education-enablers?sector=${s}`} />} />
                  <Route path="/education-enablers/edtech" element={<Navigate to="/education-enablers?filter=edtech" replace />} />
                  <Route path="/education-enablers/edtech/:slug" element={<SlugRedirect to={(s) => `/education-enablers?edtech=${s}`} />} />
                  <Route path="/education-enablers/edtech/regions" element={<Navigate to="/education-enablers?filter=edtech" replace />} />
                  <Route path="/education-enablers/edtech/prospects" element={<Navigate to="/prospective-organizations?filter=edtech" replace />} />
                  <Route path="/education-enablers/claim-profile" element={<Navigate to="/education-enablers?action=claim" replace />} />
                  <Route path="/education-enablers/submit-evidence" element={<Navigate to="/education-enablers?action=evidence" replace />} />
                  <Route path="/education-enablers/verification" element={<Navigate to="/governance#verification" replace />} />

                  {/* Impact Programmes */}
                  <Route path="/impact/regional-voting" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />
                  <Route path="/impact/regional-winners" element={<Navigate to="/impact" replace />} />
                  <Route path="/impact/donate" element={<Navigate to="/donate" replace />} />
                  <Route path="/impact/afri-edutourism-2027" element={<Navigate to="/afri-edutourism" replace />} />
                  <Route path="/impact/reports" element={<Navigate to="/impact#reports" replace />} />
                  <Route path="/impact/map" element={<Navigate to="/impact#map" replace />} />

                  {/* Media & Events */}
                  <Route path="/media-events" element={<Navigate to="/media" replace />} />
                  <Route path="/radio-podcast" element={<Navigate to="/media#radio" replace />} />
                  <Route path="/news" element={<Navigate to="/media#news" replace />} />
                  <Route path="/stories" element={<Navigate to="/media#stories" replace />} />
                  <Route path="/education-enabler-features" element={<Navigate to="/media#features" replace />} />
                  <Route path="/interviews" element={<Navigate to="/media#interviews" replace />} />
                  <Route path="/press-room" element={<Navigate to="/media#press" replace />} />
                  <Route path="/gala/tables" element={<Navigate to="/tickets" replace />} />
                  <Route path="/events/calendar" element={<Navigate to="/media#events" replace />} />
                  <Route path="/events/afri-edutourism" element={<Navigate to="/afri-edutourism" replace />} />

                  {/* Get Involved */}
                  <Route path="/get-involved/partner" element={<Navigate to="/support#partner" replace />} />
                  <Route path="/get-involved/category-sponsorship" element={<Navigate to="/sponsorship-packages" replace />} />
                  <Route path="/get-involved/enabler-page-sponsorship" element={<Navigate to="/sponsorship-packages" replace />} />
                  <Route path="/get-involved/gala-sponsorship" element={<Navigate to="/sponsorship-packages" replace />} />
                  <Route path="/get-involved/media-partnership" element={<Navigate to="/support#media" replace />} />
                  <Route path="/get-involved/fundraising-partner" element={<Navigate to="/support#fundraising" replace />} />
                  <Route path="/contact/partnerships" element={<Navigate to="/contact" replace />} />

                  {/* Canonical consolidation aliases per 2026 IA refactor */}
                  <Route path="/recognition" element={<Navigate to="/awards" replace />} />
                  <Route path="/companies" element={<Navigate to="/education-enablers" replace />} />
                  <Route path="/organisations" element={<Navigate to="/education-enablers" replace />} />
                  <Route path="/organizations" element={<Navigate to="/education-enablers" replace />} />
                  <Route path="/enabler-database" element={<Navigate to="/education-enablers" replace />} />
                  <Route path="/gala" element={<Navigate to="/events/gala-2026" replace />} />
                  <Route path="/gala/tickets" element={<Navigate to="/tickets" replace />} />
                  <Route path="/partner" element={<Navigate to="/get-involved/partner" replace />} />
                  <Route path="/sponsor" element={<Navigate to="/sponsors" replace />} />




                  {/* === 22-page canonical spec (2026 final refactor) === */}
                  {/* Short tier aliases (canonical URLs per spec) */}
                  <Route path="/africa-education-icon" element={<WithLayout><IconAward /></WithLayout>} />
                  <Route path="/gold-blue-garnet" element={<WithLayout><BlueGarnetAward /></WithLayout>} />
                  <Route path="/platinum" element={<WithLayout><PlatinumAward /></WithLayout>} />
                  <Route path="/influencer-impact" element={<InfluencerImpact2026 />} />
                  <Route path="/endorsements" element={<WithLayout><EndorsementsPage /></WithLayout>} />




                  {/* About */}
                  <Route
                    path="/about"
                    element={
                      <WithLayout>
                        <AboutConsolidated />
                      </WithLayout>
                    }
                  />
                  <Route path="/about/nesa-africa-2026" element={<WithLayout><AboutCycle2026 /></WithLayout>} />
                  <Route path="/about/nesa-africa-2027" element={<WithLayout><AboutCycle2027 /></WithLayout>} />
                  <Route path="/about/nesa-africa-2028-2030" element={<WithLayout><AboutCycle2028_2030 /></WithLayout>} />
                  {/* Legacy short-path redirects */}
                  <Route path="/about/2026" element={<Navigate to="/about/nesa-africa-2026" replace />} />
                  <Route path="/about/2027" element={<Navigate to="/about/nesa-africa-2027" replace />} />
                  <Route path="/about/2028-2030" element={<Navigate to="/about/nesa-africa-2028-2030" replace />} />
                  <Route path="/about/vision-2035" element={<Navigate to="/about#vision-2035" replace />} />
                  <Route path="/about/governance" element={<Navigate to="/about#governance" replace />} />
                  <Route
                    path="/governance"
                    element={
                      <WithLayout>
                        <GovernancePage />
                      </WithLayout>
                    }
                  />
                  <Route path="/edx-matrix" element={<EDXMatrixPage />} />
                  <Route path="/edx" element={<Navigate to="/edx-matrix" replace />} />
                  <Route
                    path="/about/timeline"
                    element={
                      <WithLayout>
                        <Timeline />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/timeline"
                    element={
                      <WithLayout>
                        <Timeline />
                      </WithLayout>
                    }
                  />
                  <Route path="/voting-timeline" element={<Navigate to="/timeline" replace />} />
                  <Route path="/awards/timeline" element={<Navigate to="/timeline" replace />} />

                  <Route path="/about/scef" element={<Navigate to="/about#scef" replace />} />
                  <Route path="/about/awards-recognition" element={<Navigate to="/recognition" replace />} />
                  <Route path="/about/social-impact" element={<Navigate to="/eduaid-africa" replace />} />
                  <Route
                    path="/awards"
                    element={
                      <WithLayout>
                        <Awards />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/impact"
                    element={
                      <WithLayout>
                        <ImpactHub />
                      </WithLayout>
                    }
                  />
                  <Route path="/impact/regional-school-intervention" element={<Navigate to="/impact" replace />} />
                  <Route path="/impact/rebuild-my-school-africa" element={<Navigate to="/eduaid-africa/rebuild-my-school" replace />} />
                  <Route
                    path="/impact/nominate-school"
                    element={
                      <WithLayout>
                        <NominateSchool />
                      </WithLayout>
                    }
                  />

                  <Route
                    path="/videos"
                    element={
                      <WithLayout>
                        <Videos />
                      </WithLayout>
                    }
                  />

                  {/* Trending nominees */}
                  <Route
                    path="/trending"
                    element={
                      <WithLayout>
                        <Trending />
                      </WithLayout>
                    }
                  />
                  {/* Voting explainer — sunset */}
                  <Route path="/how-voting-works" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />

                  {/* Awards — Refactored category architecture (Phase 18B) */}
                  <Route
                    path="/awards/categories"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <CategoryMasterIndex />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/18-categories"
                    element={
                      <WithLayout>
                        <EighteenCategoriesPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/18-categories/:categorySlug"
                    element={
                      <WithLayout>
                        <CategoryDetailPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/gold-blue-garnet/categories"
                    element={<Navigate to="/awards/18-categories" replace />}
                  />
                  <Route
                    path="/awards/gold-blue-garnet/:categorySlug"
                    element={
                      <WithLayout>
                        <CategoryDetailPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/gold-blue-garnet/:categorySlug/:subcategorySlug"
                    element={
                      <WithLayout>
                        <TierCategorySubcategoryPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/18-categories/:categorySlug/:subcategorySlug"
                    element={
                      <WithLayout>
                        <TierCategorySubcategoryPage />
                      </WithLayout>
                    }
                  />



                  <Route
                    path="/awards/blue-garnet-categories"
                    element={
                      <WithLayout>
                        <BlueGarnetCategoriesIndex />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/blue-garnet-categories/:slug"
                    element={
                      <WithLayout>
                        <AwardCategoryRoute />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/platinum-certificate-categories"
                    element={
                      <WithLayout>
                        <PlatinumCategoriesIndex />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/platinum-certificate-categories/:slug"
                    element={
                      <WithLayout>
                        <AwardCategoryRoute />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/influencers-education-impact"
                    element={
                      <WithLayout>
                        <InfluencersCategoriesIndex />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/influencers-education-impact/:slug"
                    element={
                      <WithLayout>
                        <AwardCategoryRoute />
                      </WithLayout>
                    }
                  />

                  {/* Programmatic legacy → canonical redirects for category URLs */}
                  {buildCategoryRedirects().map(({ from, to }) => (
                    <Route key={`catredir-${from}`} path={from} element={<Navigate to={to} replace />} />
                  ))}

                  {/* Legacy /categories index → master index */}
                  <Route path="/categories" element={<Navigate to="/awards/categories" replace />} />

                  {/* Legacy /categories/:slug — preserved for any deep links not covered by redirect map */}
                  <Route
                    path="/categories/:slug"
                    element={
                      <WithLayout>
                        <CategoryDetail />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/platinum"
                    element={
                      <WithLayout>
                        <PlatinumAward />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/icon"
                    element={
                      <WithLayout>
                        <IconAward />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/gold"
                    element={
                      <WithLayout>
                        <GoldAward />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/blue-garnet"
                    element={
                      <WithLayout>
                        <BlueGarnetAward />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/influencers-education-impact-2026-recognition"
                    element={<InfluencerImpact2026 />}
                  />
                  {/* Simplified Awards dropdown canonical URLs — keep these alive so the gateway never 404s */}
                  <Route path="/awards/recognition-architecture" element={<Navigate to="/awards" replace />} />
                  <Route path="/awards/gold-blue-garnet" element={<WithLayout><BlueGarnetAward /></WithLayout>} />
                  <Route path="/awards/gold-blue-garnet/vote" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />
                  <Route path="/awards/gold-blue-garnet/vote-now" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />
                  <Route path="/awards/platinum-recognition" element={<WithLayout><PlatinumAward /></WithLayout>} />
                  <Route path="/awards/platinum-recognition/diaspora" element={<WithLayout><PlatinumDiasporaPage /></WithLayout>} />
                  <Route path="/awards/platinum/diaspora" element={<Navigate to="/awards/platinum-recognition/diaspora" replace />} />
                  <Route path="/awards/influencer-education-impact" element={<InfluencerImpact2026 />} />
                  <Route path="/awards/influencer-education-impact/nominees" element={<InfluencerNomineesDirectoryPage />} />
                  <Route path="/nominees/influencer-education-impact/:sub" element={<WithLayout><InfluencerSubcategoryPage /></WithLayout>} />
                  <Route path="/recognition/influencer-education-impact/african-social-media-influencers" element={<WithLayout><InfluencerSubcategoryPage slugOverride="african-social-media-influencers" /></WithLayout>} />
                  <Route path="/recognition/influencer-education-impact/african-sports-icons-supporting-education" element={<WithLayout><InfluencerSubcategoryPage slugOverride="african-sports-icons-supporting-education" /></WithLayout>} />
                  <Route path="/recognition/influencer-education-impact/african-music-icons-supporting-education" element={<WithLayout><InfluencerSubcategoryPage slugOverride="african-music-icons-supporting-education" /></WithLayout>} />

                  {/* Standardized 4-subpage cluster (About · Criteria · Nominees · Nominate) for each recognition tier */}
                  <Route path="/awards/:tier/about" element={<WithLayout><TierClusterPage subpage="about" /></WithLayout>} />
                  <Route path="/awards/:tier/criteria" element={<WithLayout><TierClusterPage subpage="criteria" /></WithLayout>} />
                  <Route path="/awards/:tier/nominees" element={<WithLayout><TierClusterPage subpage="nominees" /></WithLayout>} />
                  <Route path="/awards/:tier/nominate" element={<WithLayout><TierClusterPage subpage="nominate" /></WithLayout>} />


                  {/* Legacy shell — keep importable from other entry points */}
                  <Route
                    path="/awards/gold-special-recognition-legacy"
                    element={<GoldSpecialRecognition />}
                  />
                  <Route
                    path="/awards/gold-special-recognition"
                    element={<Navigate to="/awards/influencers-education-impact-2026-recognition" replace />}
                  />
                  <Route
                    path="/awards/winners"
                    element={
                      <WithLayout>
                        <Winners />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/certificates/verify"
                    element={
                      <WithLayout>
                        <CertificateVerify />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/verify/:hash"
                    element={
                      <WithLayout>
                        <VerifyCertificate />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/my-certificates"
                    element={
                      <WithLayout>
                        <MyCertificates />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/certificates/guide"
                    element={
                      <WithLayout>
                        <CertificateGuide />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/my-certificates/guide"
                    element={
                      <WithLayout>
                        <CertificateGuide />
                      </WithLayout>
                    }
                  />

                  <Route path="/voting-portal" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />



                  {/* Recognition Hub — dedicated page + 4 award category pages */}
                  <Route
                    path="/subcategories"
                    element={
                      <WithLayout>
                        <PathwaysPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/ecosystem"
                    element={
                      <WithLayout>
                        <EcosystemPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/movement"
                    element={
                      <WithLayout>
                        <MovementPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/subcategories-to-recognition"
                    element={
                      <WithLayout>
                        <PathwaysPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/africa-education-icon"
                    element={
                      <WithLayout>
                        <AfricaEducationIconRefactored />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/africa-education-icon/nominees"
                    element={<Navigate to="/nominees/africa-education-icon-award" replace />}
                  />
                  <Route
                    path="/awards/regions"
                    element={<Navigate to="/awards#regions" replace />}
                  />
                  <Route
                    path="/awards/regions/:slug"
                    element={
                      <WithLayout>
                        <AwardsRegionPage />
                      </WithLayout>
                    }
                  />

                  <Route
                    path="/awards/pillars"
                    element={
                      <WithLayout>
                        <PillarsHub />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/pillars/:slug"
                    element={
                      <WithLayout>
                        <PillarPage />
                      </WithLayout>
                    }
                  />

                  {/* Canonical Awards Spine — Pathway → Category → Subcategory */}
                  <Route path="/recognition" element={<WithLayout><RecognitionHubPage /></WithLayout>} />

                  {/* === 38-page canonical spec (2026 refactor) ===
                      Renders existing tier & category components at the
                      authoritative /recognition/{tier}[/{category}] URLs.
                      Legacy /awards/* paths remain as aliases/redirects. */}
                  <Route path="/recognition/gold-blue-garnet" element={<WithLayout><BlueGarnetAward /></WithLayout>} />
                  <Route path="/recognition/platinum" element={<WithLayout><PlatinumAward /></WithLayout>} />
                  <Route path="/recognition/africa-education-icon" element={<WithLayout><IconAward /></WithLayout>} />
                  <Route path="/recognition/influencer-education-impact" element={<InfluencerImpact2026 />} />
                  {/* 3-segment subcategory routes remain */}
                  <Route path="/recognition/gold-blue-garnet/:categorySlug/:subcategorySlug" element={<WithLayout><TierCategorySubcategoryPage /></WithLayout>} />
                  {/* Phase C — 22 unified subpages driven by src/config/awards/subpages2026.ts */}
                  <Route path="/recognition/subpage/:slug" element={<WithLayout><AwardSubpageRoute /></WithLayout>} />
                  {/* 18 dedicated category pages — unified renderer driven by src/config/recognition2026 */}
                  <Route path="/recognition/:tier/:category" element={<WithLayout><CategoryPage2026 /></WithLayout>} />



                  {/* Core spec URLs — render existing content at canonical paths */}
                  <Route path="/gala" element={<WithLayout><GalaConsolidated /></WithLayout>} />
                  <Route path="/support" element={<WithLayout><SupportConsolidated /></WithLayout>} />
                  <Route path="/education-enablers" element={<WithLayout><NomineeDirectory /></WithLayout>} />
                  <Route path="/special-needs" element={<WithLayout><EduAid /></WithLayout>} />
                  <Route path="/rebuild-my-school" element={<WithLayout><Rebuild /></WithLayout>} />
                  {/* Stage 6 — Legacy recognition redirects (data-driven). */}
                  {LEGACY_RECOGNITION_REDIRECTS.map((r) => (
                    <Route key={r.from} path={r.from} element={<RedirectRoute to={r.to} />} />
                  ))}
                  {/* Master refactor — 2026 canonical 301 register. */}
                  {REFACTOR_REDIRECTS_2026.map((r) => (
                    <Route key={`refactor-${r.from}`} path={r.from} element={<RedirectRoute to={r.to} />} />
                  ))}
                  {/* Stage 7 — DB-resolved legacy category redirect (/awards/c/:slug → spine). */}
                  <Route path="/awards/c/:categorySlug" element={<LegacyCategoryRedirect />} />
                  <Route path="/awards/category/:categorySlug" element={<LegacyCategoryRedirect />} />

                  <Route path="/awards/explore" element={<WithLayout><Awards /></WithLayout>} />
                  <Route path="/awards/explore/:pathwaySlug" element={<WithLayout><AwardSpinePage /></WithLayout>} />
                  <Route path="/awards/explore/:pathwaySlug/:categorySlug" element={<WithLayout><AwardSpinePage /></WithLayout>} />
                  <Route path="/awards/explore/:pathwaySlug/:categorySlug/:subcategorySlug" element={<WithLayout><AwardSpinePage /></WithLayout>} />


                  <Route
                    path="/awards/csr-education"
                    element={
                      <WithLayout>
                        <CSREducationAfrica />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/csr-for-education"
                    element={<Navigate to="/awards/csr-education" replace />}
                  />
                  <Route
                    path="/awards/influencer-education"
                    element={
                      <WithLayout>
                        <DigitalVoices />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/digital-voices"
                    element={
                      <WithLayout>
                        <DigitalVoices />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/grants-global-support"
                    element={
                      <WithLayout>
                        <InternationalEducation />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/awards/global-partnerships"
                    element={
                      <WithLayout>
                        <InternationalEducation />
                      </WithLayout>
                    }
                  />


                  {/* Dynamic Category Pages (data-driven) */}
                  <Route
                    path="/category/csr-education-africa"
                    element={
                      <WithLayout>
                        <CSREducationAfrica />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/csr-education-nigeria"
                    element={
                      <WithLayout>
                        <CSREducationNigeria />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/edutech-africa"
                    element={
                      <WithLayout>
                        <EduTechAfrica />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/media-advocacy-nigeria"
                    element={
                      <WithLayout>
                        <MediaAdvocacyNigeria />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/ngo-education-nigeria"
                    element={
                      <WithLayout>
                        <NGOEducationNigeria />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/ngo-education-africa"
                    element={
                      <WithLayout>
                        <NGOEducationAfrica />
                      </WithLayout>
                    }
                  />
                  {/* NGO 5-Africa Regional ecosystem */}
                  <Route
                    path="/nominees/best-ngo-contribution-to-education"
                    element={
                      <WithLayout>
                        <NGOHubPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/best-ngo-contribution-to-education/profile/:slug"
                    element={
                      <WithLayout>
                        <NGONomineeProfile />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/best-ngo-contribution-to-education/:region"
                    element={
                      <WithLayout>
                        <NGORegionalPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/stem-education-africa"
                    element={
                      <WithLayout>
                        <STEMEducationAfrica />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/creative-arts-nigeria"
                    element={
                      <WithLayout>
                        <CreativeArtsNigeria />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/education-friendly-state-nigeria"
                    element={
                      <WithLayout>
                        <EducationFriendlyStateNigeria />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/library-nigeria"
                    element={
                      <WithLayout>
                        <LibraryNigeria />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/research-development-nigeria"
                    element={
                      <WithLayout>
                        <ResearchDevelopmentNigeria />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/christian-education-africa"
                    element={
                      <WithLayout>
                        <ChristianEducationAfrica />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/islamic-education-africa"
                    element={
                      <WithLayout>
                        <IslamicEducationAfrica />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/political-leaders-nigeria"
                    element={
                      <WithLayout>
                        <PoliticalLeadersNigeria />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/international-education"
                    element={
                      <WithLayout>
                        <InternationalEducation />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/diaspora-education"
                    element={
                      <WithLayout>
                        <DiasporaEducation />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/categories/diaspora-education-impact"
                    element={
                      <WithLayout>
                        <DiasporaEducation />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/categories/international-bilateral-education"
                    element={
                      <WithLayout>
                        <InternationalEducation />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/categories/islamic-education-impact-africa"
                    element={
                      <WithLayout>
                        <IslamicEducationAfrica />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/categories/christian-education-impact-africa"
                    element={
                      <WithLayout>
                        <ChristianEducationAfrica />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/category/africa-education-icon"
                    element={<Navigate to="/nominees/africa-education-icon-award" replace />}
                  />
                  <Route
                    path="/nominees/category/africa-education-icon-award"
                    element={<Navigate to="/nominees/africa-education-icon-award" replace />}
                  />

                  {/* Nominee Response Routes */}
                  <Route
                    path="/nominee/accept/:token"
                    element={<NomineeAccept />}
                  />
                  <Route
                    path="/nominee/decline/:token"
                    element={<NomineeDecline />}
                  />
                  <Route
                    path="/nominee/dashboard/:token"
                    element={<NomineeDashboard />}
                  />

                  {/* Media */}
                  <Route path="/media" element={<WithLayout><MediaHubConsolidated /></WithLayout>} />
                  {/* Gallery */}
                  <Route
                    path="/gallery"
                    element={
                      <WithLayout>
                        <GalleryLanding />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/gallery/:slug"
                    element={
                      <WithLayout>
                        <GalleryCollection />
                      </WithLayout>
                    }
                  />
                  <Route path="/media/gallery" element={<Navigate to="/gallery" replace />} />
                  <Route path="/media/photos" element={<Navigate to="/gallery" replace />} />
                  <Route path="/media/events" element={<Navigate to="/gallery" replace />} />
                  <Route path="/media/highlights" element={<Navigate to="/gallery" replace />} />
                  <Route path="/media/behind-the-scenes" element={<Navigate to="/gallery" replace />} />
                  <Route
                    path="/media/tv"
                    element={
                      <WithLayout>
                        <NESATV />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/media/shows"
                    element={
                      <WithLayout>
                        <Shows />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/media/webinars"
                    element={
                      <WithLayout>
                        <Webinars />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/media/gala"
                    element={
                      <WithLayout>
                        <Gala />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/tickets"
                    element={
                      <WithLayout>
                        <Tickets />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/buy-your-ticket"
                    element={
                      <WithLayout>
                        <BuyYourTicket />
                      </WithLayout>
                    }
                  />

                  {/* Shop / Merchandise - specific routes before dynamic :slug */}
                  <Route
                    path="/shop"
                    element={
                      <WithLayout>
                        <Shop />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/shop/cart"
                    element={
                      <WithLayout>
                        <Cart />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/shop/checkout"
                    element={
                      <WithLayout>
                        <Checkout />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/shop/bulk-orders"
                    element={
                      <WithLayout>
                        <BulkOrders />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/shop/orders/:id"
                    element={
                      <WithLayout>
                        <OrderConfirmation />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/shop/:slug"
                    element={
                      <WithLayout>
                        <ProductDetail />
                      </WithLayout>
                    }
                  />

                  {/* Shop route aliases - redirect old/guessed URLs to /shop */}
                  <Route
                    path="/merchandise"
                    element={
                      <WithLayout>
                        <Shop />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/merch"
                    element={
                      <WithLayout>
                        <Shop />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/store"
                    element={
                      <WithLayout>
                        <Shop />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/buy-merchandise"
                    element={
                      <WithLayout>
                        <Shop />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/shop-now"
                    element={
                      <WithLayout>
                        <Shop />
                      </WithLayout>
                    }
                  />

                  {/* Cart, Checkout, and Orders route aliases */}
                  <Route
                    path="/cart"
                    element={
                      <WithLayout>
                        <Cart />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <WithLayout>
                        <Checkout />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <WithLayout>
                        <OrderConfirmation />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/bulk-orders"
                    element={
                      <WithLayout>
                        <BulkOrders />
                      </WithLayout>
                    }
                  />

                  {/* Auth - standalone layout (dark branded) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/otp" element={<OTPVerification />} />
                  <Route path="/account/otp" element={<OTPVerification />} />
                  <Route path="/account/login" element={<Login />} />

                  {/* User Actions */}
                  {/* /nominate → Google Forms MVP intake (brief §5). Legacy multi-step
                      flow remains available at /nominate/advanced for power users. */}
                  <Route
                    path="/nominate"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateHub2026 />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  {/* 18 canonical nomination forms (Phase 1 shells) */}
                  <Route
                    path="/nominate/africa-education-icon"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateCategoryShell
                            fixedTier="africa-education-icon"
                            fixedCategory="africa-education-icon"
                          />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominate/influencer-education-impact"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateCategoryShell
                            fixedTier="influencer-education-impact"
                            fixedCategory="influencer-education-impact"
                          />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominate/platinum/:category"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateCategoryShell fixedTier="platinum" />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominate/gold-blue-garnet/:category"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateCategoryShell fixedTier="gold-blue-garnet" />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  {/* Native Icon Award nomination hub (writes straight to Supabase). */}
                  <Route
                    path="/nominate/icon"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <IconNominatePage />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominate/ngo"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NGOChooser />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominate/advanced"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateFlow />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominate/official"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateOfficial />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominate/official/:family"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateOfficial />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominate/official/:family/:category"
                    element={
                      <WithLayout>
                        <WithFirewall>
                          <NominateOfficial />
                        </WithFirewall>
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees"
                    element={
                      <WithLayout>
                        <Nominees />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/catalogue"
                    element={
                      <WithLayout>
                        <CatalogueIndexPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/category/:categorySlug"
                    element={
                      <WithLayout>
                        <CategoryLandingPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/category/:categorySlug/:subSlug"
                    element={
                      <WithLayout>
                        <SubcategoryPage />
                      </WithLayout>
                    }
                  />
                  {/* Region-first nominee ecosystem (West / East / North / Central / Southern Africa) */}
                  {[
                    "west-africa",
                    "east-africa",
                    "north-africa",
                    "central-africa",
                    "southern-africa",
                  ].flatMap((region) => [
                    <Route key={`${region}-hub`} path={`/nominees/${region}`} element={<WithLayout><RegionNomineesHubPage region={region} /></WithLayout>} />,
                    <Route key={`${region}-cat`} path={`/nominees/${region}/:categorySlug`} element={<WithLayout><RegionCategoryPage region={region} /></WithLayout>} />,
                    <Route key={`${region}-sub`} path={`/nominees/${region}/:categorySlug/:subcategorySlug`} element={<WithLayout><RegionCategoryPage region={region} /></WithLayout>} />,
                  ])}
                  {/* Influencers Education Impact Award — dedicated nominee ecosystem */}
                  <Route
                    path="/nominees/gold-special-recognition"
                    element={
                      <WithLayout>
                        <GoldHubPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/gold-special-recognition/:categorySlug"
                    element={
                      <WithLayout>
                        <GoldCategoryPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/gold-special-recognition/:categorySlug/:nomineeSlug"
                    element={
                      <WithLayout>
                        <GoldNomineeProfilePage />
                      </WithLayout>
                    }
                  />
                  {/* Africa Education Icon Award — nested nominee ecosystem */}
                  <Route
                    path="/nominees/africa-education-icon-award"
                    element={
                      <WithLayout>
                        <IconAwardMain />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/africa-education-icon-award/:sub"
                    element={
                      <WithLayout>
                        <IconSubcategoryPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominees/africa-education-icon-award/:sub/:cls"
                    element={
                      <WithLayout>
                        <IconClassificationPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/nominee/:slug"
                    element={<NomineeSlugRedirect />}
                  />
                  <Route
                    path="/nominees/:slug"
                    element={
                      <WithLayout>
                        <NomineeSlugDispatcher />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/directory"
                    element={
                      <WithLayout>
                        <NomineeDirectory />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/directory/:slug"
                    element={
                      <WithLayout>
                        <MasterNomineeProfile />
                      </WithLayout>
                    }
                  />
                  <Route path="/vote" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />
                  <Route path="/vote-with-agc" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />
                  <Route path="/vote/gold" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />
                  <Route path="/vote/blue-garnet" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />
                  <Route
                    path="/about-agc"
                    element={
                      <WithLayout>
                        <AboutAGC />
                      </WithLayout>
                    }
                  />
                  <Route path="/earn-voting-credits" element={<Navigate to="/earn-agc" replace />} />
                  <Route path="/claim-voting-credits" element={<Navigate to="/earn-agc" replace />} />
                  <Route
                    path="/gfawzip"
                    element={
                      <WithLayout>
                        <GFAWzipWallet />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/gfawzip/links"
                    element={
                      <WithLayout>
                        <GFAWzipLinks />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/wallet/gfawzip"
                    element={
                      <WithLayout>
                        <GFAWzipWallet />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/payments/gfawzip"
                    element={
                      <WithLayout>
                        <GFAWzipWallet />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/getfinance"
                    element={
                      <WithLayout>
                        <GFAWzipWallet />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/gfawzip-wallet"
                    element={
                      <WithLayout>
                        <GFAWzipWallet />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/links"
                    element={
                      <WithLayout>
                        <GFAWzipLinks />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
                      <WithLayout>
                        <Wallet />
                      </WithLayout>
                    }
                  />
                  <Route path="/sponsors" element={<WithLayout><SponsorsPartners /></WithLayout>} />
                  <Route path="/sponsors/:slug" element={<SponsorLanding />} />
                  <Route path="/results" element={<Navigate to={VOTING_SUNSET_REDIRECT} replace />} />

                  {/* Dashboards - use their own layout */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* Register-canonical merged dashboards: NRC lives inside the
                      Volunteer Dashboard, Judges Arena inside the Judge Dashboard. */}
                  <Route path="/dashboard/volunteer" element={<VolunteerDashboardMerged />} />
                  <Route path="/dashboard/judge" element={<JudgeDashboardMerged />} />
                  <Route
                    path="/dashboard/nominations"
                    element={<Dashboard />}
                  />
                  <Route
                    path="/dashboard/notifications"
                    element={<NotificationsPage />}
                  />
                  <Route path="/dashboard/profile" element={<ProfilePage />} />
                  <Route
                    path="/dashboard/settings"
                    element={<SettingsPage />}
                  />
                  <Route
                    path="/dashboard/region"
                    element={<RegionDashboard />}
                  />

                  {/* Region Routes — canonical lives under /regions */}
                  <Route
                    path="/regions"
                    element={
                      <WithLayout>
                        <RegionsIndexPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/regions/nigeria"
                    element={
                      <WithLayout>
                        <NigeriaChapterTrack />
                      </WithLayout>
                    }
                  />
                  <Route path="/regions/:slug" element={<RegionHubPage />} />
                  {/* Afri-EduTourism Ecosystem */}
                  <Route
                    path="/afri-edutourism"
                    element={
                      <WithLayout>
                        <AfriEduTourismPage />
                      </WithLayout>
                    }
                  />

                  {/* NRC Arena — public landing + secure workspace shell. */}
                  <Route path="/nrc" element={<NRCArenaIndex />} />
                  <Route path="/nrc/sign-in" element={<NRCSignIn />} />
                  <Route path="/nrc/portal" element={<Navigate to="/nrc" replace />} />
                  <Route
                    path="/nrc/onboarding"
                    element={<NRCProtectedRoute><NRCOnboarding /></NRCProtectedRoute>}
                  />
                  <Route
                    path="/nrc/profile"
                    element={<NRCProtectedRoute><NRCProfile /></NRCProtectedRoute>}
                  />
                  <Route
                    path="/nrc/profile/:nrcReference"
                    element={<NRCProtectedRoute><NRCProfile /></NRCProtectedRoute>}
                  />
                  <Route
                    path="/nrc/directory"
                    element={<NRCProtectedRoute><NRCDirectory /></NRCProtectedRoute>}
                  />
                  <Route
                    path="/nrc/teams"
                    element={<NRCProtectedRoute><NRCTeams /></NRCProtectedRoute>}
                  />
                  <Route
                    path="/nrc/teams/:teamSlug"
                    element={<NRCProtectedRoute><NRCTeamDetail /></NRCProtectedRoute>}
                  />

                  {/* NRC operational pages (legacy screens retained) */}
                  <Route path="/nrc/my-queue" element={<NRCMyQueue />} />
                  <Route path="/nrc/members" element={<NRCMembersPage />} />
                  <Route path="/nrc/settings" element={<NRCSettings />} />
                  <Route
                    path="/nrc/scoring"
                    element={<NRCScoringDashboard />}
                  />

                  {/* NRC Dashboard — new arena dashboard */}
                  <Route
                    path="/nrc/dashboard"
                    element={<NRCProtectedRoute><NRCArenaDashboard /></NRCProtectedRoute>}
                  />
                  <Route path="/nrc/cases" element={<NRCProtectedRoute><NRCCases /></NRCProtectedRoute>} />
                  <Route path="/nrc/cases/:caseId" element={<NRCProtectedRoute><NRCCaseDetail /></NRCProtectedRoute>} />
                  <Route path="/nrc/evidence" element={<NRCProtectedRoute><NRCEvidence /></NRCProtectedRoute>} />
                  <Route path="/nrc/duplicates" element={<NRCProtectedRoute><NRCDuplicates /></NRCProtectedRoute>} />
                  <Route path="/nrc/endorsements" element={<NRCProtectedRoute><NRCEndorsements /></NRCProtectedRoute>} />
                  <Route path="/nrc/handover/judges" element={<NRCProtectedRoute><NRCHandoverJudges /></NRCProtectedRoute>} />
                  <Route path="/nrc/handover/governance" element={<NRCProtectedRoute><NRCHandoverGovernance /></NRCProtectedRoute>} />
                  <Route path="/nrc/reports" element={<NRCProtectedRoute><NRCReportsPage /></NRCProtectedRoute>} />
                  <Route path="/nrc/audit-log" element={<NRCProtectedRoute><NRCAuditLog /></NRCProtectedRoute>} />
                  <Route path="/nrc/automation" element={<NRCProtectedRoute><NRCAutomation /></NRCProtectedRoute>} />
                  <Route
                    path="/nrc/dashboard/nominees"
                    element={<NRCNomineeTable />}
                  />
                  <Route
                    path="/nrc/dashboard/review/:id"
                    element={<NRCNomineeReview />}
                  />
                  <Route
                    path="/nrc/dashboard/reports"
                    element={<NRCReports />}
                  />
                  <Route
                    path="/nrc/dashboard/flagged"
                    element={<NRCFlaggedCases />}
                  />
                  <Route
                    path="/nrc/dashboard/my-reviews"
                    element={<NRCMyReviews />}
                  />
                  <Route
                    path="/nrc/dashboard/queue"
                    element={<NRCNomineeTable />}
                  />
                  <Route
                    path="/nrc/dashboard/intake"
                    element={<NRCIntakeQueue />}
                  />
                  <Route
                    path="/nrc/dashboard/intake/:id"
                    element={<NRCIntakeReview />}
                  />
                  <Route
                    path="/nrc/dashboard/merge"
                    element={<NRCMergeTool />}
                  />
                  <Route
                    path="/nrc/dashboard/duplicates"
                    element={<NRCMergeTool />}
                  />
                  <Route
                    path="/nrc/dashboard/guidelines"
                    element={<NRCSettings />}
                  />
                  <Route
                    path="/nrc/dashboard/edi-analytics"
                    element={<EDIAnalyticsDashboard />}
                  />
                  <Route
                    path="/nrc/dashboard/profile"
                    element={<NRCSettings />}
                  />
                  <Route
                    path="/nrc/dashboard/settings"
                    element={<NRCSettings />}
                  />

                  {/* OLC Coordinator Routes - use their own layout */}
                  <Route path="/olc/dashboard" element={<OLCDashboard />} />
                  <Route path="/olc/members" element={<OLCMembers />} />
                  <Route path="/olc/wallet" element={<OLCWallet />} />
                  <Route path="/olc/settlements" element={<OLCSettlements />} />

                  {/* Admin Routes - use their own layout */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/impact" element={<AdminImpact />} />
                  <Route
                    path="/admin/nominee-images"
                    element={<AdminNomineeImages />}
                  />
                  <Route
                    path="/admin/nominee-media"
                    element={<AdminNomineeMediaLibrary />}
                  />
                  <Route
                    path="/admin/nominee-profiles"
                    element={<AdminNomineeProfiles />}
                  />
                  <Route
                    path="/admin/voting"
                    element={<AdminVotingGovernance />}
                  />
                  <Route path="/admin/rebuild" element={<AdminRebuild />} />
                  <Route path="/admin/edx" element={<AdminEDXAnalytics />} />
                  <Route path="/admin/contributor-photos" element={<AdminContributorPhotos />} />
                  <Route path="/admin/contributors" element={<AdminContributorsCMS />} />
                  <Route path="/admin/volunteers" element={<AdminVolunteersCMS />} />
                  <Route path="/admin/subcategories" element={<AdminPathwaysCMS />} />
                  <Route path="/admin/gallery" element={<AdminGalleryCMS />} />
                  <Route path="/admin/icon-migration" element={<AdminIconMigrationVerification />} />
                  <Route path="/admin/icon-portrait-gaps" element={<AdminIconPortraitGaps />} />
                  <Route
                    path="/admin/bulk-seed"
                    element={<BulkSeedNominees />}
                  />

                  {/* Support */}
                  <Route
                    path="/donate"
                    element={
                      <WithLayout>
                        <Donate />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/eduaid"
                    element={
                      <WithLayout>
                        <EduAid />
                      </WithLayout>
                    }
                  />
                  <Route path="/eduaid-africa" element={<WithLayout><EduAidAfricaImpact /></WithLayout>} />
                  {/* /afri-edutourism canonical route is defined above (standalone page). */}

                  <Route
                    path="/rebuild"
                    element={
                      <WithLayout>
                        <Rebuild />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/eduaid-africa/rebuild-my-school"
                    element={
                      <WithLayout>
                        <RebuildHubPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/eduaid-africa/rebuild-my-school/:regionSlug"
                    element={
                      <WithLayout>
                        <RebuildRegionalPortal />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/judges"
                    element={
                      <WithLayout>
                        <Judges />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/judges/directory"
                    element={
                      <WithLayout>
                        <JudgesDirectory />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/judges/nominee-pipeline"
                    element={
                      <WithLayout>
                        <NomineePipeline />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/judges/pathways/:pathwaySlug"
                    element={
                      <WithLayout>
                        <PathwayWorkspace />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/judges/:slug"
                    element={
                      <WithLayout>
                        <JudgeProfile />
                      </WithLayout>
                    }
                  />
                  <Route path="/install" element={<Install />} />

                  {/* Judge Application Flow (Public) */}
                  <Route
                    path="/judge/apply"
                    element={
                      <WithLayout>
                        <JudgeApply />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/judge/status"
                    element={
                      <WithLayout>
                        <JudgeStatus />
                      </WithLayout>
                    }
                  />
                  <Route path="/judge/signup" element={<JudgeSignup />} />
                  <Route path="/judge/verify" element={<JudgeVerify />} />

                  {/* /judgeapply — Judges & NRC Portal (dropdown hub with nested pages) */}
                  <Route path="/judgeapply" element={<JudgeApplyPortalLayout />}>
                    <Route index element={<JudgeApplyPortalHome />} />
                    <Route path="about" element={<JudgeApplyAreaLanding areaId="about" />} />
                    <Route path="about/:slug" element={<JudgeApplySupportingPage areaId="about" />} />
                    <Route path="judges" element={<JudgeApplyAreaLanding areaId="judges" />} />
                    <Route path="judges/:slug" element={<JudgeApplySupportingPage areaId="judges" />} />
                    <Route path="nrc" element={<JudgeApplyAreaLanding areaId="nrc" />} />
                    <Route path="nrc/:slug" element={<JudgeApplySupportingPage areaId="nrc" />} />
                    <Route path="*" element={<Navigate to="/judgeapply" replace />} />
                  </Route>

                  <Route
                    path="/judge-apply"
                    element={
                      <WithLayout>
                        <JudgeApply />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/judge-application-form"
                    element={
                      <WithLayout>
                        <JudgeApply />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/judge-status"
                    element={
                      <WithLayout>
                        <JudgeStatus />
                      </WithLayout>
                    }
                  />
                  <Route path="/judge-verify" element={<JudgeVerify />} />
                  <Route path="/judge-signup" element={<JudgeSignup />} />

                  {/* Judge Portal Routes (Authenticated + Protected + OTP enforced) */}
                  <Route
                    path="/judge"
                    element={
                      <JudgeArenaGuard>
                        <JudgeDashboard />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/onboarding"
                    element={
                      <JudgeArenaGuard>
                        <JudgeOnboarding />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/dashboard"
                    element={
                      <JudgeArenaGuard>
                        <JudgeDashboard />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/scoring"
                    element={
                      <JudgeArenaGuard>
                        <JuryScoring />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/coi"
                    element={
                      <JudgeArenaGuard>
                        <JuryCOI />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/chat"
                    element={
                      <JudgeArenaGuard>
                        <JudgeChatRoom />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/rubric"
                    element={
                      <JudgeArenaGuard>
                        <JudgeRubric />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/guidelines"
                    element={
                      <JudgeArenaGuard>
                        <JudgeGuidelines />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/panel"
                    element={
                      <JudgeArenaGuard>
                        <JudgePanel />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/help"
                    element={
                      <JudgeArenaGuard>
                        <JudgeHelp />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/settings"
                    element={
                      <JudgeArenaGuard>
                        <JudgeSettings />
                      </JudgeArenaGuard>
                    }
                  />
                  <Route
                    path="/judge/icon-lifetime"
                    element={
                      <JudgeArenaGuard>
                        <JudgeIconLifetime />
                      </JudgeArenaGuard>
                    }
                  />

                  {/* Judges Arena (new shell) */}
                  <Route
                    path="/judges-arena"
                    element={
                      <JudgeArenaGuard>
                        <ArenaShellLayout />
                      </JudgeArenaGuard>
                    }
                  >
                    {/* Canonical judge entry is the Judge Dashboard per the
                        master register; deep arena screens remain as children. */}
                    <Route index element={<Navigate to="/dashboard/judge" replace />} />
                    <Route path="nominees" element={<ArenaNominees />} />
                    <Route path="nominee/:slug" element={<ArenaReview />} />
                    <Route path="discussion" element={<ArenaDiscussion />} />
                  </Route>
                  <Route
                    path="/partners"
                    element={
                      <WithLayout>
                        <Partners />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/partners/prospects/:slug"
                    element={
                      <WithLayout>
                        <ProspectiveOrgPage />
                      </WithLayout>
                    }
                  />

                  <Route
                    path="/chapters"
                    element={
                      <WithLayout>
                        <ChaptersConsolidated />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/vacancies"
                    element={
                      <WithLayout>
                        <Vacancies />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/volunteer"
                    element={
                      <WithLayout>
                        <Volunteer />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/volunteers"
                    element={
                      <WithLayout>
                        <Volunteers />
                      </WithLayout>
                    }
                  />
                  <Route path="/volunteers/:slug" element={<WithLayout><VolunteerProfile /></WithLayout>} />
                  <Route path="/volunteer-teams" element={<WithLayout><VolunteerTeams /></WithLayout>} />
                  <Route path="/volunteer-leaderboard" element={<WithLayout><VolunteerLeaderboard /></WithLayout>} />
                  <Route path="/volunteer-stories" element={<WithLayout><VolunteerStories /></WithLayout>} />
                  <Route path="/volunteer/dashboard" element={<WithLayout><VolunteerDashboard /></WithLayout>} />
                  <Route path="/volunteer/profile" element={<WithLayout><VolunteerProfileEdit /></WithLayout>} />
                  <Route path="/volunteer/referrals" element={<WithLayout><VolunteerReferralsPage /></WithLayout>} />
                  <Route path="/volunteer/tasks" element={<WithLayout><VolunteerTasksPage /></WithLayout>} />
                  <Route path="/volunteer/analytics" element={<WithLayout><VolunteerAnalyticsPage /></WithLayout>} />
                  <Route path="/volunteer/settings" element={<WithLayout><VolunteerSettingsPage /></WithLayout>} />
                  <Route path="/volunteer/share-assets" element={<WithLayout><VolunteerShareAssets /></WithLayout>} />
                  <Route path="/volunteer-chapters" element={<WithLayout><VolunteerChaptersHub /></WithLayout>} />
                  <Route path="/join-local-chapter" element={<WithLayout><JoinLocalChapter /></WithLayout>} />
                  <Route path="/volunteers/command-center" element={<VolunteerCommandCenter />} />
                  <Route
                    path="/ambassadors"
                    element={
                      <WithLayout>
                        <Ambassadors />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/contributors"
                    element={
                      <WithLayout>
                        <Contributors />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/contributors/:id"
                    element={
                      <WithLayout>
                        <ContributorProfile />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <WithLayout>
                        <Contact />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/policies"
                    element={
                      <WithLayout>
                        <Policies />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/faqs"
                    element={
                      <WithLayout>
                        <FAQPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/events"
                    element={
                      <WithLayout>
                        <EventsPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/resources"
                    element={
                      <WithLayout>
                        <ResourcesPage />
                      </WithLayout>
                    }
                  />
                  <Route path="/help-center" element={<Navigate to="/faqs" replace />} />
                  <Route path="/help" element={<Navigate to="/faqs" replace />} />

                  {/* Guidelines & EDI Matrix */}
                  <Route
                    path="/guidelines/edi-matrix"
                    element={
                      <WithLayout>
                        <EDIMatrix />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/guidelines/nominators"
                    element={
                      <WithLayout>
                        <ForNominators />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/guidelines/nominees"
                    element={
                      <WithLayout>
                        <ForNominees />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/guidelines/judges"
                    element={
                      <WithLayout>
                        <ForJudges />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/guidelines/voters"
                    element={
                      <WithLayout>
                        <ForVoters />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/guidelines/renomination"
                    element={
                      <WithLayout>
                        <ContinueRecognition />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/guidelines/update-impact"
                    element={<Navigate to="/guidelines/renomination" replace />}
                  />
                  <Route
                    path="/guidelines/impact-storytelling"
                    element={
                      <WithLayout>
                        <ImpactStorytelling />
                      </WithLayout>
                    }
                  />

                  {/* Get Involved - Endorse NESA */}
                  <Route
                    path="/get-involved/endorse-nesa-africa"
                    element={
                      <WithLayout>
                        <EndorseNESA />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/endorse"
                    element={
                      <WithLayout>
                        <EndorseNESA />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/endorse-nesa"
                    element={
                      <WithLayout>
                        <EndorseNESA />
                      </WithLayout>
                    }
                  />

                  {/* Africa Education Icon — Judges Arena (public + isolated jury portal) */}
                  <Route path="/judges" element={<JudgesArenaLanding />} />
                  <Route path="/judges/enter" element={<JudgesEntry />} />
                  <Route path="/judges/sign-in" element={<IconJurySignIn />} />
                  <Route path="/icon-jury/sign-in" element={<Navigate to="/judges/sign-in" replace />} />
                  <Route
                    path="/judges"
                    element={
                      <IconJudgeGate>
                        <IconJuryLayout />
                      </IconJudgeGate>
                    }
                  >
                    <Route path="dashboard" element={<IconJuryDashboard />} />
                    <Route path="my-panel" element={<MyPanel />} />
                    <Route path="assignments" element={<IconJuryAssignments />} />
                    <Route path="nominees/:nomineeId" element={<IconJuryNomineeReview />} />
                    <Route path="nominee/:nomineeId" element={<IconJuryNomineeReview />} />
                    <Route path="conflicts" element={<IconJuryConflicts />} />
                    <Route path="scoring" element={<IconJuryScoringGuide />} />
                    <Route path="notes" element={<IconJuryNotes />} />
                    <Route path="voting" element={<GrandJuryVotingHub />} />
                    <Route path="voting/:groupId" element={<GrandJuryGroupBallot />} />
                    <Route path="results" element={<IconJuryResults />} />
                    <Route path="profile" element={<IconJuryProfile />} />
                    <Route path="audit" element={<IconJuryAuditTrailPage />} />
                    <Route path="help" element={<IconJuryHelp />} />
                  </Route>
                  {/* Legacy /icon-jury/* aliases → /judges/* */}
                  <Route path="/icon-jury" element={<Navigate to="/judges/dashboard" replace />} />
                  <Route path="/icon-jury/*" element={<Navigate to="/judges/dashboard" replace />} />

                  <Route
                    path="/admin/icon-jury"
                    element={
                      <IconJudgeGate requireModerator>
                        <IconJuryLayout />
                      </IconJudgeGate>
                    }
                  >
                    <Route index element={<IconJuryAdminDashboard />} />
                    <Route path="results" element={<IconJuryResults />} />
                    <Route path="governance-review" element={<GovernanceReviewDashboard />} />
                    <Route path="audit" element={<IconJuryAdminAuditTrailPage />} />
                  </Route>


                  {/* Utility */}
                  <Route
                    path="/unauthorized"
                    element={
                      <WithLayout>
                        <Unauthorized />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <WithLayout>
                        <NotFound />
                      </WithLayout>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </RegionProvider>
          </SeasonProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
