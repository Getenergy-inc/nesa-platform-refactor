import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NESALogo } from "@/components/nesa/NESALogo";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  USER_DASHBOARD_NAV,
  NRC_DASHBOARD_NAV,
  JURY_DASHBOARD_NAV,
  ADMIN_DASHBOARD_NAV,
  CHAPTER_DASHBOARD_NAV,
  OLC_DASHBOARD_NAV,
  type NavItem,
} from "@/config/navigation";
import type { AppRole } from "@/config/roles";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

interface SidebarSection {
  title: string;
  items: NavItem[];
  roles?: AppRole[];
}

export function DashboardLayout({
  children,
  title,
  breadcrumbs,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, roles, signOut, hasRole } = useAuth();
  const location = useLocation();

  // Build sidebar sections based on user roles
  const sidebarSections: SidebarSection[] = [
    { title: "Dashboard", items: USER_DASHBOARD_NAV },
  ];

  if (hasRole("nrc") || hasRole("admin")) {
    sidebarSections.push({
      title: "NRC Review",
      items: NRC_DASHBOARD_NAV,
      roles: ["nrc", "admin"],
    });
  }
  if (hasRole("jury") || hasRole("admin")) {
    sidebarSections.push({
      title: "Jury Panel",
      items: JURY_DASHBOARD_NAV,
      roles: ["jury", "admin"],
    });
  }
  if (hasRole("chapter") || hasRole("admin")) {
    sidebarSections.push({
      title: "Chapter",
      items: CHAPTER_DASHBOARD_NAV,
      roles: ["chapter", "admin"],
    });
    sidebarSections.push({
      title: "OLC Coordinator",
      items: OLC_DASHBOARD_NAV,
      roles: ["chapter", "admin"],
    });
  }
  if (hasRole("admin")) {
    sidebarSections.push({
      title: "Admin",
      items: ADMIN_DASHBOARD_NAV,
      roles: ["admin"],
    });
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-card border-r transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <NESALogo variant="icon" size="sm" />
              <span className="font-display text-lg">NESA</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/">
              <NESALogo variant="icon" size="sm" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("hidden lg:flex", collapsed && "mx-auto")}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 py-4">
          {sidebarSections.map((section, idx) => (
            <div key={section.title} className={cn("px-2", idx > 0 && "mt-6")}>
              {!collapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        "hover:bg-muted/50",
                        collapsed && "justify-center px-2",
                      )}
                      activeClassName="bg-primary/10 text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive && "text-primary",
                          )}
                        />
                      )}
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive",
              collapsed && "justify-center px-2",
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b flex items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                <Home className="h-4 w-4" />
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <span>/</span>
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-foreground">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {title && !breadcrumbs && <h1 className="font-semibold">{title}</h1>}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            {roles.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {roles[0]}
              </span>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
