// Main Navigation Component
// Fully responsive navbar with dropdown menus for NESA-Africa
// Optimized for all screen sizes: mobile, tablet, desktop, and large displays

import { useState, forwardRef, useEffect } from "react";
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
  X,
  Sparkles,
  Medal,
  Star,
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
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { MAIN_NAV, MOBILE_NAV, type NavItem } from "@/config/navigation";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
import { CVOFlashMessage, CVOMessageTrigger } from "@/components/nesa/cvo";
import { LanguageSwitcher } from "@/components/i18n";
import { AppRole } from "@/config/roles";

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      setScrollY(scrollY);
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection]);

  return { scrollDirection, scrollY };
}

// ============================================================================
// DESKTOP NAVIGATION
// ============================================================================

function DesktopNav({ onOpenCVOMessage }: { onOpenCVOMessage: () => void }) {
  const location = useLocation();
  const isLargeDesktop = useMediaQuery("(min-width: 1536px)");

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {MAIN_NAV.map((item) => (
          <NavigationMenuItem key={item.href}>
            {item.children ? (
              <>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent text-white/90 hover:text-gold hover:bg-gold/10 data-[state=open]:bg-gold/10 data-[state=open]:text-gold",
                    "h-10 px-3 xl:px-4 text-sm xl:text-base transition-all",
                  )}
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4 mr-1.5 xl:mr-2" />
                  )}
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">
                    {item.shortLabel || item.label}
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      "grid gap-2 p-3 xl:gap-3 xl:p-4 bg-charcoal border border-gold/20 rounded-lg",
                      isLargeDesktop
                        ? "w-[680px]"
                        : "w-[520px] md:w-[600px] lg:w-[560px]",
                      item.children.length > 6
                        ? "md:grid-cols-2"
                        : "md:grid-cols-1",
                      item.children.length > 8 && "lg:grid-cols-3",
                    )}
                  >
                    {/* CVO Message Trigger - Only for About menu */}
                    {item.label === "About" && (
                      <li
                        className={cn(
                          "col-span-full border-b border-gold/10 pb-2 mb-1",
                          item.children.length > 6 && "md:col-span-2",
                          item.children.length > 8 && "lg:col-span-3",
                        )}
                      >
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
                              "block select-none rounded-md p-2 xl:p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-gold/10 hover:text-gold focus:bg-gold/10 focus:text-gold",
                              location.pathname === child.href &&
                                "bg-gold/10 text-gold",
                              child.description ? "space-y-1" : "",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {child.icon && (
                                <child.icon className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-gold flex-shrink-0" />
                              )}
                              <span className="text-xs xl:text-sm font-medium leading-none text-white truncate">
                                {child.label}
                              </span>
                              {child.badge && (
                                <span className="ml-auto text-[10px] xl:text-xs bg-gold/20 text-gold px-1.5 xl:px-2 py-0.5 rounded-full whitespace-nowrap">
                                  {child.badge}
                                </span>
                              )}
                            </div>
                            {child.description && (
                              <p className="text-[10px] xl:text-xs leading-snug text-white/60 line-clamp-2">
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
              <Link to={item.href}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white/90 hover:text-gold hover:bg-gold/10",
                    "h-10 px-3 xl:px-4 text-sm xl:text-base",
                    location.pathname === item.href && "text-gold bg-gold/10",
                  )}
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4 mr-1.5 xl:mr-2" />
                  )}
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">
                    {item.shortLabel || item.label}
                  </span>
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ============================================================================
// TABLET NAVIGATION (Compact for iPad/Tablet)
// ============================================================================

