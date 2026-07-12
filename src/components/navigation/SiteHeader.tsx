// NESA-Africa SiteHeader — single canonical public header.
// Layers: SkipLink + UtilityBar + Brand/MainNav + Nominate CTA.
// Shared data source: src/config/siteNavigation.ts (desktop + mobile).

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, LogIn, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/i18n";
import { SITE_NAV, NOMINATE_CTA, type NavItem } from "@/config/siteNavigation";
import { trackEvent } from "@/lib/analytics";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-charcoal focus:rounded-md focus:font-semibold"
    >
      Skip to main content
    </a>
  );
}

function AccountActions() {
  // Inline desktop account actions rendered next to Nominate.
  // Signed-out: EN + Sign In. Signed-in: My Account + EN + Sign Out.
  const { user, signOut } = useAuth();
  const linkCls =
    "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-white/85 hover:text-gold hover:bg-gold/10 transition-colors";
  return (
    <div className="hidden min-[1100px]:flex items-center gap-1">
      {user ? (
        <>
          <Link
            to="/account"
            className={linkCls}
            onClick={() => trackEvent("account_click", { href: "/account" })}
          >
            <UserCircle2 className="h-4 w-4" aria-hidden /> My Account
          </Link>
          <LanguageSwitcher className="text-sm" />
          <button
            type="button"
            onClick={async () => { trackEvent("sign_out_click", {}); await signOut(); }}
            className={linkCls}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign Out
          </button>
        </>
      ) : (
        <>
          <LanguageSwitcher className="text-sm" />
          <Link
            to="/login"
            className={linkCls}
            onClick={() => trackEvent("sign_in_click", { href: "/login" })}
          >
            <LogIn className="h-4 w-4" aria-hidden /> Sign In
          </Link>
        </>
      )}
    </div>
  );
}

function BrandBlock() {
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0 group" aria-label="NESA-Africa home">
      <img
        src={nesaStamp}
        alt=""
        className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover ring-1 ring-gold/40"
      />
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="font-playfair text-gold text-lg lg:text-xl font-bold">NESA-Africa</span>
        <span className="text-[10px] lg:text-[11px] text-white/70 -mt-0.5">
          NESA-Africa 2026 · The African Gold-Blue Garnet Recognition for Education
        </span>
      </div>
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const bare = href.split("#")[0].split("?")[0];
  return pathname === bare || pathname.startsWith(bare + "/");
}

