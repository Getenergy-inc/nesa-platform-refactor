// SmartLink — a drop-in <Link> that prefetches its target route chunk on
// intent: hover/focus on pointer devices, viewport-visible on touch devices.
//
// Use for primary navigation links, category/pathway cards and nominee cards.
// It renders exactly what react-router's <Link> renders, so styling and a11y
// behaviour are unchanged.

import { forwardRef, useEffect, useRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import { prefetchRoute, isCoarsePointer } from "@/lib/routePrefetch";

export interface SmartLinkProps extends LinkProps {
  /** Disable viewport-based prefetching (still prefetches on hover/focus). */
  prefetchOnVisible?: boolean;
}

export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(
  ({ to, prefetchOnVisible = true, onMouseEnter, onFocus, ...rest }, ref) => {
    const innerRef = useRef<HTMLAnchorElement | null>(null);
    const href = typeof to === "string" ? to : (to?.pathname ?? "");

    useEffect(() => {
      if (!prefetchOnVisible || !href) return;
      if (!isCoarsePointer()) return; // desktop uses hover/focus instead
      const el = innerRef.current;
      if (!el || typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            prefetchRoute(href);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [href, prefetchOnVisible]);

    return (
      <Link
        {...rest}
        to={to}
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLAnchorElement | null>).current = node;
        }}
        onMouseEnter={(e) => {
          prefetchRoute(href);
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          prefetchRoute(href);
          onFocus?.(e);
        }}
      />
    );
  },
);

SmartLink.displayName = "SmartLink";

export default SmartLink;
