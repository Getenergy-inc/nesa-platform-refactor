/**
 * NRC Dashboard Layout — Institutional review workspace
 * Black/charcoal + gold design matching AU/UNESCO internal portals
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  LayoutDashboard,
  Users,
  ClipboardList,
  FileCheck,
  Flag,
  BarChart3,
  Shield,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
  User,
  TrendingUp,
  Inbox,
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
      {
        href: "/nrc/dashboard/nominees?status=nomination_submitted",
        label: "Pending Review",
        icon: Clock,
      },
      {
        href: "/nrc/dashboard/nominees?status=documentation_verification",
        label: "Under Verification",
        icon: FileCheck,
      },
      {
        href: "/nrc/dashboard/nominees?status=nomination_cleared",
        label: "Cleared",
        icon: CheckCircle,
      },
      {
        href: "/nrc/dashboard/nominees?status=rejected",
        label: "Declined",
        icon: XCircle,
      },
    ],
  },
  {
    label: "Review Tools",
    items: [
      {
        href: "/nrc/dashboard/my-reviews",
        label: "My Assigned Reviews",
        icon: ClipboardList,
      },
      { href: "/nrc/dashboard/queue", label: "Scoring Queue", icon: BarChart3 },
      { href: "/nrc/dashboard/flagged", label: "Flagged Cases", icon: Flag },
      { href: "/nrc/dashboard/merge", label: "Merge & Dedup Tool", icon: Copy },
    ],
  },
  {
    label: "Standards",
    items: [
      {
        href: "/nrc/dashboard/edi-analytics",
        label: "EDI Analytics",
        icon: TrendingUp,
      },
      { href: "/guidelines/edi-matrix", label: "EDI Matrix", icon: Shield },
      {
        href: "/nrc/dashboard/guidelines",
        label: "NRC Guidelines",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        href: "/nrc/dashboard/reports",
        label: "Review Progress",
        icon: BarChart3,
      },
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href.includes("?")) {
      return location.pathname + location.search === href;
    }
    return location.pathname === href;
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 border-b border-[hsl(var(--gold)/0.1)] px-3 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--gold)/0.15)] md:h-9 md:w-9">
          <Award className="h-4 w-4 text-primary md:h-5 md:w-5" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xs font-bold text-foreground md:text-sm">
              NRC Portal
            </h2>
            <p className="text-[9px] text-muted-foreground md:text-[10px]">
              Internal Review System
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4 md:space-y-6">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.label}>
            {(!collapsed || isMobile) && (
              <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 md:text-[10px]">
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
                    className={cn(
                      "flex items-center gap-2 md:gap-3 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm transition-all",
                      active
                        ? "bg-[hsl(var(--gold)/0.15)] text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        "h-3.5 w-3.5 md:h-4 md:w-4 shrink-0",
                        active ? "text-primary" : "",
                      )}
                    />
                    {(!collapsed || isMobile) && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-[hsl(var(--gold)/0.1)] p-2 md:p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs md:text-sm text-muted-foreground hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background dark">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--gold)/0.1)] bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-14 items-center justify-between px-3 md:px-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden h-8 w-8 md:h-9 md:w-9"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <Menu className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </Button>

            {/* Desktop collapse */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex shrink-0 h-8 w-8"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            <div className="hidden sm:flex items-center gap-2 md:gap-3 min-w-0">
              <Award className="h-4 w-4 text-primary md:h-5 md:w-5 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xs font-bold truncate md:text-sm">
                  NRC Scoring Dashboard
                </h1>
                <p className="text-[9px] text-muted-foreground md:text-[10px]">
                  NESA Africa 2025
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="hidden md:flex border-primary/30 text-primary text-[9px] md:text-[10px] px-2 py-0 h-5"
            >
              Internal Review
            </Badge>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Search - Mobile */}
            <div className="relative md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  // Handle mobile search
                  const searchInput = document.createElement("input");
                  searchInput.type = "text";
                  searchInput.placeholder = "Search nominees...";
                  // You might want to open a dialog or show a search overlay
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Search - Desktop */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search nominees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-40 lg:w-60 bg-muted/30 pl-8 text-xs border-muted"
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 shrink-0"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-destructive md:h-2 md:w-2" />
            </Button>

            {/* Profile */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-muted/30 px-2 py-1 md:px-3 md:py-1.5">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <User className="h-3 w-3 text-primary md:h-3.5 md:w-3.5" />
              </div>
              <div className="hidden md:block min-w-0">
                <p className="text-xs font-medium truncate max-w-[100px]">
                  {user?.email?.split("@")[0] || "Reviewer"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  NRC Reviewer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Optional) - Show when search is active */}
        {searchQuery && (
          <div className="px-3 py-2 border-t border-[hsl(var(--gold)/0.1)] md:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search nominees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full bg-muted/30 pl-8 text-xs"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex h-[calc(100vh-3.5rem)] sticky top-14 flex-col border-r border-[hsl(var(--gold)/0.08)] bg-card transition-all duration-300",
            collapsed ? "w-16" : "w-60",
          )}
        >
          {sidebarContent}
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[hsl(var(--gold)/0.1)] bg-card shadow-xl lg:hidden top-14">
              {sidebarContent}
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-3 md:p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
