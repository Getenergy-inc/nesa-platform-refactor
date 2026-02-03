import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { SeasonProvider } from "@/contexts/SeasonContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { JudgeArenaGuard } from "./components/judge/JudgeArenaGuard";
import { optimizedQueryConfig } from "@/lib/performance";

// Import all lazy-loaded routes
import {
  NESAAfrica,
  Categories,
  Programs,
  Login,
  Register,
  OTPVerification,
  Nominees,
  NomineeProfile,
  Nominate,
  NomineeAccept,
  NomineeDecline,
  NomineeDashboard,
  About,
  Vision2035,
  Governance,
  Timeline,
  SCEF,
  PlatinumAward,
  IconAward,
  GoldAward,
  BlueGarnetAward,
  Winners,
  CategoryDetail,
  CertificateVerify,
  VerifyCertificate,
  Results,
  MediaHub,
  NESATV,
  Shows,
  Webinars,
  Gala,
  Tickets,
  BuyYourTicket,
  Shop,
  ProductDetail,
  Cart,
  Checkout,
  OrderConfirmation,
  BulkOrders,
  Vote,
  VoteWithAGC,
  AboutAGC,
  EarnVotingCredits,
  ClaimVotingCredits,
  GFAWzipWallet,
  GFAWzipLinks,
  Wallet,
  Donate,
  EduAid,
  Rebuild,
  Judges,
  Partners,
  Chapters,
  Volunteer,
  Ambassadors,
  Contact,
  Policies,
  SponsorLanding,
  Dashboard,
  JudgeApply,
  JudgeStatus,
  JudgeSignup,
  JudgeVerify,
  JudgeDashboard,
  JuryScoring,
  JuryCOI,
  JudgeRubric,
  JudgeGuidelines,
  JudgePanel,
  JudgeHelp,
  JudgeSettings,
  NRCPortal,
  NRCMyQueue,
  NRCMembers,
  NRCSettings,
  OLCDashboard,
  OLCMembers,
  OLCWallet,
  OLCSettlements,
  AdminDashboard,
  AdminOrders,
  AdminImpact,
  AdminNomineeImages,
  AdminNomineeProfiles,
  Unauthorized,
  NotFound,
} from "@/lib/lazy-routes";

// Optimized QueryClient with caching strategy
const queryClient = new QueryClient(optimizedQueryConfig);

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
                <Route path="/nrc/members" element={<NRCMembers />} />
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
                <Route path="/judge/rubric" element={<JudgeArenaGuard><JudgeRubric /></JudgeArenaGuard>} />
                <Route path="/judge/guidelines" element={<JudgeArenaGuard><JudgeGuidelines /></JudgeArenaGuard>} />
                <Route path="/judge/panel" element={<JudgeArenaGuard><JudgePanel /></JudgeArenaGuard>} />
                <Route path="/judge/help" element={<JudgeArenaGuard><JudgeHelp /></JudgeArenaGuard>} />
                <Route path="/judge/settings" element={<JudgeArenaGuard><JudgeSettings /></JudgeArenaGuard>} />
                <Route path="/partners" element={<WithLayout><Partners /></WithLayout>} />
                <Route path="/chapters" element={<WithLayout><Chapters /></WithLayout>} />
                <Route path="/volunteer" element={<WithLayout><Volunteer /></WithLayout>} />
                <Route path="/ambassadors" element={<WithLayout><Ambassadors /></WithLayout>} />
                <Route path="/contact" element={<WithLayout><Contact /></WithLayout>} />
                <Route path="/policies" element={<WithLayout><Policies /></WithLayout>} />
                
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
