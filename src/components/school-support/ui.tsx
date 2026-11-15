import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export const pill = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200";
export const pillPrimary = cn(pill, "bg-ea-green text-ea-cream hover:bg-ea-dark");
export const pillOutline = cn(pill, "border-2 border-ea-green text-ea-green hover:bg-ea-green/10");
export const pillOnDark = cn(pill, "border-2 border-ea-tan text-ea-tan hover:bg-ea-tan/10");
export const card = "rounded-2xl border border-ea-line bg-ea-cream p-5 sm:p-6";
export const input = "w-full min-h-11 rounded-xl border border-ea-line bg-ea-cream px-3 py-2 text-sm text-ea-ink";
export const chip = (active: boolean) => cn("min-h-10 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors", active ? "border-ea-green bg-ea-green text-ea-cream" : "border-ea-line bg-ea-cream text-ea-ink hover:border-ea-green");

export function Btn({ className, ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn(pillPrimary, className)} {...p} />;
}

export function SectionHead({ eyebrow, title, intro, dark }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; dark?: boolean }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && <p className={cn("text-xs font-bold uppercase tracking-[0.18em]", dark ? "text-ea-tan" : "text-ea-green")}>{eyebrow}</p>}
      <h2 className={cn("mt-2 text-3xl sm:text-4xl", dark ? "text-ea-cream" : "text-ea-ink")}>{title}</h2>
      {intro && <div className={cn("mt-3 text-base leading-relaxed", dark ? "text-ea-cream/80" : "text-ea-muted")}>{intro}</div>}
    </div>
  );
}

export function Wrap({ id, children, className, dark, label }: { id?: string; children: ReactNode; className?: string; dark?: boolean; label?: string }) {
  return (
    <section id={id} aria-label={label} className={cn("scroll-mt-28 px-4 py-14 sm:px-6 sm:py-20", dark ? "bg-ea-deep text-ea-cream" : "", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" aria-label={`Copy ${label}`} onClick={async () => { try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* ignore */ } }}
      className="inline-flex min-h-9 items-center gap-1 rounded-full border border-ea-line px-3 text-xs font-semibold text-ea-green hover:bg-ea-green/10">
      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}{done ? "Copied" : "Copy"}
    </button>
  );
}

export const fmtMoney = (n: number, cur: string) => {
  try { return new Intl.NumberFormat("en", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n); } catch { return `${cur} ${n}`; }
};
export const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));
