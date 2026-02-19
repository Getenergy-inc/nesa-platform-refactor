import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { useNRCStats, useMyQueue, useNRCMembers } from "@/hooks/useNRCData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

function NRCPortalContent() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useNRCStats();
  const { data: myQueue, isLoading: queueLoading } = useMyQueue();
  const { data: members } = useNRCMembers();

  const urgentItems = useMemo(() => {
    if (!myQueue) return [];
    const now = new Date();
    return myQueue.filter((item) => {
      if (!item.due_date) return false;
      const dueDate = new Date(item.due_date);
      const hoursUntilDue =
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilDue < 48;
    });
  }, [myQueue]);

  const memberCapPercent = stats ? (stats.total_members / 30) * 100 : 0;

  return (
    <NRCLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h2 className="font-display text-2xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here's your NRC dashboard overview
          </p>
        </div>

        {/* Urgent Alerts */}
        {urgentItems.length > 0 && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {urgentItems.length} nomination
                  {urgentItems.length > 1 ? "s" : ""} due within 48 hours
                </p>
                <p className="text-sm text-muted-foreground">
                  Review these nominations before the deadline
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/nrc/my-queue">
                  View Queue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Queue
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myQueue?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                nominations to review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                NRC Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {stats?.active_members || 0}
                </span>
                <span className="text-sm text-muted-foreground">/ 30</span>
              </div>
              <Progress value={memberCapPercent} className="mt-2 h-1.5" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Queue
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_queue_items || 0}
              </div>
              <p className="text-xs text-muted-foreground">awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.completed_reviews || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                reviews this season
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* My Queue Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">My Assigned Queue</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/nrc/my-queue">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {queueLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-muted" />
                  ))}
                </div>
              ) : myQueue && myQueue.length > 0 ? (
                <div className="space-y-3">
                  {myQueue.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">
                          {item.nomination?.nominee_name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.nomination?.subcategory?.category?.name ||
                            "Unknown Category"}
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.status === "in_review" ? "default" : "secondary"
                        }
                        className="shrink-0"
                      >
                        {item.status === "in_review" ? "In Review" : "Assigned"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <ClipboardList className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No nominations in your queue</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">NRC Team</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/nrc/members">
                  Manage
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member Capacity</span>
                  <span className="font-medium">
                    {stats?.total_members || 0} / 30 members
                  </span>
                </div>
                <Progress value={memberCapPercent} className="h-2" />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-success">
                      {stats?.active_members || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-warning">
                      {stats?.pending_invitations || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>

                {(stats?.total_members || 0) < 30 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/nrc/members">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite New Member
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NRCLayout>
  );
}

export default function NRCPortal() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin", "FREE_MEMBER"]}>
      <NRCPortalContent />
    </ProtectedRoute>
  );
}
