import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { installChunkReloadHandler } from "./lib/chunkReload";
import "./index.css";

// Initialize i18n
import "./lib/i18n";

// Recover automatically from stale JS chunks after a new deploy.
installChunkReloadHandler();

// The app no longer ships a service worker. Any registration still present in
// a visitor's browser is from an older build and can serve a stale index.html
// (which is exactly what causes "failed to fetch dynamically imported module"),
// so unregister it and drop its caches in every environment.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    })
    .catch(() => {
      // Ignore cleanup errors; this only protects clients from stale PWA caches.
    });

  if ("caches" in window) {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .catch(() => {
        // Ignore cleanup errors.
      });
  }
}

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
