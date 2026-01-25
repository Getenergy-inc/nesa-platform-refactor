// Main Navigation Component
// Responsive navbar with dropdown menus for NESA-Africa

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Globe, User, LogOut } from "lucide-react";
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

// ============================================================================
// DESKTOP NAVIGATION
// ============================================================================

function DesktopNav() {
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
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-charcoal border border-gold/20">
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

function MobileNav() {
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:text-gold hover:bg-gold/10"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-charcoal border-l border-gold/20 p-0">
        <SheetHeader className="p-4 border-b border-gold/20">
          <SheetTitle className="flex items-center gap-2">
            <NESALogo variant="icon" size="sm" />
            <span className="text-gold font-display">Menu</span>
          </SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {/* Quick Links */}
            <div className="px-4 pb-4 border-b border-gold/10">
              <div className="grid grid-cols-3 gap-2">
                {MOBILE_NAV.slice(0, 6).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-lg text-center transition-colors",
                      "hover:bg-gold/10 hover:text-gold",
                      location.pathname === item.href ? "bg-gold/10 text-gold" : "text-white/70"
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="text-xs">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Full Navigation */}
            <div className="py-2">
              {MAIN_NAV.map((item) => (
                <div key={item.href} className="border-b border-gold/5">
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.href)}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3 text-left transition-colors",
                          "hover:bg-gold/5",
                          expandedItems.includes(item.href) ? "text-gold" : "text-white/90"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon && <item.icon className="h-4 w-4" />}
                          {item.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems.includes(item.href) && "rotate-180"
                          )}
                        />
                      </button>
                      {expandedItems.includes(item.href) && (
                        <div className="bg-charcoal-light/30 py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={handleLinkClick}
                              className={cn(
                                "flex items-center gap-2 px-8 py-2.5 text-sm transition-colors",
                                "hover:bg-gold/5 hover:text-gold",
                                location.pathname === child.href ? "text-gold" : "text-white/70"
                              )}
                            >
                              {child.icon && <child.icon className="h-4 w-4" />}
                              <span>{child.label}</span>
                              {child.badge && (
                                <span className="ml-auto text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 transition-colors",
                        "hover:bg-gold/5 hover:text-gold",
                        location.pathname === item.href ? "text-gold" : "text-white/90"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div className="mt-auto border-t border-gold/20 p-4">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-red-400 hover:bg-red-400/10"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={handleLinkClick} className="flex-1">
                  <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={handleLinkClick} className="flex-1">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
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
// USER MENU (Desktop)
// ============================================================================

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
        <Button variant="ghost" size="icon" className="text-white hover:text-gold hover:bg-gold/10">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-charcoal border-gold/20">
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
// MAIN NAVIGATION HEADER
// ============================================================================

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-charcoal/95 backdrop-blur-md border-b border-gold/20">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <NESALogo variant="full" size="md" />
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Right Side */}
        <div className="flex items-center gap-2">
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
          <UserMenu />

          {/* Mobile Menu */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export default MainNav;
