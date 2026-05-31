// Public Layout Component
// Wraps all public-facing pages with NESAHeader and MobileBottomNav

import { ReactNode } from "react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { BottomPageNav } from "@/components/navigation/PageNavigation";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { PageFAQSection, FloatingFAQButton } from "@/components/nesa/PageFAQ";
import { MobileAGCWallet } from "@/components/rewards/MobileAGCWallet";
import { TrustSpine } from "@/components/trust/TrustSpine";

interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  /** Set false to suppress the auto-injected page FAQ section above the footer */
  showFAQ?: boolean;
  /** Set false to suppress the site-wide Trust Spine strip above the footer */
  showTrustSpine?: boolean;
  /** Trust Spine variant — defaults to "compact" */
  trustSpineVariant?: "full" | "compact" | "alignment" | "governance";
}

export function PublicLayout({
  children,
  showFooter = true,
  showFAQ = true,
  showTrustSpine = true,
  trustSpineVariant = "compact",
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      <NESAHeader />
      <main className="flex-1 pt-14 sm:pt-16 lg:pt-[100px] pb-20 lg:pb-16">
        {children}
      </main>
      {showTrustSpine && <TrustSpine variant={trustSpineVariant} />}
      {showFAQ && <PageFAQSection />}
      {showFooter && <NESAFooter />}
      <MobileBottomNav />
      <BottomPageNav />
      <ExitIntentPopup />
      <FloatingFAQButton />
      <MobileAGCWallet />
    </div>
  );
}

export default PublicLayout;
