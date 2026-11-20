import { useEffect, useRef, useState } from "react";
import { Accessibility, RotateCcw, X } from "lucide-react";

const SIZE_KEY = "nesa_public_text_size";
const CONTRAST_KEY = "nesa_public_contrast";

export function PublicAccessibilityControls() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(0);
  const [contrast, setContrast] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      setSize(Math.min(2, Math.max(0, Number(localStorage.getItem(SIZE_KEY) ?? 0))));
      setContrast(localStorage.getItem(CONTRAST_KEY) === "high");
    } catch { /* storage may be unavailable */ }
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${100 + size * 12.5}%`;
    document.documentElement.dataset.publicContrast = contrast ? "high" : "normal";
    try {
      localStorage.setItem(SIZE_KEY, String(size));
      localStorage.setItem(CONTRAST_KEY, contrast ? "high" : "normal");
    } catch { /* storage may be unavailable */ }
  }, [contrast, size]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  const reset = () => { setSize(0); setContrast(false); };

  return (
    <div className="fixed bottom-28 left-3 z-40 md:bottom-6 md:left-4">
      {open && (
        <div role="dialog" aria-label="Accessibility preferences" className="mb-3 w-64 rounded-xl border border-gold/40 bg-charcoal p-4 text-ivory shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg text-gold">Accessibility</h2>
            <button type="button" aria-label="Close accessibility preferences" onClick={() => { setOpen(false); buttonRef.current?.focus(); }} className="min-h-9 min-w-9 rounded-md text-ivory hover:bg-gold/10"><X className="mx-auto h-4 w-4" /></button>
          </div>
          <div className="mt-3" role="group" aria-label="Text size">
            <p className="text-xs font-semibold">Text size</p>
            <div className="mt-2 flex gap-2">{["A", "A+", "A++"].map((label, index) => <button key={label} type="button" aria-pressed={size === index} onClick={() => setSize(index)} className={`min-h-10 min-w-12 rounded-md border px-2 text-sm font-bold ${size === index ? "border-gold bg-gold text-charcoal" : "border-gold/40 text-gold"}`}>{label}</button>)}</div>
          </div>
          <button type="button" aria-pressed={contrast} onClick={() => setContrast((value) => !value)} className={`mt-4 min-h-10 w-full rounded-md border px-3 text-sm font-semibold ${contrast ? "border-gold bg-gold text-charcoal" : "border-gold/40 text-gold"}`}>High contrast: {contrast ? "on" : "off"}</button>
          <button type="button" onClick={reset} className="mt-3 inline-flex min-h-9 items-center gap-2 text-xs text-ivory/75 underline"><RotateCcw className="h-3 w-3" />Reset preferences</button>
        </div>
      )}
      <button ref={buttonRef} type="button" aria-expanded={open} aria-label="Open accessibility preferences" onClick={() => setOpen((value) => !value)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/50 bg-charcoal px-4 text-xs font-semibold text-gold shadow-lg hover:bg-gold/10">
        <Accessibility className="h-4 w-4" aria-hidden />Accessibility
      </button>
    </div>
  );
}
