import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { NRCArenaLayout } from "@/components/nrc/arena/NRCArenaLayout";
import { useAuth } from "@/contexts/AuthContext";

const ACTIVITY = [
  "Cases Assigned", "Cases Completed", "Cases In Progress",
  "Evidence Requests Issued", "Quality Reviews Completed",
  "Cases Escalated", "Cases Handed to Judges", "Cases Handed to Governance",
];

export default function NRCProfile() {
  const { nrcReference } = useParams();
  const { user } = useAuth();
  const ref = nrcReference ?? "NRC-2026-PENDING";
  const display = user?.email?.split("@")[0] ?? "NRC Member";

  return (
    <NRCArenaLayout>
      <Helmet><title>NRC Profile · {ref} · NESA-Africa</title></Helmet>

      <header className="mb-6 flex flex-wrap items-start gap-4">
        <div className="h-24 w-24 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-gold">
            {display.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-gold/80">NRC Reference · {ref}</p>
          <h1 className="font-display text-2xl font-bold mt-0.5">{display}</h1>
          <p className="text-white/60 text-sm">Professional title · Organisation · Country</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-gold/40 text-gold">Appointment · Active</Badge>
            <Badge variant="outline" className="border-emerald-400/40 text-emerald-300">MFA enabled</Badge>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Block title="Professional Overview">
            <p className="text-sm text-white/70">
              Biography, qualifications, expertise, publications and languages appear here once
              the profile is completed.
            </p>
          </Block>
          <Block title="NRC Assignment">
            <p className="text-sm text-white/70">
              Recognition tier, main category, subcategories, team role, team members and
              service period appear here once appointed.
            </p>
          </Block>
          <Block title="Activity Summary">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ACTIVITY.map((k) => (
                <div key={k} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <dt className="text-[11px] uppercase tracking-wider text-white/50">{k}</dt>
                  <dd className="mt-1 font-display text-xl font-bold text-white">0</dd>
                </div>
              ))}
            </dl>
          </Block>
        </div>

        <aside className="space-y-6">
          <Block title="Compliance (restricted)">
            <ul className="text-sm text-white/70 space-y-1.5">
              {["Identity", "MOU", "Confidentiality", "Code of Conduct", "COI Declaration",
                "Data Protection", "Training", "Assessment", "MFA"].map((k) => (
                <li key={k} className="flex justify-between">
                  <span>{k}</span>
                  <span className="text-white/40">Pending</span>
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Assignment management (restricted)">
            <p className="text-xs text-white/60">
              Workload, capacity, deadline performance, reassignment and recusal history are
              visible only to the member, leadership, Governance and authorised admins.
            </p>
          </Block>
        </aside>
      </section>
    </NRCArenaLayout>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="font-display font-semibold text-gold text-sm uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
