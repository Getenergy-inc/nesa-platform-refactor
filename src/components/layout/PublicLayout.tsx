import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MobileBottomNav } from "../navigation/MainNav";
import { TopPageNav, BottomPageNav } from "../navigation/PageNavigation";
import { NESAFooter } from "../nesa/NESAFooter";
import { NESAHeader } from "../nesa/NESAHeader";

export const PublicLayout = ({
  children,
  showFooter = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) => {
  const location = useLocation();

  // ✅ Detect dashboard pages
  const isDashboard =
    location.pathname.startsWith("/nominee") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/nrc");

  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      {/* ✅ ONLY show public headers on non-dashboard */}
      {!isDashboard && <NESAHeader />}
      {!isDashboard && <TopPageNav />}

      {/* MAIN */}
      <main
        className={cn(
          "flex-1",
          !isDashboard && "pb-20 lg:pb-16", // public pages need bottom spacing
          isDashboard && "overflow-x-hidden", // dashboards need clean layout
        )}
      >
        {children}
      </main>

      {/* FOOTER + NAVS */}
      {!isDashboard && showFooter && <NESAFooter />}
      {!isDashboard && <BottomPageNav />}
      {!isDashboard && <MobileBottomNav />}
    </div>
  );
};
