import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SAMPLE = [
  { id: "GBG-014", nominee: "BrightConnect Initiative", tier: "Gold-Blue Garnet", cat: "CSR · Telecoms", country: "Senegal", role: "Lead", status: "In Progress", due: "5 days" },
  { id: "ICON-007", nominee: "Prof. L. Kamau", tier: "Africa Education Icon", cat: "Africa Technical Educator", country: "Kenya", role: "Primary", status: "Evidence", due: "2 days" },
  { id: "PLAT-021", nominee: "Ibadan University", tier: "Platinum", cat: "Institutional Due-Diligence", country: "Nigeria", role: "Quality", status: "Not Started", due: "8 days" },
];

export default function NRCCases() {
  return (
    <NRCArenaPage
      title="Nominee Verification Cases"
      description="Every case routed to you or your team. Actions available: accept, request more info, hold, reassign, reject or escalate."
      status="live"
      actions={
        <>
          <Button size="sm" variant="outline" className="border-white/20 text-white/80"><Filter className="mr-1.5 h-3.5 w-3.5" /> Filters</Button>
          <Button size="sm" className="bg-gold text-charcoal hover:bg-gold/90">Assign to Me</Button>
        </>
      }
    >
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3">
        <Search className="h-4 w-4 text-white/50" />
        <Input placeholder="Search by nominee, reference or country…" className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0" />
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-left text-[11px] uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-3 py-3">Reference</th>
              <th className="px-3 py-3">Nominee</th>
              <th className="px-3 py-3 hidden md:table-cell">Tier · Category</th>
              <th className="px-3 py-3 hidden lg:table-cell">Country</th>
              <th className="px-3 py-3 hidden md:table-cell">My Role</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Deadline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {SAMPLE.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.04]">
                <td className="px-3 py-3">
                  <Link to={`/nrc/cases/${c.id}`} className="font-mono text-xs text-gold hover:underline">{c.id}</Link>
                </td>
                <td className="px-3 py-3 font-medium text-white">{c.nominee}</td>
                <td className="px-3 py-3 hidden md:table-cell text-white/70">{c.tier}<br /><span className="text-xs text-white/40">{c.cat}</span></td>
                <td className="px-3 py-3 hidden lg:table-cell text-white/70">{c.country}</td>
                <td className="px-3 py-3 hidden md:table-cell">
                  <Badge variant="outline" className="border-gold/30 text-gold text-[10px]">{c.role}</Badge>
                </td>
                <td className="px-3 py-3"><Badge variant="outline" className="border-white/20 text-white/70 text-[10px]">{c.status}</Badge></td>
                <td className="px-3 py-3 text-right text-white/60">{c.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-white/40">
        Sample data shown. Live case routing arrives with Phase 3 (NRC schema) and Phase 4 (automation engine).
      </p>
    </NRCArenaPage>
  );
}
