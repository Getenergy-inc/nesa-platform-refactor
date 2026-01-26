import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { TrendingUp, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface FXRateCardProps {
  currentRate: number;
  lastUpdated: string | null;
  onUpdateRate: (newRate: number) => Promise<void>;
}

export function FXRateCard({ currentRate, lastUpdated, onUpdateRate }: FXRateCardProps) {
  const [open, setOpen] = useState(false);
  const [newRate, setNewRate] = useState(currentRate.toString());
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate <= 0) {
      toast.error("Please enter a valid rate");
      return;
    }

    setUpdating(true);
    try {
      await onUpdateRate(rate);
      toast.success("FX rate updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update FX rate");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              FX Rate Management
            </CardTitle>
            <CardDescription>
              Set the AGC to USD exchange rate
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-2" />
                Update Rate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update FX Rate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rate">New Rate (1 AGC = $ USD)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="0.0100"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Current rate: 1 AGC = ${currentRate.toFixed(4)} USD
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating ? "Updating..." : "Update Rate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">1 AGC</span>
          <span className="text-2xl text-muted-foreground">=</span>
          <span className="text-3xl font-bold text-emerald-600">
            ${currentRate.toFixed(4)} USD
          </span>
        </div>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
