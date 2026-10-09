import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SubcategoryTab {
  slug: string; // "" => All
  name: string;
  count: number;
}

interface Props {
  tabs: SubcategoryTab[];
  activeSlug: string;
  onChange: (slug: string) => void;
  className?: string;
}

/**
 * Netflix-style horizontally scrollable subcategory tabs with floating
 * circular nav arrows. Sticky-on-scroll, active highlighted in gold.
 */
export function SubcategoryTabs({ tabs, activeSlug, onChange, className }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [tabs.length]);

  // Auto-scroll active tab into view
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLButtonElement>(`[data-slug="${activeSlug || "all"}"]`);
    if (active) {
      const offset = active.offsetLeft - el.clientWidth / 2 + active.clientWidth / 2;
      el.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  }, [activeSlug]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "sticky top-16 z-30 -mx-4 md:mx-0 mb-6 backdrop-blur-md bg-charcoal/85 border-y border-gold/10 md:border md:rounded-2xl py-3 px-3 md:px-4",
        className,
      )}
    >
      <div className="relative">
        {/* Left arrow */}
        {canLeft && (
          <button
            type="button"
            aria-label="Scroll subcategories left"
            onClick={() => scrollBy(-1)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-9 h-9 rounded-full bg-charcoal-light border border-gold/30 text-gold items-center justify-center hover:bg-gold hover:text-charcoal transition-all shadow-lg shadow-charcoal/50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right arrow */}
        {canRight && (
          <button
            type="button"
            aria-label="Scroll subcategories right"
            onClick={() => scrollBy(1)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-9 h-9 rounded-full bg-charcoal-light border border-gold/30 text-gold items-center justify-center hover:bg-gold hover:text-charcoal transition-all shadow-lg shadow-charcoal/50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-charcoal to-transparent z-[5]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-charcoal to-transparent z-[5]" />

        <div
          ref={scrollerRef}
          className="flex gap-2 overflow-x-auto scroll-smooth px-2 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((t) => {
            const isAll = t.slug === "";
            const active = activeSlug === t.slug;
            return (
              <button
                key={t.slug || "all"}
                data-slug={t.slug || "all"}
                onClick={() => onChange(t.slug)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all border",
                  active
                    ? "bg-gold text-charcoal border-gold shadow-md shadow-gold/30"
                    : "bg-charcoal-light/60 text-ivory/75 border-gold/15 hover:border-gold/40 hover:text-gold",
                )}
              >
                <span className="max-w-[220px] truncate">{isAll ? "All" : t.name}</span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    active ? "bg-charcoal/20 text-charcoal" : "bg-gold/15 text-gold",
                  )}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
