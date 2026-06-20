// NESA-Africa Navigation Configuration
// Centralized navigation structure for the entire platform

import {
  Award,
  BookOpen,
  Building,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  Coins,
  FileCheck,
  FileDown,
  Gavel,
  Globe,
  Globe2,
  GraduationCap,
  Handshake,
  Heart,
  Home,
  Info,
  Mail,
  Map,
  MapPin,
  Medal,
  Megaphone,
  MessageSquare,
  Mic,
  Play,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
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

// ----------------------------------------------------------------------------
// LEVEL 1 — Governance / Quick-Access Bar (thin top bar, desktop)
// SCEF-style stakeholder strip. Lightweight, no dropdowns.
// ----------------------------------------------------------------------------
export const GOVERNANCE_NAV: NavItem[] = [
  { label: "Governance", href: "/about/governance", icon: Shield },
  { label: "Africa Education Icon", href: "/awards/icon", icon: Star },
  { label: "Judges", href: "/judges/directory", icon: Gavel },
  { label: "Volunteers", href: "/volunteers", icon: Heart },
  { label: "Local Chapters", href: "/chapters", icon: MapPin },
  { label: "Partners", href: "/partners", icon: Handshake },
  { label: "Sponsors", href: "/sponsors", icon: Sparkles },
  { label: "Donate", href: "/donate", icon: Heart },
];

// ----------------------------------------------------------------------------
// LEVEL 2 — Primary NESA-Africa Public Navigation
// 9 menus per MVP Public Experience Register. Operational surfaces
// (Admin, NRC, Audit, Wallet, Dashboard, Jury, Voting Governance, Payments)
// are intentionally NOT exposed here — they live behind /dashboard/* and
// role-protected routes only.
// ----------------------------------------------------------------------------
export const MAIN_NAV: NavItem[] = [
  // 1. HOME
  { label: "Home", href: "/", icon: Home },

  // 2. ABOUT
  {
    label: "About",
    href: "/about",
    icon: Info,
    children: [
      { label: "About NESA-Africa", href: "/about", description: "The African Blue-Garnet Awards for Education", icon: Info },
      { label: "Mission & Vision", href: "/about#mission", description: "Why NESA-Africa exists", icon: Target },
      { label: "Our Story (2006–2026)", href: "/about#story", description: "Two decades of education recognition", icon: BookOpen },
      { label: "SCEF Foundation", href: "/about/scef", description: "Santos Creations Educational Foundation", icon: Building },
      { label: "Governance & Integrity", href: "/about/governance", description: "Firewalls, jury panels, accountability", icon: Shield },
      { label: "2026 Timeline", href: "/about/timeline", description: "Key dates & milestones", icon: Calendar },
      { label: "Vision 2035", href: "/about/vision-2035", description: "Continental education roadmap", icon: Target },
    ],
  },

  // 3. AWARDS
  {
    label: "Awards",
    href: "/awards",
    icon: Trophy,
    children: [
      { label: "Award Overview", href: "/awards", description: "Four recognition pathways", icon: Award },
      { label: "Africa Education Icon (2006–2026)", href: "/awards/icon", description: "Lifetime achievement", icon: Star },
      { label: "Gold-Blue Garnet Awards", href: "/awards/blue-garnet", description: "Competitive excellence — Jury + Public", icon: Trophy },
      { label: "Platinum Recognition", href: "/awards/platinum", description: "Institutional leadership", icon: Medal },
      { label: "Influencer Education Impact 2026", href: "/awards/influencers-education-impact-2026-recognition", description: "Sports, Music & Social Media", icon: Sparkles, badge: "2026" },
      { label: "Award Categories", href: "/categories", description: "Browse every category", icon: BookOpen },
      { label: "Explore Existing Nominees", href: "/nominees", description: "Africa's Education Impact Directory", icon: Users },
      { label: "Eligibility & Guidelines", href: "/guidelines/nominators", description: "Who can be nominated", icon: FileCheck },
    ],
  },

  // 4. PARTICIPATE — primary action menu
  {
    label: "Participate",
    href: "/nominate",
    icon: FileCheck,
    children: [
      { label: "Nominate Now", href: "/nominate", description: "Submit a 2026 nomination", icon: FileCheck, badge: "2026" },
      { label: "Explore Existing Nominees", href: "/nominees", description: "Africa's Education Impact Directory", icon: Users },
      { label: "Vote", href: "/vote", description: "Cast your public vote", icon: Vote },
      { label: "Endorse a Nominee", href: "/endorse", description: "Institutional endorsements", icon: Shield },
      { label: "Nominate a Special Needs School", href: "/eduaid", description: "Special Needs School Intervention", icon: Heart },
    ],
  },

  // 5. SPONSORS & PARTNERS
  {
    label: "Sponsors & Partners",
    href: "/partners",
    icon: Handshake,
    children: [
      { label: "Become a Sponsor", href: "/sponsor", description: "CSR & headline sponsorship", icon: Sparkles },
      { label: "Sponsorship Packages", href: "/sponsorship-packages", description: "Tiers & benefits", icon: Trophy },
      { label: "Partner With Us", href: "/partners", description: "Institutional partnerships", icon: Handshake },
      { label: "Media Partners", href: "/partners#media", description: "Editorial & broadcast partners", icon: Tv },
      { label: "Our Sponsors", href: "/sponsors", description: "Current 2026 sponsors", icon: Star },
      { label: "Contact Partnerships", href: "/contact#partnerships", description: "Speak to our team", icon: Mail },
    ],
  },

  // 6. IMPACT PROGRAMS
  {
    label: "Impact Programs",
    href: "/programs",
    icon: Heart,
    children: [
      { label: "Special Needs School Intervention", href: "/eduaid", description: "Nominate → Verify → Intervention", icon: Heart, badge: "Flagship" },
      { label: "EduAid-Africa", href: "/eduaid", description: "Scholarships, learning access & inclusion", icon: GraduationCap },
      { label: "Rebuild My School Africa", href: "/rebuild", description: "Classrooms, infrastructure & accessibility", icon: Building2 },
      { label: "NESA-Africa TV", href: "/media/tv", description: "Live streams & documentaries", icon: Tv, badge: "Live" },
      { label: "Education Impact Webinars", href: "/media/webinars", description: "Continental webinar series", icon: Mic },
      { label: "Post-Award Legacy", href: "/programs#legacy", description: "Long-term social impact", icon: Sparkles },
    ],
  },

  // 7. MEDIA & EVENTS
  {
    label: "Media & Events",
    href: "/media",
    icon: Tv,
    children: [
      { label: "NESA-Africa TV", href: "/media/tv", description: "Live & on-demand", icon: Tv, badge: "Live" },
      { label: "Impact Stories", href: "/media", description: "Voices shaping African education", icon: MessageSquare },
      { label: "Webinars", href: "/media/webinars", description: "Continental webinar series", icon: Mic },
      { label: "Gallery", href: "/gallery", description: "Photo archives across NESA seasons", icon: Play },
      { label: "Press Releases", href: "/press", description: "Official announcements", icon: FileCheck },
      { label: "Awards Gala — 22 Oct 2026", href: "/media/gala", description: "The Blue-Garnet Gala Night", icon: Calendar, badge: "2026" },
      { label: "Buy Gala Ticket", href: "/tickets", description: "Secure your seat", icon: Ticket },
    ],
  },

  // 8. JOIN THE MOVEMENT
  {
    label: "Join the Movement",
    href: "/get-involved",
    icon: Users,
    children: [
      { label: "Become a Volunteer", href: "/volunteer", description: "Join the continental volunteer force", icon: UserPlus },
      { label: "Meet Our Volunteers", href: "/volunteers", description: "People powering NESA-Africa", icon: Heart },
      { label: "Become an Ambassador", href: "/volunteers#ambassadors", description: "Continental & diaspora ambassadors", icon: Star },
      { label: "Apply to be a Judge", href: "/judgeapply", description: "Independent jury panel", icon: Gavel },
      { label: "Meet Our Judges", href: "/judges/directory", description: "Our independent jury", icon: Gavel },
      { label: "Join a Local Chapter", href: "/chapters", description: "Find your regional chapter", icon: MapPin },
      { label: "Donate for Education Impact", href: "/donate", description: "Support our mission", icon: Heart },
      { label: "Buy Award Merchandise", href: "/shop", description: "Official NESA-Africa store", icon: ShoppingBag },
    ],
  },

  // 9. CONTACT
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
    children: [
      { label: "Contact Us", href: "/contact", description: "Reach the NESA-Africa team", icon: Mail },
      { label: "FAQs", href: "/faq", description: "Frequently asked questions", icon: MessageSquare },
      { label: "Nomination Support", href: "/contact#nominations", description: "Help with nominations", icon: FileCheck },
      { label: "Sponsorship Support", href: "/contact#partnerships", description: "Help for sponsors & partners", icon: Handshake },
      { label: "Technical Support", href: "/contact#technical", description: "Bugs, access & device issues", icon: Settings },
    ],
  },
];

