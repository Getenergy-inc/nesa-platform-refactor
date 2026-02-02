import { useEffect, useRef, useState, ReactNode, Suspense } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

/**
 * LazySection - Only renders children when section enters viewport
 * Reduces initial page load and improves FCP/LCP
 */
export function LazySection({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "200px 0px",
  className = "",
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback || <SectionSkeleton />}>
          {children}
        </Suspense>
      ) : (
        fallback || <SectionSkeleton />
      )}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="py-16 md:py-20">
      <div className="container">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-white/5 rounded-lg mx-auto" />
          <div className="h-4 w-96 max-w-full bg-white/5 rounded mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LazySection;
