import { nrcApi } from "@/api/newnrc";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Lock, Sparkles } from "lucide-react";

export default function ProtectedView({ children }) {
  const { accessToken } = useAuth();

  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await nrcApi.fetchNrcDetails(accessToken);
        setAllowed(data?.role === "NRC_LEAD");
      } catch {
        setAllowed(false);
      }
    }

    if (accessToken) loadData();
  }, [accessToken]);

  return (
    <div className="relative w-full h-full">
      {children}

      <AnimatePresence>
        {allowed === false && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            {/* ambient glow */}
            <div className="absolute w-[500px] h-[500px] bg-yellow-400/10 blur-[120px] rounded-full" />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="relative pointer-events-auto"
            >
              {/* shimmer border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/30 via-transparent to-yellow-400/30 blur-lg opacity-60" />

              <div className="relative w-[360px] rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 text-center shadow-2xl">
                {/* icon */}
                <motion.div
                  animate={{
                    rotate: [0, -8, 8, -6, 6, 0],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 border border-yellow-400/40"
                >
                  <Lock className="h-6 w-6 text-yellow-300" />
                </motion.div>

                <h2 className="text-xl font-semibold text-white">
                  Locked Feature
                </h2>

                <p className="mt-2 text-sm text-white/70">
                  You don’t currently have permission to access this section.
                </p>

                {/* decorative divider */}
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex items-center justify-center gap-2 text-xs text-yellow-300/80">
                  <Sparkles className="h-3 w-3" />
                  NRC Lead access required
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