function DesktopNav() {
  const location = useLocation();
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";
  return (
    <NavigationMenu className="hidden min-[1100px]:flex" aria-label="Primary">
      <NavigationMenuList className="gap-1">
        {SITE_NAV.map((item) => {
          const active = isActive(location.pathname, item.href);
          const cls = cn(
            "px-3 py-2 text-sm font-medium rounded-md transition-colors",
            focusRing,
            active ? "text-gold bg-gold/10" : "text-white/85 hover:text-gold hover:bg-gold/5",
          );
          if (!item.children) {
            return (
              <NavigationMenuItem key={item.href}>
                <Link
                  to={item.href}
                  className={cls}
                  aria-current={active ? "page" : undefined}
                  onClick={() => trackEvent("header_navigation_click", { label: item.label, href: item.href })}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            );
          }
          const groupLabelId = `nav-group-${item.href.replace(/[^a-z0-9]+/gi, "-")}`;
          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuTrigger
                className={cn(cls, "bg-transparent data-[state=open]:bg-gold/10 data-[state=open]:text-gold")}
                onClick={() => trackEvent("dropdown_open", { label: item.label })}
              >
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul
                  className="grid w-[300px] gap-1 p-2 bg-charcoal border border-gold/20"
                  aria-labelledby={groupLabelId}
                >
                  <li id={groupLabelId} className="sr-only">
                    {item.label} submenu
                  </li>
                  {item.children.map((c) => {
                    const childActive = isActive(location.pathname, c.href);
                    return (
                      <li key={c.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={c.href}
                            aria-current={childActive ? "page" : undefined}
                            onClick={() =>
                              trackEvent("dropdown_item_click", {
                                parent: item.label,
                                label: c.label,
                                href: c.href,
                              })
                            }
                            className={cn(
                              "block px-3 py-2 rounded-md text-sm hover:text-gold hover:bg-gold/10",
                              focusRing,
                              childActive ? "text-gold bg-gold/10" : "text-white/85",
                            )}
                          >
                            {c.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function NominateButton({ className }: { className?: string }) {
  return (
    <Button
      asChild
      className={cn("bg-gold text-charcoal hover:bg-gold/90 font-semibold shadow-sm", className)}
    >
      <Link
        to={NOMINATE_CTA.href}
        onClick={() => trackEvent("nominate_cta_click", { href: NOMINATE_CTA.href })}
      >
        {NOMINATE_CTA.label}
      </Link>
    </Button>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);
  const linkCls = "block px-3 py-2 rounded text-sm text-white/85 hover:text-gold hover:bg-gold/10";

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); trackEvent(v ? "mobile_menu_open" : "mobile_menu_close", {}); }}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          aria-expanded={open}
          className="min-[1100px]:hidden text-white hover:text-gold hover:bg-gold/10 min-h-11 min-w-11"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[92vw] sm:w-[380px] bg-charcoal border-l border-gold/20 p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b border-gold/20">
          <SheetTitle className="text-gold text-left">NESA-Africa 2026</SheetTitle>
        </SheetHeader>
        <div className="p-3">
          <NominateButton className="w-full mb-3" />
          <nav aria-label="Mobile primary">
            <Accordion type="single" collapsible className="w-full">
              {SITE_NAV.map((item) => (
                item.children ? (
                  <AccordionItem key={item.href} value={item.href} className="border-gold/15">
                    <AccordionTrigger className="text-white hover:text-gold px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <Link
                        to={item.href}
                        onClick={close}
                        aria-current={isActive(location.pathname, item.href) ? "page" : undefined}
                        className={cn(linkCls, "font-semibold text-gold/90")}
                      >
                        {item.label} overview
                      </Link>
                      {item.children.map((c) => {
                        const childActive = isActive(location.pathname, c.href);
                        return (
                          <Link
                            key={c.href}
                            to={c.href}
                            onClick={close}
                            aria-current={childActive ? "page" : undefined}
                            className={cn(linkCls, childActive && "text-gold bg-gold/10")}
                          >
                            {c.label}
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div key={item.href} className="border-b border-gold/15">
                    <Link
                      to={item.href}
                      onClick={close}
                      aria-current={isActive(location.pathname, item.href) ? "page" : undefined}
                      className="block px-3 py-3 text-sm text-white hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md"
                    >
                      {item.label}
                    </Link>
                  </div>
                )
              ))}
            </Accordion>
          </nav>

          <div className="mt-4 border-t border-gold/20 pt-3 space-y-1">
            {user ? (
              <>
                <Link to="/account" onClick={close} className={linkCls}>My Account</Link>
                <div className="px-3 py-2"><LanguageSwitcher /></div>
                <button
                  type="button"
                  onClick={async () => { close(); await signOut(); }}
                  className={cn(linkCls, "w-full text-left")}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="px-3 py-2"><LanguageSwitcher /></div>
                <Link to="/login" onClick={close} className={linkCls}>Sign In</Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  return (
    <>
      <SkipLink />
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur border-b border-gold/20"
      >
        <div className="container mx-auto px-4 flex items-center justify-between gap-3 h-14 lg:h-16">
          <BrandBlock />
          <DesktopNav />
          <div className="flex items-center gap-2">
            <NominateButton className="hidden sm:inline-flex" />
            <NominateButton className="sm:hidden text-xs px-3 py-1.5 h-9" />
            <AccountActions />
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}

export default SiteHeader;
