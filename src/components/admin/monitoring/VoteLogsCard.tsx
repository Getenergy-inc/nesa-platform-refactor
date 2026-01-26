import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Vote, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import type { VoteLog, RiskFlag } from "@/types/admin";

interface VoteLogsCardProps {
  logs: VoteLog[];
  riskFlags: RiskFlag[];
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function VoteLogsCard({ logs, riskFlags, loading, page, totalPages, onPageChange }: VoteLogsCardProps) {
  const [showRiskOnly, setShowRiskOnly] = useState(false);

  const filteredLogs = showRiskOnly 
    ? logs.filter(log => log.risk_flags && log.risk_flags.length > 0)
    : logs;

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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Vote className="h-5 w-5 text-purple-500" />
            Vote Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            {riskFlags.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {riskFlags.length} Risk Flags
              </Badge>
            )}
            <Button 
              variant={showRiskOnly ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setShowRiskOnly(!showRiskOnly)}
            >
              {showRiskOnly ? "Show All" : "Show Flagged"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Nominee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{log.nominee_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.vote_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {log.risk_flags && log.risk_flags.length > 0 ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Flagged
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Valid</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No vote logs available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
