import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, CheckCircle, XCircle, AlertTriangle, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { exportNomineesForDatabase, getNomineeExportStats } from "@/lib/nomineeExport";
import { toast } from "sonner";

interface ImportResult {
  success: boolean;
  dry_run: boolean;
  results: {
    total: number;
    valid: number;
    skipped: number;
    inserted: number;
    errors: string[];
    missing_subcategories: string[];
  };
}

export function NomineeImportCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ReturnType<typeof getNomineeExportStats> | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const loadStats = () => {
    const exportStats = getNomineeExportStats();
    setStats(exportStats);
  };

  const runImport = async (dryRun: boolean) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { nominees } = exportNomineesForDatabase();
      
      const { data, error } = await supabase.functions.invoke("seed-nominees", {
        body: { nominees, dry_run: dryRun },
      });

      if (error) {
        toast.error(`Import failed: ${error.message}`);
        return;
      }

      setResult(data as ImportResult);
      
      if (data.success) {
        if (dryRun) {
          toast.info(`Dry run complete: ${data.results.valid} nominees ready to import`);
        } else {
          toast.success(`Successfully imported ${data.results.inserted} nominees!`);
        }
      }
    } catch (err) {
      toast.error(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-charcoal-light border-gold/20">
      <CardHeader>
        <CardTitle className="text-ivory flex items-center gap-2">
          <Database className="w-5 h-5 text-gold" />
          Import CSV Nominees to Database
        </CardTitle>
        <CardDescription className="text-ivory/60">
          Parse nominees from the CSV file and import them into the database for live updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Preview */}
        {!stats && (
          <Button 
            onClick={loadStats} 
            variant="outline" 
            className="border-gold/30 text-gold hover:bg-gold/10"
          >
            Preview Import Stats
          </Button>
        )}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-charcoal/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{stats.total}</div>
              <div className="text-xs text-ivory/60">Total Nominees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.mapped}</div>
              <div className="text-xs text-ivory/60">Mapped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{stats.unmapped}</div>
              <div className="text-xs text-ivory/60">Need Mapping</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ivory">{stats.unmappedSlugs.length}</div>
              <div className="text-xs text-ivory/60">Unique Unmapped</div>
            </div>
          </div>
        )}

        {/* Unmapped slugs */}
        {stats && stats.unmappedSlugs.length > 0 && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
              <AlertTriangle className="w-4 h-4" />
              Unmapped Subcategory Slugs
            </div>
            <div className="flex flex-wrap gap-1">
              {stats.unmappedSlugs.slice(0, 10).map((slug) => (
                <Badge key={slug} variant="outline" className="text-xs border-amber-500/30 text-amber-300">
                  {slug}
                </Badge>
              ))}
              {stats.unmappedSlugs.length > 10 && (
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-300">
                  +{stats.unmappedSlugs.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {stats && (
          <div className="flex gap-3">
            <Button
              onClick={() => runImport(true)}
              disabled={isLoading}
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Dry Run
            </Button>
            <Button
              onClick={() => runImport(false)}
              disabled={isLoading}
              className="bg-gold hover:bg-gold-dark text-charcoal"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Import to Database
            </Button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={`p-4 rounded-lg border ${result.success ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
            <div className="flex items-center gap-2 mb-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-medium ${result.success ? "text-green-400" : "text-red-400"}`}>
                {result.dry_run ? "Dry Run Complete" : "Import Complete"}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-ivory/60">Total:</span>
                <span className="ml-2 text-ivory">{result.results.total}</span>
              </div>
              <div>
                <span className="text-ivory/60">Valid:</span>
                <span className="ml-2 text-green-400">{result.results.valid}</span>
              </div>
              <div>
                <span className="text-ivory/60">Skipped:</span>
                <span className="ml-2 text-amber-400">{result.results.skipped}</span>
              </div>
              <div>
                <span className="text-ivory/60">Inserted:</span>
                <span className="ml-2 text-gold">{result.results.inserted}</span>
              </div>
            </div>

            {result.results.missing_subcategories.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-ivory/60 mb-1">Missing subcategories in DB:</div>
                <div className="flex flex-wrap gap-1">
                  {result.results.missing_subcategories.slice(0, 5).map((slug) => (
                    <Badge key={slug} variant="outline" className="text-xs border-red-500/30 text-red-300">
                      {slug}
                    </Badge>
                  ))}
                  {result.results.missing_subcategories.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{result.results.missing_subcategories.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {result.results.errors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-red-400 mb-1">Errors:</div>
                {result.results.errors.slice(0, 3).map((err, i) => (
                  <div key={i} className="text-xs text-red-300">{err}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
