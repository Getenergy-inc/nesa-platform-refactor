// Main Navigation Component
// Responsive navbar with dropdown menus for NESA-Africa

import { useState, forwardRef, useRef, useEffect, type KeyboardEvent as ReactKeyboardEvent } from "react";
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
  Wallet,
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
import { MAIN_NAV, MAIN_NAV_CTA, MAIN_NAV_MOBILE_ORDER, MOBILE_NAV, GOVERNANCE_NAV, type NavItem } from "@/config/navigation";
import { Sparkles, MessageSquare } from "lucide-react";
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
    <NavigationMenu className="flex w-full min-w-0" aria-label="Primary">
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
                            aria-current={location.pathname === child.href ? "page" : undefined}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-gold/10 hover:text-gold focus:bg-gold/10 focus:text-gold",
                              "focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-1 focus-visible:ring-offset-charcoal",
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
                  aria-current={location.pathname === item.href ? "page" : undefined}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white/90 hover:text-gold hover:bg-gold/10 h-8 xl:h-9 px-1.5 xl:px-2 text-[11px] xl:text-[13px] leading-none whitespace-nowrap",
                    "focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-1 focus-visible:ring-offset-charcoal",
                    location.pathname === item.href && "text-gold bg-gold/10",
                  )}
                >
                  {item.icon && <item.icon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />}
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



  // Refs to panels + triggers for keyboard focus management
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pendingFocus, setPendingFocus] = useState<string | null>(null);

  // Mobile: only ONE dropdown open at a time (accordion behavior per IA brief).
  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => {
      const isOpen = prev.includes(href);
      if (isOpen) return [];
      setPendingFocus(href);
      return [href];
    });
  };

  // After a panel expands, move focus to its first link
  useEffect(() => {
    if (!pendingFocus) return;
    if (!expandedItems.includes(pendingFocus)) return;
    const panel = panelRefs.current[pendingFocus];
    const firstLink = panel?.querySelector<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );
    firstLink?.focus();
    setPendingFocus(null);
  }, [pendingFocus, expandedItems]);

  // Ordered list of trigger hrefs (only items with children — accordion targets).
  // Computed inside the handler via mobileOrdered so it stays in sync.
  const getTriggerHrefs = () =>
    mobileOrdered.filter((i) => i.children?.length).map((i) => i.href);

  const focusTriggerAt = (hrefs: string[], index: number) => {
    const wrapped = (index + hrefs.length) % hrefs.length;
    triggerRefs.current[hrefs[wrapped]]?.focus();
  };

  const handleTriggerKeyDown = (
    href: string,
  ) => (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const hrefs = getTriggerHrefs();
    const idx = hrefs.indexOf(href);

    switch (e.key) {
      case "ArrowDown": {
        if (e.altKey) {
          // Alt+Down opens panel (APG convention)
          e.preventDefault();
          if (!expandedItems.includes(href)) {
            setPendingFocus(href);
            setExpandedItems([href]);
          }
          return;
        }
        e.preventDefault();
        focusTriggerAt(hrefs, idx + 1);
        return;
      }
      case "ArrowUp": {
        e.preventDefault();
        focusTriggerAt(hrefs, idx - 1);
        return;
      }
      case "Home": {
        e.preventDefault();
        focusTriggerAt(hrefs, 0);
        return;
      }
      case "End": {
        e.preventDefault();
        focusTriggerAt(hrefs, hrefs.length - 1);
        return;
      }
      case "Enter":
      case " ": {
        // Native button activation handles toggling; no-op here.
        return;
      }
      default:
        return;
    }
  };

  const handlePanelKeyDown = (
    href: string,
  ) => (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setExpandedItems((prev) => prev.filter((h) => h !== href));
      triggerRefs.current[href]?.focus();
      return;
    }

    // Arrow navigation between links inside the open panel
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const panel = panelRefs.current[href];
      if (!panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (items.length === 0) return;
      const active = document.activeElement as HTMLElement | null;
      const currentIdx = active ? items.indexOf(active) : -1;
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = (currentIdx + delta + items.length) % items.length;
      items[next]?.focus();
      return;
    }

    if (e.key === "Home" || e.key === "End") {
      const panel = panelRefs.current[href];
      if (!panel) return;
      const items = panel.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
      if (items.length === 0) return;
      e.preventDefault();
      (e.key === "Home" ? items[0] : items[items.length - 1])?.focus();
    }
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
          className="min-[1200px]:hidden text-white hover:text-gold hover:bg-gold/10 min-h-[44px] min-w-[44px]"
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
            <span className="flex flex-col text-left leading-tight">
              <span className="text-gold font-display text-base">NESA-Africa 2026</span>
              <span className="text-[11px] font-medium italic tracking-wide text-white/70">
                The African Blue-Garnet Awards for Education
              </span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile primary navigation" className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Sticky Sponsor CTA — top-level per IA brief */}
            <div className="px-4 pt-4 pb-2">
              <Link to="/sponsor" onClick={handleLinkClick} className="block">
                <Button className="w-full bg-gold text-charcoal hover:bg-gold/90 font-semibold h-12 touch-manipulation shadow-md shadow-gold/20">
                  Sponsor NESA-Africa 2026
                </Button>
              </Link>
            </div>


            {/* Full Navigation */}
            <div className="py-2">
              {/* Governance / Quick-Access strip (mobile mirror of Level-1 bar) */}
              <div className="px-4 pb-2 pt-1">
                <p className="text-[10px] uppercase tracking-wider text-gold/60 font-semibold mb-2">Quick access</p>
                <div className="flex flex-wrap gap-2">
                  {GOVERNANCE_NAV.map((g) => (
                    <Link
                      key={g.href}
                      to={g.href}
                      onClick={handleLinkClick}
                      className="inline-flex items-center text-xs text-white/85 hover:text-gold border border-gold/20 rounded-full px-3 min-h-[48px] transition-colors touch-manipulation"
                    >
                      {g.label}
                    </Link>
                  ))}
                </div>

              </div>
              <div className="h-px bg-gold/10 mx-4 my-2" />

              {mobileOrdered.map((item) => (
                <div
                  key={item.href}
                  className="border-b border-gold/5 last:border-b-0"
                >
                  {item.children ? (
                    <div>
                      <button
                        ref={(el) => { triggerRefs.current[item.href] = el; }}
                        onClick={() => toggleExpanded(item.href)}
                        onKeyDown={handleTriggerKeyDown(item.href)}
                        aria-expanded={expandedItems.includes(item.href)}
                        aria-controls={`mnav-sub-${item.href}`}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-4 text-left transition-colors touch-manipulation min-h-[48px]",
                          "hover:bg-gold/5 active:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-inset",
                          expandedItems.includes(item.href)
                            ? "text-gold bg-gold/5"
                            : "text-white/90",
                        )}

                      >
                        <span className="flex items-center gap-3">
                          {item.icon && <item.icon className="h-5 w-5" aria-hidden="true" />}
                          <span className="font-medium text-base">
                            {item.label}
                          </span>
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            expandedItems.includes(item.href) && "rotate-180",
                          )}
                        />

                      </button>
                      <div
                        id={`mnav-sub-${item.href}`}
                        ref={(el) => { panelRefs.current[item.href] = el; }}
                        role="region"
                        aria-label={`${item.label} submenu`}
                        hidden={!expandedItems.includes(item.href)}
                        onKeyDown={handlePanelKeyDown(item.href)}
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
                              aria-current={location.pathname === child.href ? "page" : undefined}
                              className={cn(
                                "flex items-center gap-3 px-8 py-3.5 min-h-[48px] text-sm transition-colors touch-manipulation",
                                "hover:bg-gold/5 hover:text-gold active:bg-gold/10",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-inset",
                                location.pathname === child.href
                                  ? "text-gold bg-gold/5"
                                  : "text-white/70",
                              )}

                            >
                              {child.icon && (
                                <child.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
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
                      aria-current={location.pathname === item.href ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 px-4 py-4 min-h-[48px] transition-colors touch-manipulation",
                        "hover:bg-gold/5 hover:text-gold active:bg-gold/10",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-inset",
                        location.pathname === item.href
                          ? "text-gold bg-gold/5"
                          : "text-white/90",
                      )}

                    >
                      {item.icon && <item.icon className="h-5 w-5" aria-hidden="true" />}
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
                  className="flex items-center px-4 py-3 min-h-[48px] rounded-xl bg-gold/10 text-gold hover:bg-gold/20 transition-colors touch-manipulation"
                >
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-red-400 hover:bg-red-400/10 min-h-[48px] py-3 h-auto touch-manipulation"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                >
                  <span className="font-medium">Sign Out</span>
                </Button>

              </div>
            ) : (
              <div className="space-y-3">
                {/* Primary CTA: Become a Sponsor (full-width) */}
                <Link to="/sponsor" onClick={handleLinkClick} className="block">
                  <Button className="w-full bg-gold text-charcoal hover:bg-gold/90 font-semibold min-h-[48px] py-3 h-auto touch-manipulation shadow-md shadow-gold/20">
                    Become a Sponsor
                  </Button>
                </Link>
                {/* Secondary: Nominate + Vote */}
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/nominate" onClick={handleLinkClick}>
                    <Button variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold bg-transparent min-h-[48px] py-3 h-auto touch-manipulation">
                      Nominate
                    </Button>
                  </Link>
                  <Link to="/vote" onClick={handleLinkClick}>
                    <Button variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold bg-transparent min-h-[48px] py-3 h-auto touch-manipulation">
                      Vote
                    </Button>
                  </Link>
                </div>
                {/* Tertiary: Get Started (guided landing — does not compete with primary CTAs) */}
                <Link to="/get-involved" onClick={handleLinkClick} className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-white/80 hover:text-gold hover:bg-gold/10 min-h-[48px] py-3 h-auto touch-manipulation border border-gold/20"
                  >
                    Get Started
                  </Button>
                </Link>
                {/* Utility: Sign In */}
                <Link to="/login" onClick={handleLinkClick} className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-white/80 hover:text-gold hover:bg-gold/10 min-h-[48px] py-3 h-auto touch-manipulation"
                  >
                    Sign In
                  </Button>
                </Link>
                {/* Utility: Language Switcher */}
                <div className="flex items-center justify-center pt-1">
                  <LanguageSwitcher className="flex" />
                </div>


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
      <div className="hidden min-[1200px]:flex items-center gap-2">
        <Link to="/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/90 hover:text-gold hover:bg-gold/10 h-9 px-3 text-[12px]"
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
        aria-label="Quick actions"
        className="fixed bottom-0 left-0 right-0 z-40 min-[1200px]:hidden bg-charcoal/95 backdrop-blur-md border-t border-gold/20 safe-area-inset-bottom"
      >
        <div className="flex justify-around items-center py-2 px-1">
          {mobileQuickActions.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all min-w-[60px] min-h-[52px] touch-manipulation active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
                  active
                    ? "text-gold bg-gold/10"
                    : "text-white/60 hover:text-gold hover:bg-gold/5",
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-5 transition-transform",
                    active && "scale-110",
                  )}
                />
                <span className="text-[10px] font-medium leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  },
);
MobileBottomNav.displayName = "MobileBottomNav";

