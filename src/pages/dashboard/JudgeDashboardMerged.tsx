import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Layers, ListChecks, FileSearch, ClipboardCheck,
  ShieldAlert, CheckCircle2, GraduationCap, ArrowRight,
} from "lucide-react";

// Register alignment (152-page master register): the "Judges Arena" lives
// INSIDE the Judge Dashboard as modules, rather than as a separate /judges-arena
// route tree. This shell is the canonical judge entry point; each module links
// to the working screen.
const MODULES = [
  { key: "overview", label: "Judge Overview", icon: LayoutDashboard, href: "/judge/dashboard" },
  { key: "categories", label: "Assigned Categories", icon: Layers, href: "/judges-arena/nominees" },
  { key: "shortlist", label: "Shortlisted Nominees", icon: ListChecks, href: "/judges-arena/nominees" },
  { key: "evidence", label: "Evidence Review", icon: FileSearch, href: "/judges-arena/nominees" },
  { key: "scorecard", label: "Scorecard", icon: ClipboardCheck, href: "/judge/scoring" },
  { key: "coi", label: "Conflict-of-Interest Declaration", icon: ShieldAlert, href: "/judge/coi" },
  { key: "submitted", label: "Submitted Scores", icon: CheckCircle2, href: "/judge/scoring" },
  { key: "guidelines", label: "Judging Guidelines", icon: GraduationCap, href: "/judge/guidelines" },
] as const;

function JudgeDashboardContent() {
  const { user } = useAuth();
  return (
    <div className="bg-charcoal min-h-screen">
      <Helmet>
        <title>Judge Dashboard | NESA-Africa</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container max-w-5xl py-10 md:py-14">
        <div className="mb-8">
          <p className="text-gold/80 text-sm uppercase tracking-wide">NESA-Africa · Jury</p>
          <h1 className="text-3xl md:text-4xl font-playfair text-gold mt-2">Judge Dashboard</h1>
          <p className="text-white/70 mt-2">
            Your judging workspace — assigned categories, evidence review, scoring and
            conflict-of-interest, all in one place.
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

          {MODULES.map((m) => (
            <TabsContent key={m.key} value={m.key} className="mt-6">
              <Card className="bg-charcoal-light/40 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <m.icon className="w-5 h-5 text-gold" />{m.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {m.key === "overview" && (
                    <p className="text-white/50 text-sm">Signed in as {user?.email}.</p>
                  )}
                  <p className="text-white/70 text-sm">Open the {m.label} workspace.</p>
                  <Button asChild className="bg-gold text-charcoal hover:bg-gold-light">
                    <Link to={m.href}>Open {m.label}<ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default function JudgeDashboardMerged() {
  return (
    <ProtectedRoute requiredRoles={["jury", "admin"]}>
      <JudgeDashboardContent />
    </ProtectedRoute>
  );
}
