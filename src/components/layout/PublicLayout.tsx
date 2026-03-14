// Public Layout Component
// Wraps all public-facing pages with NESAHeader and MobileBottomNav

import { ReactNode } from "react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { TopPageNav, BottomPageNav } from "@/components/navigation/PageNavigation";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";

interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      <NESAHeader />
      <TopPageNav />
      <main className="flex-1 pb-20 lg:pb-16">
        {children}
      </main>
      {showFooter && <NESAFooter />}
      <BottomPageNav />
      <ExitIntentPopup />
    </div>
  );
}

export default PublicLayout;
