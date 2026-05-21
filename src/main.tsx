import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize i18n
import "./lib/i18n";

if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    })
    .catch(() => {
      // Ignore cleanup errors; this only protects local dev from stale PWA caches.
    });
}

createRoot(document.getElementById("root")!).render(<App />);
