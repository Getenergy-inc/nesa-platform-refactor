import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    return (
      location.pathname === href ||
      (href !== "/nrc" && location.pathname.startsWith(href))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-shadow",
          isScrolled && "shadow-sm",
        )}
      >
        <div className="container flex h-14 sm:h-16 items-center justify-between gap-2 px-3 sm:px-4">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 border-b px-4 py-4">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="font-display text-sm font-bold">
                      NRC Portal
                    </span>
                  </div>
                  <nav className="flex-1 space-y-1 p-4">
                    {navItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            active
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
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo and Title */}
            <Link
              to="/"
              className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
            >
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </Link>

            <div className="min-w-0 flex-1">
              <h1 className="font-display text-sm sm:text-lg font-bold truncate">
                Hybrid NRC Portal
              </h1>
              <div className="hidden sm:flex items-center gap-2">
                <p className="text-xs text-muted-foreground truncate">
                  30 Volunteers • Blended Verification Model
                </p>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {currentEdition.name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Stats Badge */}
            <div className="flex sm:hidden items-center gap-1">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-5">
                {currentEdition.name}
              </Badge>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-destructive sm:h-2 sm:w-2" />
            </Button>

            {/* Exit Button */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <Link to="/">
                <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Exit Portal</span>
                <span className="sm:hidden">Exit</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Stats Bar */}
        {/* <div className="border-t px-3 py-1.5 sm:hidden">
          <p className="text-[10px] text-muted-foreground text-center truncate">
            30 Volunteers • Blended Verification Model
          </p>
        </div> */}
      </header>

      <div className="container px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
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

          {/* Main Content */}
          <main className="min-w-0 flex-1 pb-16 lg:pb-0">{children}</main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card shadow-lg lg:hidden">
        <nav className="flex justify-around py-1.5 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-colors min-w-[60px]",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5",
                    active && "text-primary",
                  )}
                />
                <span className="text-[9px] sm:text-xs font-medium">
                  {item.label === "Create Team"
                    ? "Create"
                    : item.label === "Manage Team"
                      ? "Manage"
                      : item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
