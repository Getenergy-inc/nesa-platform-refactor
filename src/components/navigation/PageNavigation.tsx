// Book-style page navigation: top bar + bottom pagination + pages drawer
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Home,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAGE_SEQUENCE, getPageNavigation } from "@/config/page-sequence";

// ── Top Page Nav Bar ──────────────────────────────────────────────────────────

export function TopPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!nav.isKnown) return null;

  return (
    <>
      <div className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-gold/20">
        <div className="container flex items-center justify-between h-11 px-3 max-w-5xl mx-auto">
          {/* Left: Home */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-white/80 hover:text-gold transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/* Center: Page indicator + Pages button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 text-sm text-white/80 hover:text-gold transition-colors"
            >
              <List className="h-4 w-4" />
              <span>Pages</span>
            </button>
            <span className="text-xs text-white/50 font-mono">
              {nav.pageNumber} / {nav.totalPages}
            </span>
          </div>

          {/* Right: Back / Next */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={nav.isFirst}
              asChild={!nav.isFirst}
              className="h-8 px-2 text-white/80 hover:text-gold hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {nav.previousPage ? (
                <Link to={nav.previousPage.path}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Back</span>
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Back</span>
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={nav.isLast}
              asChild={!nav.isLast}
              className="h-8 px-2 text-white/80 hover:text-gold hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {nav.nextPage ? (
                <Link to={nav.nextPage.path}>
                  <span className="hidden sm:inline text-xs">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span>
                  <span className="hidden sm:inline text-xs">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Pages Drawer */}
      <PagesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPath={location.pathname}
      />
    </>
  );
}

// ── Bottom Pagination Bar ─────────────────────────────────────────────────────

export function BottomPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);

  if (!nav.isKnown) return null;

  // Generate visible page numbers (window around current)
  const pageNumbers = getVisiblePages(nav.currentIndex, nav.totalPages);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-md border-t border-gold/20 safe-area-inset-bottom">
      <div className="container flex items-center justify-between h-14 px-2 max-w-5xl mx-auto">
        {/* First + Previous */}
        <div className="flex items-center gap-0.5">
          <NavButton
            to={PAGE_SEQUENCE[0].path}
            disabled={nav.isFirst}
            label="First"
            icon={<ChevronsLeft className="h-4 w-4" />}
            hideLabel
          />
          <NavButton
            to={nav.previousPage?.path}
            disabled={nav.isFirst}
            label="Previous"
            icon={<ChevronLeft className="h-4 w-4" />}
          />
        </div>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, i) =>
            p === -1 ? (
              <span key={`ellipsis-${i}`} className="text-white/30 text-xs px-1">
                …
              </span>
            ) : (
              <Link
                key={p}
                to={PAGE_SEQUENCE[p].path}
                className={cn(
                  "flex items-center justify-center min-w-[32px] h-8 rounded-md text-xs font-medium transition-all",
                  p === nav.currentIndex
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-white/60 hover:text-gold hover:bg-gold/10 active:scale-95"
                )}
              >
                {p + 1}
              </Link>
            )
          )}
        </div>

        {/* Next + Last */}
        <div className="flex items-center gap-0.5">
          <NavButton
            to={nav.nextPage?.path}
            disabled={nav.isLast}
            label="Next"
            icon={<ChevronRight className="h-4 w-4" />}
            iconRight
          />
          <NavButton
            to={PAGE_SEQUENCE[nav.totalPages - 1].path}
            disabled={nav.isLast}
            label="Last"
            icon={<ChevronsRight className="h-4 w-4" />}
            hideLabel
          />
        </div>
      </div>
    </div>
  );
}

// ── Nav Button Helper ─────────────────────────────────────────────────────────

function NavButton({
  to,
  disabled,
  label,
  icon,
  iconRight,
  hideLabel,
}: {
  to?: string;
  disabled: boolean;
  label: string;
  icon: React.ReactNode;
  iconRight?: boolean;
  hideLabel?: boolean;
}) {
  const base =
    "flex items-center gap-1 h-10 px-2 sm:px-3 rounded-lg text-xs font-medium transition-all active:scale-95";
  const enabled = "text-white/80 hover:text-gold hover:bg-gold/10";
  const disabledStyle = "opacity-30 cursor-not-allowed pointer-events-none";

  if (disabled || !to) {
    return (
      <span className={cn(base, disabledStyle)}>
        {!iconRight && icon}
        {!hideLabel && <span className="hidden sm:inline">{label}</span>}
        {iconRight && icon}
      </span>
    );
  }

  return (
    <Link to={to} className={cn(base, enabled)}>
      {!iconRight && icon}
      {!hideLabel && <span className="hidden sm:inline">{label}</span>}
      {iconRight && icon}
    </Link>
  );
}

// ── Pages Drawer / Modal ──────────────────────────────────────────────────────

function PagesDrawer({
  open,
  onClose,
  currentPath,
}: {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}) {
  const navigate = useNavigate();

  // Group pages by section
  const sections = PAGE_SEQUENCE.reduce<Record<string, typeof PAGE_SEQUENCE>>(
    (acc, page) => {
      const s = page.section || "Other";
      if (!acc[s]) acc[s] = [];
      acc[s].push(page);
      return acc;
    },
    {}
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-[320px] sm:w-[360px] bg-charcoal border-l border-gold/20 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/20">
              <h2 className="text-gold font-display font-bold text-lg">
                All Pages
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/70 hover:text-gold hover:bg-gold/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Page List */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">
              {Object.entries(sections).map(([section, pages]) => (
                <div key={section}>
                  <h3 className="text-xs font-bold text-gold/60 uppercase tracking-wider mb-2">
                    {section}
                  </h3>
                  <div className="space-y-0.5">
                    {pages.map((page, i) => {
                      const globalIndex = PAGE_SEQUENCE.indexOf(page);
                      const isActive = currentPath === page.path;
                      return (
                        <button
                          key={page.path}
                          onClick={() => {
                            navigate(page.path);
                            onClose();
                          }}
                          className={cn(
                            "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-all text-left touch-manipulation",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-white/70 hover:bg-gold/10 hover:text-gold active:bg-gold/15"
                          )}
                        >
                          <span
                            className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0",
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-gold/10 text-gold/60"
                            )}
                          >
                            {globalIndex + 1}
                          </span>
                          <span className="truncate">{page.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Visible Page Numbers ──────────────────────────────────────────────────────

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: number[] = [];
  pages.push(0); // always show first

  if (current > 3) pages.push(-1); // ellipsis

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 4) pages.push(-1); // ellipsis

  pages.push(total - 1); // always show last

  return pages;
}
