import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { JudgesSidebar } from "./JudgesSidebar";

interface JudgesArenaLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function JudgesArenaLayout({ children, title, description }: JudgesArenaLayoutProps) {
  return (
    <SidebarProvider>
      {title && (
        <Helmet>
          <title>{`${title} | Judges Arena`}</title>
        </Helmet>
      )}
      <div className="min-h-screen flex w-full bg-charcoal text-white">
        <JudgesSidebar />
        <SidebarInset className="bg-charcoal">
          <header className="h-14 border-b border-gold/15 bg-charcoal/95 backdrop-blur sticky top-0 z-30 flex items-center gap-3 px-4">
            <SidebarTrigger className="text-gold" />
            {title && (
              <div>
                <h1 className="text-sm font-semibold text-white leading-tight">{title}</h1>
                {description && (
                  <p className="text-xs text-white/50 leading-tight">{description}</p>
                )}
              </div>
            )}
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default JudgesArenaLayout;
