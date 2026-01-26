import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { toast } from "sonner";
import type { DisbursementRun } from "@/types/admin";

interface DisbursementRunsCardProps {
  runs: DisbursementRun[];
  loading?: boolean;
  onRunDisbursement: (notes: string) => Promise<void>;
  onViewDetails: (runId: string) => void;
}

export function DisbursementRunsCard({ runs, loading, onRunDisbursement, onViewDetails }: DisbursementRunsCardProps) {
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    try {
      await onRunDisbursement(notes);
      toast.success("Disbursement run initiated successfully");
      setRunDialogOpen(false);
      setNotes('');
    } catch (error) {
      toast.error("Failed to initiate disbursement run");
    } finally {
      setRunning(false);
    }
  };

  const getStatusBadge = (status: DisbursementRun['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Draft
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
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
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-500" />
              Disbursement Runs
            </CardTitle>
            <CardDescription>
              Execute and track revenue distribution
            </CardDescription>
          </div>
          <Dialog open={runDialogOpen} onOpenChange={setRunDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Run Disbursement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Run Disbursement</DialogTitle>
                <DialogDescription>
                  This will calculate and distribute revenue according to the current split configuration.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this disbursement run..."
                    rows={3}
                  />
                </div>
                <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Warning:</strong> This action will create permanent ledger entries and cannot be undone.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRunDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleRun} disabled={running}>
                  {running ? "Processing..." : "Confirm & Run"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-medium">
                    {new Date(run.run_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${run.total_amount_usd.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(run.status)}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {run.notes ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewDetails(run.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {runs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No disbursement runs yet
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
