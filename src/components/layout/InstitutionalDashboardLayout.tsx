/**
 * NESA Africa — Premium Institutional Dashboard Layout
 * Black + Gold theme, collapsible sidebar, responsive
 */

import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronLeft, ChevronRight, LogOut, Bell, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NESALogo } from "@/components/nesa/NESALogo";
import { cn } from "@/lib/utils";
import { DASHBOARD_SIDEBAR_NAV, DASHBOARD_TOP_NAV } from "@/config/dashboard-navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  children: ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function InstitutionalDashboardLayout({ children, title, breadcrumbs }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, roles, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex w-full bg-charcoal">
      {/* ── Mobile Overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300",
          "bg-[hsl(30_8%_4%)] border-r border-gold/10",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-gold/10",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed ? (
            <Link to="/" className="flex items-center gap-2.5">
              <NESALogo variant="icon" size="sm" />
              <span className="font-display text-lg text-gold tracking-wide">NESA</span>
            </Link>
          ) : (
            <Link to="/">
              <NESALogo variant="icon" size="sm" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("hidden lg:flex text-white/50 hover:text-gold hover:bg-gold/5", collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/50 hover:text-gold"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <ScrollArea className="flex-1 py-3">
          {DASHBOARD_SIDEBAR_NAV.map((section, idx) => (
            <div key={section.id} className={cn("px-2", idx > 0 && "mt-5")}>
              {!collapsed && (
                <h3 className="px-3 mb-1.5 text-[10px] font-semibold text-gold/50 uppercase tracking-[0.15em]">
                  {section.label}
                </h3>
              )}
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        "hover:bg-gold/5 hover:text-gold",
                        collapsed && "justify-center px-2",
                        isActive
                          ? "bg-gold/10 text-gold border-l-2 border-gold"
                          : "text-white/60 border-l-2 border-transparent"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-gold" : "text-white/40")} />
                      {!collapsed && (
                        <span className="flex-1">{item.label}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded-full font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gold/10">
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className={cn(
              "w-full justify-start gap-3 text-white/40 hover:text-red-400 hover:bg-red-400/5",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* ── Main Content Area ───────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[hsl(30_8%_6%)]/95 backdrop-blur-md border-b border-gold/10 flex items-center px-4 md:px-6 gap-4">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white/60 hover:text-gold"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="hidden sm:flex items-center gap-2 text-sm">
              <Link to="/dashboard" className="text-white/40 hover:text-gold transition-colors">
                Dashboard
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <span className="text-white/20">/</span>
                  {crumb.href ? (
                    <Link to={crumb.href} className="text-white/40 hover:text-gold transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/80">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {title && !breadcrumbs && (
            <h1 className="text-white/80 font-medium hidden sm:block">{title}</h1>
          )}

          {/* Center nav links (desktop) */}
          <div className="hidden lg:flex items-center gap-1 mx-auto">
            {DASHBOARD_TOP_NAV.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-gold bg-gold/10"
                      : "text-white/50 hover:text-gold hover:bg-gold/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side utilities */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-gold hover:bg-gold/5" asChild>
              <Link to="/dashboard/notifications">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-white/60 hover:text-gold hover:bg-gold/5">
                  <div className="h-7 w-7 rounded-full bg-gold/20 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-gold" />
                  </div>
                  <span className="hidden md:inline text-sm">{user?.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[hsl(30_8%_8%)] border-gold/10 text-white/80">
                <div className="px-3 py-2 border-b border-gold/10">
                  <p className="text-sm font-medium text-white/90">{user?.email}</p>
                  {roles.length > 0 && (
                    <p className="text-xs text-gold/60 mt-0.5 capitalize">{roles[0]}</p>
                  )}
                </div>
                <DropdownMenuItem asChild className="hover:bg-gold/5 hover:text-gold focus:bg-gold/5 focus:text-gold cursor-pointer">
                  <Link to="/dashboard/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-gold/5 hover:text-gold focus:bg-gold/5 focus:text-gold cursor-pointer">
                  <Link to="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gold/10" />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-400 hover:bg-red-400/5 focus:bg-red-400/5 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
