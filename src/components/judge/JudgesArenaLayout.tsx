import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { JudgesSidebar } from "./JudgesSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { ArenaTopBar, ArenaFooter } from "@/components/arena/ArenaChrome";

interface JudgesArenaLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function JudgesArenaLayout({ children, title, description }: JudgesArenaLayoutProps) {
  const { user } = useAuth();
  return (
    <SidebarProvider>
      {title && (
        <Helmet>
          <title>{`${title} | Judges Arena`}</title>
        </Helmet>
      )}
      <div className="min-h-screen flex w-full bg-arena-bg text-arena-text">
        <JudgesSidebar />
        <SidebarInset className="bg-arena-bg">
          <ArenaTopBar
            title={title ?? "NESA-Africa Judges Arena"}
            subtitle={description ?? "Private Deliberation · Audit Enabled"}
            leading={<SidebarTrigger className="text-gold" />}
            statusLabel="Judging Live"
            statusDetail="2026 Cycle"
            statusTone="live"
            identityName={user?.email ?? "Judge"}
            identityRole="Panel Judge"
            notifications={3}
          />
          <main className="flex-1 min-w-0">{children}</main>
          <ArenaFooter workspace="Judges Arena" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default JudgesArenaLayout;
