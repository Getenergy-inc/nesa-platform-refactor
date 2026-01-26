import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentProviderStatus } from "@/types/admin";

interface PaymentProviderStatusCardProps {
  providers: PaymentProviderStatus[];
  loading?: boolean;
  onRefresh: () => void;
}

export function PaymentProviderStatusCard({ providers, loading, onRefresh }: PaymentProviderStatusCardProps) {
  const getStatusIcon = (status: PaymentProviderStatus['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-emerald-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-rose-500" />;
    }
  };

  const getStatusBadge = (status: PaymentProviderStatus['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-emerald-500/10 text-emerald-600">Online</Badge>;
      case 'degraded':
        return <Badge className="bg-amber-500/10 text-amber-600">Degraded</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
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
              <Wifi className="h-5 w-5 text-blue-500" />
              Payment Provider Status
            </CardTitle>
            <CardDescription>
              Real-time status of payment gateways
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.provider}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(provider.status)}
                  <span className="font-semibold">{provider.provider}</span>
                </div>
                {getStatusBadge(provider.status)}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">{provider.response_time_ms}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Success Rate</span>
                  <span className={`font-medium ${provider.success_rate_24h >= 99 ? 'text-emerald-600' : provider.success_rate_24h >= 95 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {provider.success_rate_24h.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Ping</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(provider.last_ping_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {providers.length === 0 && (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              No provider status data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
