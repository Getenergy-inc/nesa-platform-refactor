import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gavel, 
  Trophy, 
  Users, 
  FileCheck, 
  Clock, 
  Star,
  MessageSquare,
  Shield,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

// Quick stats for the dashboard
const stats = [
  { label: "Assigned Finalists", value: "12", icon: Trophy, color: "text-gold" },
  { label: "Pending Scores", value: "8", icon: Clock, color: "text-yellow-500" },
  { label: "Completed", value: "4", icon: CheckCircle, color: "text-green-500" },
  { label: "Days Remaining", value: "14", icon: Calendar, color: "text-blue-500" },
];

// Quick actions
const quickActions = [
  { 
    label: "Score Finalists", 
    description: "Evaluate assigned Blue Garnet nominees",
    href: "/judge/scoring", 
    icon: Star,
    badge: "8 pending"
  },
  { 
    label: "View Evidence", 
    description: "Review evidence bundles for nominees",
    href: "/judge/evidence", 
    icon: FileCheck 
  },
  { 
    label: "Jury Discussion", 
    description: "Join category-specific discussions",
    href: "/judge/chat", 
    icon: MessageSquare 
  },
  { 
    label: "COI Declarations", 
    description: "Manage conflict of interest disclosures",
    href: "/judge/coi", 
    icon: Shield 
  },
];

export default function JudgeDashboard() {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent("/judge/dashboard")}`} replace />;
  }

  // Check if user has jury role
  const isJudge = roles.includes("jury") || roles.includes("admin");

  if (!isJudge) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Judges Arena | NESA-Africa</title>
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Header */}
        <header className="bg-charcoal border-b border-gold/20">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Judges Arena</h1>
                  <p className="text-sm text-white/60">NESA-Africa Blue Garnet Jury Panel</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-gold/20 text-gold border-gold/30">
                  <Users className="mr-1 h-3 w-3" />
                  Jury Member
                </Badge>
                <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/">Exit Arena</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container py-8">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user.user_metadata?.full_name || "Judge"}
            </h2>
            <p className="text-white/60">
              You have <span className="text-gold font-semibold">8 pending evaluations</span> to complete.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-white/10 bg-white/5">
                <CardContent className="pt-6 text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {quickActions.map((action) => (
              <Link 
                key={action.label} 
                to={action.href}
                className="block group"
              >
                <Card className="border-white/10 bg-white/5 hover:border-gold/30 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                          <action.icon className="h-6 w-6 text-gold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-gold transition-colors flex items-center gap-2">
                            {action.label}
                            {action.badge && (
                              <Badge variant="secondary" className="bg-gold/20 text-gold text-xs">
                                {action.badge}
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-white/60 mt-1">{action.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-gold transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Important Notice */}
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Scoring Deadline Approaching</h3>
                  <p className="text-sm text-white/70">
                    All Blue Garnet finalist evaluations must be completed by{" "}
                    <strong className="text-gold">June 15, 2026</strong>. 
                    Please ensure you have submitted all scores and COI declarations before this date.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Links */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/judge/scoring">
                  <Star className="mr-2 h-4 w-4" />
                  All Assignments
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/judge/guidelines">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Scoring Guidelines
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/about/governance">
                  <Shield className="mr-2 h-4 w-4" />
                  Governance Framework
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
