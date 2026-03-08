/**
 * Dashboard Sidebar Navigation Configuration
 * Premium institutional navigation structure
 */

import {
  Award, BookOpen, Building, Calendar, Coins, FileCheck,
  Gavel, Globe, Heart, Home, Map, Medal, MessageSquare,
  School, Settings, Shield, Star, Target, Trophy, Tv,
  UserPlus, Users, Vote, Wallet, Bell, type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface DashboardNavSection {
  id: string;
  label: string;
  items: DashboardNavItem[];
}

// ── Main Dashboard Sidebar ─────────────────────────────────────────
export const DASHBOARD_SIDEBAR_NAV: DashboardNavSection[] = [
  {
    id: "main",
    label: "Dashboard",
    items: [
      { label: "Overview", href: "/dashboard", icon: Home },
    ],
  },
  {
    id: "awards",
    label: "Awards",
    items: [
      { label: "Platinum Recognition", href: "/awards/platinum", icon: Medal },
      { label: "Africa Icons", href: "/awards/icon", icon: Star },
      { label: "Gold Certificates", href: "/awards/gold", icon: Award },
      { label: "Blue Garnet", href: "/awards/blue-garnet", icon: Trophy },
    ],
  },
  {
    id: "nominations",
    label: "Nominations",
    items: [
      { label: "Submit Nomination", href: "/nominate", icon: FileCheck, badge: "Open" },
      { label: "My Nominations", href: "/dashboard/nominations", icon: Target },
      { label: "Nomination Guidelines", href: "/guidelines/nominators", icon: BookOpen },
    ],
  },
  {
    id: "standards",
    label: "Standards",
    items: [
      { label: "EDI Matrix", href: "/guidelines/edi-matrix", icon: Shield },
      { label: "Governance Framework", href: "/about/governance", icon: Gavel },
      { label: "Evaluation Criteria", href: "/guidelines/judges", icon: Star },
    ],
  },
  {
    id: "programs",
    label: "Programs",
    items: [
      { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school", icon: Building },
      { label: "Ambassador Program", href: "/ambassadors", icon: UserPlus },
      { label: "Local Chapters", href: "/chapters", icon: Map },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      { label: "Events", href: "/about/timeline", icon: Calendar },
      { label: "Media", href: "/media/tv", icon: Tv },
      { label: "Donate", href: "/donate", icon: Heart },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      { label: "Profile", href: "/dashboard/profile", icon: Users },
      { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

// ── Top Nav Items ───────────────────────────────────────────────────
export const DASHBOARD_TOP_NAV: DashboardNavItem[] = [
  { label: "Explore", href: "/awards", icon: Globe },
  { label: "Awards", href: "/awards", icon: Trophy },
  { label: "Standards", href: "/guidelines/edi-matrix", icon: Shield },
  { label: "Chapters", href: "/chapters", icon: Map },
  { label: "Programs", href: "/eduaid-africa/rebuild-my-school", icon: Building },
];
