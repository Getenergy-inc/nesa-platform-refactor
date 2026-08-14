// Global recovery for stale dynamic-import chunks after a new deploy.
//
// When a new build is published, previously-served HTML/JS shells reference
// chunk filenames (with old content hashes) that no longer exist on the CDN.
// The browser then throws "Failed to fetch dynamically imported module".
// The correct recovery is a single hard reload so the client picks up the
// fresh index.html + chunk graph. A sessionStorage guard prevents a reload
// loop if the network (not the deploy) is the real problem.

const RELOAD_FLAG = "nesa:chunk-reload-attempted";

const CHUNK_ERROR_PATTERNS = [
  "failed to fetch dynamically imported module",
  "error loading dynamically imported module",
  "importing a module script failed",
  "failed to load module script",
  "unable to preload css",
  "dynamically imported module",
];

export function isChunkLoadError(error: unknown): boolean {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? `${error.name} ${error.message}`
        : ((error as { message?: string })?.message ?? "");

  if (!message) return false;
  const lower = message.toLowerCase();
  return CHUNK_ERROR_PATTERNS.some((pattern) => lower.includes(pattern));
}

/** Returns true if a reload was triggered (caller should render nothing). */
export function recoverFromChunkError(error: unknown): boolean {
  if (!isChunkLoadError(error)) return false;
  if (typeof window === "undefined") return false;

  let alreadyTried = false;
  try {
    alreadyTried = window.sessionStorage.getItem(RELOAD_FLAG) === "1";
  } catch {
    // sessionStorage can be blocked (private mode / strict cookie policy).
    // Fall back to a module-scoped guard below.
    alreadyTried = memoryGuard;
  }

  if (alreadyTried) return false;

  memoryGuard = true;
  try {
    window.sessionStorage.setItem(RELOAD_FLAG, "1");
  } catch {
    /* ignore */
  }

  // Drop any stale service-worker caches before reloading so the fresh
  // request can't be answered from an outdated app shell.
  void purgeStaleAppShell().finally(() => {
    window.location.reload();
  });

  return true;
}

let memoryGuard = false;

async function purgeStaleAppShell(): Promise<void> {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    /* best effort only */
  }
}

/** Clears the one-shot guard once the app has rendered successfully. */
export function clearChunkReloadGuard() {
  memoryGuard = false;
  try {
    window.sessionStorage.removeItem(RELOAD_FLAG);
  } catch {
    /* ignore */
  }
}

/** Installs window-level listeners. Safe to call once at boot. */
export function installChunkReloadHandler() {
  if (typeof window === "undefined") return;

  // Vite emits this for failed module preloads (covers React.lazy routes).
  window.addEventListener("vite:preloadError", (event) => {
    if (recoverFromChunkError((event as CustomEvent).detail ?? event)) {
      event.preventDefault();
    }
  });

  window.addEventListener("error", (event) => {
    recoverFromChunkError(event.error ?? event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    recoverFromChunkError(event.reason);
  });

  // Once the app is up and stable, allow a future recovery attempt.
  window.setTimeout(() => clearChunkReloadGuard(), 10_000);
}
