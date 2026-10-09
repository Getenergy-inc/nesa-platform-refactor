import { Helmet } from "react-helmet-async";
import { IconJuryAuditTrail } from "@/features/iconJudges/IconJuryAuditTrail";

export default function IconJuryAuditTrailPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <Helmet>
        <title>My Audit Trail · Icon Judges Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gold/80">Africa Education Icon</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white">My Audit Trail</h1>
        <p className="text-white/60 text-sm mt-1 max-w-2xl">
          A confidential, immutable log of every action attributed to your judge account —
          for your own oversight and accountability.
        </p>
      </div>
      <IconJuryAuditTrail scope="self" />
    </div>
  );
}
