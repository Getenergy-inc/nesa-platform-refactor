import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle2, AlertTriangle, TrendingUp, Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const assigned = [
  { name: "SHOFCO Kenya", category: "Africa Education Impact", deadline: "Jun 18", score: 82, status: "in-progress" },
  { name: "Building Tomorrow", category: "Innovation in Education", deadline: "Jun 20", score: 74, status: "in-progress" },
  { name: "Mo Ibrahim Foundation", category: "Lifetime Education Champion", deadline: "Jun 22", score: 91, status: "done" },
  { name: "AMI Nigeria", category: "Tech-Enabled Learning", deadline: "Jun 24", score: 61, status: "pending" },
  { name: "COOPI", category: "Inclusive Education", deadline: "Jun 25", score: 70, status: "pending" },
];

const announcements = [
  { from: "NRC", title: "Cycle 2026 calibration window opens June 16", time: "2h ago" },
  { from: "Panel Lead", title: "EDI rubric clarification posted for STEM category", time: "Yesterday" },
  { from: "Secretariat", title: "Submit all Gold-track scores by June 28, 23:59 GMT", time: "2 days ago" },
];

export default function ArenaDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light to-charcoal p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold/70 mb-2">Judges Arena</div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white">
              Welcome back, Judge.
            </h1>
            <p className="text-white/70 mt-2 max-w-xl">
              You have <span className="text-gold font-semibold">12 nominees</span> pending review.
              Stay calibrated, stay confidential.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold-light">
              <Link to="/judges-arena/nominees">Open my queue <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild className="border-gold/30 text-gold hover:bg-gold/10">
              <Link to="/judges/scoring">Review rubric</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Progress cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Progress", value: "68%", note: "of assigned reviews", icon: TrendingUp, accent: "from-gold/30" },
          { label: "Pending Reviews", value: "12", note: "across 3 categories", icon: Clock, accent: "from-amber-500/20" },
          { label: "Completed", value: "26", note: "this cycle", icon: CheckCircle2, accent: "from-emerald-500/20" },
          { label: "Flagged", value: "2", note: "need NRC follow-up", icon: AlertTriangle, accent: "from-rose-500/20" },
        ].map((s) => (
          <Card key={s.label} className="bg-white/[0.03] border-gold/15 text-white overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} to-transparent opacity-60 pointer-events-none`} />
            <CardContent className="p-5 relative">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-white/60">{s.label}</div>
                <s.icon className="h-4 w-4 text-gold" />
              </div>
              <div className="mt-3 text-3xl font-bold text-gold">{s.value}</div>
              <div className="text-xs text-white/50 mt-1">{s.note}</div>
              {s.label === "Overall Progress" && (
                <Progress value={68} className="mt-3 h-1.5 bg-white/10" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assigned queue */}
      <Card className="bg-white/[0.03] border-gold/15 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white font-serif">Priority Queue</CardTitle>
          <Button variant="link" className="text-gold" asChild>
            <Link to="/judges-arena/nominees">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gold/10">
            {assigned.map((n) => (
              <Link
                key={n.name}
                to={`/judges-arena/nominee/${encodeURIComponent(n.name.toLowerCase().replace(/\s+/g, "-"))}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gold/5 transition group"
              >
                <div className="h-10 w-10 rounded-full bg-gold/15 grid place-items-center text-gold font-semibold">
                  {n.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{n.name}</div>
                  <div className="text-xs text-white/50 truncate">{n.category}</div>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <div className="text-xs text-white/50">Deadline</div>
                  <div className="text-sm text-white">{n.deadline}</div>
                </div>
                <div className="w-20 text-right">
                  <div className="text-2xl font-bold text-gold leading-none">{n.score}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">EDI auto</div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    n.status === "done"
                      ? "border-emerald-500/40 text-emerald-300"
                      : n.status === "in-progress"
                      ? "border-gold/40 text-gold"
                      : "border-white/20 text-white/60"
                  }
                >
                  {n.status.replace("-", " ")}
                </Badge>
                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-gold transition" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card className="bg-white/[0.03] border-gold/15 text-white">
        <CardHeader>
          <CardTitle className="text-white font-serif flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-gold" /> NRC Updates & Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {announcements.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gold/10 bg-charcoal/40">
              <Badge className="bg-gold/15 text-gold border-gold/30 hover:bg-gold/20">{a.from}</Badge>
              <div className="flex-1">
                <div className="text-sm text-white">{a.title}</div>
                <div className="text-xs text-white/40 mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
