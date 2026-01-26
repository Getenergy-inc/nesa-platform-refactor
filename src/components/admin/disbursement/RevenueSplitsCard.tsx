import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Edit2, Plus, Percent } from "lucide-react";
import { toast } from "sonner";
import type { RevenueSplit } from "@/types/admin";

interface RevenueSplitsCardProps {
  splits: RevenueSplit[];
  loading?: boolean;
  onUpdateSplit: (id: string, updates: Partial<RevenueSplit>) => Promise<void>;
  onAddSplit: (split: Omit<RevenueSplit, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function RevenueSplitsCard({ splits, loading, onUpdateSplit, onAddSplit }: RevenueSplitsCardProps) {
  const [editingSplit, setEditingSplit] = useState<RevenueSplit | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSplit, setNewSplit] = useState({ split_key: '', percent: '', destination_description: '' });

  const totalPercent = splits.filter(s => s.is_active).reduce((sum, s) => sum + s.percent, 0);

  const handleSave = async () => {
    if (!editingSplit) return;
    try {
      await onUpdateSplit(editingSplit.id, {
        percent: editingSplit.percent,
        destination_description: editingSplit.destination_description,
        is_active: editingSplit.is_active,
      });
      toast.success("Split updated successfully");
      setEditingSplit(null);
    } catch (error) {
      toast.error("Failed to update split");
    }
  };

  const handleAdd = async () => {
    const percent = parseFloat(newSplit.percent);
    if (!newSplit.split_key || isNaN(percent)) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await onAddSplit({
        split_key: newSplit.split_key,
        percent,
        destination_description: newSplit.destination_description || null,
        is_active: true,
        season_id: splits[0]?.season_id ?? '',
      });
      toast.success("Split added successfully");
      setAddDialogOpen(false);
      setNewSplit({ split_key: '', percent: '', destination_description: '' });
    } catch (error) {
      toast.error("Failed to add split");
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
              <PieChart className="h-5 w-5 text-emerald-500" />
              Revenue Split Configuration
            </CardTitle>
            <CardDescription>
              Configure how revenue is distributed across stakeholders
            </CardDescription>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Split
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Revenue Split</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Split Key</Label>
                  <Input
                    value={newSplit.split_key}
                    onChange={(e) => setNewSplit({ ...newSplit, split_key: e.target.value })}
                    placeholder="e.g., CHAPTER_BONUS"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Percentage</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={newSplit.percent}
                    onChange={(e) => setNewSplit({ ...newSplit, percent: e.target.value })}
                    placeholder="10.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newSplit.destination_description}
                    onChange={(e) => setNewSplit({ ...newSplit, destination_description: e.target.value })}
                    placeholder="Description of this split"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Split</Button>
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
                <TableHead>Split Key</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {splits.map((split) => (
                <TableRow key={split.id}>
                  <TableCell className="font-medium">{split.split_key}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {split.destination_description ?? '—'}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {split.percent.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch 
                      checked={split.is_active} 
                      onCheckedChange={(checked) => onUpdateSplit(split.id, { is_active: checked })}
                    />
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingSplit(split)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Revenue Split</DialogTitle>
                        </DialogHeader>
                        {editingSplit && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Split Key</Label>
                              <Input value={editingSplit.split_key} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Percentage</Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={editingSplit.percent}
                                onChange={(e) => setEditingSplit({ 
                                  ...editingSplit, 
                                  percent: parseFloat(e.target.value) || 0 
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input
                                value={editingSplit.destination_description ?? ''}
                                onChange={(e) => setEditingSplit({ 
                                  ...editingSplit, 
                                  destination_description: e.target.value 
                                })}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingSplit(null)}>Cancel</Button>
                          <Button onClick={handleSave}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 p-4 rounded-lg bg-muted/50 flex items-center justify-between">
          <span className="text-sm font-medium">Total Active Allocation</span>
          <span className={`text-lg font-bold ${totalPercent === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {totalPercent.toFixed(2)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
