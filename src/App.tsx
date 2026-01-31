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

// Pages
import NESAAfrica from "./pages/programs/NESAAfrica";
import Categories from "./pages/Categories";
import Programs from "./pages/Programs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Nominate from "./pages/Nominate";
import Dashboard from "./pages/Dashboard";
import NRCDashboard from "./pages/NRCDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import CategoryDetail from "./pages/CategoryDetail";
import NomineeAccept from "./pages/NomineeAccept";
import NomineeDecline from "./pages/NomineeDecline";

// About Pages
import About from "./pages/about/About";
import Vision2035 from "./pages/about/Vision2035";
import Governance from "./pages/about/Governance";
import Timeline from "./pages/about/Timeline";
import SCEF from "./pages/about/SCEF";

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
import Partners from "./pages/Partners";
import Chapters from "./pages/Chapters";
import Volunteer from "./pages/Volunteer";
import Ambassadors from "./pages/Ambassadors";
import Contact from "./pages/Contact";
import Vote from "./pages/Vote";
import VoteWithAGC from "./pages/VoteWithAGC";
import AboutAGC from "./pages/AboutAGC";
import Tickets from "./pages/Tickets";
import BuyYourTicket from "./pages/BuyYourTicket";
import GFAWzipWallet from "./pages/GFAWzipWallet";
import GFAWzipLinks from "./pages/GFAWzipLinks";
import { Shop, ProductDetail, Cart, Checkout, OrderConfirmation, BulkOrders } from "./pages/shop";

// OLC Pages
import { OLCDashboard, OLCMembers, OLCSettlements, OLCWallet } from "./pages/olc";

// Admin Pages
import { AdminDashboard, AdminOrders, AdminImpact } from "./pages/admin";

const queryClient = new QueryClient();

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
                <Route path="/nominee/accept/:token" element={<WithLayout><NomineeAccept /></WithLayout>} />
                <Route path="/nominee/decline/:token" element={<WithLayout><NomineeDecline /></WithLayout>} />
                
                {/* Media */}
                <Route path="/media" element={<WithLayout><MediaHub /></WithLayout>} />
                <Route path="/media/tv" element={<WithLayout><NESATV /></WithLayout>} />
                <Route path="/media/shows" element={<WithLayout><Shows /></WithLayout>} />
                <Route path="/media/webinars" element={<WithLayout><Webinars /></WithLayout>} />
                <Route path="/media/gala" element={<WithLayout><Gala /></WithLayout>} />
                <Route path="/tickets" element={<WithLayout><Tickets /></WithLayout>} />
                <Route path="/buy-your-ticket" element={<WithLayout><BuyYourTicket /></WithLayout>} />
                
                {/* Shop / Merchandise */}
                <Route path="/shop" element={<WithLayout><Shop /></WithLayout>} />
                <Route path="/shop/:slug" element={<WithLayout><ProductDetail /></WithLayout>} />
                <Route path="/shop/cart" element={<WithLayout><Cart /></WithLayout>} />
                <Route path="/shop/checkout" element={<WithLayout><Checkout /></WithLayout>} />
                <Route path="/shop/orders/:id" element={<WithLayout><OrderConfirmation /></WithLayout>} />
                <Route path="/shop/bulk-orders" element={<WithLayout><BulkOrders /></WithLayout>} />
                
                {/* Auth - minimal layout */}
                <Route path="/login" element={<WithLayout showFooter={false}><Login /></WithLayout>} />
                <Route path="/register" element={<WithLayout showFooter={false}><Register /></WithLayout>} />
                
                {/* User Actions */}
                <Route path="/nominate" element={<WithLayout><Nominate /></WithLayout>} />
                <Route path="/nominees" element={<WithLayout><Nominees /></WithLayout>} />
                <Route path="/nominees/:slug" element={<WithLayout><NomineeProfile /></WithLayout>} />
                <Route path="/vote" element={<WithLayout><Vote /></WithLayout>} />
                <Route path="/vote-with-agc" element={<WithLayout><VoteWithAGC /></WithLayout>} />
                <Route path="/about-agc" element={<WithLayout><AboutAGC /></WithLayout>} />
                <Route path="/gfawzip" element={<GFAWzipWallet />} />
                <Route path="/gfawzip/links" element={<GFAWzipLinks />} />
                <Route path="/wallet/gfawzip" element={<GFAWzipWallet />} />
                <Route path="/payments/gfawzip" element={<GFAWzipWallet />} />
                <Route path="/getfinance" element={<GFAWzipWallet />} />
                <Route path="/gfawzip-wallet" element={<GFAWzipWallet />} />
                <Route path="/links" element={<GFAWzipLinks />} />
                <Route path="/results" element={<WithLayout><Results /></WithLayout>} />
                
                {/* Dashboards - use their own layout */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/nominations" element={<Dashboard />} />
                <Route path="/nrc" element={<NRCDashboard />} />
                
                {/* OLC Coordinator Routes - use their own layout */}
                <Route path="/olc/dashboard" element={<OLCDashboard />} />
                <Route path="/olc/members" element={<OLCMembers />} />
                <Route path="/olc/wallet" element={<OLCWallet />} />
                <Route path="/olc/settlements" element={<OLCSettlements />} />
                
                {/* Admin Routes - use their own layout */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/impact" element={<AdminImpact />} />
                
                {/* Support */}
                <Route path="/donate" element={<WithLayout><Donate /></WithLayout>} />
                <Route path="/eduaid" element={<WithLayout><EduAid /></WithLayout>} />
                <Route path="/rebuild" element={<WithLayout><Rebuild /></WithLayout>} />
                <Route path="/judges" element={<WithLayout><Judges /></WithLayout>} />
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
