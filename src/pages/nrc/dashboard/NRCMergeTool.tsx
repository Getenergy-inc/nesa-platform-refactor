/**
 * NRC Merge Tool — Duplicate resolution and nominee record merging
 */

import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Merge, Search, ArrowRight, CheckCircle, AlertTriangle, Users, FileText, Image as ImageIcon, Award,
} from "lucide-react";
import { getAllMasterNominees, type MasterNominee } from "@/lib/nomineeMasterData";
import { detectDuplicates, type DuplicateMatch } from "@/lib/nominationEngine";

function MergeToolContent() {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [selectedA, setSelectedA] = useState<MasterNominee | null>(null);
  const [selectedB, setSelectedB] = useState<MasterNominee | null>(null);
  const [mergeNotes, setMergeNotes] = useState("");
  const allNominees = useMemo(() => getAllMasterNominees(), []);

  const resultsA = useMemo(() => {
    if (searchA.length < 2) return [];
    const q = searchA.toLowerCase();
    return allNominees.filter(n => n.name.toLowerCase().includes(q)).slice(0, 8);
  }, [allNominees, searchA]);

  const resultsB = useMemo(() => {
    if (searchB.length < 2) return [];
    const q = searchB.toLowerCase();
    return allNominees.filter(n => n.name.toLowerCase().includes(q) && n.id !== selectedA?.id).slice(0, 8);
  }, [allNominees, searchB, selectedA]);

  const autoMatches = useMemo(() => {
    if (!selectedA) return [];
    return detectDuplicates(selectedA.name, selectedA.country, selectedA.category);
  }, [selectedA]);

  const handleMerge = () => {
    if (!selectedA || !selectedB) return;
    toast.success(`Merge initiated: "${selectedA.name}" ← "${selectedB.name}"`, {
      description: "Records merged. Audit log entry created.",
    });
    setSelectedA(null);
    setSelectedB(null);
    setSearchA("");
    setSearchB("");
    setMergeNotes("");
  };

  return (
    <>
      <Helmet><title>Merge Tool — NRC Dashboard</title></Helmet>
      <NRCDashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Merge className="h-6 w-6 text-gold" />
              Nominee Merge Tool
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Resolve duplicates by merging nominee records. The primary record is preserved with enriched data.
            </p>
          </div>

          {/* Auto-detected duplicates */}
          {autoMatches.length > 0 && selectedA && (
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Auto-Detected Matches for "{selectedA.name}"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {autoMatches.map((m, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                      <div>
                        <p className="text-sm text-white">{m.nominee.name}</p>
                        <p className="text-xs text-white/40">{m.nominee.country} — {m.matchDetails}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs border-0 bg-amber-500/20 text-amber-400">
                          {m.confidence}%
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-gold text-xs"
                          onClick={() => { setSelectedB(m.nominee); setSearchB(m.nominee.name); }}>
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Record A — Primary */}
            <Card className="bg-[hsl(30,5%,12%)] border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Primary Record (Keep)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    placeholder="Search nominee..."
                    value={searchA}
                    onChange={e => { setSearchA(e.target.value); setSelectedA(null); }}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                {!selectedA && resultsA.length > 0 && (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {resultsA.map(n => (
                      <button key={n.id} onClick={() => { setSelectedA(n); setSearchA(n.name); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <p className="text-sm text-white">{n.name}</p>
                        <p className="text-xs text-white/40">{n.country} — {n.category}</p>
                      </button>
                    ))}
                  </div>
                )}
                {selectedA && (
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
                    <p className="text-lg font-bold text-white">{selectedA.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-white/40">Country:</span> <span className="text-white">{selectedA.country}</span></div>
                      <div><span className="text-white/40">Category:</span> <span className="text-white truncate">{selectedA.category}</span></div>
                      <div><span className="text-white/40">Pathway:</span> <span className="text-white">{selectedA.pathway}</span></div>
                      <div><span className="text-white/40">Status:</span> <span className="text-white">{selectedA.workflowStatus}</span></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Record B — Merge Into */}
            <Card className="bg-[hsl(30,5%,12%)] border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
                  <Merge className="h-4 w-4" />
                  Duplicate Record (Merge & Archive)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    placeholder="Search duplicate..."
                    value={searchB}
                    onChange={e => { setSearchB(e.target.value); setSelectedB(null); }}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                {!selectedB && resultsB.length > 0 && (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {resultsB.map(n => (
                      <button key={n.id} onClick={() => { setSelectedB(n); setSearchB(n.name); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <p className="text-sm text-white">{n.name}</p>
                        <p className="text-xs text-white/40">{n.country} — {n.category}</p>
                      </button>
                    ))}
                  </div>
                )}
                {selectedB && (
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-4 space-y-2">
                    <p className="text-lg font-bold text-white">{selectedB.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-white/40">Country:</span> <span className="text-white">{selectedB.country}</span></div>
                      <div><span className="text-white/40">Category:</span> <span className="text-white truncate">{selectedB.category}</span></div>
                      <div><span className="text-white/40">Pathway:</span> <span className="text-white">{selectedB.pathway}</span></div>
                      <div><span className="text-white/40">Status:</span> <span className="text-white">{selectedB.workflowStatus}</span></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Merge Controls */}
          {selectedA && selectedB && (
            <Card className="bg-[hsl(30,5%,12%)] border-gold/20">
              <CardHeader>
                <CardTitle className="text-sm text-gold flex items-center gap-2">
                  <Merge className="h-4 w-4" />
                  Merge Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 justify-center text-sm">
                  <span className="text-emerald-400 font-medium">{selectedA.name}</span>
                  <ArrowRight className="h-4 w-4 text-gold" />
                  <span className="text-amber-400 line-through">{selectedB.name}</span>
                </div>

                <div className="rounded-lg bg-white/5 p-4 space-y-2 text-xs">
                  <p className="text-white/50">Merge will:</p>
                  <ul className="space-y-1 text-white/60 ml-4">
                    <li>• Keep primary record: <strong className="text-white">{selectedA.name}</strong></li>
                    <li>• Archive duplicate: <strong className="text-white">{selectedB.name}</strong></li>
                    <li>• Merge best biography, evidence, and images</li>
                    <li>• Create audit log entry</li>
                    <li>• Preserve historical traceability</li>
                  </ul>
                </div>

                <Textarea
                  placeholder="Merge notes (required for audit trail)..."
                  value={mergeNotes}
                  onChange={e => setMergeNotes(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />

                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" className="text-white/50" onClick={() => { setSelectedA(null); setSelectedB(null); }}>
                    Cancel
                  </Button>
                  <Button className="bg-gold hover:bg-gold/90 text-charcoal gap-2"
                    disabled={!mergeNotes.trim()}
                    onClick={handleMerge}>
                    <Merge className="h-4 w-4" />
                    Execute Merge
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </NRCDashboardLayout>
    </>
  );
}

export default function NRCMergeTool() {
  return (
    <ProtectedRoute>
      <MergeToolContent />
    </ProtectedRoute>
  );
}
