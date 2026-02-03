import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function PageLoader({ message = "Loading...", size = "md" }: PageLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className={`${sizeClasses[size]} text-primary animate-spin mx-auto`} />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}

export function SectionLoader({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-2">
        <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto" />
        {message && <p className="text-muted-foreground text-xs">{message}</p>}
      </div>
    </div>
  );
}

export function CardLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-muted rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

export function ListLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-4">
          <div className="h-12 w-12 bg-muted rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
