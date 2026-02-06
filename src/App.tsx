import { Toaster } from "@/components/ui/toaster";
import Nominees from "./pages/Nominees";
import NomineeProfile from "./pages/NomineeProfile";
import CertificateVerify from "./pages/CertificateVerify";
import VerifyCertificate from "./pages/VerifyCertificate";
import Results from "./pages/Results";
import Policies from "./pages/Policies";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { SeasonProvider } from "@/contexts/SeasonContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CustomerCareChat } from "@/components/support/CustomerCareChat";

// Pages
import NESAAfrica from "./pages/programs/NESAAfrica";
import Categories from "./pages/Categories";
import Programs from "./pages/Programs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OTPVerification from "./pages/auth/OTPVerification";
import Nominate from "./pages/Nominate";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import CategoryDetail from "./pages/CategoryDetail";
import NomineeAccept from "./pages/NomineeAccept";
import NomineeDecline from "./pages/NomineeDecline";
import NomineeDashboard from "./pages/nominee/NomineeDashboard";

// About Pages
import About from "./pages/about/About";
import Vision2035 from "./pages/about/Vision2035";
import Governance from "./pages/about/Governance";
import Timeline from "./pages/about/Timeline";
import SCEF from "./pages/about/SCEF";
import Awards from "./pages/Awards";
import Impact from "./pages/Impact";
import Videos from "./pages/Videos";

// Award Pages
import PlatinumAward from "./pages/awards/PlatinumAward";
import IconAward from "./pages/awards/IconAward";
import GoldAward from "./pages/awards/GoldAward";
import BlueGarnetAward from "./pages/awards/BlueGarnetAward";
import Winners from "./pages/awards/Winners";

// Media Pages
import MediaHub from "./pages/media/MediaHub";
import NESATV from "./pages/media/NESATV";
import Shows from "./pages/media/Shows";
import Webinars from "./pages/media/Webinars";
import Gala from "./pages/media/Gala";

// Support Pages
import Donate from "./pages/Donate";
import EduAid from "./pages/EduAid";
import Rebuild from "./pages/Rebuild";
import Judges from "./pages/Judges";

// Judge Portal Pages
import { JudgeApply, JudgeStatus, JudgeSignup, JudgeVerify, JudgeDashboard, JudgePortal, JuryScoring, JuryCOI, JudgeRubric, JudgeGuidelines, JudgePanel, JudgeHelp, JudgeSettings, JudgeChatRoom, JudgeIconLifetime } from "./pages/judge";
import { JudgeArenaGuard } from "./components/judge/JudgeArenaGuard";
import Partners from "./pages/Partners";
import Chapters from "./pages/Chapters";
import Volunteer from "./pages/Volunteer";
import Ambassadors from "./pages/Ambassadors";
import Contact from "./pages/Contact";
import Vote from "./pages/Vote";
import VoteWithAGC from "./pages/VoteWithAGC";
import { GoldVoting, BlueGarnetVoting } from "./pages/vote";
import AboutAGC from "./pages/AboutAGC";
import EarnVotingCredits from "./pages/EarnVotingCredits";
import ClaimVotingCredits from "./pages/ClaimVotingCredits";
import Tickets from "./pages/Tickets";
import BuyYourTicket from "./pages/BuyYourTicket";
import GFAWzipWallet from "./pages/GFAWzipWallet";
import GFAWzipLinks from "./pages/GFAWzipLinks";
import { Shop, ProductDetail, Cart, Checkout, OrderConfirmation, BulkOrders } from "./pages/shop";
import { SponsorLanding } from "./pages/sponsors";
import Wallet from "./pages/Wallet";
import EndorseNESA from "./pages/EndorseNESA";

// OLC Pages
import { OLCDashboard, OLCMembers, OLCSettlements, OLCWallet } from "./pages/olc";

// NRC Portal Pages
import { NRCPortal, NRCMyQueue, NRCMembers as NRCMembersPage, NRCSettings } from "./pages/nrc";

// Admin Pages
import { AdminDashboard, AdminOrders, AdminImpact, AdminNomineeImages, AdminNomineeProfiles, AdminVotingGovernance } from "./pages/admin";

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