// Right-side action CTAs per MVP brief:
// PRIMARY   → Nominate Now (filled gold)
// SECONDARY → Explore Existing Nominees (outline gold)
// SUPPORT   → Become a Sponsor (outline)
export const MAIN_NAV_CTAS: NavItem[] = [
  { label: "Nominate Now", href: "/nominate", icon: FileCheck, badge: "2026" },
  { label: "Explore Nominees", href: "/nominees", icon: Users },
  { label: "Become a Sponsor", href: "/sponsor", icon: Sparkles },
];

// Legacy single-CTA export (kept for backward compatibility — now primary Nominate CTA)
export const MAIN_NAV_CTA: NavItem = {
  label: "Nominate Now",
  href: "/nominate",
  icon: FileCheck,
  badge: "2026",
};

// Support-action cluster — surfaced in footer, mobile sheet, and Join the Movement.
// Used wherever the platform invites visitors to back the cause beyond core CTAs.
export const SUPPORT_CTAS: NavItem[] = [
  { label: "Buy Gala Ticket", href: "/tickets", icon: Ticket },
  { label: "Buy Award Merchandise", href: "/shop", icon: ShoppingBag },
  { label: "Donate for Education Impact", href: "/donate", icon: Heart },
  { label: "Become a Sponsor", href: "/sponsor", icon: Sparkles },
  { label: "Nominate a Special Needs School", href: "/eduaid", icon: Heart },
];

// Mobile-first menu order (information architecture only — CTAs render separately)
export const MAIN_NAV_MOBILE_ORDER: readonly string[] = [
  "Home",
  "About",
  "Awards",
  "Participate",
  "Sponsors & Partners",
  "Impact Programs",
  "Media & Events",
  "Join the Movement",
  "Contact",
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
