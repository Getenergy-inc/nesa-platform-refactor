// Main Navigation Component
// Responsive navbar with dropdown menus for NESA-Africa

import { useState, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  Globe,
  User,
  LogOut,
  Home,
  Award,
  Ticket,
  Play,
  Heart,
  LayoutDashboard,
  Vote,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { MAIN_NAV, MAIN_NAV_CTA, MAIN_NAV_MOBILE_ORDER, MOBILE_NAV, type NavItem } from "@/config/navigation";
import { Sparkles } from "lucide-react";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
import { CVOFlashMessage, CVOMessageTrigger } from "@/components/nesa/cvo";
import { LanguageSwitcher } from "@/components/i18n";
import { NavSearch } from "@/components/navigation/NavSearch";
import { trackEvent } from "@/lib/analytics";



// ============================================================================
// DESKTOP NAVIGATION
// ============================================================================

function DesktopNav({ onOpenCVOMessage }: { onOpenCVOMessage: () => void }) {
  const location = useLocation();

  return (
    <NavigationMenu className="flex w-full min-w-0">
      <NavigationMenuList className="px-0 gap-0 flex-nowrap overflow-x-auto scrollbar-hide max-w-full">
        {MAIN_NAV.map((item) => (
          <NavigationMenuItem key={item.href} className="shrink-0">

            {item.children ? (
              <>
                <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-gold hover:bg-gold/10 data-[state=open]:bg-gold/10 data-[state=open]:text-gold h-8 xl:h-9 px-1.5 xl:px-2 text-[11px] xl:text-[13px] leading-none whitespace-nowrap">
                  {/* {item.icon && <item.icon className="h-3.5 w-3.5 mr-1.5" />} */}
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      "grid gap-3 p-4 bg-charcoal border border-gold/20",
                      item.label === "About" || item.label === "Support"
                        ? "w-[420px]"
                        : item.label === "Engage" || item.label === "Impact Programs" || item.label === "Awards" || item.label === "Media"
                        ? "w-[560px] md:w-[640px] md:grid-cols-2"
                        : "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]",

                    )}
                  >
                    {/* CVO Message Trigger - Only for About menu */}
                    {item.label === "About" && (
                      <li className="col-span-full border-b border-gold/10 pb-3 mb-1">
                        <CVOMessageTrigger
                          onClick={onOpenCVOMessage}
                          variant="dropdown"
                        />
                      </li>
                    )}

                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={child.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-gold/10 hover:text-gold focus:bg-gold/10 focus:text-gold",
                              location.pathname === child.href &&
                                "bg-gold/10 text-gold",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {child.icon && (
                                <child.icon className="h-4 w-4 text-gold" />
                              )}
                              <span className="text-sm font-medium leading-none text-white">
                                {child.label}
                              </span>
                              {child.badge && (
                                <span className="ml-auto text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </div>
                            {child.description && (
                              <p className="line-clamp-2 text-sm leading-snug text-white/60 mt-1">
                                {child.description}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  to={item.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white/90 hover:text-gold hover:bg-gold/10 h-8 xl:h-9 px-1.5 xl:px-2 text-[11px] xl:text-[13px] leading-none whitespace-nowrap",
                    location.pathname === item.href && "text-gold bg-gold/10",
                  )}
                >
                  {item.icon && <item.icon className="h-3.5 w-3.5 mr-1.5" />}
                  {item.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}

      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ============================================================================
// MOBILE NAVIGATION
// ============================================================================

function MobileNav({ onOpenCVOMessage }: { onOpenCVOMessage: () => void }) {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const mobileOrdered = [...MAIN_NAV].sort(
    (a, b) =>
      MAIN_NAV_MOBILE_ORDER.indexOf(a.label) - MAIN_NAV_MOBILE_ORDER.indexOf(b.label),
  );



  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    );
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleTrackedClick = (label: string, href: string) => () => {
    trackEvent("mobile_nav_item_click", { label, href });
    setOpen(false);
  };

  const handleCVOClick = () => {
    setOpen(false);
    onOpenCVOMessage();
  };

  const handleOpenChange = (next: boolean) => {
    if (next) trackEvent("mobile_nav_open", {});
    setOpen(next);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:text-gold hover:bg-gold/10 min-h-[44px] min-w-[44px]"
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        id="mobile-nav-drawer"
        side="right"
        className="w-[min(100vw,420px)] sm:max-w-sm bg-charcoal border-l border-gold/20 p-0 overflow-hidden z-[70]"
      >
        <SheetHeader className="p-4 border-b border-gold/20">
          <SheetTitle className="flex items-center gap-2">
            <img
              src={nesaStamp}
              alt="NESA"
              className="h-7 w-7 rounded-full object-contain"
            />
            <span className="text-gold font-display text-base">NESA-Africa</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Sticky Sponsor CTA — top-level per IA brief */}
            <div className="px-4 pt-4 pb-2">
              <Link to="/sponsor" onClick={handleLinkClick} className="block">
                <Button className="w-full bg-gold text-charcoal hover:bg-gold/90 font-semibold h-12 touch-manipulation shadow-md shadow-gold/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sponsor NESA-Africa 2026
                </Button>
              </Link>
            </div>


            {/* Full Navigation */}
            <div className="py-2">
              {mobileOrdered.map((item) => (
                <div
                  key={item.href}
                  className="border-b border-gold/5 last:border-b-0"
                >
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.href)}
                        aria-expanded={expandedItems.includes(item.href)}
                        aria-controls={`mnav-sub-${item.href}`}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-4 text-left transition-colors touch-manipulation min-h-[44px]",
                          "hover:bg-gold/5 active:bg-gold/10",
                          expandedItems.includes(item.href)
                            ? "text-gold bg-gold/5"
                            : "text-white/90",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon && <item.icon className="h-5 w-5" />}
                          <span className="font-medium text-base">
                            {item.label === "Impact Programs" ? "Programs" : item.label}
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            expandedItems.includes(item.href) && "rotate-180",
                          )}
                        />

                      </button>
                      <div
                        id={`mnav-sub-${item.href}`}
                        className={cn(
                          "overflow-hidden transition-all duration-200",
                          expandedItems.includes(item.href)
                            ? "max-h-[800px]"
                            : "max-h-0",
                        )}
                      >
                        <div className="bg-charcoal-light/30 py-2">
                          {/* CVO Message for About menu in mobile */}
                          {item.label === "About" && (
                            <div className="px-4 py-3 border-b border-gold/10 mb-1">
                              <CVOMessageTrigger
                                onClick={handleCVOClick}
                                variant="dropdown"
                              />
                            </div>
                          )}

                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={handleTrackedClick(child.label, child.href)}
                              className={cn(
                                "flex items-center gap-3 px-8 py-3.5 text-sm transition-colors touch-manipulation",
                                "hover:bg-gold/5 hover:text-gold active:bg-gold/10",
                                location.pathname === child.href
                                  ? "text-gold bg-gold/5"
                                  : "text-white/70",
                              )}
                            >
                              {child.icon && (
                                <child.icon className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className="flex-1">{child.label}</span>
                              {child.badge && (
                                <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={handleTrackedClick(item.label, item.href)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-4 transition-colors touch-manipulation",
                        "hover:bg-gold/5 hover:text-gold active:bg-gold/10",
                        location.pathname === item.href
                          ? "text-gold bg-gold/5"
                          : "text-white/90",
                      )}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Auth Section - Fixed at bottom */}
          <div className="border-t border-gold/20 p-4 bg-charcoal">
            {user ? (
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold/10 text-gold hover:bg-gold/20 transition-colors touch-manipulation"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-red-400 hover:bg-red-400/10 py-3 h-auto touch-manipulation"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-medium">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Primary CTA: Become a Sponsor (full-width) */}
                <Link to="/sponsor" onClick={handleLinkClick} className="block">
                  <Button className="w-full bg-gold text-charcoal hover:bg-gold/90 font-semibold py-3 h-auto touch-manipulation shadow-md shadow-gold/20">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Become a Sponsor
                  </Button>
                </Link>
                {/* Secondary: Nominate + Vote */}
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/nominate" onClick={handleLinkClick}>
                    <Button variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold bg-transparent py-3 h-auto touch-manipulation">
                      Nominate
                    </Button>
                  </Link>
                  <Link to="/vote" onClick={handleLinkClick}>
                    <Button variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold bg-transparent py-3 h-auto touch-manipulation">
                      Vote
                    </Button>
                  </Link>
                </div>
                {/* Tertiary: Get Started (guided landing — does not compete with primary CTAs) */}
                <Link to="/get-involved" onClick={handleLinkClick} className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-white/80 hover:text-gold hover:bg-gold/10 py-3 h-auto touch-manipulation border border-gold/20"
                  >
                    Get Started
                  </Button>
                </Link>
                {/* Utility: Sign In */}
                <Link to="/login" onClick={handleLinkClick} className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-white/80 hover:text-gold hover:bg-gold/10 py-3 h-auto touch-manipulation"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// USER MENU (Desktop) - Using forwardRef to fix ref warning
// ============================================================================

const UserMenuButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className="text-white hover:text-gold hover:bg-gold/10"
    {...props}
  >
    <User className="h-5 w-5" />
    <span className="sr-only">User menu</span>
  </Button>
));
UserMenuButton.displayName = "UserMenuButton";

function UserMenu() {
  const { user, signOut, hasRole } = useAuth();

  if (!user) {
    return (
      <div className="hidden xl:flex items-center gap-2">
        <Link to="/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/90 hover:text-gold hover:bg-gold/10 h-8 xl:h-9 px-3 text-[11px] xl:text-sm"
          >
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserMenuButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-charcoal border-gold/20 z-50"
      >
        <div className="px-2 py-1.5 text-sm text-white/60">{user.email}</div>
        <DropdownMenuSeparator className="bg-gold/10" />
        <DropdownMenuItem asChild>
          <Link
            to="/dashboard"
            className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
          >
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        {hasRole("nrc") && (
          <DropdownMenuItem asChild>
            <Link
              to="/nrc"
              className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
            >
              NRC Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        {hasRole("jury") && (
          <DropdownMenuItem asChild>
            <Link
              to="/judges"
              className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
            >
              Jury Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        {hasRole("admin") && (
          <DropdownMenuItem asChild>
            <Link
              to="/admin"
              className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
            >
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-gold/10" />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// MOBILE BOTTOM NAV - Quick Actions Bar
// ============================================================================

const mobileQuickActions = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Award, label: "Nominate", href: "/nominate" },
  { icon: Vote, label: "Vote", href: "/vote" },
  { icon: Heart, label: "Donate", href: "/donate" },
  { icon: Globe, label: "Explore", href: "/regions" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
];

export const MobileBottomNav = forwardRef<HTMLElement, object>(
  function MobileBottomNav(_, ref) {
    const location = useLocation();
    return (
      <nav 
        ref={ref}
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-charcoal/95 backdrop-blur-md border-t border-gold/20 safe-area-inset-bottom"
      >
        <div className="flex justify-around items-center py-2 px-1">
          {mobileQuickActions.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all min-w-[60px] min-h-[52px] touch-manipulation active:scale-95",
                location.pathname === item.href
                  ? "text-gold bg-gold/10"
                  : "text-white/60 hover:text-gold hover:bg-gold/5",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  location.pathname === item.href && "scale-110",
                )}
              />
              <span className="text-[10px] font-medium leading-tight">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    );
  },
);
MobileBottomNav.displayName = "MobileBottomNav";

// ============================================================================
// MAIN NAVIGATION HEADER
// ============================================================================

export function MainNav() {
  const [cvoMessageOpen, setCVOMessageOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-charcoal/95 backdrop-blur-md border-b border-gold/20 overflow-x-clip">
        <div className="container flex h-14 sm:h-16 items-center gap-2 px-3 sm:px-4 max-w-screen-2xl">
          {/* Brand Area: Logo + NESA-Africa 2026 + motto */}
          <Link
            to="/"
            className="flex items-center shrink-0 gap-2"
            aria-label="New Education Standard Award Africa — NESA-Africa 2026"
          >
            <img
              src={nesaStamp}
              alt="NESA-Africa"
              className="h-8 sm:h-10 w-8 sm:w-10 rounded-full object-contain"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-display font-bold text-gold tracking-wide">
                NESA-Africa <span className="text-white/70 font-medium">2026</span>
              </span>
              <span className="text-[9px] xl:text-[10px] text-gold/70 font-medium tracking-wider italic">
                The African Blue-Garnet Awards for Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (6 main items) */}
          <div className="flex-1 min-w-0">
            <DesktopNav onOpenCVOMessage={() => setCVOMessageOpen(true)} />
          </div>

          {/* Right Side: CTAs + Utility — order: Become a Sponsor → Nominate 2026 */}
          <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
            {/* Become a Sponsor (outline) — desktop only */}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden xl:inline-flex border-gold/40 text-gold hover:bg-gold/10 hover:text-gold h-9 px-3 text-[12px] bg-transparent whitespace-nowrap shrink-0"
            >
              <Link to={MAIN_NAV_CTA.href} aria-label="Become a Sponsor of NESA-Africa 2026">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                {MAIN_NAV_CTA.label}
              </Link>
            </Button>

            {/* Vote CTA — desktop only (mobile uses Get Involved dropdown) */}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden xl:inline-flex border-gold/40 text-gold hover:bg-gold/10 hover:text-gold bg-transparent h-9 px-2.5 xl:px-3 text-[11px] xl:text-[12px] whitespace-nowrap shrink-0"
            >
              <Link to="/vote" aria-label="Vote for NESA-Africa 2026">
                <Vote className="h-3.5 w-3.5 sm:mr-1" />
                <span>Vote</span>
              </Link>
            </Button>

            {/* Primary CTA: Nominate 2026 — desktop only */}
            <Button
              asChild
              size="sm"
              className="hidden xl:inline-flex bg-gold text-charcoal hover:bg-gold/90 font-semibold h-9 px-2.5 xl:px-3 text-[11px] xl:text-[12px] shadow-md shadow-gold/20 shrink-0 whitespace-nowrap"
            >
              <Link to="/nominate" aria-label="Nominate for NESA-Africa 2026">
                <Trophy className="h-3.5 w-3.5 sm:mr-1" />
                <span>Nominate 2026</span>
              </Link>
            </Button>

            {/* Mobile-only: Get Involved dropdown (replaces overlapping CTAs below xl) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="xl:hidden inline-flex bg-gold text-charcoal hover:bg-gold/90 font-semibold h-9 px-3 text-[12px] shadow-md shadow-gold/20 shrink-0 whitespace-nowrap gap-1"
                  aria-label="Get Involved with NESA-Africa 2026"
                >
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Get Involved</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 bg-charcoal border-gold/30 text-white"
              >
                <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold cursor-pointer py-3">
                  <Link to="/nominate" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gold" />
                    <span className="font-semibold">Nominate 2026</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold cursor-pointer py-3">
                  <Link to="/vote" className="flex items-center gap-2">
                    <Vote className="h-4 w-4 text-gold" />
                    <span>Vote</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold cursor-pointer py-3">
                  <Link to={MAIN_NAV_CTA.href} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span>Become a Sponsor</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Utility: Search */}
            <NavSearch />

            {/* Utility: Language Selector — wide screens only to keep navbar uncluttered */}
            <LanguageSwitcher className="hidden 2xl:flex" />

            {/* Utility: User Menu / Sign In (Desktop) */}
            <div className="hidden xl:block">
              <UserMenu />
            </div>


            {/* Mobile Menu */}
            <MobileNav onOpenCVOMessage={() => setCVOMessageOpen(true)} />
          </div>
        </div>
      </header>

      {/* CVO Flash Message Modal */}
      <CVOFlashMessage
        isOpen={cvoMessageOpen}
        onClose={() => setCVOMessageOpen(false)}
      />
    </>
  );
}

export default MainNav;
