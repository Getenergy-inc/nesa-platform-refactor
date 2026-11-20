import { useEffect, useRef, useState } from "react";
import { ArrowRight, Award, ShieldCheck, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "nesa_exit_popup_shown_v2";
const DESKTOP_QUERY = "(min-width:1024px) and (pointer:fine)";
const SUPPRESSED_PREFIXES = ["/nominate", "/login", "/register", "/nominee-portal", "/nrrc", "/judges", "/admin", "/dashboard"];

export function ExitIntentPopup() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const suppressed = SUPPRESSED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  useEffect(() => {
    if (suppressed) return;
    let alreadyShown = false;
    try { alreadyShown = localStorage.getItem(STORAGE_KEY) === "1"; } catch { /* storage may be unavailable */ }
    if (alreadyShown) return;

    const media = window.matchMedia(DESKTOP_QUERY);
    const onMouseLeave = (event: MouseEvent) => {
      if (!media.matches || event.clientY > 0) return;
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* storage may be unavailable */ }
      setIsOpen(true);
    };
    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, [pathname, suppressed]);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && !suppressed && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]" onClick={() => setIsOpen(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[201] w-full max-w-lg"
          >
            <div className="relative bg-charcoal rounded-2xl border border-gold/30 p-8 shadow-2xl shadow-gold/10">
              <button ref={closeRef} onClick={() => setIsOpen(false)} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close dialog">
                <X className="h-4 w-4" />
              </button>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gold/20 mb-6"><Award className="h-8 w-8 text-gold" /></div>
                <h2 id="exit-intent-title" className="font-display text-2xl md:text-3xl font-bold text-white mb-3">Before You Go</h2>
                <p className="text-white/70 mb-6 max-w-sm mx-auto">
                  Someone in your world is already enabling education. Nomination is free, and every nomination is reviewed by the Nominee Research and Review Corps; Icon dossiers are assessed by independent judges.
                </p>
                <div className="flex items-center justify-center gap-4 mb-6 text-sm">
                  <span className="flex items-center gap-1.5 text-gold"><Award className="h-4 w-4" />Free to submit</span>
                  <span className="flex items-center gap-1.5 text-gold"><ShieldCheck className="h-4 w-4" />Independent Icon judging</span>
                </div>
                <div className="space-y-3">
                  <Link to="/nominate" onClick={() => setIsOpen(false)} className="block">
                    <Button size="lg" className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">Submit a Nomination<ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                  <button onClick={() => setIsOpen(false)} className="text-sm text-white/50 hover:text-white/70 transition-colors">Maybe later</button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ExitIntentPopup;
