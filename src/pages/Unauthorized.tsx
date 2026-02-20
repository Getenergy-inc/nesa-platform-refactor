import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ShieldX, Home, LogIn, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

const suggestedPages = [
  { icon: Home, label: "Home", href: "/", description: "Return to the landing page" },
  { icon: LogIn, label: "Login", href: "/auth", description: "Sign in to your account" },
];

export default function Unauthorized() {
  const location = useLocation();

  useEffect(() => {
    console.error("403 Error: Unauthorized access attempt:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Access Denied | NESA-Africa</title>
      </Helmet>
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 py-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/">
            <img src={nesaStamp} alt="NESA Africa" className="h-16 w-16 rounded-full object-contain" />
          </Link>
        </motion.div>

        {/* 403 Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-8xl font-bold text-gold/30 mb-2 font-display">403</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
            Access Denied
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            You don't have permission to access this page. Please sign in or contact an administrator.
          </p>
        </motion.div>

        {/* Suggested Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full mb-10"
        >
          {suggestedPages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              className="group flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 hover:border-gold/30 hover:bg-white/8 transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                <page.icon className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm group-hover:text-gold transition-colors">{page.label}</p>
                <p className="text-white/40 text-xs">{page.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/">
            <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
