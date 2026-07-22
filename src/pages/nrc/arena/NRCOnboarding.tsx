import { Helmet } from "react-helmet-async";
import { CheckCircle2, Circle } from "lucide-react";
import { NRCArenaLayout } from "@/components/nrc/arena/NRCArenaLayout";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  "Professional Profile",
  "Identity Verification",
  "Appointment Acceptance",
  "NRC MOU",
  "Confidentiality Agreement",
  "Code of Conduct",
  "Conflict Declaration",
  "Data Protection",
  "Evidence Verification Training",
  "Category or Pathway Training",
  "Assessment",
  "Activation",
];

export default function NRCOnboarding() {
  return (
    <NRCArenaLayout>
      <Helmet><title>NRC Onboarding · NESA-Africa 2026</title></Helmet>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gold/80">Onboarding centre</p>
        <h1 className="font-display text-2xl font-bold">Appointment & compliance</h1>
        <p className="text-white/65 mt-1 text-sm">
          Every NRC member must complete all twelve steps before receiving nominee cases.
        </p>
      </header>

      <ol className="space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3"
          >
            <Circle className="h-5 w-5 text-white/30" aria-hidden />
            <span className="flex-1 text-white/85">
              <span className="text-gold/70 text-xs mr-2 font-mono">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </span>
            <Badge variant="outline" className="border-white/20 text-white/60 text-[10px]">Not started</Badge>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-xs text-white/50 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        All items must be marked complete by NRC leadership before activation.
      </p>
    </NRCArenaLayout>
  );
}
