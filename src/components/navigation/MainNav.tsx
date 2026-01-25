// Main Navigation Component
// Responsive navbar with dropdown menus for NESA-Africa

import { useState, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Globe, User, LogOut, Home, Award, Ticket, Play, Heart } from "lucide-react";
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
import { MAIN_NAV, MOBILE_NAV, type NavItem } from "@/config/navigation";
import { NESALogo } from "@/components/nesa/NESALogo";
import { CVOFlashMessage, CVOMessageTrigger } from "@/components/nesa/CVOFlashMessage";

// ============================================================================
// DESKTOP NAVIGATION
// ============================================================================

function DesktopNav({ onOpenCVOMessage }: { onOpenCVOMessage: () => void }) {
  const location = useLocation();

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {MAIN_NAV.map((item) => (
          <NavigationMenuItem key={item.href}>
            {item.children ? (
              <>
                <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-gold hover:bg-gold/10 data-[state=open]:bg-gold/10 data-[state=open]:text-gold">
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className={cn(
                    "grid gap-3 p-4 bg-charcoal border border-gold/20",
                    item.label === "About" 
                      ? "w-[420px]" 
                      : "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
                  )}>
                    {/* CVO Message Trigger - Only for About menu */}
                    {item.label === "About" && (
                      <li className="col-span-full border-b border-gold/10 pb-3 mb-1">
                        <CVOMessageTrigger onClick={onOpenCVOMessage} variant="dropdown" />
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
                              location.pathname === child.href && "bg-gold/10 text-gold"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {child.icon && <child.icon className="h-4 w-4 text-gold" />}
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
              <Link to={item.href}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white/90 hover:text-gold hover:bg-gold/10",
                    location.pathname === item.href && "text-gold bg-gold/10"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  {item.label}
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
// MOBILE NAVIGATION
// ============================================================================

function MobileNav({ onOpenCVOMessage }: { onOpenCVOMessage: () => void }) {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleCVOClick = () => {
    setOpen(false);
    onOpenCVOMessage();
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
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[350px] bg-charcoal border-l border-gold/20 p-0 overflow-hidden">
        <SheetHeader className="p-4 border-b border-gold/20">
          <SheetTitle className="flex items-center gap-2">
            <NESALogo variant="icon" size="sm" />
            <span className="text-gold font-display">Menu</span>
          </SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Quick Action Grid */}
            <div className="px-4 py-4 border-b border-gold/10">
              <div className="grid grid-cols-3 gap-3">
                {MOBILE_NAV.slice(0, 6).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all active:scale-95",
                      "hover:bg-gold/10 hover:text-gold min-h-[72px] touch-manipulation",
                      location.pathname === item.href ? "bg-gold/10 text-gold" : "text-white/70"
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="text-xs font-medium leading-tight">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Full Navigation */}
            <div className="py-2">
              {MAIN_NAV.map((item) => (
                <div key={item.href} className="border-b border-gold/5 last:border-b-0">
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.href)}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-4 text-left transition-colors touch-manipulation",
                          "hover:bg-gold/5 active:bg-gold/10",
                          expandedItems.includes(item.href) ? "text-gold bg-gold/5" : "text-white/90"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon && <item.icon className="h-5 w-5" />}
                          <span className="font-medium">{item.label}</span>
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            expandedItems.includes(item.href) && "rotate-180"
                          )}
                        />
                      </button>
                      <div className={cn(
                        "overflow-hidden transition-all duration-200",
                        expandedItems.includes(item.href) ? "max-h-[500px]" : "max-h-0"
                      )}>
                        <div className="bg-charcoal-light/30 py-2">
                          {/* CVO Message for About menu in mobile */}
                          {item.label === "About" && (
                            <div className="px-4 py-3 border-b border-gold/10 mb-1">
                              <CVOMessageTrigger onClick={handleCVOClick} variant="dropdown" />
                            </div>
                          )}
                          
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={handleLinkClick}
                              className={cn(
                                "flex items-center gap-3 px-8 py-3.5 text-sm transition-colors touch-manipulation",
                                "hover:bg-gold/5 hover:text-gold active:bg-gold/10",
                                location.pathname === child.href ? "text-gold bg-gold/5" : "text-white/70"
                              )}
                            >
                              {child.icon && <child.icon className="h-4 w-4 flex-shrink-0" />}
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
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-3 px-4 py-4 transition-colors touch-manipulation",
                        "hover:bg-gold/5 hover:text-gold active:bg-gold/10",
                        location.pathname === item.href ? "text-gold bg-gold/5" : "text-white/90"
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
              <div className="flex gap-3">
                <Link to="/login" onClick={handleLinkClick} className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 text-primary hover:bg-primary/10 py-3 h-auto touch-manipulation"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={handleLinkClick} className="flex-1">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 h-auto touch-manipulation">
                    Get Started
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

const UserMenuButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  (props, ref) => (
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
  )
);
UserMenuButton.displayName = "UserMenuButton";

function UserMenu() {
  const { user, signOut, hasRole } = useAuth();

  if (!user) {
    return (
      <div className="hidden lg:flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost" className="text-white/90 hover:text-gold hover:bg-gold/10">
            Sign In
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
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
      <DropdownMenuContent align="end" className="w-56 bg-charcoal border-gold/20 z-50">
        <div className="px-2 py-1.5 text-sm text-white/60">
          {user.email}
        </div>
        <DropdownMenuSeparator className="bg-gold/10" />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer text-white hover:text-gold hover:bg-gold/10">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        {hasRole("nrc") && (
          <DropdownMenuItem asChild>
            <Link to="/nrc" className="cursor-pointer text-white hover:text-gold hover:bg-gold/10">
              NRC Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        {hasRole("jury") && (
          <DropdownMenuItem asChild>
            <Link to="/jury" className="cursor-pointer text-white hover:text-gold hover:bg-gold/10">
              Jury Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        {hasRole("admin") && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer text-white hover:text-gold hover:bg-gold/10">
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
  { icon: Ticket, label: "Tickets", href: "/tickets" },
  { icon: Play, label: "Watch", href: "/media/tv" },
  { icon: Heart, label: "Donate", href: "/donate" },
];

export function MobileBottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-charcoal/95 backdrop-blur-md border-t border-gold/20 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-2">
        {mobileQuickActions.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[56px] touch-manipulation",
              "hover:bg-gold/10 active:scale-95",
              location.pathname === item.href ? "text-gold" : "text-white/60"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

// ============================================================================
// MAIN NAVIGATION HEADER
// ============================================================================

export function MainNav() {
  const [cvoMessageOpen, setCVOMessageOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-charcoal/95 backdrop-blur-md border-b border-gold/20">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <NESALogo variant="full" size="md" className="h-8 sm:h-10" />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav onOpenCVOMessage={() => setCVOMessageOpen(true)} />

          {/* Right Side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Selector */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-white/90 hover:text-gold hover:bg-gold/10 gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">EN</span>
            </Button>

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
