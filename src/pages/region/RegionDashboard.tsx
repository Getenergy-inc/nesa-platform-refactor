import { Helmet } from "react-helmet-async";
import { useRegion } from "@/contexts/RegionContext";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Globe, Trophy, Vote, Coins, ArrowRight, Users } from "lucide-react";
import { ChapterHighlightCard } from "@/components/dashboard/ChapterHighlightCard";
import { CampaignTimelineCard } from "@/components/dashboard/CampaignTimelineCard";

function RegionDashboardContent() {
  const { user } = useAuth();
  const { activeRegion, userChapter } = useRegion();

  const regionName = activeRegion?.name || userChapter?.region_name || "All Africa";
  const chapterName = userChapter?.chapter_name || "Online Chapter";
  const membershipLevel = userChapter?.membership_level || "basic";

  return (
    <DashboardLayout
      title="Regional Dashboard"
      breadcrumbs={[{ label: "Dashboard" }, { label: regionName }]}
    >
      <Helmet>
        <title>{regionName} Dashboard | NESA-Africa</title>
      </Helmet>

      <div className="space-y-6">
        {/* Welcome Header */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold mb-1">
                  Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  You are viewing: <span className="text-primary font-semibold">{regionName} Region</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <MapPin className="h-3 w-3 mr-1" />
                    {chapterName}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {membershipLevel} Member
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/30">
                <Coins className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Afrigold Points</p>
                  <p className="font-bold text-gold">--</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapter & Timeline */}
        <ChapterHighlightCard />
        <CampaignTimelineCard />

        {/* Regional Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/nominate">
            <Card className="hover:border-gold/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-semibold text-sm">Nominate</h3>
                <p className="text-xs text-muted-foreground">Region auto-filled</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/vote">
            <Card className="hover:border-blue-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Vote className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-sm">Vote with AGC</h3>
                <p className="text-xs text-muted-foreground">Support nominees</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/nominees">
            <Card className="hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-sm">Nominees</h3>
                <p className="text-xs text-muted-foreground">{regionName}</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/categories">
            <Card className="hover:border-purple-500/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-sm">Categories</h3>
                <p className="text-xs text-muted-foreground">17 Official Categories</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Membership Upgrade CTA */}
        {membershipLevel === "basic" && (
          <Card className="border-gold/20 bg-gold/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Upgrade Your Membership</h3>
                <p className="text-xs text-muted-foreground">
                  Unlock premium features, priority support, and exclusive events.
                </p>
              </div>
              <Button size="sm" className="bg-gold hover:bg-gold-dark text-charcoal gap-1">
                Upgrade
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function RegionDashboard() {
  return (
    <ProtectedRoute>
      <RegionDashboardContent />
    </ProtectedRoute>
  );
}
