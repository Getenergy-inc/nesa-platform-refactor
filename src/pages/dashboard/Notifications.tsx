import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Award, FileCheck, Users, Calendar, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "award" | "nomination" | "system" | "event" | "chapter";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "award",
    title: "Awards Season Update",
    message: "The 2025 NESA-Africa awards nomination period is now open. Submit your nominations before the deadline.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "nomination",
    title: "Nomination Received",
    message: "Your nomination for the Education Innovation category has been received and is under NRC review.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "3",
    type: "chapter",
    title: "Chapter Activity",
    message: "Your local chapter (West Africa) has scheduled a new event. Check the events page for details.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "Profile Completion",
    message: "Complete your profile to unlock all platform features including voting and endorsements.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "5",
    type: "event",
    title: "Upcoming Gala",
    message: "The NESA-Africa 2025 Awards Gala is scheduled for September. Early bird tickets are now available.",
    time: "1 week ago",
    read: true,
  },
];

const TYPE_CONFIG = {
  award: { icon: Award, color: "text-gold", bg: "bg-gold/10" },
  nomination: { icon: FileCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  system: { icon: Info, color: "text-blue-400", bg: "bg-blue-400/10" },
  event: { icon: Calendar, color: "text-purple-400", bg: "bg-purple-400/10" },
  chapter: { icon: Users, color: "text-amber-400", bg: "bg-amber-400/10" },
};

function NotificationsContent() {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <InstitutionalDashboardLayout title="Notifications" breadcrumbs={[{ label: "Notifications" }]}>
      <Helmet>
        <title>Notifications | NESA-Africa</title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Notifications</h1>
            <p className="text-white/50 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {MOCK_NOTIFICATIONS.map((notification) => {
            const config = TYPE_CONFIG[notification.type];
            const Icon = config.icon;

            return (
              <Card
                key={notification.id}
                className={cn(
                  "border-gold/10 bg-[hsl(30_8%_8%)] transition-all hover:border-gold/20",
                  !notification.read && "border-l-2 border-l-gold"
                )}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={cn("p-2.5 rounded-lg shrink-0", config.bg)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn("font-medium text-sm", notification.read ? "text-white/70" : "text-white")}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px] px-1.5 py-0">New</Badge>
                      )}
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{notification.message}</p>
                    <p className="text-white/30 text-xs mt-2">{notification.time}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state hint */}
        <p className="text-center text-white/30 text-xs pt-4">
          Notifications are automatically generated based on your platform activity.
        </p>
      </div>
    </InstitutionalDashboardLayout>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
