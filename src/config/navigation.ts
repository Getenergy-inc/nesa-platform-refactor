// NESA-Africa Navigation Configuration
// Centralized navigation structure for the entire platform

import {
  Award,
  BookOpen,
  Building,
  Calendar,
  ChevronDown,
  Clock,
  Coins,
  FileCheck,
  Gavel,
  Globe,
  Heart,
  Home,
  Info,
  Mail,
  Map,
  Medal,
  MessageSquare,
  Play,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Target,
  Ticket,
  Trophy,
  Tv,
  UserPlus,
  Users,
  Vote,
  Wallet,
  type LucideIcon,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  badge?: string;
  external?: boolean;
  requiresAuth?: boolean;
  requiredRoles?: string[];
  stageGated?: string;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

// ============================================================================
// PUBLIC NAVIGATION (Main Navbar)
// ============================================================================

export const MAIN_NAV: NavItem[] = [
  // ─────────────────────────────────────────────────────────
  // 1. ABOUT — Trust, ecosystem, policy alignment, credibility
  // ─────────────────────────────────────────────────────────
  {
    label: "About",
    href: "/about",
    icon: Info,
    children: [
      { label: "About NESA-Africa", href: "/about", description: "Continental recognition + impact platform", icon: Info },
      { label: "About NESA-Africa 2026", href: "/about#nesa-2026", description: "The 2026 season at a glance", icon: Star },
      { label: "The 2026 Journey", href: "/about/timeline", description: "Phase-by-phase campaign roadmap", icon: Calendar, badge: "2026" },
      { label: "Education Development Index (EDI)", href: "/guidelines/edi-matrix", description: "Our integrity-backed evaluation matrix", icon: Shield },
      { label: "SDG & AU Agenda 2063 Alignment", href: "/about#alignment", description: "Aligned with SDG 4 and AU Agenda 2063", icon: Target },
      { label: "Meet the Judges", href: "/judges", description: "Our distinguished jury panel & expertise", icon: Gavel },
      { label: "Meet Our Volunteers", href: "/volunteers", description: "The people powering NESA-Africa", icon: Heart },
      { label: "Governance & Jury Process", href: "/about/governance", description: "Firewalls, jury panels, accountability", icon: Shield },
      { label: "FAQ", href: "/faq", description: "Answers to the most common questions", icon: MessageSquare },
      { label: "Contact", href: "/contact", description: "Reach the NESA-Africa team", icon: Mail },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. PROGRAMS — Award ecosystems + social impact
  // ─────────────────────────────────────────────────────────
  {
    label: "Programs",
    href: "/programs",
    icon: Trophy,
    children: [
      // A. Award Ecosystems
      { label: "Africa Education Icon Awards", href: "/awards/icon", description: "Lifetime achievement (2006–2026)", icon: Star },
      { label: "Blue Garnet Awards", href: "/awards/blue-garnet", description: "Competitive excellence — Jury + Public", icon: Trophy },
      { label: "Platinum Recognition", href: "/awards/platinum", description: "Institutional leadership recognition", icon: Medal },
      { label: "Influencer Education Impact Awards", href: "/awards/influencers-education-impact-2026-recognition", description: "Sports, Music & Social Media impact", icon: Award, badge: "2026" },
      { label: "Award Gala", href: "/media/gala", description: "Blue Garnet Awards Gala — 22 Oct 2026 · Lagos", icon: Ticket, badge: "Gala" },
      // B. Social Impact
      { label: "Rebuild My School Africa", href: "/rebuild", description: "Post-award legacy project (Oct 2026 → Oct 2027)", icon: Building },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 3. ENGAGE — The participation ecosystem
  // ─────────────────────────────────────────────────────────
  {
    label: "Engage",
    href: "/get-involved",
    icon: Users,
    children: [
      { label: "Partners / CSR", href: "/partners", description: "Sponsorship & CSR for education", icon: Building },
      { label: "Buy Your Ticket", href: "/tickets", description: "Blue Garnet Awards Gala — 22 Oct 2026", icon: Ticket },
      { label: "Apply as Ambassador", href: "/ambassadors", description: "Represent NESA-Africa in your region", icon: UserPlus },
      { label: "Apply to be a Judge", href: "/judgeapply", description: "Join the 2026 jury panel", icon: Gavel },
      { label: "Become a Volunteer", href: "/volunteer", description: "Join the NRC or event volunteer team", icon: Heart },
      { label: "Join a Local Chapter", href: "/chapters", description: "Find your community — Africa & Diaspora", icon: Map },
      { label: "How to Join a Local Chapter", href: "/chapters#how-to-join", description: "Find, start, and grow a chapter", icon: BookOpen },
      { label: "Donate", href: "/donate", description: "Fund Africa's education transformation", icon: Wallet },
      { label: "Buy Merchandise", href: "/shop", description: "Support the movement — caps, tees & more", icon: ShoppingBag },
      { label: "How to Earn AGC for Voting", href: "/earn-agc", description: "Earn AGC · Vote with AGC · Leaderboard · Missions", icon: Coins, badge: "AGC" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 4. MEDIA — Storytelling, visibility, amplification
  // ─────────────────────────────────────────────────────────
  {
    label: "Media",
    href: "/media",
    icon: Tv,
    children: [
      { label: "Gallery", href: "/gallery", description: "Photo archives across NESA seasons", icon: Play },
      { label: "Videos", href: "/media/tv", description: "NESA Africa TV — interviews & features", icon: Play, badge: "Live" },
      { label: "Press Releases", href: "/press", description: "Official news & announcements", icon: MessageSquare },
      { label: "Winner Stories", href: "/awards/winners", description: "Honourees from every season", icon: Trophy },
      { label: "Impact Stories", href: "/media/shows", description: "Documented impact across Africa", icon: BookOpen },
      { label: "Trending Nominees", href: "/nominees?sort=trending", description: "Most-voted nominees right now", icon: Star },
      { label: "Media Kit", href: "/press#media-kit", description: "Logos, brand assets & guidelines", icon: FileCheck },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 5. NOMINATE — Nomination ecosystem
  // ─────────────────────────────────────────────────────────
  {
    label: "Nominate",
    href: "/nominate",
    icon: FileCheck,
    children: [
      { label: "Nominate for 2026", href: "/nominate", description: "Submit a nomination for the 2026 season", icon: FileCheck, stageGated: "nominations" },
      { label: "Public Pre-Nomination", href: "/nominate?mode=public", description: "Quick public-facing nomination flow", icon: UserPlus },
      { label: "How to Nominate", href: "/guidelines/how-to-nominate", description: "Step-by-step nomination guide", icon: BookOpen },
      { label: "Nomination Guidelines", href: "/guidelines/nominees", description: "Eligibility, evidence & criteria", icon: Shield },
      { label: "Re-Nominate a Changemaker", href: "/nominate?mode=renominate", description: "Bring a past nominee back for 2026", icon: Award },
      { label: "Why Re-Nomination Matters", href: "/guidelines/renomination", description: "How re-nomination strengthens impact", icon: Info },
      { label: "Existing Nominee Updates", href: "/dashboard/nominations", description: "Manage and update your nominee profile", icon: Settings },
      { label: "Explore Existing Nominees", href: "/nominees", description: "Browse the live nominee directory", icon: Users },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 6. VOTE — Voting ecosystem (Gold + Blue Garnet + AGC)
  // ─────────────────────────────────────────────────────────
  {
    label: "Vote",
    href: "/vote",
    icon: Vote,
    children: [
      // A. About Voting
      { label: "How Voting Works", href: "/how-voting-works", description: "Public + jury voting explained", icon: Info },
      { label: "Public + Jury Voting", href: "/about/governance#voting", description: "Two voting tracks with full firewalls", icon: Shield },
      { label: "Vote with AGC", href: "/vote-with-agc", description: "Use Afri-Gold Coin credits to vote", icon: Coins },
      // B. Gold Certificate Voting — 15 Aug – 15 Sep 2026
      { label: "Vote in Gold Categories", href: "/vote/gold", description: "Gold Certificate · 15 Aug – 15 Sep 2026", icon: Award, badge: "AGC Voting" },
      { label: "Gold Voting FAQ", href: "/faq#gold-voting", description: "Common questions about Gold voting", icon: MessageSquare },
      { label: "Gold Voting Timeline", href: "/about/timeline#gold-voting", description: "When Gold voting opens and closes", icon: Calendar },
      // C. Blue Garnet Voting — 16 Sep – 22 Oct 2026
      { label: "Vote in Blue Garnet Categories", href: "/vote/blue-garnet", description: "Blue Garnet · 16 Sep – 22 Oct 2026", icon: Trophy, badge: "Final Voting Phase" },
      { label: "Blue Garnet Gala Voting", href: "/vote/blue-garnet#gala", description: "Final voting window closes on gala day", icon: Trophy },
      { label: "Final Voting Window", href: "/about/timeline#blue-garnet-voting", description: "Closes 22 October 2026", icon: Clock },
      // D. Voting Participation
      { label: "Earn AGC", href: "/earn-agc", description: "All ways to earn Afri-Gold Coins", icon: Coins },
      { label: "AGC Wallet", href: "/dashboard/wallet", description: "Balance, settlements & transactions", icon: Wallet },
      { label: "Voting Leaderboard", href: "/earn-agc#leaderboard", description: "Top AGC voters across the movement", icon: Trophy },
    ],
  },
];

// Mobile-first menu order — Nominate & Vote surfaced first for 95% mobile traffic
export const MAIN_NAV_MOBILE_ORDER: readonly string[] = [
  "Nominate",
  "Vote",
  "Engage",
  "Programs",
  "About",
  "Media",
];


// ============================================================================
// QUICK ACTIONS (Hero Section)
// ============================================================================

export const QUICK_NAV: NavItem[] = [
  { label: "Refer", href: "#refer", icon: Users },
  { label: "Nominate", href: "/nominate", icon: FileCheck, stageGated: "nominations" },
  { label: "Vision 2035", href: "/about/vision-2035", icon: Target },
  { label: "Tickets", href: "/tickets", icon: Ticket, stageGated: "tickets" },
  { label: "Watch", href: "/media/tv", icon: Play },
];

// ============================================================================
// FOOTER NAVIGATION
// ============================================================================

export const FOOTER_NAV: NavSection[] = [
  {
    id: "programme",
    label: "Programme",
    items: [
      { label: "About NESA", href: "/about" },
      { label: "Award Categories", href: "/categories" },
      { label: "Timeline", href: "/about/timeline" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    id: "participate",
    label: "Participate",
    items: [
      { label: "Nominate", href: "/nominate" },
      { label: "Vote", href: "/vote" },
      { label: "Apply to be a Judge", href: "/judgeapply" },
      { label: "Partners", href: "/partners" },
      { label: "Join a Local Chapter", href: "/chapters" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Buy Merchandise", href: "/shop" },

    ],
  },
  {
    id: "media",
    label: "Media",
    items: [
      { label: "NESA Africa TV", href: "/media/tv" },
      { label: "Online Shows", href: "/media/shows" },
      { label: "Webinars", href: "/media/webinars" },
      { label: "Gala", href: "/media/gala" },
    ],
  },
  {
    id: "support",
    label: "Support",
    items: [
      { label: "Donate", href: "/donate" },
      { label: "EduAid-Africa", href: "/eduaid" },
      { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    id: "legal",
    label: "Legal",
    items: [
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
      { label: "Conflict of Interest", href: "/policies/coi" },
      { label: "Voting Integrity", href: "/policies/voting-integrity" },
    ],
  },
];

// ============================================================================
// AUTHENTICATED USER NAVIGATION
// ============================================================================

export const USER_DASHBOARD_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "My Profile", href: "/dashboard/profile", icon: Users },
  { label: "My Nominations", href: "/dashboard/nominations", icon: FileCheck },
  { label: "My Votes", href: "/dashboard/votes", icon: Vote },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "Notifications", href: "/dashboard/notifications", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

// ============================================================================
// ROLE-BASED DASHBOARDS
// ============================================================================

export const NRC_DASHBOARD_NAV: NavItem[] = [
  { label: "Review Queue", href: "/nrc", icon: FileCheck },
  { label: "Assigned Reviews", href: "/nrc/assigned", icon: Target },
  { label: "Evidence Validation", href: "/nrc/evidence", icon: Shield },
  { label: "Approval Logs", href: "/nrc/logs", icon: BookOpen },
  { label: "Audit Trail", href: "/nrc/audit", icon: Shield },
];

export const JURY_DASHBOARD_NAV: NavItem[] = [
  { label: "Finalists", href: "/jury", icon: Trophy },
  { label: "Scoring", href: "/jury/scoring", icon: Star },
  { label: "Jury Discussion", href: "/jury/chat", icon: MessageSquare },
  { label: "Locked Results", href: "/jury/results", icon: Shield },
];

export const CHAPTER_DASHBOARD_NAV: NavItem[] = [
  { label: "Chapter Home", href: "/chapter", icon: Home },
  { label: "Local Events", href: "/chapter/events", icon: Calendar },
  { label: "Local Nominations", href: "/chapter/nominations", icon: FileCheck },
  { label: "Reports", href: "/chapter/reports", icon: BookOpen },
];

// OLC Coordinator Dashboard Navigation
export const OLC_DASHBOARD_NAV: NavItem[] = [
  { label: "OLC Dashboard", href: "/olc/dashboard", icon: Home },
  { label: "Chapter Members", href: "/olc/members", icon: Users },
  { label: "Chapter Wallet", href: "/olc/wallet", icon: Wallet },
  { label: "Settlements", href: "/olc/settlements", icon: Coins },
];

export const ADMIN_DASHBOARD_NAV: NavItem[] = [
  { label: "Admin Home", href: "/admin", icon: Home },
  { label: "Stage Control", href: "/admin/stages", icon: Settings },
  { label: "Category Control", href: "/admin/categories", icon: Trophy },
  { label: "User Roles", href: "/admin/users", icon: Users },
  { label: "CMS", href: "/admin/cms", icon: BookOpen },
  { label: "Media Scheduling", href: "/admin/media", icon: Tv },
  { label: "Audit Logs", href: "/admin/logs", icon: Shield },
  { label: "Compliance", href: "/admin/compliance", icon: Shield },
];

// ============================================================================
// MOBILE NAVIGATION (Simplified)
// ============================================================================

export const MOBILE_NAV: NavItem[] = [
  { label: "Nominate", href: "/nominate", icon: FileCheck },
  { label: "Vote", href: "/vote", icon: Vote },
  { label: "Engage", href: "/get-involved", icon: Users },
  { label: "Earn AGC", href: "/earn-agc", icon: Coins },
  { label: "Tickets", href: "/tickets", icon: Ticket },
  { label: "Watch", href: "/media/tv", icon: Tv },
];


// ============================================================================
// PAGE REGISTRY (All Frontend Pages)
// ============================================================================

export interface PageDefinition {
  path: string;
  title: string;
  description: string;
  component: string;
  category: "public" | "auth" | "dashboard" | "admin" | "legal";
  stageGated?: string;
  requiredRoles?: string[];
}

export const PAGE_REGISTRY: PageDefinition[] = [
  // ==================== PUBLIC PAGES ====================
  { path: "/", title: "Home", description: "NESA-Africa Landing Page", component: "NESAAfrica", category: "public" },
  { path: "/about", title: "About NESA-Africa", description: "Our mission and vision", component: "About", category: "public" },
  { path: "/about/vision-2035", title: "Vision 2035", description: "Strategic roadmap", component: "Vision2035", category: "public" },
  { path: "/about/governance", title: "Governance & Firewalls", description: "Integrity frameworks", component: "Governance", category: "public" },
  { path: "/about/timeline", title: "Programme Timeline", description: "Key dates and milestones", component: "Timeline", category: "public" },
  { path: "/about/scef", title: "SCEF Foundation", description: "Parent organisation", component: "SCEF", category: "public" },
  
  // Awards
  { path: "/categories", title: "Award Categories", description: "All 17 categories", component: "Categories", category: "public" },
  { path: "/categories/:slug", title: "Category Detail", description: "Category subcategories", component: "CategoryDetail", category: "public" },
  { path: "/awards/platinum", title: "Platinum Certificate", description: "Baseline recognition", component: "PlatinumAward", category: "public" },
  { path: "/awards/icon", title: "Africa Education Icon", description: "Lifetime achievement", component: "IconAward", category: "public" },
  { path: "/awards/gold", title: "Gold Certificate", description: "Public-voted recognition", component: "GoldAward", category: "public" },
  { path: "/awards/blue-garnet", title: "Blue Garnet Award", description: "Highest honour", component: "BlueGarnetAward", category: "public" },
  { path: "/awards/winners", title: "Past Winners", description: "Previous honourees", component: "Winners", category: "public" },
  { path: "/nominees", title: "Nominees", description: "Current nominees", component: "Nominees", category: "public" },
  { path: "/nominees/:slug", title: "Nominee Profile", description: "Nominee details", component: "NomineeProfile", category: "public" },
  
  // Participate
  { path: "/nominate", title: "Nominate", description: "Submit nomination", component: "Nominate", category: "public", stageGated: "nominations" },
  { path: "/vote", title: "Vote", description: "Cast your vote", component: "Vote", category: "public", stageGated: "public_voting" },
  { path: "/partners", title: "Partners & Sponsors", description: "Partnership opportunities", component: "Partners", category: "public" },
  { path: "/chapters", title: "Local Chapters", description: "Regional chapters", component: "Chapters", category: "public" },
  { path: "/volunteer", title: "Volunteer", description: "Join our team", component: "Volunteer", category: "public" },
  
  // Media
  { path: "/media", title: "Media Hub", description: "All media content", component: "MediaHub", category: "public" },
  { path: "/media/tv", title: "NESA Africa TV", description: "Live and on-demand", component: "NESATV", category: "public" },
  { path: "/media/shows", title: "Online Shows", description: "Award shows archive", component: "Shows", category: "public" },
  { path: "/media/webinars", title: "Webinar Hub", description: "Educational webinars", component: "Webinars", category: "public" },
  { path: "/media/gala", title: "Awards Gala", description: "Annual ceremony", component: "Gala", category: "public" },
  { path: "/press", title: "Press & News", description: "Media resources", component: "Press", category: "public" },
  
  // Events
  { path: "/events", title: "Events", description: "Upcoming events", component: "Events", category: "public" },
  { path: "/tickets", title: "Tickets", description: "Event tickets", component: "Tickets", category: "public", stageGated: "tickets" },
  { path: "/buy-your-ticket", title: "Buy Your Ticket", description: "Gala tickets", component: "BuyYourTicket", category: "public" },
  { path: "/gfawzip", title: "GFAWzip Wallet", description: "Multi-currency payments", component: "GFAWzipWallet", category: "public" },
  { path: "/events/tourism", title: "Education Tourism", description: "Educational experiences", component: "Tourism", category: "public" },
  
  // Support
  { path: "/donate", title: "Donate", description: "Support our mission", component: "Donate", category: "public" },
  { path: "/eduaid", title: "EduAid-Africa", description: "Student support", component: "EduAid", category: "public" },
  { path: "/rebuild", title: "Rebuild My School", description: "Infrastructure support", component: "Rebuild", category: "public" },
  { path: "/contact", title: "Contact", description: "Get in touch", component: "Contact", category: "public" },
  { path: "/faq", title: "FAQs", description: "Frequently asked questions", component: "FAQ", category: "public" },
  
  // ==================== AUTH PAGES ====================
  { path: "/login", title: "Sign In", description: "Log in to your account", component: "Login", category: "auth" },
  { path: "/register", title: "Sign Up", description: "Create an account", component: "Register", category: "auth" },
  { path: "/forgot-password", title: "Forgot Password", description: "Reset your password", component: "ForgotPassword", category: "auth" },
  { path: "/reset-password", title: "Reset Password", description: "Set new password", component: "ResetPassword", category: "auth" },
  { path: "/verify-email", title: "Verify Email", description: "Email verification", component: "VerifyEmail", category: "auth" },
  
  // ==================== USER DASHBOARD ====================
  { path: "/dashboard", title: "Dashboard", description: "User dashboard", component: "Dashboard", category: "dashboard", requiredRoles: ["user"] },
  { path: "/dashboard/profile", title: "My Profile", description: "Edit profile", component: "Profile", category: "dashboard", requiredRoles: ["user"] },
  { path: "/dashboard/nominations", title: "My Nominations", description: "Nomination history", component: "MyNominations", category: "dashboard", requiredRoles: ["user"] },
  { path: "/dashboard/votes", title: "My Votes", description: "Voting history", component: "MyVotes", category: "dashboard", requiredRoles: ["user"] },
  { path: "/dashboard/certificates", title: "Certificates", description: "Download certificates", component: "Certificates", category: "dashboard", requiredRoles: ["user"], stageGated: "certificates" },
  { path: "/dashboard/wallet", title: "Wallet", description: "Donation history", component: "Wallet", category: "dashboard", requiredRoles: ["user"] },
  { path: "/dashboard/notifications", title: "Notifications", description: "Updates and alerts", component: "Notifications", category: "dashboard", requiredRoles: ["user"] },
  { path: "/dashboard/settings", title: "Settings", description: "Account settings", component: "Settings", category: "dashboard", requiredRoles: ["user"] },
  
  // ==================== NRC DASHBOARD ====================
  { path: "/nrc", title: "NRC Dashboard", description: "Review nominations", component: "NRCDashboard", category: "dashboard", requiredRoles: ["nrc", "admin"] },
  { path: "/nrc/assigned", title: "Assigned Reviews", description: "Your assignments", component: "NRCAssigned", category: "dashboard", requiredRoles: ["nrc", "admin"] },
  { path: "/nrc/evidence", title: "Evidence Validation", description: "Verify evidence", component: "NRCEvidence", category: "dashboard", requiredRoles: ["nrc", "admin"] },
  { path: "/nrc/logs", title: "Approval Logs", description: "Decision history", component: "NRCLogs", category: "dashboard", requiredRoles: ["nrc", "admin"] },
  { path: "/nrc/audit", title: "Audit Trail", description: "System audit logs", component: "NRCAudit", category: "dashboard", requiredRoles: ["nrc", "admin"] },
  
  // ==================== JURY DASHBOARD ====================
  { path: "/jury", title: "Jury Dashboard", description: "Score finalists", component: "JuryDashboard", category: "dashboard", requiredRoles: ["jury", "admin"], stageGated: "jury_scoring" },
  { path: "/jury/scoring", title: "Scoring", description: "Submit scores", component: "JuryScoring", category: "dashboard", requiredRoles: ["jury", "admin"], stageGated: "jury_scoring" },
  { path: "/jury/chat", title: "Jury Discussion", description: "Deliberation chat", component: "JuryChat", category: "dashboard", requiredRoles: ["jury", "admin"], stageGated: "jury_scoring" },
  { path: "/jury/results", title: "Locked Results", description: "Final results", component: "JuryResults", category: "dashboard", requiredRoles: ["jury", "admin"], stageGated: "results" },
  
  // ==================== CHAPTER DASHBOARD ====================
  { path: "/chapter", title: "Chapter Dashboard", description: "Local chapter management", component: "ChapterDashboard", category: "dashboard", requiredRoles: ["chapter", "admin"] },
  { path: "/chapter/events", title: "Local Events", description: "Chapter events", component: "ChapterEvents", category: "dashboard", requiredRoles: ["chapter", "admin"] },
  { path: "/chapter/nominations", title: "Local Nominations", description: "Chapter nominations", component: "ChapterNominations", category: "dashboard", requiredRoles: ["chapter", "admin"] },
  { path: "/chapter/reports", title: "Reports", description: "Chapter reports", component: "ChapterReports", category: "dashboard", requiredRoles: ["chapter", "admin"] },
  
  // ==================== OLC COORDINATOR DASHBOARD ====================
  { path: "/olc/dashboard", title: "OLC Dashboard", description: "Chapter coordinator dashboard", component: "OLCDashboard", category: "dashboard", requiredRoles: ["chapter", "admin"] },
  { path: "/olc/members", title: "Chapter Members", description: "Manage chapter members", component: "OLCMembers", category: "dashboard", requiredRoles: ["chapter", "admin"] },
  { path: "/olc/wallet", title: "Chapter Wallet", description: "Chapter wallet transactions", component: "OLCWallet", category: "dashboard", requiredRoles: ["chapter", "admin"] },
  { path: "/olc/settlements", title: "Settlements", description: "Settlement request history", component: "OLCSettlements", category: "dashboard", requiredRoles: ["chapter", "admin"] },
  
  // ==================== ADMIN DASHBOARD ====================
  { path: "/admin", title: "Admin Dashboard", description: "Platform administration", component: "AdminDashboard", category: "admin", requiredRoles: ["admin"] },
  { path: "/admin/stages", title: "Stage Control", description: "Manage stages", component: "AdminStages", category: "admin", requiredRoles: ["admin"] },
  { path: "/admin/categories", title: "Category Control", description: "Manage categories", component: "AdminCategories", category: "admin", requiredRoles: ["admin"] },
  { path: "/admin/users", title: "User Roles", description: "Manage users", component: "AdminUsers", category: "admin", requiredRoles: ["admin"] },
  { path: "/admin/cms", title: "CMS", description: "Content management", component: "AdminCMS", category: "admin", requiredRoles: ["admin"] },
  { path: "/admin/media", title: "Media Scheduling", description: "Schedule broadcasts", component: "AdminMedia", category: "admin", requiredRoles: ["admin"] },
  { path: "/admin/logs", title: "Audit Logs", description: "System logs", component: "AdminLogs", category: "admin", requiredRoles: ["admin"] },
  { path: "/admin/compliance", title: "Compliance", description: "Governance oversight", component: "AdminCompliance", category: "admin", requiredRoles: ["admin"] },
  
  // ==================== LEGAL PAGES ====================
  { path: "/policies/privacy", title: "Privacy Policy", description: "Data protection", component: "PrivacyPolicy", category: "legal" },
  { path: "/policies/terms", title: "Terms of Service", description: "Usage terms", component: "Terms", category: "legal" },
  { path: "/policies/coi", title: "Conflict of Interest", description: "COI policy", component: "COIPolicy", category: "legal" },
  { path: "/policies/voting-integrity", title: "Voting Integrity", description: "Voting rules", component: "VotingIntegrity", category: "legal" },
  
  // ==================== UTILITY PAGES ====================
  { path: "/certificates/verify/:code", title: "Verify Certificate", description: "Certificate verification", component: "VerifyCertificate", category: "public" },
  { path: "/unauthorized", title: "Unauthorized", description: "Access denied", component: "Unauthorized", category: "public" },
  { path: "*", title: "Not Found", description: "Page not found", component: "NotFound", category: "public" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPagesByCategory(category: PageDefinition["category"]): PageDefinition[] {
  return PAGE_REGISTRY.filter((page) => page.category === category);
}

export function getStageGatedPages(): PageDefinition[] {
  return PAGE_REGISTRY.filter((page) => page.stageGated);
}

export function getRoleProtectedPages(): PageDefinition[] {
  return PAGE_REGISTRY.filter((page) => page.requiredRoles && page.requiredRoles.length > 0);
}

export function findPageByPath(path: string): PageDefinition | undefined {
  return PAGE_REGISTRY.find((page) => page.path === path);
}
