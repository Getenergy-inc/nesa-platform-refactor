/**
 * NRC Dashboard Layout — Institutional review workspace
 * Black/charcoal + gold design matching AU/UNESCO internal portals
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArenaSeal, ArenaBrand, ArenaTopBar, ArenaFooter,
} from "@/components/arena/ArenaChrome";
import { ArenaSeo } from "@/components/arena/ArenaSeo";
import {
  Award, LayoutDashboard, Users, ClipboardList, FileCheck, Flag,
  BarChart3, Shield, BookOpen, Settings, LogOut, Bell, Search,
  ChevronLeft, ChevronRight, Menu, X, CheckCircle, XCircle,
  Clock, AlertTriangle, Copy, User, TrendingUp, Inbox,
} from "lucide-react";

interface NRCDashboardLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_SECTIONS = [
  {
    label: "Dashboard",
    items: [
      { href: "/nrc/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/nrc/dashboard/intake", label: "Intake Queue", icon: Inbox },
    ],
  },
  {
    label: "Nominees",
    items: [
      { href: "/nrc/dashboard/nominees", label: "All Nominees", icon: Users },
      { href: "/nrc/dashboard/nominees?status=nomination_submitted", label: "Pending Review", icon: Clock },
      { href: "/nrc/dashboard/nominees?status=documentation_verification", label: "Under Verification", icon: FileCheck },
      { href: "/nrc/dashboard/nominees?status=nomination_cleared", label: "Cleared", icon: CheckCircle },
      { href: "/nrc/dashboard/nominees?status=rejected", label: "Declined", icon: XCircle },
    ],
  },
  {
    label: "Review Tools",
    items: [
      { href: "/nrc/dashboard/my-reviews", label: "My Assigned Reviews", icon: ClipboardList },
      { href: "/nrc/dashboard/queue", label: "Scoring Queue", icon: BarChart3 },
      { href: "/nrc/dashboard/flagged", label: "Flagged Cases", icon: Flag },
      { href: "/nrc/dashboard/merge", label: "Merge & Dedup Tool", icon: Copy },
    ],
  },
  {
    label: "Standards",
    items: [
      { href: "/nrc/dashboard/edi-analytics", label: "EDI Analytics", icon: TrendingUp },
      { href: "/guidelines/edi-matrix", label: "EDI Matrix", icon: Shield },
      { href: "/nrc/dashboard/guidelines", label: "NRC Guidelines", icon: BookOpen },
    ],
  },
  {
    label: "Reports",
    items: [
      { href: "/nrc/dashboard/reports", label: "Review Progress", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/nrc/dashboard/profile", label: "Profile", icon: User },
      { href: "/nrc/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function NRCDashboardLayout({ children }: NRCDashboardLayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (href: string) => {
    if (href.includes("?")) {
      return location.pathname + location.search === href;
    }
    return location.pathname === href;
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-arena-rail">
      {/* Sidebar Header */}
      {collapsed ? (
        <div className="flex items-center justify-center border-b border-white/10 py-4">
          <ArenaSeal className="h-9 w-9" />
        </div>
      ) : (
        <div className="border-b border-white/10">
          <ArenaBrand workspace="NRC Arena" to="/nrc/dashboard" compact />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      active
                        ? "bg-gradient-to-r from-gold/25 to-transparent font-medium text-gold border-l-2 border-gold"
                        : "text-white/70 hover:bg-white/5 hover:text-gold"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-white/60 hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-arena-bg text-arena-text">
      <ArenaSeo workspace="NRC Arena" />
      <ArenaTopBar
        title="NESA-Africa NRC Arena"
        subtitle="Internal Review System · NESA Africa 2026"
        statusLabel="Verification Live"
        statusDetail="2026 Cycle"
        statusTone="live"
        identityName={user?.email ?? "Reviewer"}
        identityRole="NRC Reviewer"
        notifications={3}
        leading={
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle navigation"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Collapse sidebar"
              className="hidden lg:flex text-white hover:bg-white/10"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        }
        actions={
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/50" />
            <Input
              placeholder="Search nominees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-56 border-white/12 bg-arena-panel pl-8 text-xs text-white placeholder:text-white/40"
            />
          </div>
        }
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex h-[calc(100vh-4rem)] sticky top-16 flex-col border-r border-white/10 bg-arena-rail transition-all duration-300",
            collapsed ? "w-16" : "w-60"
          )}
        >
          {sidebarContent}
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-arena-bg/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="fixed inset-y-16 left-0 z-50 w-64 overflow-y-auto border-r border-white/10 bg-arena-rail lg:hidden">
              {sidebarContent}
            </aside>
          </>
        )}

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          <ArenaFooter workspace="NRC Arena" />
        </div>
      </div>
    </div>
  );
}

