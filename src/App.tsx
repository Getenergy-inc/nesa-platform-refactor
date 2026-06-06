import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import Nominees from "./pages/Nominees";
import NomineeProfile from "./pages/NomineeProfile";
import CategoryLandingPage from "./pages/nominees/CategoryLandingPage";
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

/** 301-style redirect that preserves the :slug param and query string. */
const SlugRedirect = ({ to }: { to: (slug: string) => string }) => {
  const { slug = "" } = useParams();
  const search = typeof window !== "undefined" ? window.location.search : "";
  return <Navigate to={`${to(slug)}${search}`} replace />;
};
import NomineeDirectory from "./pages/NomineeDirectory";
import MasterNomineeProfile from "./pages/MasterNomineeProfile";
import CertificateVerify from "./pages/CertificateVerify";
import VerifyCertificate from "./pages/VerifyCertificate";
import Results from "./pages/Results";
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
import Categories from "./pages/Categories";
import Programs from "./pages/Programs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OTPVerification from "./pages/auth/OTPVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Nominate from "./pages/Nominate";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import PathwaysPage from "./pages/PathwaysPage";
import AwardPathwayPage from "./pages/AwardPathwayPage";
import EcosystemPage from "./pages/EcosystemPage";
import MovementPage from "./pages/MovementPage";
import CategoryDetail from "./pages/CategoryDetail";
import NomineeAccept from "./pages/NomineeAccept";
import NomineeDecline from "./pages/NomineeDecline";
import NomineeDashboard from "./pages/nominee/NomineeDashboard";
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
import IconAward from "./pages/awards/IconAward";
import GoldAward from "./pages/awards/GoldAward";
import BlueGarnetAward from "./pages/awards/BlueGarnetAward";
import GoldSpecialRecognition from "./pages/awards/GoldSpecialRecognition";
import DigitalVoices from "./pages/awards/DigitalVoices";
import Winners from "./pages/awards/Winners";
import GovernancePage from "./pages/GovernancePage";
import EDXMatrixPage from "./pages/EDXMatrixPage";
import { SponsorFirewallBanner } from "@/components/governance/SponsorFirewallBanner";

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
import Install from "./pages/Install";

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
import { JudgeArenaGuard } from "./components/judge/JudgeArenaGuard";
import Partners from "./pages/Partners";
import Chapters from "./pages/Chapters";
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
} from "./pages/guidelines";
import Vote from "./pages/Vote";
import VoteWithAGC from "./pages/VoteWithAGC";
import { GoldVoting, BlueGarnetVoting } from "./pages/vote/index";
import AboutAGC from "./pages/AboutAGC";
import EarnVotingCredits from "./pages/EarnVotingCredits";
import ClaimVotingCredits from "./pages/ClaimVotingCredits";
import Trending from "./pages/Trending";
import HowVotingWorks from "./pages/HowVotingWorks";
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
                  <Route path="/nominees/category/:slug" element={<SlugRedirect to={(s) => `/nominees/${s}`} />} />

                  {/* Region legacy */}
                  <Route path="/regions" element={<Navigate to="/region" replace />} />
                  <Route path="/regions/:slug" element={<SlugRedirect to={(s) => `/region/${s}`} />} />
                  <Route path="/nominees/region/:slug" element={<SlugRedirect to={(s) => `/nominees/${s}`} />} />


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
                  <Route path="/get-involved" element={<Navigate to="/volunteer" replace />} />
                  <Route path="/press" element={<Navigate to="/media" replace />} />




                  {/* About */}
                  <Route
                    path="/about"
                    element={
                      <WithLayout>
                        <About />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/about/vision-2035"
                    element={
                      <WithLayout>
                        <Vision2035 />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/about/governance"
                    element={
                      <WithLayout>
                        <Governance />
                      </WithLayout>
                    }
                  />
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
                    path="/about/scef"
                    element={
                      <WithLayout>
                        <SCEF />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/about/awards-recognition"
                    element={
                      <WithLayout>
                        <Awards />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/about/social-impact"
                    element={
                      <WithLayout>
                        <Impact />
                      </WithLayout>
                    }
                  />
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
                        <Impact />
                      </WithLayout>
                    }
                  />
                  <Route path="/impact/regional-school-intervention" element={<Navigate to="/impact" replace />} />
                  <Route path="/impact/rebuild-my-school-africa" element={<Navigate to="/eduaid-africa/rebuild-my-school" replace />} />

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
                  {/* Voting explainer */}
                  <Route
                    path="/how-voting-works"
                    element={
                      <WithLayout>
                        <HowVotingWorks />
                      </WithLayout>
                    }
                  />

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
                    element={<GoldSpecialRecognition />}
                  />
                  {/* Legacy alias — 301-style redirect preserving query string */}
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

                  {/* Pathways to Recognition — dedicated page + 4 award category pages */}
                  <Route
                    path="/pathways"
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
                    path="/pathways-to-recognition"
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
                        <AwardCategoryRoute config={ICON_CATEGORY} />
                      </WithLayout>
                    }
                  />
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
                  <Route
                    path="/media"
                    element={
                      <WithLayout>
                        <MediaHub />
                      </WithLayout>
                    }
                  />
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
                  <Route
                    path="/nominate"
                    element={
                      <WithLayout>
                        <Nominate />
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
                        <NomineeProfile />
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
                  <Route
                    path="/vote"
                    element={
                      <WithLayout>
                        <Vote />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/vote-with-agc"
                    element={
                      <WithLayout>
                        <VoteWithAGC />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/vote/gold"
                    element={
                      <WithLayout>
                        <GoldVoting />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/vote/blue-garnet"
                    element={
                      <WithLayout>
                        <BlueGarnetVoting />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/about-agc"
                    element={
                      <WithLayout>
                        <AboutAGC />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/earn-voting-credits"
                    element={
                      <WithLayout>
                        <EarnVotingCredits />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/claim-voting-credits"
                    element={
                      <WithLayout>
                        <ClaimVotingCredits />
                      </WithLayout>
                    }
                  />
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
                  <Route path="/sponsors" element={<SponsorsHub />} />
                  <Route path="/sponsors/:slug" element={<SponsorLanding />} />
                  <Route
                    path="/results"
                    element={
                      <WithLayout>
                        <Results />
                      </WithLayout>
                    }
                  />

                  {/* Dashboards - use their own layout */}
                  <Route path="/dashboard" element={<Dashboard />} />
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

                  {/* Region Routes */}
                  <Route
                    path="/regions"
                    element={
                      <WithLayout>
                        <RegionsIndexPage />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/region/nigeria"
                    element={
                      <WithLayout>
                        <NigeriaChapterTrack />
                      </WithLayout>
                    }
                  />
                  <Route path="/region/:slug" element={<RegionHubPage />} />

                  {/* NRC Portal Routes (Legacy) */}
                  <Route path="/nrc" element={<NRCPortal />} />
                  <Route path="/nrc/my-queue" element={<NRCMyQueue />} />
                  <Route path="/nrc/members" element={<NRCMembersPage />} />
                  <Route path="/nrc/settings" element={<NRCSettings />} />
                  <Route
                    path="/nrc/scoring"
                    element={<NRCScoringDashboard />}
                  />

                  {/* NRC Dashboard Routes (New Professional Dashboard) */}
                  <Route path="/nrc/dashboard" element={<NRCDashboardHome />} />
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
                  <Route path="/admin/pathways" element={<AdminPathwaysCMS />} />
                  <Route path="/admin/gallery" element={<AdminGalleryCMS />} />
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
                  <Route path="/eduaid-africa" element={<Navigate to="/eduaid" replace />} />

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

                  {/* Judge route aliases (legacy/expected URLs) */}
                  <Route
                    path="/judgeapply"
                    element={
                      <WithLayout>
                        <JudgeApply />
                      </WithLayout>
                    }
                  />
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
                  <Route
                    path="/partners"
                    element={
                      <WithLayout>
                        <Partners />
                      </WithLayout>
                    }
                  />
                  <Route
                    path="/chapters"
                    element={
                      <WithLayout>
                        <Chapters />
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
                    path="/faq"
                    element={
                      <WithLayout>
                        <FAQPage />
                      </WithLayout>
                    }
                  />
                  <Route path="/help-center" element={<Navigate to="/faq" replace />} />
                  <Route path="/help" element={<Navigate to="/faq" replace />} />

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
