import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Search, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import type { AuditLogEntry } from "@/types/admin";

interface AuditTrailCardProps {
  logs: AuditLogEntry[];
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilter: (filters: { action?: string; entity_type?: string }) => void;
  onExport: () => void;
}

const actionColors: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-600",
  update: "bg-blue-500/10 text-blue-600",
  delete: "bg-rose-500/10 text-rose-600",
  role_assigned: "bg-purple-500/10 text-purple-600",
  role_removed: "bg-amber-500/10 text-amber-600",
  renomination: "bg-cyan-500/10 text-cyan-600",
};

export function AuditTrailCard({ 
  logs, 
  loading, 
  page, 
  totalPages, 
  onPageChange, 
  onFilter,
  onExport 
}: AuditTrailCardProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [entityFilter, setEntityFilter] = useState<string>('');

  const handleFilter = () => {
    onFilter({
      action: actionFilter || undefined,
      entity_type: entityFilter || undefined,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
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
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              Audit Trail
            </CardTitle>
            <CardDescription>
              Immutable log of all system actions
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="role_assigned">Role Assigned</SelectItem>
                <SelectItem value="role_removed">Role Removed</SelectItem>
                <SelectItem value="renomination">Renomination</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Entity type..."
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-[150px]"
            />
            <Button variant="secondary" size="icon" onClick={handleFilter}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={actionColors[log.action] ?? "bg-gray-500/10 text-gray-600"}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.entity_type}</TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-[150px]">
                    {log.user_id?.slice(0, 8) ?? 'System'}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Audit Log Details</DialogTitle>
                        </DialogHeader>
                        {selectedLog && (
                          <ScrollArea className="max-h-[60vh]">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Action</p>
                                  <Badge className={actionColors[selectedLog.action] ?? ""}>
                                    {selectedLog.action}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Entity Type</p>
                                  <p className="font-medium">{selectedLog.entity_type}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Entity ID</p>
                                  <p className="font-mono text-sm">{selectedLog.entity_id ?? '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">User ID</p>
                                  <p className="font-mono text-sm">{selectedLog.user_id ?? 'System'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Timestamp</p>
                                  <p className="text-sm">{new Date(selectedLog.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">IP Address</p>
                                  <p className="font-mono text-sm">{selectedLog.ip_address ?? '—'}</p>
                                </div>
                              </div>
                              
                              {selectedLog.old_values && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Old Values</p>
                                  <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto">
                                    {JSON.stringify(selectedLog.old_values, null, 2)}
                                  </pre>
                                </div>
                              )}
                              
                              {selectedLog.new_values && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">New Values</p>
                                  <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto">
                                    {JSON.stringify(selectedLog.new_values, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No audit logs found
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
