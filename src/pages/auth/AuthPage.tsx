// Unified Auth Page — Sign In / Sign Up with tab switcher
// Same black+gold visual language as landing page
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterEntry } from "@/components/auth/RegisterEntry";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

  return (
    <>
      <Helmet>
        <title>{activeTab === "login" ? "Sign In" : "Sign Up"} | NESA-Africa</title>
      </Helmet>
      <div className="min-h-[100svh] bg-secondary flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
        {/* Matching glow from hero */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_hsla(42,85%,52%,0.06)_0%,_transparent_70%)]" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/5 to-transparent" />

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-secondary-foreground/40 hover:text-primary text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </motion.div>

        {/* Logo + Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col items-center mb-6 sm:mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-primary/8 blur-lg" />
              <img src={nesaStamp} alt="NESA Africa" className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full object-contain" />
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-secondary-foreground">NESA Africa</span>
          </Link>
          <p className="text-secondary-foreground/40 text-xs sm:text-sm text-center max-w-xs">
            Welcome to the continental platform for education excellence.
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 w-full max-w-[420px]"
        >
          <div className="rounded-2xl border border-primary/12 bg-[hsl(30_8%_9%)] shadow-2xl shadow-primary/5 overflow-hidden">
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 border-b border-primary/10">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-3.5 text-sm font-semibold transition-colors touch-manipulation ${
                    activeTab === tab
                      ? "text-primary"
                      : "text-secondary-foreground/35 hover:text-secondary-foreground/55"
                  }`}
                >
                  {tab === "login" ? "Sign In" : "Sign Up"}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="auth-tab-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "login" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "login" ? 10 : -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === "login" ? (
                    <LoginForm onSwitchToRegister={() => setActiveTab("register")} />
                  ) : (
                    <RegisterEntry onSwitchToLogin={() => setActiveTab("login")} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative z-10 text-center text-secondary-foreground/25 text-[11px] mt-6"
        >
          By continuing, you agree to our{" "}
          <Link to="/policies" className="text-primary/60 hover:text-primary hover:underline">Terms</Link>
          {" & "}
          <Link to="/policies" className="text-primary/60 hover:text-primary hover:underline">Privacy Policy</Link>
        </motion.p>
      </div>
    </>
  );
}
