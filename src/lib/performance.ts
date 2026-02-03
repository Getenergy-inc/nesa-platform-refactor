// Performance utilities for faster loading

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  // Preload critical fonts
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];
  
  fontLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Preload a route on hover/focus
 */
export function createRoutePreloader(importFn: () => Promise<any>) {
  let preloaded = false;
  return () => {
    if (!preloaded) {
      preloaded = true;
      importFn();
    }
  };
}

/**
 * Defer non-critical work
 */
export function deferWork(fn: () => void, timeout = 0) {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn, { timeout });
  } else {
    setTimeout(fn, timeout);
  }
}

/**
 * Intersection Observer for lazy loading
 */
export function createLazyLoader(
  callback: () => void,
  options: IntersectionObserverInit = { rootMargin: '200px' }
) {
  let triggered = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        callback();
        observer.disconnect();
      }
    });
  }, options);
  
  return observer;
}

/**
 * Prefetch data for a route
 */
export async function prefetchData<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheTime = 5 * 60 * 1000 // 5 minutes
): Promise<T | null> {
  const cacheKey = `prefetch_${key}`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheTime) {
      return data as T;
    }
  }
  
  try {
    const data = await fetcher();
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    return data;
  } catch {
    return null;
  }
}

/**
 * Image preloader
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch multiple preloads
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.allSettled(srcs.map(preloadImage));
}

/**
 * Network-aware loading strategy
 */
export function getNetworkStrategy(): 'fast' | 'slow' | 'offline' {
  const connection = (navigator as any).connection;
  
  if (!navigator.onLine) return 'offline';
  
  if (connection) {
    const { effectiveType, saveData } = connection;
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'slow';
    }
  }
  
  return 'fast';
}

/**
 * Optimize QueryClient settings
 */
export const optimizedQueryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
};
