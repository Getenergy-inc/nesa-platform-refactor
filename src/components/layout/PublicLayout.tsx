// Public Layout Component
// Wraps all public-facing pages with NESAHeader and MobileBottomNav

import { ReactNode } from "react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { BottomPageNav } from "@/components/navigation/PageNavigation";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { PageFAQSection, FloatingFAQButton } from "@/components/nesa/PageFAQ";
import { MobileAGCWallet } from "@/components/rewards/MobileAGCWallet";
import { TrustSpine } from "@/components/trust/TrustSpine";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";
import { MobileBottomActions } from "@/components/navigation/MobileBottomActions";
import { useLocation } from "react-router-dom";


interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  /** Set false to suppress the auto-injected page FAQ section above the footer */
  showFAQ?: boolean;
  /** Set false to suppress the site-wide Trust Spine strip above the footer */
  showTrustSpine?: boolean;
  /** Trust Spine variant — defaults to "compact" */
  trustSpineVariant?: "full" | "compact" | "alignment" | "governance";
  /** Set false to suppress the global "Explore Existing Nominees" CTA above the footer */
  showExploreNomineesCTA?: boolean;
}


export function PublicLayout({
  children,
  showFooter = true,
  showFAQ = true,
  showTrustSpine = true,
  trustSpineVariant = "compact",
  showExploreNomineesCTA = true,
}: PublicLayoutProps) {
  const { pathname } = useLocation();
  // Hide the global CTA on directory/profile surfaces where it would be redundant
  const onNomineesSurface = pathname.startsWith("/nominees");
  const showCTA = showExploreNomineesCTA && !onNomineesSurface;

  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      <NESAHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-[92px] xl:pt-[134px] pb-[148px] lg:pb-16">
        {children}
      </main>
      {showCTA && (
        <div className="container mx-auto max-w-6xl px-4 pb-8">
          <ExploreNomineesCTA />
        </div>
      )}
      {showTrustSpine && <TrustSpine variant={trustSpineVariant} />}
      {showFAQ && <PageFAQSection />}
      {showFooter && <NESAFooter />}
      <BottomPageNav />
      <ExitIntentPopup />
      <FloatingFAQButton />
      <MobileAGCWallet />
      <MobileBottomActions />
    </div>
  );
}


export default PublicLayout;
