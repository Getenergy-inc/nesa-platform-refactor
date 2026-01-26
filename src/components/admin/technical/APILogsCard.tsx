import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import type { APILogSummary } from "@/types/admin";

interface APILogsCardProps {
  logs: APILogSummary[];
  loading?: boolean;
}

export function APILogsCard({ logs, loading }: APILogsCardProps) {
  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500/10 text-blue-600",
      POST: "bg-emerald-500/10 text-emerald-600",
      PUT: "bg-amber-500/10 text-amber-600",
      PATCH: "bg-purple-500/10 text-purple-600",
      DELETE: "bg-rose-500/10 text-rose-600",
    };
    return <Badge className={colors[method] ?? "bg-gray-500/10 text-gray-600"}>{method}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-500" />
          API Request Summary
        </CardTitle>
        <CardDescription>
          Aggregated view of API endpoint usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Avg Time</TableHead>
                <TableHead className="text-right">Error Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                  <TableCell>{getMethodBadge(log.method)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {log.total_requests.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {log.avg_response_time_ms.toFixed(0)}ms
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={log.error_rate > 5 ? 'text-rose-600 font-medium' : log.error_rate > 1 ? 'text-amber-600' : 'text-muted-foreground'}>
                      {log.error_rate.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No API log data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
