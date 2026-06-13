import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, List, Filter, ArrowUpDown, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Nominee = {
  slug: string;
  name: string;
  category: string;
  region: string;
  deadline: string;
  score: number;
  status: "not-reviewed" | "in-progress" | "completed" | "flagged";
};

const mock: Nominee[] = [
  { slug: "shofco-kenya", name: "SHOFCO Kenya", category: "Africa Education Impact", region: "East Africa", deadline: "Jun 18", score: 82, status: "in-progress" },
  { slug: "building-tomorrow", name: "Building Tomorrow", category: "Innovation in Education", region: "East Africa", deadline: "Jun 20", score: 74, status: "in-progress" },
  { slug: "mo-ibrahim", name: "Mo Ibrahim Foundation", category: "Lifetime Education Champion", region: "Pan-African", deadline: "Jun 22", score: 91, status: "completed" },
  { slug: "ami-nigeria", name: "AMI Nigeria", category: "Tech-Enabled Learning", region: "West Africa", deadline: "Jun 24", score: 61, status: "not-reviewed" },
  { slug: "coopi", name: "COOPI", category: "Inclusive Education", region: "Horn of Africa", deadline: "Jun 25", score: 70, status: "not-reviewed" },
  { slug: "teach-for-africa", name: "Teach For Africa", category: "Teacher Empowerment", region: "Pan-African", deadline: "Jun 27", score: 78, status: "flagged" },
];

const statusStyle: Record<Nominee["status"], string> = {
  "not-reviewed": "border-white/20 text-white/60",
  "in-progress": "border-gold/40 text-gold",
  "completed": "border-emerald-500/40 text-emerald-300",
  "flagged": "border-rose-500/40 text-rose-300",
};

export default function ArenaNominees() {
  const [view, setView] = useState<"card" | "table">("card");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("deadline");

  const rows = useMemo(() => {
    let r = mock.filter(
      (n) =>
        (status === "all" || n.status === status) &&
        (q.trim() === "" ||
          n.name.toLowerCase().includes(q.toLowerCase()) ||
          n.category.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "score") r = [...r].sort((a, b) => b.score - a.score);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [q, status, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-white">My Assignments</h1>
        <p className="text-white/60 text-sm mt-1">Review and score nominees assigned to your panel.</p>
      </div>

      {/* Toolbar */}
      <Card className="bg-white/[0.03] border-gold/15">
        <CardContent className="p-4 flex flex-col lg:flex-row gap-3">
          <Input
            placeholder="Search by nominee or category…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-white/5 border-gold/20 text-white placeholder:text-white/40 lg:max-w-xs"
          />
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[170px] bg-white/5 border-gold/20 text-white">
                <Filter className="h-3.5 w-3.5 mr-2 text-gold" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="not-reviewed">Not reviewed</SelectItem>
                <SelectItem value="in-progress">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[170px] bg-white/5 border-gold/20 text-white">
                <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-gold" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Sort: Deadline</SelectItem>
                <SelectItem value="score">Sort: EDI score</SelectItem>
                <SelectItem value="name">Sort: Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:ml-auto inline-flex rounded-md border border-gold/20 overflow-hidden">
            <button
              onClick={() => setView("card")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${view === "card" ? "bg-gold text-charcoal" : "text-white/70 hover:bg-white/5"}`}
            >
              <LayoutGrid className="h-4 w-4" /> Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${view === "table" ? "bg-gold text-charcoal" : "text-white/70 hover:bg-white/5"}`}
            >
              <List className="h-4 w-4" /> Table
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {view === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((n) => (
            <Card key={n.slug} className="bg-white/[0.03] border-gold/15 text-white hover:border-gold/40 transition group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-serif text-lg group-hover:text-gold transition">{n.name}</div>
                    <div className="text-xs text-white/50">{n.category} · {n.region}</div>
                  </div>
                  <Badge variant="outline" className={statusStyle[n.status]}>{n.status.replace("-", " ")}</Badge>
                </div>
                <div className="flex items-end justify-between pt-2">
                  <div>
                    <div className="text-xs text-white/40">EDI auto-score</div>
                    <div className="text-3xl font-bold text-gold leading-none">{n.score}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40">Deadline</div>
                    <div className="text-sm">{n.deadline}</div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="bg-gold text-charcoal hover:bg-gold-light flex-1">
                    <Link to={`/judges-arena/nominee/${n.slug}`}>Open review</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/[0.03] border-gold/15 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/50 border-b border-gold/15">
              <tr>
                <th className="p-3 font-medium">Nominee</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Region</th>
                <th className="p-3 font-medium">EDI</th>
                <th className="p-3 font-medium">Deadline</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="text-white">
              {rows.map((n) => (
                <tr key={n.slug} className="border-b border-gold/10 hover:bg-gold/5">
                  <td className="p-3 font-medium">{n.name}</td>
                  <td className="p-3 text-white/70">{n.category}</td>
                  <td className="p-3 text-white/70">{n.region}</td>
                  <td className="p-3 text-gold font-semibold">{n.score}</td>
                  <td className="p-3 text-white/70">{n.deadline}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={statusStyle[n.status]}>{n.status.replace("-", " ")}</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button asChild size="sm" variant="ghost" className="text-gold hover:bg-gold/10">
                      <Link to={`/judges-arena/nominee/${n.slug}`}>Review →</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
