import { Link, useLocation } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Award,
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  ArrowLeft,
  Bell,
  UsersRound,
} from "lucide-react";

interface NRCLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/nrc", label: "Dashboard", icon: LayoutDashboard },
  { href: "/nrc/my-queue", label: "My Queue", icon: ClipboardList },
  {
    href: "/nrc/team",
    label: "Create Team",
    icon: Users,
  },
  {
    href: "/nrc/manageteam",
    label: "Manage Team",
    icon: UsersRound,
  },
];

export function NRCLayout({ children }: NRCLayoutProps) {
  const location = useLocation();
  const { currentEdition } = useSeason();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
            >
              <Award className="h-5 w-5 text-primary" />
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold">
                Hybrid NRC Portal
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  30 Volunteers • Blended Verification Model
                </p>
                <Badge variant="outline" className="text-[10px]">
                  {currentEdition.name}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Exit Portal
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex gap-6 px-4 py-6">
        {/* Sidebar Navigation */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/nrc" &&
                  location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
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

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card lg:hidden">
          <nav className="container flex justify-around py-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/nrc" &&
                  location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 text-xs transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only sm:not-sr-only">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
      </div>
    </div>
  );
}
