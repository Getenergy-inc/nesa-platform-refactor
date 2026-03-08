// Unified Auth Page — Sign In / Sign Up with tab switcher
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
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
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(42,85%,52%,0.04)_0%,_transparent_60%)]" />

        {/* Logo + Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <img src={nesaStamp} alt="NESA Africa" className="h-14 w-14 rounded-full object-contain" />
            <span className="font-display text-xl font-bold text-secondary-foreground">NESA Africa</span>
          </Link>
          <p className="text-secondary-foreground/50 text-sm max-w-sm mx-auto">
            Access nominations, standards, awards, and institutional platforms.
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="rounded-2xl border border-primary/15 bg-secondary shadow-2xl shadow-primary/5 overflow-hidden">
            {/* Tab Switcher */}
            <div className="flex border-b border-primary/10">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
                  activeTab === "login"
                    ? "text-primary"
                    : "text-secondary-foreground/40 hover:text-secondary-foreground/60"
                }`}
              >
                Sign In
                {activeTab === "login" && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
                  activeTab === "register"
                    ? "text-primary"
                    : "text-secondary-foreground/40 hover:text-secondary-foreground/60"
                }`}
              >
                Sign Up
                {activeTab === "register" && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8">
              {activeTab === "login" ? (
                <LoginForm onSwitchToRegister={() => setActiveTab("register")} />
              ) : (
                <RegisterEntry onSwitchToLogin={() => setActiveTab("login")} />
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 text-center text-secondary-foreground/30 text-xs mt-8"
        >
          By continuing, you agree to our{" "}
          <Link to="/policies" className="text-primary/70 hover:text-primary hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/policies" className="text-primary/70 hover:text-primary hover:underline">
            Privacy Policy
          </Link>
        </motion.p>
      </div>
    </>
  );
}
