import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PortalHeader } from "@/components/judgeapply/PortalHeader";
import { Link } from "react-router-dom";

export default function PortalLayout() {
  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col">
      <Helmet>
        <title>Judges & NRC Portal | NESA-Africa 2026</title>
        <meta
          name="description"
          content="NESA-Africa 2026 Judges and Nominee Research Corps (NRC) portal. Learn how the process works, recommend a judge, or apply to join the NRC."
        />
      </Helmet>
      <PortalHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gold/15 bg-charcoal-light">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© 2026 NESA-Africa. Judges & NRC Portal.</div>
          <div className="flex gap-4">
            <Link to="/judgeapply/about/integrity" className="hover:text-gold">
              Integrity
            </Link>
            <Link to="/judgeapply/about/faq" className="hover:text-gold">
              FAQ
            </Link>
            <span className="text-white/40">
              Public navigation only — does not grant access.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
