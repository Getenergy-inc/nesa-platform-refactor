import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeDollarSign, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { formatAgc, formatUsd } from "@/api/wallet";
import type { Chapter, SettlementRequest } from "@/types/olc";

function OLCSettlementsContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [settlements, setSettlements] = useState<SettlementRequest[]>([]);

  const loadSettlements = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Find the chapter where user is coordinator
      const { data: chapterData } = await supabase
        .from("chapters")
        .select("*")
        .eq("coordinator_user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (!chapterData) {
        navigate("/unauthorized");
        return;
      }

      setChapter(chapterData as Chapter);

      // Note: In a real implementation, you'd have a settlement_requests table
      // For now, we'll show mock data or empty state
      setSettlements([]);
    } catch (error) {
      console.error("Failed to load settlements:", error);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    loadSettlements();
  }, [loadSettlements]);

  const getStatusBadge = (status: SettlementRequest["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-blue-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Settlement History"
        breadcrumbs={[
          { label: "OLC", href: "/olc/dashboard" },
          { label: "Settlements" },
        ]}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BadgeDollarSign className="h-4 w-4 text-emerald-600" />
              Settlement Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Settlement History"
      breadcrumbs={[
        { label: "OLC", href: "/olc/dashboard" },
        { label: "Settlements" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <BadgeDollarSign className="h-4 w-4 text-emerald-600" />
            Settlement Requests
            <Badge variant="secondary" className="ml-2">
              {settlements.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No settlement requests yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Request a settlement from the dashboard when you have withdrawable balance
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Reviewed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {format(new Date(settlement.requested_at), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(settlement.requested_at), { addSuffix: true })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatAgc(settlement.amount_agc)}</p>
                          <p className="text-xs text-muted-foreground">
                            ≈ {formatUsd(settlement.amount_usd)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(settlement.status)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {settlement.notes || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {settlement.reviewed_at
                          ? format(new Date(settlement.reviewed_at), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default function OLCSettlements() {
  return (
    <ProtectedRoute requiredRoles={["chapter", "admin"]}>
      <OLCSettlementsContent />
    </ProtectedRoute>
  );
}