// Wrapper component that applies PublicLayout
const WithLayout = ({ children, showFooter = true }: { children: React.ReactNode; showFooter?: boolean }) => (
  <PublicLayout showFooter={showFooter}>{children}</PublicLayout>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SeasonProvider>
            <Toaster />
            <Sonner />
            <CustomerCareChat />
            <BrowserRouter>
              <Routes>
                {/* Landing - has its own header/footer */}
                <Route path="/" element={<NESAAfrica />} />
                <Route path="/programs/nesa-africa" element={<NESAAfrica />} />
                
                {/* Programs */}
                <Route path="/programs" element={<WithLayout><Programs /></WithLayout>} />
                
                {/* About */}
                <Route path="/about" element={<WithLayout><About /></WithLayout>} />
                <Route path="/about/vision-2035" element={<WithLayout><Vision2035 /></WithLayout>} />
                <Route path="/about/governance" element={<WithLayout><Governance /></WithLayout>} />
                <Route path="/about/timeline" element={<WithLayout><Timeline /></WithLayout>} />
                <Route path="/about/scef" element={<WithLayout><SCEF /></WithLayout>} />
                <Route path="/about/awards-recognition" element={<WithLayout><Awards /></WithLayout>} />
                <Route path="/about/social-impact" element={<WithLayout><Impact /></WithLayout>} />
                <Route path="/awards" element={<WithLayout><Awards /></WithLayout>} />
                <Route path="/impact" element={<WithLayout><Impact /></WithLayout>} />
                <Route path="/videos" element={<WithLayout><Videos /></WithLayout>} />
                
                {/* Awards */}
                <Route path="/categories" element={<WithLayout><Categories /></WithLayout>} />
                <Route path="/categories/:slug" element={<WithLayout><CategoryDetail /></WithLayout>} />
                <Route path="/awards/platinum" element={<WithLayout><PlatinumAward /></WithLayout>} />
                <Route path="/awards/icon" element={<WithLayout><IconAward /></WithLayout>} />
                <Route path="/awards/gold" element={<WithLayout><GoldAward /></WithLayout>} />
                <Route path="/awards/blue-garnet" element={<WithLayout><BlueGarnetAward /></WithLayout>} />
                <Route path="/awards/winners" element={<WithLayout><Winners /></WithLayout>} />
                <Route path="/certificates/verify" element={<WithLayout><CertificateVerify /></WithLayout>} />
                <Route path="/verify/:hash" element={<WithLayout><VerifyCertificate /></WithLayout>} />
                
                {/* Nominee Response Routes */}
                <Route path="/nominee/accept/:token" element={<NomineeAccept />} />
                <Route path="/nominee/decline/:token" element={<NomineeDecline />} />
                <Route path="/nominee/dashboard/:token" element={<NomineeDashboard />} />
                
                {/* Media */}
                <Route path="/media" element={<WithLayout><MediaHub /></WithLayout>} />
                <Route path="/media/tv" element={<WithLayout><NESATV /></WithLayout>} />
                <Route path="/media/shows" element={<WithLayout><Shows /></WithLayout>} />
                <Route path="/media/webinars" element={<WithLayout><Webinars /></WithLayout>} />
                <Route path="/media/gala" element={<WithLayout><Gala /></WithLayout>} />
                <Route path="/tickets" element={<WithLayout><Tickets /></WithLayout>} />
                <Route path="/buy-your-ticket" element={<WithLayout><BuyYourTicket /></WithLayout>} />
                
                {/* Shop / Merchandise - specific routes before dynamic :slug */}
                <Route path="/shop" element={<WithLayout><Shop /></WithLayout>} />
                <Route path="/shop/cart" element={<WithLayout><Cart /></WithLayout>} />
                <Route path="/shop/checkout" element={<WithLayout><Checkout /></WithLayout>} />
                <Route path="/shop/bulk-orders" element={<WithLayout><BulkOrders /></WithLayout>} />
                <Route path="/shop/orders/:id" element={<WithLayout><OrderConfirmation /></WithLayout>} />
                <Route path="/shop/:slug" element={<WithLayout><ProductDetail /></WithLayout>} />
                
                {/* Shop route aliases - redirect old/guessed URLs to /shop */}
                <Route path="/merchandise" element={<WithLayout><Shop /></WithLayout>} />
                <Route path="/merch" element={<WithLayout><Shop /></WithLayout>} />
                <Route path="/store" element={<WithLayout><Shop /></WithLayout>} />
                <Route path="/buy-merchandise" element={<WithLayout><Shop /></WithLayout>} />
                <Route path="/shop-now" element={<WithLayout><Shop /></WithLayout>} />
                
                {/* Cart, Checkout, and Orders route aliases */}
                <Route path="/cart" element={<WithLayout><Cart /></WithLayout>} />
                <Route path="/checkout" element={<WithLayout><Checkout /></WithLayout>} />
                <Route path="/orders/:id" element={<WithLayout><OrderConfirmation /></WithLayout>} />
                <Route path="/bulk-orders" element={<WithLayout><BulkOrders /></WithLayout>} />
                
                {/* Auth - minimal layout */}
                <Route path="/login" element={<WithLayout showFooter={false}><Login /></WithLayout>} />
                <Route path="/register" element={<WithLayout showFooter={false}><Register /></WithLayout>} />
                <Route path="/otp" element={<OTPVerification />} />
                <Route path="/account/otp" element={<OTPVerification />} />
                <Route path="/account/login" element={<WithLayout showFooter={false}><Login /></WithLayout>} />
                
                {/* User Actions */}
                <Route path="/nominate" element={<WithLayout><Nominate /></WithLayout>} />
                <Route path="/nominees" element={<WithLayout><Nominees /></WithLayout>} />
                <Route path="/nominees/:slug" element={<WithLayout><NomineeProfile /></WithLayout>} />
                <Route path="/vote" element={<WithLayout><Vote /></WithLayout>} />
                <Route path="/vote-with-agc" element={<WithLayout><VoteWithAGC /></WithLayout>} />
                <Route path="/vote/gold" element={<WithLayout><GoldVoting /></WithLayout>} />
                <Route path="/vote/blue-garnet" element={<WithLayout><BlueGarnetVoting /></WithLayout>} />
                <Route path="/about-agc" element={<WithLayout><AboutAGC /></WithLayout>} />
                <Route path="/earn-voting-credits" element={<WithLayout><EarnVotingCredits /></WithLayout>} />
                <Route path="/claim-voting-credits" element={<WithLayout><ClaimVotingCredits /></WithLayout>} />
                <Route path="/gfawzip" element={<WithLayout><GFAWzipWallet /></WithLayout>} />
                <Route path="/gfawzip/links" element={<WithLayout><GFAWzipLinks /></WithLayout>} />
                <Route path="/wallet/gfawzip" element={<WithLayout><GFAWzipWallet /></WithLayout>} />
                <Route path="/payments/gfawzip" element={<WithLayout><GFAWzipWallet /></WithLayout>} />
                <Route path="/getfinance" element={<WithLayout><GFAWzipWallet /></WithLayout>} />
                <Route path="/gfawzip-wallet" element={<WithLayout><GFAWzipWallet /></WithLayout>} />
                <Route path="/links" element={<WithLayout><GFAWzipLinks /></WithLayout>} />
                <Route path="/wallet" element={<WithLayout><Wallet /></WithLayout>} />
                <Route path="/sponsors/:slug" element={<SponsorLanding />} />
                <Route path="/results" element={<WithLayout><Results /></WithLayout>} />
                
                {/* Dashboards - use their own layout */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/nominations" element={<Dashboard />} />
                
                {/* NRC Portal Routes */}
                <Route path="/nrc" element={<NRCPortal />} />
                <Route path="/nrc/my-queue" element={<NRCMyQueue />} />
                <Route path="/nrc/members" element={<NRCMembersPage />} />
                <Route path="/nrc/settings" element={<NRCSettings />} />
                
                {/* OLC Coordinator Routes - use their own layout */}
                <Route path="/olc/dashboard" element={<OLCDashboard />} />
                <Route path="/olc/members" element={<OLCMembers />} />
                <Route path="/olc/wallet" element={<OLCWallet />} />
                <Route path="/olc/settlements" element={<OLCSettlements />} />
                
                {/* Admin Routes - use their own layout */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/impact" element={<AdminImpact />} />
                <Route path="/admin/nominee-images" element={<AdminNomineeImages />} />
                <Route path="/admin/nominee-profiles" element={<AdminNomineeProfiles />} />
                <Route path="/admin/voting" element={<AdminVotingGovernance />} />
                
                {/* Support */}
                <Route path="/donate" element={<WithLayout><Donate /></WithLayout>} />
                <Route path="/eduaid" element={<WithLayout><EduAid /></WithLayout>} />
                <Route path="/rebuild" element={<WithLayout><Rebuild /></WithLayout>} />
                <Route path="/judges" element={<WithLayout><Judges /></WithLayout>} />
                
                {/* Judge Application Flow (Public) */}
                <Route path="/judge/apply" element={<WithLayout><JudgeApply /></WithLayout>} />
                <Route path="/judge/status" element={<WithLayout><JudgeStatus /></WithLayout>} />
                <Route path="/judge/signup" element={<JudgeSignup />} />
                <Route path="/judge/verify" element={<JudgeVerify />} />
                
                {/* Judge route aliases (legacy/expected URLs) */}
                <Route path="/judgeapply" element={<WithLayout><JudgeApply /></WithLayout>} />
                <Route path="/judge-apply" element={<WithLayout><JudgeApply /></WithLayout>} />
                <Route path="/judge-application-form" element={<WithLayout><JudgeApply /></WithLayout>} />
                <Route path="/judge-status" element={<WithLayout><JudgeStatus /></WithLayout>} />
                <Route path="/judge-verify" element={<JudgeVerify />} />
                <Route path="/judge-signup" element={<JudgeSignup />} />
                
                {/* Judge Portal Routes (Authenticated + Protected + OTP enforced) */}
                <Route path="/judge" element={<JudgeArenaGuard><JudgeDashboard /></JudgeArenaGuard>} />
                <Route path="/judge/dashboard" element={<JudgeArenaGuard><JudgeDashboard /></JudgeArenaGuard>} />
                <Route path="/judge/scoring" element={<JudgeArenaGuard><JuryScoring /></JudgeArenaGuard>} />
                <Route path="/judge/coi" element={<JudgeArenaGuard><JuryCOI /></JudgeArenaGuard>} />
                <Route path="/judge/chat" element={<JudgeArenaGuard><JudgeChatRoom /></JudgeArenaGuard>} />
                <Route path="/judge/rubric" element={<JudgeArenaGuard><JudgeRubric /></JudgeArenaGuard>} />
                <Route path="/judge/guidelines" element={<JudgeArenaGuard><JudgeGuidelines /></JudgeArenaGuard>} />
                <Route path="/judge/panel" element={<JudgeArenaGuard><JudgePanel /></JudgeArenaGuard>} />
                <Route path="/judge/help" element={<JudgeArenaGuard><JudgeHelp /></JudgeArenaGuard>} />
                <Route path="/judge/settings" element={<JudgeArenaGuard><JudgeSettings /></JudgeArenaGuard>} />
                <Route path="/judge/icon-lifetime" element={<JudgeArenaGuard><JudgeIconLifetime /></JudgeArenaGuard>} />
                <Route path="/partners" element={<WithLayout><Partners /></WithLayout>} />
                <Route path="/chapters" element={<WithLayout><Chapters /></WithLayout>} />
                <Route path="/volunteer" element={<WithLayout><Volunteer /></WithLayout>} />
                <Route path="/ambassadors" element={<WithLayout><Ambassadors /></WithLayout>} />
                <Route path="/contact" element={<WithLayout><Contact /></WithLayout>} />
                <Route path="/policies" element={<WithLayout><Policies /></WithLayout>} />
                
                {/* Get Involved - Endorse NESA */}
                <Route path="/get-involved/endorse-nesa-africa" element={<WithLayout><EndorseNESA /></WithLayout>} />
                <Route path="/endorse" element={<WithLayout><EndorseNESA /></WithLayout>} />
                <Route path="/endorse-nesa" element={<WithLayout><EndorseNESA /></WithLayout>} />
                
                {/* Utility */}
                <Route path="/unauthorized" element={<WithLayout><Unauthorized /></WithLayout>} />
                <Route path="*" element={<WithLayout><NotFound /></WithLayout>} />
              </Routes>
            </BrowserRouter>
          </SeasonProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
