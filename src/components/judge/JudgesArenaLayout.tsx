import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { JudgesSidebar } from "./JudgesSidebar";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JudgesArenaLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function JudgesArenaLayout({ children, title, description }: JudgesArenaLayoutProps) {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading Judges Arena...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  const isJudge = roles.includes("jury") || roles.includes("admin");
  if (!isJudge) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-charcoal">
        <JudgesSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 bg-charcoal/95 backdrop-blur border-b border-gold/10">
            <div className="flex items-center gap-4 px-4 py-3">
              <SidebarTrigger className="text-white/60 hover:text-white">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              {title && (
                <div>
                  <h1 className="text-lg font-semibold text-white">{title}</h1>
                  {description && (
                    <p className="text-xs text-white/50">{description}</p>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
