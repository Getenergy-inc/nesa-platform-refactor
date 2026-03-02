import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home, Search, Award, Users, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

const suggestedPages = [
  { icon: Home, label: "Home", href: "/", description: "Return to the landing page" },
  { icon: Award, label: "Nominate", href: "/nominate", description: "Submit a nomination" },
  { icon: Users, label: "Nominees", href: "/nominees", description: "Explore nominees" },
  { icon: Search, label: "Categories", href: "/categories", description: "Browse award categories" },
  { icon: MapPin, label: "Chapters", href: "/chapters", description: "Find your local chapter" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found | NESA-Africa</title>
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

        {/* 404 Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <h1 className="text-8xl font-bold text-gold/30 mb-2 font-display">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
            Page Not Found
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            The page <code className="text-gold/70 bg-white/5 px-2 py-0.5 rounded text-sm">{location.pathname}</code> doesn't exist. Here are some pages that might help:
          </p>
        </motion.div>

        {/* Suggested Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl w-full mb-10"
        >
          {suggestedPages.map((page, index) => (
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
};

export default NotFound;