// ============================================================================
// LEVEL 1 — GOVERNANCE / QUICK-ACCESS BAR (desktop only, SCEF-style)
// ============================================================================

function GovernanceBar() {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <div className="hidden lg:block w-full bg-charcoal-light/60 border-b border-gold/10">
      <div className="container max-w-screen-2xl flex h-9 items-center justify-between gap-4 px-4 text-[11px] xl:text-[12px]">
        {/* Left: stakeholder links */}
        <nav aria-label="Governance and stakeholder navigation" className="flex items-center gap-3 xl:gap-4 overflow-x-auto scrollbar-hide">
          {GOVERNANCE_NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={location.pathname === item.href ? "page" : undefined}
              className="text-white/70 hover:text-gold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Right: utility */}
        <div className="flex items-center gap-3 xl:gap-4 shrink-0">
          <Link to="/wallet" className="text-white/70 hover:text-gold whitespace-nowrap transition-colors flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5" aria-hidden="true" /> Wallet
          </Link>
          {!user && (
            <Link to="/login" className="text-white/70 hover:text-gold whitespace-nowrap transition-colors">
              Login
            </Link>
          )}
          <LanguageSwitcher className="flex" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN NAVIGATION HEADER (Level 1 + Level 2)
// ============================================================================

export function MainNav() {
  const [cvoMessageOpen, setCVOMessageOpen] = useState(false);

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main =
      (document.getElementById("main-content") as HTMLElement | null) ||
      (document.querySelector("main") as HTMLElement | null);
    if (main) {
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: false });
      main.scrollIntoView({ block: "start" });
    }
  };

  return (
    <>
      <a
        href="#main-content"
        onClick={handleSkip}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-gold focus:text-charcoal focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold/60"
      >
        Skip to main content
      </a>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-charcoal/95 backdrop-blur-md border-b border-gold/20 overflow-x-clip">
        {/* LEVEL 1 — Governance / Quick Access Bar */}
        <GovernanceBar />

        {/* LEVEL 2 — Primary Navigation */}
        <div className="container flex min-h-16 flex-wrap items-center gap-x-1 gap-y-2 px-3 py-2 sm:min-h-[72px] sm:gap-x-2 sm:px-4 min-[1200px]:h-16 min-[1200px]:flex-nowrap min-[1200px]:py-0 max-w-screen-2xl">
          {/* Brand */}
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
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[13px] sm:text-sm font-display font-bold text-gold tracking-wide whitespace-nowrap">
                NESA-Africa <span className="text-white/70 font-medium">2026</span>
              </span>
              <span className="block max-w-[178px] text-[9px] text-gold/70 font-medium tracking-wide italic leading-snug sm:max-w-none sm:text-[10px] min-[1200px]:whitespace-nowrap">
                The African Blue-Garnet Awards for Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — only at >=1200px */}
          <div className="hidden min-[1200px]:block flex-1 min-w-0">
            <DesktopNav onOpenCVOMessage={() => setCVOMessageOpen(true)} />
          </div>

          {/* Spacer to push CTAs right on tablet/mobile */}
          <div className="flex-1 min-[1200px]:hidden" />

          {/* Right Side: 3 primary CTAs (Nominate, Vote, Become a Sponsor) + utility */}
          <div className="order-3 grid w-full grid-cols-[1fr_auto] items-center gap-2 min-[430px]:order-none min-[430px]:flex min-[430px]:w-auto min-[430px]:justify-start sm:gap-1.5 xl:gap-2 shrink-0">
            <div className="grid min-w-0 grid-cols-3 gap-1 min-[430px]:contents">
            {/* Desktop CTA 1 — Nominate (secondary outline) */}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden min-[1200px]:inline-flex border-gold/40 text-gold hover:bg-gold/10 hover:text-gold h-9 px-3 text-[12px] bg-transparent whitespace-nowrap shrink-0"
            >
              <Link to="/nominate" aria-label="Nominate for NESA-Africa 2026">
                <Trophy className="h-3.5 w-3.5 mr-1" />
                Nominate
              </Link>
            </Button>

            {/* Desktop CTA 2 — Vote (secondary outline) */}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden min-[1200px]:inline-flex border-gold/40 text-gold hover:bg-gold/10 hover:text-gold h-9 px-3 text-[12px] bg-transparent whitespace-nowrap shrink-0"
            >
              <Link to="/vote" aria-label="Vote in NESA-Africa 2026">
                <Vote className="h-3.5 w-3.5 mr-1" />
                Vote
              </Link>
            </Button>

            {/* Desktop CTA 3 — Become a Sponsor (primary filled, strongest) */}
            <Button
              asChild
              size="sm"
              className="hidden min-[1200px]:inline-flex bg-gold text-charcoal hover:bg-gold/90 font-semibold h-9 px-3 text-[12px] shadow-md shadow-gold/20 shrink-0 whitespace-nowrap"
            >
              <Link to="/sponsor" aria-label="Become a Sponsor of NESA-Africa 2026">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Become a Sponsor
              </Link>
            </Button>

            {/* Mobile / tablet header CTAs — order: Nominate, Vote, Become a Sponsor, Language(icon) */}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="min-[1200px]:hidden inline-flex border-gold/40 text-gold hover:bg-gold/10 hover:text-gold h-9 px-1.5 min-[430px]:px-2.5 text-[10px] min-[430px]:text-[11px] bg-transparent min-w-0 shrink-0 whitespace-nowrap"
            >
              <Link to="/nominate" aria-label="Nominate for NESA-Africa 2026">
                <span className="inline min-[430px]:hidden">Nominate</span>
                <span className="hidden min-[430px]:inline">Nominate 2026</span>
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="min-[1200px]:hidden inline-flex border-gold/40 text-gold hover:bg-gold/10 hover:text-gold h-9 px-1.5 min-[430px]:px-2.5 text-[10px] min-[430px]:text-[11px] bg-transparent min-w-0 shrink-0 whitespace-nowrap"
            >
              <Link to="/vote" aria-label="Vote in NESA-Africa 2026">Vote</Link>
            </Button>

            {/* Mobile / tablet Sponsor CTA — primary filled gold */}
            <Button
              asChild
              size="sm"
              className="min-[1200px]:hidden inline-flex bg-gold text-charcoal hover:bg-gold/90 font-semibold h-9 px-1.5 min-[430px]:px-2.5 text-[10px] min-[430px]:text-[11px] shadow-md shadow-gold/20 min-w-0 shrink-0 whitespace-nowrap"
            >
              <Link to="/sponsor" aria-label="Become a Sponsor of NESA-Africa 2026">
                <span className="inline min-[430px]:hidden">Sponsor</span>
                <span className="hidden min-[430px]:inline">Become a Sponsor</span>
              </Link>
            </Button>
            </div>

            {/* Mobile / tablet Language Switcher — icon only */}
            <div className="hidden min-[430px]:block min-[1200px]:hidden shrink-0">
              <LanguageSwitcher variant="compact" className="h-9 w-9" />
            </div>

            {/* Utility: Search — hidden below sm to preserve CTA space */}
            <div className="hidden sm:block">
              <NavSearch />
            </div>

            {/* Utility: User Menu (Desktop only at >=1200px) */}
            <div className="hidden min-[1200px]:block">
              <UserMenu />
            </div>

            {/* Mobile Menu (visible below 1200px) */}
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
