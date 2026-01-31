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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, FileText } from "lucide-react";
import type { SettlementRun, SettlementStatus } from "@/types/settlement";

interface SettlementRunsTableProps {
  runs: SettlementRun[];
  isLoading?: boolean;
  onViewDetails?: (run: SettlementRun) => void;
  onExport?: (runId: string) => void;
}

const statusColors: Record<SettlementStatus, "default" | "secondary" | "destructive" | "outline"> = {
  COMPLETED: "default",
  PROCESSING: "secondary",
  STARTED: "outline",
  FAILED: "destructive",
};

export function SettlementRunsTable({
  runs,
  isLoading,
  onViewDetails,
  onExport,
}: SettlementRunsTableProps) {
  const formatWindow = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getTotalNet = (run: SettlementRun) => {
    const currencies = run.totals_json?.currencies || [];
    return currencies.reduce((sum, c) => sum + (c.net || 0), 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Settlement Run History
        </CardTitle>
        <CardDescription>
          View past settlement executions and their disbursements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading settlement runs...
          </div>
        ) : runs.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No settlement runs yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Window</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Payments</TableHead>
                <TableHead className="text-right">Net Distributed</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-mono text-xs">
                    {formatWindow(run.window_start, run.window_end)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[run.status]}>
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {run.payments_processed}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${getTotalNet(run).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {run.completed_at
                      ? new Date(run.completed_at).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails?.(run)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onExport?.(run.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
