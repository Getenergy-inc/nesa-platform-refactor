import { Helmet } from "react-helmet-async";
import { IconJuryAuditTrail } from "@/features/iconJudges/IconJuryAuditTrail";

export default function IconJuryAdminAuditTrailPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <Helmet>
        <title>Jury Audit Trail · Icon Moderation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gold/80">Africa Education Icon</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white">Governance Audit Trail</h1>
        <p className="text-white/60 text-sm mt-1 max-w-2xl">
          Full jury activity ledger — sign-ins, assignment access, score edits, conflict declarations,
          note changes, moderation actions, and result locking events across all judges.
        </p>
      </div>
      <IconJuryAuditTrail scope="all" />
    </div>
  );
}
