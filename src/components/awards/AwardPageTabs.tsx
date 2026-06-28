import { useEffect, useState } from "react";

export interface AwardPageTab {
  id: string;
  label: string;
  href?: string; // if external/route link instead of in-page anchor
}

interface Props {
  tabs: AwardPageTab[];
}

/**
 * Sticky in-page navigation bar rendered directly under an award page hero.
 * Replaces the heavy mega-menu sublinks with per-page navigation that
 * scrolls to anchored sections (or routes externally when href is set).
 */
export function AwardPageTabs({ tabs }: Props) {
  const [active, setActive] = useState<string>(tabs[0]?.id ?? "");

  useEffect(() => {
    const ids = tabs.filter((t) => !t.href).map((t) => t.id);
    if (!ids.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tabs]);

  const handleClick = (e: React.MouseEvent, tab: AwardPageTab) => {
    if (tab.href) return;
    e.preventDefault();
    const el = document.getElementById(tab.id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(tab.id);
  };

  return (
    <nav
      aria-label="Award page sections"
      className="sticky top-16 z-30 -mt-2 border-y border-white/10 bg-charcoal/95 backdrop-blur supports-[backdrop-filter]:bg-charcoal/80"
    >
      <div className="container mx-auto px-4">
        <ul className="flex gap-1 overflow-x-auto scrollbar-none py-2 text-sm">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            const className = [
              "whitespace-nowrap rounded-full px-4 py-2 transition-colors",
              isActive
                ? "bg-gold text-charcoal font-semibold"
                : "text-white/75 hover:bg-white/10 hover:text-white",
            ].join(" ");
            return (
              <li key={tab.id}>
                <a
                  href={tab.href ?? `#${tab.id}`}
                  onClick={(e) => handleClick(e, tab)}
                  className={className}
                  aria-current={isActive ? "true" : undefined}
                >
                  {tab.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default AwardPageTabs;
