import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Download, Eye, RefreshCw } from "lucide-react";
import type { Order } from "@/types/shop";

type OrderStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export default function AdminOrders() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && user && hasRole("admin")) {
      loadOrders();
    }
  }, [authLoading, user, page, statusFilter, impactFilter]);

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // if (!authLoading && !hasRole("admin")) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  const loadOrders = async () => {
    setLoading(true);
    try {
      const limit = 20;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("orders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (statusFilter !== "all") {
        query = query.eq(
          "status",
          statusFilter as
            | "PENDING"
            | "PAID"
            | "FAILED"
            | "REFUNDED"
            | "FULFILLED",
        );
      }
      if (impactFilter !== "all") {
        query = query.eq(
          "impact_destination",
          impactFilter as
            | "REBUILD_MY_SCHOOL"
            | "EDUAID_AFRICA"
            | "SPONSOR_STUDENT"
            | "TVET_GRANT",
        );
      }

      const { data, count, error } = await query;
      if (error) throw error;

      setOrders((data || []) as Order[]);
      setTotalPages(Math.ceil((count || 0) / limit));
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<
      OrderStatus,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      PENDING: "outline",
      PAID: "default",
      FAILED: "destructive",
      REFUNDED: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const handleExport = async () => {
    try {
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (statusFilter !== "all") {
        query = query.eq(
          "status",
          statusFilter as
            | "PENDING"
            | "PAID"
            | "FAILED"
            | "REFUNDED"
            | "FULFILLED",
        );
      }
      if (impactFilter !== "all") {
        query = query.eq(
          "impact_destination",
          impactFilter as
            | "REBUILD_MY_SCHOOL"
            | "EDUAID_AFRICA"
            | "SPONSOR_STUDENT"
            | "TVET_GRANT",
        );
      }

      const { data } = await query;
      if (!data) return;

      const csv = [
        [
          "Order ID",
          "Status",
          "Email",
          "Name",
          "Total USD",
          "Pay Currency",
          "Pay Amount",
          "FX Rate",
          "Impact",
          "Provider",
          "Created At",
        ].join(","),
        ...data.map((o) =>
          [
            o.id,
            o.status,
            o.email,
            o.full_name,
            o.total_usd,
            o.pay_currency || "USD",
            o.pay_amount_total || o.total_usd,
            o.fx_rate || 1,
            o.impact_destination,
            o.provider || "-",
            o.created_at,
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Orders exported");
    } catch {
      toast.error("Export failed");
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout title="Orders">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Orders & Revenue"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Orders" }]}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Merchandise Orders</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadOrders}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={impactFilter} onValueChange={setImpactFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                <SelectItem value="REBUILD_MY_SCHOOL">
                  Rebuild My School
                </SelectItem>
                <SelectItem value="EDUAID_AFRICA">EduAid-Africa</SelectItem>
                <SelectItem value="SPONSOR_STUDENT">
                  Sponsor a Student
                </SelectItem>
                <SelectItem value="TVET_GRANT">TVET Grant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>FX</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status as OrderStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{order.full_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${order.total_usd.toFixed(2)}
                        </div>
                        {order.pay_currency && order.pay_currency !== "USD" && (
                          <div className="text-xs text-muted-foreground">
                            {order.pay_amount_total?.toFixed(2)}{" "}
                            {order.pay_currency}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.fx_rate && order.fx_rate !== 1 ? (
                          <div className="text-xs">
                            <div>{order.fx_rate.toFixed(4)}</div>
                            {order.fx_markup_amount ? (
                              <div className="text-gold">
                                +${order.fx_markup_amount.toFixed(2)}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {order.impact_destination?.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.provider || "-"}</TableCell>
                      <TableCell className="text-xs">
                        {order.created_at
                          ? format(new Date(order.created_at), "MMM d, HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/shop/orders/${order.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
