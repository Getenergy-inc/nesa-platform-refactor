import { lazy, Suspense, ComponentType } from "react";
import { PageLoader } from "@/components/ui/page-loader";

// Utility to create lazy-loaded route components with suspense
export function lazyRoute<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallbackMessage?: string
) {
  const LazyComponent = lazy(factory);
  
  return function WrappedLazyComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<PageLoader message={fallbackMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Preload a route component (call on hover/focus for faster navigation)
export function preloadRoute(factory: () => Promise<{ default: any }>) {
  factory();
}

// ============ LAZY LOADED PAGES ============

// Landing & Core
export const NESAAfrica = lazyRoute(() => import("@/pages/programs/NESAAfrica"), "Loading...");
export const Categories = lazyRoute(() => import("@/pages/Categories"), "Loading categories...");
export const Programs = lazyRoute(() => import("@/pages/Programs"), "Loading programs...");

// Auth
export const Login = lazyRoute(() => import("@/pages/auth/Login"), "Loading...");
export const Register = lazyRoute(() => import("@/pages/auth/Register"), "Loading...");
export const OTPVerification = lazyRoute(() => import("@/pages/auth/OTPVerification"), "Loading...");

// Nominees
export const Nominees = lazyRoute(() => import("@/pages/Nominees"), "Loading nominees...");
export const NomineeProfile = lazyRoute(() => import("@/pages/NomineeProfile"), "Loading profile...");
export const Nominate = lazyRoute(() => import("@/pages/Nominate"), "Loading form...");
export const NomineeAccept = lazyRoute(() => import("@/pages/NomineeAccept"), "Loading...");
export const NomineeDecline = lazyRoute(() => import("@/pages/NomineeDecline"), "Loading...");
export const NomineeDashboard = lazyRoute(() => import("@/pages/nominee/NomineeDashboard"), "Loading dashboard...");

// About
export const About = lazyRoute(() => import("@/pages/about/About"), "Loading...");
export const Vision2035 = lazyRoute(() => import("@/pages/about/Vision2035"), "Loading...");
export const Governance = lazyRoute(() => import("@/pages/about/Governance"), "Loading...");
export const Timeline = lazyRoute(() => import("@/pages/about/Timeline"), "Loading...");
export const SCEF = lazyRoute(() => import("@/pages/about/SCEF"), "Loading...");

// Awards
export const PlatinumAward = lazyRoute(() => import("@/pages/awards/PlatinumAward"), "Loading...");
export const IconAward = lazyRoute(() => import("@/pages/awards/IconAward"), "Loading...");
export const GoldAward = lazyRoute(() => import("@/pages/awards/GoldAward"), "Loading...");
export const BlueGarnetAward = lazyRoute(() => import("@/pages/awards/BlueGarnetAward"), "Loading...");
export const Winners = lazyRoute(() => import("@/pages/awards/Winners"), "Loading...");
export const CategoryDetail = lazyRoute(() => import("@/pages/CategoryDetail"), "Loading category...");
export const CertificateVerify = lazyRoute(() => import("@/pages/CertificateVerify"), "Loading...");
export const VerifyCertificate = lazyRoute(() => import("@/pages/VerifyCertificate"), "Loading...");
export const Results = lazyRoute(() => import("@/pages/Results"), "Loading results...");

// Media
export const MediaHub = lazyRoute(() => import("@/pages/media/MediaHub"), "Loading media...");
export const NESATV = lazyRoute(() => import("@/pages/media/NESATV"), "Loading TV...");
export const Shows = lazyRoute(() => import("@/pages/media/Shows"), "Loading shows...");
export const Webinars = lazyRoute(() => import("@/pages/media/Webinars"), "Loading webinars...");
export const Gala = lazyRoute(() => import("@/pages/media/Gala"), "Loading gala...");
export const Tickets = lazyRoute(() => import("@/pages/Tickets"), "Loading tickets...");
export const BuyYourTicket = lazyRoute(() => import("@/pages/BuyYourTicket"), "Loading tickets...");

// Shop
export const Shop = lazyRoute(() => import("@/pages/shop/Shop"), "Loading shop...");
export const ProductDetail = lazyRoute(() => import("@/pages/shop/ProductDetail"), "Loading product...");
export const Cart = lazyRoute(() => import("@/pages/shop/Cart"), "Loading cart...");
export const Checkout = lazyRoute(() => import("@/pages/shop/Checkout"), "Loading checkout...");
export const OrderConfirmation = lazyRoute(() => import("@/pages/shop/OrderConfirmation"), "Loading order...");
export const BulkOrders = lazyRoute(() => import("@/pages/shop/BulkOrders"), "Loading...");

// Voting & Wallet
export const Vote = lazyRoute(() => import("@/pages/Vote"), "Loading vote...");
export const VoteWithAGC = lazyRoute(() => import("@/pages/VoteWithAGC"), "Loading...");
export const AboutAGC = lazyRoute(() => import("@/pages/AboutAGC"), "Loading...");
export const EarnVotingCredits = lazyRoute(() => import("@/pages/EarnVotingCredits"), "Loading...");
export const ClaimVotingCredits = lazyRoute(() => import("@/pages/ClaimVotingCredits"), "Loading...");
export const GFAWzipWallet = lazyRoute(() => import("@/pages/GFAWzipWallet"), "Loading wallet...");
export const GFAWzipLinks = lazyRoute(() => import("@/pages/GFAWzipLinks"), "Loading...");
export const Wallet = lazyRoute(() => import("@/pages/Wallet"), "Loading wallet...");

// Support
export const Donate = lazyRoute(() => import("@/pages/Donate"), "Loading...");
export const EduAid = lazyRoute(() => import("@/pages/EduAid"), "Loading...");
export const Rebuild = lazyRoute(() => import("@/pages/Rebuild"), "Loading...");
export const Judges = lazyRoute(() => import("@/pages/Judges"), "Loading...");

// Community
export const Partners = lazyRoute(() => import("@/pages/Partners"), "Loading partners...");
export const Chapters = lazyRoute(() => import("@/pages/Chapters"), "Loading chapters...");
export const Volunteer = lazyRoute(() => import("@/pages/Volunteer"), "Loading...");
export const Ambassadors = lazyRoute(() => import("@/pages/Ambassadors"), "Loading...");
export const Contact = lazyRoute(() => import("@/pages/Contact"), "Loading...");
export const Policies = lazyRoute(() => import("@/pages/Policies"), "Loading...");

// Sponsors
export const SponsorLanding = lazyRoute(() => import("@/pages/sponsors/SponsorLanding"), "Loading...");

// Dashboard
export const Dashboard = lazyRoute(() => import("@/pages/Dashboard"), "Loading dashboard...");

// Judge Portal
export const JudgeApply = lazyRoute(() => import("@/pages/judge/JudgeApply"), "Loading...");
export const JudgeStatus = lazyRoute(() => import("@/pages/judge/JudgeStatus"), "Loading...");
export const JudgeSignup = lazyRoute(() => import("@/pages/judge/JudgeSignup"), "Loading...");
export const JudgeVerify = lazyRoute(() => import("@/pages/judge/JudgeVerify"), "Loading...");
export const JudgeDashboard = lazyRoute(() => import("@/pages/judge/JudgeDashboard"), "Loading dashboard...");
export const JudgePortal = lazyRoute(() => import("@/pages/judge/JudgePortal"), "Loading...");
export const JuryScoring = lazyRoute(() => import("@/pages/judge/JuryScoring"), "Loading...");
export const JuryCOI = lazyRoute(() => import("@/pages/judge/JuryCOI"), "Loading...");
export const JudgeRubric = lazyRoute(() => import("@/pages/judge/JudgeRubric"), "Loading...");
export const JudgeGuidelines = lazyRoute(() => import("@/pages/judge/JudgeGuidelines"), "Loading...");
export const JudgePanel = lazyRoute(() => import("@/pages/judge/JudgePanel"), "Loading...");
export const JudgeHelp = lazyRoute(() => import("@/pages/judge/JudgeHelp"), "Loading...");
export const JudgeSettings = lazyRoute(() => import("@/pages/judge/JudgeSettings"), "Loading...");

// NRC Portal
export const NRCPortal = lazyRoute(() => import("@/pages/nrc/NRCPortal"), "Loading...");
export const NRCMyQueue = lazyRoute(() => import("@/pages/nrc/NRCMyQueue"), "Loading...");
export const NRCMembers = lazyRoute(() => import("@/pages/nrc/NRCMembers"), "Loading...");
export const NRCSettings = lazyRoute(() => import("@/pages/nrc/NRCSettings"), "Loading...");

// OLC Portal
export const OLCDashboard = lazyRoute(() => import("@/pages/olc/OLCDashboard"), "Loading dashboard...");
export const OLCMembers = lazyRoute(() => import("@/pages/olc/OLCMembers"), "Loading members...");
export const OLCWallet = lazyRoute(() => import("@/pages/olc/OLCWallet"), "Loading wallet...");
export const OLCSettlements = lazyRoute(() => import("@/pages/olc/OLCSettlements"), "Loading...");

// Admin
export const AdminDashboard = lazyRoute(() => import("@/pages/admin/AdminDashboard"), "Loading admin...");
export const AdminOrders = lazyRoute(() => import("@/pages/admin/AdminOrders"), "Loading orders...");
export const AdminImpact = lazyRoute(() => import("@/pages/admin/AdminImpact"), "Loading impact...");
export const AdminNomineeImages = lazyRoute(() => import("@/pages/admin/NomineeImages"), "Loading...");
export const AdminNomineeProfiles = lazyRoute(() => import("@/pages/admin/NomineeProfiles"), "Loading...");

// Utility
export const Unauthorized = lazyRoute(() => import("@/pages/Unauthorized"), "Loading...");
export const NotFound = lazyRoute(() => import("@/pages/NotFound"), "Page not found");
