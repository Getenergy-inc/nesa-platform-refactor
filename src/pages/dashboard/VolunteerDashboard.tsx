import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useNRCStats, useMyQueue } from "@/hooks/useNRCData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, FileSearch, Upload, Copy, MessageSquare,
  FileText, GraduationCap, LayoutDashboard, ArrowRight, CheckCircle2, Clock,
} from "lucide-react";

// Register alignment (152-page master register): the NRC (Nominee Research
// Corps) lives INSIDE the Volunteer Dashboard as a set of modules, rather than
// as separate /nrc/* public routes. This shell is the canonical entry point;
// each module surfaces its live data and/or links to the working screen.
const MODULES = [
  { key: "overview", label: "My Volunteer Overview", icon: LayoutDashboard },
  { key: "tasks", label: "NRC Research Tasks", icon: ClipboardList, href: "/nrc/dashboard/queue" },
  { key: "submit", label: "Submit Nominee Research", icon: FileSearch, href: "/nrc/dashboard/intake" },
  { key: "evidence", label: "Evidence Upload", icon: Upload, href: "/nrc/dashboard/intake" },
  { key: "duplicates", label: "Duplicate Flags", icon: Copy, href: "/nrc/dashboard/duplicates" },
  { key: "feedback", label: "Reviewer Feedback", icon: MessageSquare, href: "/nrc/dashboard/my-reviews" },
  { key: "reports", label: "My NRC Reports", icon: FileText, href: "/nrc/dashboard/reports" },
  { key: "training", label: "Training & Guidelines", icon: GraduationCap, href: "/nrc/dashboard/guidelines" },
] as const;

function VolunteerDashboardContent() {
  const { user } = useAuth();
  const { data: stats } = useNRCStats();
  const { data: myQueue } = useMyQueue();

  const pending = myQueue?.filter((i) => i.status !== "completed").length ?? 0;
  const completed = stats?.completed_reviews ?? 0;

  return (
    <div className="bg-charcoal min-h-screen">
      <Helmet>
        <title>Volunteer Dashboard | NESA-Africa</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container max-w-5xl py-10 md:py-14">
        <div className="mb-8">
          <p className="text-gold/80 text-sm uppercase tracking-wide">NESA-Africa · Volunteer</p>
          <h1 className="text-3xl md:text-4xl font-playfair text-gold mt-2">Volunteer Dashboard</h1>
          <p className="text-white/70 mt-2">
            Your volunteer overview and Nominee Research Corps (NRC) modules in one place.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-charcoal-light/40 border border-gold/15 p-1">
            {MODULES.map((m) => (
              <TabsTrigger key={m.key} value={m.key} className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-white/70">
                <m.icon className="w-4 h-4 mr-1.5" />{m.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard icon={Clock} label="Pending tasks" value={pending} />
              <StatCard icon={CheckCircle2} label="Completed reviews" value={completed} />
              <StatCard icon={ClipboardList} label="Queue items" value={stats?.total_queue_items ?? 0} />
            </div>
            <p className="text-white/50 text-sm mt-6">
              Signed in as {user?.email}. Use the tabs above to pick up research tasks, submit
              nominee evidence, flag duplicates, and view your NRC reports.
            </p>
          </TabsContent>

          {MODULES.filter((m) => m.key !== "overview").map((m) => (
            <TabsContent key={m.key} value={m.key} className="mt-6">
              <Card className="bg-charcoal-light/40 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <m.icon className="w-5 h-5 text-gold" />{m.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70 text-sm">Open the {m.label} workspace.</p>
                  {m.href && (
                    <Button asChild className="bg-gold text-charcoal hover:bg-gold-light">
                      <Link to={m.href}>Open {m.label}<ArrowRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <Card className="bg-charcoal-light/40 border-gold/20">
      <CardContent className="p-5">
        <Icon className="w-6 h-6 text-gold mb-2" />
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-white/60 text-sm">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function VolunteerDashboard() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <VolunteerDashboardContent />
    </ProtectedRoute>
  );
}
