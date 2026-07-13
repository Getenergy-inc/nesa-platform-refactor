// NESA-Africa SiteHeader — single canonical public header.
// Layers: SkipLink · AnnouncementBar · Brand · 6-group nav · Search · Nominate · Phase CTA · Language · Sign In.
// Shared data source: src/config/siteNavigation.ts (desktop + mobile drawer).

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
import { SITE_NAV, type NavItem, type NavChild, type NavSection } from "@/config/siteNavigation";
import { CURRENT_PHASE, NOMINATE_CTA } from "@/config/campaignPhase";
import { trackNav } from "@/lib/analytics";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { EducationEnablersMegaMenu } from "@/components/navigation/EducationEnablersMegaMenu";
import { NavSearch } from "@/components/navigation/NavSearch";
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

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const bare = href.split("#")[0].split("?")[0];
  return pathname === bare || pathname.startsWith(bare + "/");
}

function BrandBlock() {
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0 group" aria-label="NESA-Africa home">
      <img
        src={nesaStamp}
        alt=""
        className="h-10 w-10 lg:h-11 lg:w-11 rounded-full object-cover ring-1 ring-gold/40"
      />
      <div className="hidden sm:flex flex-col leading-tight min-w-0">
        <span className="font-playfair text-gold text-base lg:text-lg font-bold whitespace-nowrap">NESA-Africa</span>
        <span className="hidden min-[1700px]:block text-[10px] text-white/70 -mt-0.5 whitespace-nowrap">
          Africa's Education Recognition & Impact Platform
        </span>

      </div>
    </Link>
  );
}

/* ------------------------- Desktop dropdown panels ------------------------ */

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

function DropdownSimple({ item }: { item: NavItem }) {
  const location = useLocation();
  return (
    <ul className="grid w-[300px] gap-1 p-2 bg-charcoal border border-gold/20">
      {item.children!.map((c) => {
        const active = isActive(location.pathname, c.href);
        return (
          <li key={c.href}>
            <NavigationMenuLink asChild>
              <Link
                to={c.href}
                aria-current={active ? "page" : undefined}
                onClick={() =>
                  trackNav("dropdown_item_click", {
                    parent: item.label,
                    label: c.label,
                    href: c.href,
                    section: item.analyticsId,
                    device: "desktop",
                  })
                }
                className={cn(
                  "block px-3 py-2 rounded-md text-sm hover:text-gold hover:bg-gold/10",
                  FOCUS_RING,
                  active ? "text-gold bg-gold/10" : "text-white/85",
                )}
              >
                {c.label}
              </Link>
            </NavigationMenuLink>
          </li>
        );
      })}
    </ul>
  );
}