function TabletNav({ onOpenCVOMessage }: { onOpenCVOMessage: () => void }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:flex lg:hidden items-center">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-white/90 hover:text-gold hover:bg-gold/10 gap-2"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 bg-charcoal border-gold/20 z-50 max-h-[80vh] overflow-y-auto"
        >
          {/* CVO Message */}
          <div className="px-2 py-2 border-b border-gold/10">
            <CVOMessageTrigger
              onClick={() => {
                onOpenCVOMessage();
                setOpen(false);
              }}
              variant="dropdown"
            />
          </div>

          {MAIN_NAV.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gold/70 uppercase tracking-wider">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link
                        to={child.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "cursor-pointer text-white hover:text-gold hover:bg-gold/10",
                          location.pathname === child.href &&
                            "bg-gold/10 text-gold",
                        )}
                      >
                        {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                        <span className="flex-1">{child.label}</span>
                        {child.badge && (
                          <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                            {child.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "cursor-pointer text-white hover:text-gold hover:bg-gold/10",
                      location.pathname === item.href && "bg-gold/10 text-gold",
                    )}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ============================================================================
// MOBILE NAVIGATION - With Full Role-Based Access (FIXED)
// ============================================================================

function MobileNav({ onOpenCVOMessage }: { onOpenCVOMessage: () => void }) {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const { user, signOut, hasRole } = useAuth();
  const isSmallMobile = useMediaQuery("(max-width: 380px)");

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    );
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleCVOClick = () => {
    setOpen(false);
    onOpenCVOMessage();
  };

  // Get role-specific dashboard link - Using correct role names from your config
  const getDashboardLink = () => {
    if (hasRole("ADMIN"))
      return {
        path: "/admin",
        label: "Admin Dashboard",
        icon: LayoutDashboard,
      };
    if (hasRole("NRC"))
      return { path: "/nrc", label: "NRC Panel", icon: Medal };
    if (hasRole("jury"))
      return { path: "/jury", label: "Jury Panel", icon: Sparkles };
    if (hasRole("NOMINEE"))
      return {
        path: "/nominee/dashboard",
        label: "Nominee Dashboard",
        icon: Star,
      };
    if (hasRole("FREE_MEMBER"))
      return { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard };
    return null;
  };

  const dashboardLink = user ? getDashboardLink() : null;

  // Get role-specific quick actions for mobile grid
  const getQuickActions = () => {
    const baseActions = [...MOBILE_NAV];

    // Always include these core actions
    const coreActions = baseActions.slice(0, isSmallMobile ? 3 : 4);

    // If user is logged in, add role-specific quick actions
    if (user) {
      const roleActions = [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "dashboard",
          shortLabel: "Dashboard",
        },
      ];

      if (hasRole("ADMIN")) {
        roleActions.push({
          icon: LayoutDashboard,
          label: "Admin",
          href: "/admin",
          shortLabel: "Admin",
        });
      }
      if (hasRole("NRC")) {
        roleActions.push({
          icon: Medal,
          label: "NRC",
          href: "/nrc",
          shortLabel: "NRC",
        });
      }
      if (hasRole("jury")) {
        roleActions.push({
          icon: Sparkles,
          label: "Jury",
          href: "/jury",
          shortLabel: "Jury",
        });
      }
      if (hasRole("NOMINEE")) {
        roleActions.push({
          icon: Star,
          label: "Nominee",
          href: "/nominee/dashboard",
          shortLabel: "Nom",
        });
      }

      // Combine core actions with role actions and limit based on screen size
      const combined = [...coreActions, ...roleActions];
      return combined.slice(0, isSmallMobile ? 4 : 6);
    }

    return baseActions.slice(0, isSmallMobile ? 4 : 6);
  };

  const quickActions = getQuickActions();

  // Helper function to check if user has any of the required roles
  const hasAnyRole = (requiredRoles?: string[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some((role) => hasRole(role as AppRole));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:text-gold hover:bg-gold/10 min-h-[44px] min-w-[44px]"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={cn(
          "bg-charcoal border-l border-gold/20 p-0 overflow-hidden",
          isSmallMobile ? "w-[280px]" : "w-[320px] sm:w-[350px]",
        )}
      >
        <SheetHeader className="p-3 sm:p-4 border-b border-gold/20">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={nesaStamp}
                alt="NESA"
                className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-contain"
              />
              <span className="text-gold font-display text-sm sm:text-base">
                Menu
              </span>
            </div>
            <SheetClose className="rounded-lg p-1.5 hover:bg-gold/10 transition-colors">
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Quick Action Grid - Role Aware */}
            <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gold/10">
              <div
                className={cn(
                  "grid gap-2 sm:gap-3",
                  isSmallMobile ? "grid-cols-2" : "grid-cols-3",
                )}
              >
                {quickActions.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl text-center transition-all active:scale-95",
                      "hover:bg-gold/10 hover:text-gold min-h-[64px] sm:min-h-[72px] touch-manipulation",
                      location.pathname === item.href
                        ? "bg-gold/10 text-gold"
                        : "text-white/70",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "h-4 w-4 sm:h-5 sm:w-5",
                          item.label === "Admin" && "text-red-400",
                          item.label === "NRC" && "text-purple-400",
                          item.label === "Jury" && "text-blue-400",
                          item.label === "Nominee" && "text-amber-400",
                        )}
                      />
                    )}
                    <span className="text-[10px] sm:text-xs font-medium leading-tight">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Status Indicator - Mobile */}
            {user && (
              <div className="px-3 sm:px-4 py-2 bg-gold/5 border-b border-gold/10">
                <div className="flex items-center gap-2 text-xs text-gold/80">
                  <User className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
                  {hasRole("ADMIN") && (
                    <span className="ml-auto bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      Admin
                    </span>
                  )}
                  {hasRole("NRC") && (
                    <span className="ml-auto bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      NRC
                    </span>
                  )}
                  {hasRole("jury") && (
                    <span className="ml-auto bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      Jury
                    </span>
                  )}
                  {hasRole("NOMINEE") && (
                    <span className="ml-auto bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      Nominee
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Full Navigation - Role Aware */}
            <div className="py-2">
              {MAIN_NAV.map((item) => {
                // Check if main item requires auth
                if (item.requiresAuth && !user) return null;

                // Check if main item has role requirements
                if (item.requiredRoles && !hasAnyRole(item.requiredRoles))
                  return null;

                // Filter child items based on roles if they have role requirements
                const filteredChildren = item.children?.filter((child) => {
                  // Check if child requires auth
                  if (child.requiresAuth && !user) return false;

                  // Check if child has role requirements - FIXED: using requiredRoles array
                  if (child.requiredRoles && !hasAnyRole(child.requiredRoles))
                    return false;

                  return true;
                });

                // Skip rendering if no children after filtering
                if (item.children && filteredChildren?.length === 0)
                  return null;

                return (
                  <div
                    key={item.href}
                    className="border-b border-gold/5 last:border-b-0"
                  >
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleExpanded(item.href)}
                          className={cn(
                            "flex items-center justify-between w-full px-3 sm:px-4 py-3 sm:py-4 text-left transition-colors touch-manipulation",
                            "hover:bg-gold/5 active:bg-gold/10",
                            expandedItems.includes(item.href)
                              ? "text-gold bg-gold/5"
                              : "text-white/90",
                          )}
                        >
                          <span className="flex items-center gap-2 sm:gap-3">
                            {item.icon && (
                              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                            )}
                            <span className="text-sm sm:text-base font-medium">
                              {item.label}
                            </span>
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 flex-shrink-0",
                              expandedItems.includes(item.href) && "rotate-180",
                            )}
                          />
                        </button>
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200",
                            expandedItems.includes(item.href)
                              ? "max-h-[500px]"
                              : "max-h-0",
                          )}
                        >
                          <div className="bg-black/20 py-1 sm:py-2">
                            {/* CVO Message for About menu in mobile */}
                            {item.label === "About" && (
                              <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gold/10 mb-1">
                                <CVOMessageTrigger
                                  onClick={handleCVOClick}
                                  variant="dropdown"
                                />
                              </div>
                            )}

                            {filteredChildren?.map((child) => (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={handleLinkClick}
                                className={cn(
                                  "flex items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm transition-colors touch-manipulation",
                                  "hover:bg-gold/5 hover:text-gold active:bg-gold/10",
                                  location.pathname === child.href
                                    ? "text-gold bg-gold/5"
                                    : "text-white/70",
                                )}
                              >
                                {child.icon && (
                                  <child.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                )}
                                <span className="flex-1 truncate">
                                  {child.label}
                                </span>
                                {child.badge && (
                                  <span className="text-[10px] sm:text-xs bg-gold/20 text-gold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
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
                        onClick={handleLinkClick}
                        className={cn(
                          "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 transition-colors touch-manipulation",
                          "hover:bg-gold/5 hover:text-gold active:bg-gold/10",
                          location.pathname === item.href
                            ? "text-gold bg-gold/5"
                            : "text-white/90",
                        )}
                      >
                        {item.icon && (
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        )}
                        <span className="text-sm sm:text-base font-medium">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="ml-auto text-[10px] sm:text-xs bg-gold/20 text-gold px-1.5 sm:px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Role-Specific Menu Items - Only shown in mobile */}
              {user && (
                <>
                  {hasRole("ADMIN") && (
                    <Link
                      to="/admin"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 transition-colors touch-manipulation hover:bg-gold/5 border-t border-gold/5 mt-2"
                    >
                      <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                      <span className="text-sm sm:text-base font-medium text-white/90">
                        Admin Dashboard
                      </span>
                      <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    </Link>
                  )}

                  {hasRole("NRC") && (
                    <Link
                      to="/nrc"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 transition-colors touch-manipulation hover:bg-gold/5"
                    >
                      <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                      <span className="text-sm sm:text-base font-medium text-white/90">
                        NRC Panel
                      </span>
                      <span className="ml-auto text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                        NRC
                      </span>
                    </Link>
                  )}

                  {hasRole("jury") && (
                    <Link
                      to="/jury"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 transition-colors touch-manipulation hover:bg-gold/5"
                    >
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      <span className="text-sm sm:text-base font-medium text-white/90">
                        Jury Panel
                      </span>
                      <span className="ml-auto text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                        Jury
                      </span>
                    </Link>
                  )}

                  {hasRole("NOMINEE") && (
                    <Link
                      to="/nominee/dashboard"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 transition-colors touch-manipulation hover:bg-gold/5"
                    >
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                      <span className="text-sm sm:text-base font-medium text-white/90">
                        Nominee Dashboard
                      </span>
                      <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                        Nominee
                      </span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Auth Section - Enhanced with role info */}
          <div className="border-t border-gold/20 p-3 sm:p-4 bg-charcoal">
            {user ? (
              <div className="space-y-2 sm:space-y-3">
                {/* Role-specific dashboard link */}
                {dashboardLink && (
                  <Link
                    to={dashboardLink.path}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gold/10 text-gold hover:bg-gold/20 transition-colors touch-manipulation"
                  >
                    <dashboardLink.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base font-medium truncate flex-1">
                      {dashboardLink.label}
                    </span>
                    {hasRole("ADMIN") && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </Link>
                )}

                {/* Profile link */}
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-gold/5 transition-colors touch-manipulation"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                  <span className="text-sm sm:text-base font-medium text-white/90 truncate">
                    Profile Settings
                  </span>
                </Link>

                {/* Sign out button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-red-400 hover:bg-red-400/10 py-2.5 sm:py-3 h-auto touch-manipulation text-sm sm:text-base"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="truncate">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2 sm:gap-3">
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-primary/30 text-primary hover:bg-primary/10 py-2 sm:py-2.5 h-auto touch-manipulation text-xs sm:text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="flex-1"
                  >
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 sm:py-2.5 h-auto touch-manipulation text-xs sm:text-sm">
                      {isSmallMobile ? "Join" : "Get Started"}
                    </Button>
                  </Link>
                </div>
                <p className="text-[10px] text-center text-white/40">
                  Join NESA Africa to participate in awards
                </p>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// USER MENU (Desktop)
// ============================================================================

const UserMenuButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className="text-white hover:text-gold hover:bg-gold/10 min-h-[44px] min-w-[44px]"
    {...props}
  >
    <User className="h-4 w-4 sm:h-5 sm:w-5" />
    <span className="sr-only">User menu</span>
  </Button>
));
UserMenuButton.displayName = "UserMenuButton";

function UserMenu() {
  const { user, signOut, hasRole } = useAuth();
  const [open, setOpen] = useState(false);
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");

  if (!user) {
    return (
      <div className="hidden lg:flex items-center gap-1 xl:gap-2">
        <Link to="/login">
          <Button
            variant="ghost"
            className="text-white/90 hover:text-gold hover:bg-gold/10 h-9 px-2 xl:px-3 text-sm xl:text-base"
          >
            Sign In
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-2 xl:px-3 text-sm xl:text-base">
            {isTablet ? "Join" : "Get Started"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <UserMenuButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 sm:w-64 bg-charcoal border-gold/20 z-50"
      >
        <div className="px-2 py-1.5 text-xs sm:text-sm text-white/60 truncate">
          {user.email}
        </div>
        <DropdownMenuSeparator className="bg-gold/10" />

        {/* Dashboard Links based on roles */}
        {hasRole("FREE_MEMBER") && (
          <DropdownMenuItem asChild>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {hasRole("NOMINEE") && (
          <DropdownMenuItem asChild>
            <Link
              to="/nominee/dashboard"
              onClick={() => setOpen(false)}
              className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
            >
              <Star className="mr-2 h-4 w-4" />
              Nominee Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {(hasRole("NRC") || hasRole("jury") || hasRole("ADMIN")) && (
          <>
            <DropdownMenuSeparator className="bg-gold/10" />
            {hasRole("NRC") && (
              <DropdownMenuItem asChild>
                <Link
                  to="/nrc"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
                >
                  <Medal className="mr-2 h-4 w-4" />
                  NRC Panel
                </Link>
              </DropdownMenuItem>
            )}
            {hasRole("jury") && (
              <DropdownMenuItem asChild>
                <Link
                  to="/jury"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Jury Panel
                </Link>
              </DropdownMenuItem>
            )}
            {hasRole("ADMIN") && (
              <DropdownMenuItem asChild>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-white hover:text-gold hover:bg-gold/10"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuSeparator className="bg-gold/10" />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            setOpen(false);
          }}
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
// MOBILE BOTTOM NAV - Quick Actions Bar with Role Awareness (FIXED)
// ============================================================================

export const MobileBottomNav = forwardRef<HTMLElement, object>(
  function MobileBottomNav(_, ref) {
    const location = useLocation();
    const { user, hasRole } = useAuth();
    const isSmallMobile = useMediaQuery("(max-width: 380px)");
    const { scrollDirection, scrollY } = useScrollDirection();
    const showNav = scrollY < 50 || scrollDirection === "up";

    // Base quick actions
    const baseActions = [
      {
        icon: Home,
        label: "Home",
        href: "/",
        shortLabel: "Home",
      },
      {
        icon: Award,
        label: "Nominate",
        href: "/nominate",
        shortLabel: "Nominate",
      },
      {
        icon: Vote,
        label: "Vote",
        href: "/vote",
        shortLabel: "Vote",
      },
      {
        icon: Heart,
        label: "Donate",
        href: "/donate",
        shortLabel: "Donate",
      },
      {
        icon: Globe,
        label: "Explore",
        href: "/regions",
        shortLabel: "Explore",
      },
    ];

    // Role-specific actions
    const getRoleSpecificActions = () => {
      if (!user) return [];

      const actions = [];

      if (hasRole("ADMIN")) {
        actions.push({
          icon: LayoutDashboard,
          label: "Admin",
          href: "/admin",
          shortLabel: "Admin",
        });
      } else if (hasRole("NRC")) {
        actions.push({
          icon: Medal,
          label: "NRC",
          href: "/nrc",
          shortLabel: "NRC",
        });
      } else if (hasRole("jury")) {
        actions.push({
          icon: Sparkles,
          label: "Jury",
          href: "/jury",
          shortLabel: "Jury",
        });
      } else if (hasRole("NOMINEE")) {
        actions.push({
          icon: Star,
          label: "Nominee",
          href: "/nominee/dashboard",
          shortLabel: "Nom",
        });
      } else if (hasRole("FREE_MEMBER")) {
        actions.push({
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/dashboard",
          shortLabel: "Dash",
        });
      }

      return actions;
    };

    // Combine base and role-specific actions
    const allActions = [...baseActions, ...getRoleSpecificActions()];

    // Filter based on screen size (prioritize role-specific actions)
    const visibleActions = isSmallMobile
      ? allActions.slice(0, 4)
      : allActions.slice(0, 5);

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-charcoal/95 backdrop-blur-md border-t border-gold/20 transition-transform duration-300 safe-area-inset-bottom",
          showNav ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex justify-around items-center py-1 sm:py-2 px-1">
          {visibleActions.map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 p-1.5 sm:p-2 rounded-lg transition-all min-w-[52px] sm:min-w-[60px] min-h-[44px] sm:min-h-[52px] touch-manipulation active:scale-95",
                      location.pathname === item.href
                        ? "text-gold bg-gold/10"
                        : "text-white/60 hover:text-gold hover:bg-gold/5",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5 transition-transform",
                        location.pathname === item.href && "scale-110",
                        item.label === "Admin" && "text-red-400",
                        item.label === "NRC" && "text-purple-400",
                        item.label === "Jury" && "text-blue-400",
                        item.label === "Nominee" && "text-amber-400",
                      )}
                    />
                    <span className="text-[8px] sm:text-[10px] font-medium leading-tight">
                      {isSmallMobile && item.shortLabel
                        ? item.shortLabel
                        : item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <div className="flex items-center gap-2">
                    {item.label}
                    {item.label === "Admin" && (
                      <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                    {item.label === "NRC" && (
                      <span className="text-[8px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">
                        NRC
                      </span>
                    )}
                    {item.label === "Jury" && (
                      <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                        Jury
                      </span>
                    )}
                    {item.label === "Nominee" && (
                      <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">
                        Nominee
                      </span>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
  const { scrollDirection, scrollY } = useScrollDirection();
  const showHeader = scrollY < 50 || scrollDirection === "up";
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-charcoal/95 backdrop-blur-md border-b border-gold/20 transition-transform duration-300",
          !showHeader && "-translate-y-full",
        )}
      >
        <div className="container flex h-14 sm:h-16 lg:h-18 items-center justify-between px-2 sm:px-3 md:px-4">
          {/* Logo - Responsive sizing */}
          <Link to="/" className="flex items-center shrink-0 gap-1 sm:gap-2">
            <img
              src={nesaStamp}
              alt="NESA Africa"
              className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full object-contain"
            />
            <div
              className={cn(
                "flex-col leading-tight",
                isMobile ? "hidden" : "flex",
              )}
            >
              <span className="text-[6px] sm:text-[7px] lg:text-[8px] text-gold/70 font-medium tracking-[0.2em] uppercase whitespace-nowrap">
                {isTablet ? "NESA" : "New Education Standard Awards"}
              </span>
              <span className="text-xs sm:text-sm lg:text-base font-display font-bold text-gold tracking-wide">
                AFRICA
              </span>
              <span
                className={cn(
                  "text-[5px] sm:text-[6px] lg:text-[7px] text-white/50 font-medium tracking-wider italic",
                  isTablet && "hidden",
                )}
              >
                The African Blue-Garnet Awards for Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav onOpenCVOMessage={() => setCVOMessageOpen(true)} />

          {/* Tablet Navigation */}
          <TabletNav onOpenCVOMessage={() => setCVOMessageOpen(true)} />

          {/* Right Side */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
            {/* Language Selector - Hidden on smallest screens */}
            <LanguageSwitcher className="hidden sm:flex" />

            {/* User Menu (Desktop) */}
            <div className="hidden lg:block">
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
