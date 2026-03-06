import { Link, Outlet, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Image,
  Users,
  Vote,
  Database,
  GraduationCap,
  Layers3,
  ArrowLeft,
  Shield,
  Bell,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/impact",
    label: "Impact",
    icon: BarChart3,
  },
  {
    href: "/admin/nominee-images",
    label: "Nominee Images",
    icon: Image,
  },
  {
    href: "/admin/nominee-profiles",
    label: "Nominee Profiles",
    icon: Users,
  },
  {
    href: "/admin/voting",
    label: "Voting Governance",
    icon: Vote,
  },
  {
    href: "/admin/edx",
    label: "EDX Analytics",
    icon: GraduationCap,
  },
  {
    href: "/admin/bulk-seed",
    label: "Bulk Seed",
    icon: Layers3,
  },
  {
    href: "/admin/rebuild",
    label: "System Rebuild",
    icon: Database,
  },
  {
    href: "/admin/nrc-governance",
    label: "Manage NRC",
    icon: ShieldCheck,
  },
  {
    href: "/admin/manage-editions",
    label: "Manage Editions",
    icon: Trophy,
  },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-4">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h1 className="font-bold text-lg">NESA Admin</h1>
                <p className="text-xs text-muted-foreground">
                  Awards Management Console
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Exit
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container flex gap-6 px-4 py-6">
          {/* Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <nav className="sticky top-24 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/admin" &&
                    location.pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Bottom Nav */}
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card lg:hidden">
            <nav className="flex justify-around py-2">
              {navItems.slice(0, 5).map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/admin" &&
                    location.pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 text-xs",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only sm:not-sr-only">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Page Content */}
          <main className="min-w-0 flex-1 pb-20 lg:pb-0">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