function DropdownSectioned({ item }: { item: NavItem }) {
  const location = useLocation();
  const sections = item.sections!;
  const cols = sections.length;
  const widthCls =
    cols >= 3 ? "w-[min(96vw,880px)]" : cols === 2 ? "w-[min(96vw,640px)]" : "w-[380px]";
  return (
    <div className={cn(widthCls, "bg-charcoal border border-gold/20 p-4")}>
      <div
        className={cn(
          "grid gap-4",
          cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3",
        )}
      >
        {sections.map((sec: NavSection) => (
          <div key={sec.title}>
            <h3 className="text-[11px] uppercase tracking-wider text-gold/80 font-semibold mb-2 px-2">
              {sec.title}
            </h3>
            <ul className="space-y-0.5">
              {sec.items.map((c: NavChild) => {
                const active = isActive(location.pathname, c.href);
                return (
                  <li key={c.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={c.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() =>
                          trackNav("dropdown_item_click", {
                            parent: item.label,
                            section: sec.title,
                            label: c.label,
                            href: c.href,
                            device: "desktop",
                          })
                        }
                        className={cn(
                          "block px-2 py-1.5 rounded text-[13px] leading-snug hover:text-gold hover:bg-gold/10",
                          FOCUS_RING,
                          active ? "text-gold bg-gold/10" : "text-white/85",
                        )}
                      >
                        {c.label}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopNav() {
  const location = useLocation();
  return (
    <NavigationMenu className="hidden min-[1360px]:flex mx-auto" aria-label="Primary">
      <NavigationMenuList className="gap-0.5 flex-nowrap">

        {SITE_NAV.map((item) => {
          const active = isActive(location.pathname, item.href);
          const triggerCls = cn(
            "px-2.5 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
            FOCUS_RING,
            active ? "text-gold bg-gold/10" : "text-white/85 hover:text-gold hover:bg-gold/5",
          );


          const hasPanel = !!(item.children || item.sections || item.megaMenu);
          if (!hasPanel) {
            return (
              <NavigationMenuItem key={item.href}>
                <Link
                  to={item.href}
                  className={triggerCls}
                  aria-current={active ? "page" : undefined}
                  onClick={() =>
                    trackNav("nav_click", {
                      label: item.label,
                      href: item.href,
                      section: item.analyticsId,
                      device: "desktop",
                    })
                  }
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuTrigger
                className={cn(
                  triggerCls,
                  "bg-transparent data-[state=open]:bg-gold/10 data-[state=open]:text-gold",
                )}
                onClick={() =>
                  trackNav("dropdown_open", {
                    label: item.label,
                    section: item.analyticsId,
                    device: "desktop",
                  })
                }
              >
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {item.megaMenu === "education-enablers" ? (
                  <EducationEnablersMegaMenu />
                ) : item.sections ? (
                  <DropdownSectioned item={item} />
                ) : (
                  <DropdownSimple item={item} />
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/* --------------------------------- CTAs --------------------------------- */

function NominateButton({ className }: { className?: string }) {
  return (
    <Button
      asChild
      className={cn("bg-gold text-charcoal hover:bg-gold/90 font-semibold shadow-sm", className)}
    >
      <Link
        to={NOMINATE_CTA.href}
        onClick={() =>
          trackNav("nominate_now_click", {
            href: NOMINATE_CTA.href,
            phase: CURRENT_PHASE.phase,
            device: "desktop",
          })
        }
      >
        {NOMINATE_CTA.label}
      </Link>
    </Button>
  );
}

function SecondaryPhaseCTA({ className }: { className?: string }) {
  const cta = CURRENT_PHASE.secondary;
  // In voting/gala phase, promote the phase-primary as the secondary button
  // (Nominate stays primary if phase === "nomination"; otherwise the primary
  // phase action becomes the visible secondary next to Nominate).
  const shown =
    CURRENT_PHASE.phase === "nomination" ? cta : CURRENT_PHASE.primary;
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "hidden min-[1700px]:inline-flex border-gold/60 text-gold hover:bg-gold/10 hover:text-gold whitespace-nowrap",
        className,
      )}

    >
      <Link
        to={shown.href}
        onClick={() =>
          trackNav("secondary_cta_click", {
            href: shown.href,
            label: shown.label,
            phase: CURRENT_PHASE.phase,
            device: "desktop",
          })
        }
      >
        {shown.label}
      </Link>
    </Button>
  );
}

function AccountActions() {
  const { user, signOut } = useAuth();
  const linkCls =
    "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-white/85 hover:text-gold hover:bg-gold/10 transition-colors";
  return (
    <div className="hidden min-[1360px]:flex items-center gap-1">
      {user ? (
        <>
          <Link
            to="/account"
            className={linkCls}
            onClick={() => trackNav("account_click", { href: "/account", device: "desktop" })}
          >
            <UserCircle2 className="h-4 w-4" aria-hidden /> My Account
          </Link>
          <LanguageSwitcher className="text-sm" />
          <button
            type="button"
            onClick={async () => {
              trackNav("sign_out_click", { device: "desktop" });
              await signOut();
            }}
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
            onClick={() => trackNav("sign_in_click", { href: "/login", device: "desktop" })}
          >
            <LogIn className="h-4 w-4" aria-hidden /> Sign In
          </Link>
        </>
      )}
    </div>
  );
}

/* ------------------------------ Mobile drawer ----------------------------- */

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

  const renderChildren = (item: NavItem) => {
    if (item.sections) {
      return item.sections.map((sec) => (
        <div key={sec.title} className="mt-2">
          <div className="px-3 text-[10px] uppercase tracking-wider text-gold/70 font-semibold">
            {sec.title}
          </div>
          {sec.items.map((c) => (
            <Link
              key={c.href}
              to={c.href}
              onClick={() => {
                close();
                trackNav("mobile_drawer_item_click", {
                  parent: item.label,
                  section: sec.title,
                  label: c.label,
                  href: c.href,
                  device: "mobile",
                });
              }}
              aria-current={isActive(location.pathname, c.href) ? "page" : undefined}
              className={cn(linkCls, isActive(location.pathname, c.href) && "text-gold bg-gold/10")}
            >
              {c.label}
            </Link>
          ))}
        </div>
      ));
    }
    if (item.children) {
      return item.children.map((c) => (
        <Link
          key={c.href}
          to={c.href}
          onClick={() => {
            close();
            trackNav("mobile_drawer_item_click", {
              parent: item.label,
              label: c.label,
              href: c.href,
              device: "mobile",
            });
          }}
          aria-current={isActive(location.pathname, c.href) ? "page" : undefined}
          className={cn(linkCls, isActive(location.pathname, c.href) && "text-gold bg-gold/10")}
        >
          {c.label}
        </Link>
      ));
    }
    if (item.megaMenu === "education-enablers") {
      return (
        <>
          <Link to="/education-enablers" onClick={close} className={cn(linkCls, "font-semibold text-gold/90")}>
            Education Enablers Overview
          </Link>
          <div className="px-3 text-[10px] uppercase tracking-wider text-gold/70 font-semibold mt-2">
            Browse by African REC
          </div>
          <Link to="/education-enablers/regions" onClick={close} className={linkCls}>All 8 RECs</Link>
          <div className="px-3 text-[10px] uppercase tracking-wider text-gold/70 font-semibold mt-2">
            Browse by Sector
          </div>
          <Link to="/education-enablers/sectors" onClick={close} className={linkCls}>All 20 Sectors</Link>
          <div className="px-3 text-[10px] uppercase tracking-wider text-gold/70 font-semibold mt-2">
            EdTech
          </div>
          <Link to="/education-enablers/edtech" onClick={close} className={linkCls}>EdTech Education Enablers</Link>
          <Link to="/nominate" onClick={close} className={cn(linkCls, "text-gold font-semibold")}>
            Nominate an Education Enabler
          </Link>
        </>
      );
    }
    return null;
  };

  const secondary =
    CURRENT_PHASE.phase === "nomination" ? CURRENT_PHASE.secondary : CURRENT_PHASE.primary;

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        trackNav(v ? "mobile_drawer_open" : "mobile_drawer_close", { device: "mobile" });
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="min-[1360px]:hidden text-white hover:text-gold hover:bg-gold/10 min-h-11 min-w-11"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[92vw] sm:w-[380px] bg-charcoal border-l border-gold/20 p-0 overflow-y-auto"
      >
        <SheetHeader className="p-4 border-b border-gold/20">
          <SheetTitle className="text-gold text-left">NESA-Africa 2026</SheetTitle>
        </SheetHeader>
        <div className="p-3">
          <div className="mb-3"><NavSearch className="!h-9 !w-full" /></div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <NominateButton className="w-full" />
            <Button
              asChild
              variant="outline"
              className="w-full border-gold/60 text-gold hover:bg-gold/10"
            >
              <Link
                to={secondary.href}
                onClick={() =>
                  trackNav("secondary_cta_click", {
                    href: secondary.href,
                    label: secondary.label,
                    phase: CURRENT_PHASE.phase,
                    device: "mobile",
                  })
                }
              >
                {secondary.label}
              </Link>
            </Button>
          </div>

          <Link
            to="/"
            onClick={close}
            className={cn(linkCls, "border-b border-gold/15", isActive(location.pathname, "/") && "text-gold")}
          >
            Home
          </Link>

          <nav aria-label="Mobile primary">
            <Accordion type="single" collapsible className="w-full">
              {SITE_NAV.map((item) => {
                const hasPanel = !!(item.children || item.sections || item.megaMenu);
                if (!hasPanel) {
                  return (
                    <div key={item.href} className="border-b border-gold/15">
                      <Link
                        to={item.href}
                        onClick={close}
                        aria-current={isActive(location.pathname, item.href) ? "page" : undefined}
                        className="block px-3 py-3 text-sm text-white hover:text-gold rounded-md"
                      >
                        {item.label}
                      </Link>
                    </div>
                  );
                }
                return (
                  <AccordionItem key={item.href} value={item.href} className="border-gold/15">
                    <AccordionTrigger className="text-white hover:text-gold px-3 text-sm rounded-md">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <Link
                        to={item.href}
                        onClick={close}
                        className={cn(linkCls, "font-semibold text-gold/90")}
                      >
                        {item.label} overview
                      </Link>
                      {renderChildren(item)}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
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

/* ---------------------------------- Root ---------------------------------- */

export function SiteHeader() {
  return (
    <>
      <SkipLink />
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur border-b border-gold/20"
      >
        <AnnouncementBar />
        <div className="container mx-auto px-4 flex items-center justify-between gap-3 h-14 lg:h-16">
          <BrandBlock />
          <DesktopNav />
          <div className="flex items-center gap-2 shrink-0">
            <NavSearch className="hidden sm:inline-flex" />
            <NominateButton className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-9 sm:h-10 whitespace-nowrap" />
            <SecondaryPhaseCTA />
            <AccountActions />
            <MobileMenu />
          </div>
        </div>

      </header>
    </>
  );
}

export default SiteHeader;
