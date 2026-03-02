import { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle, Share, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Smartphone className="h-10 w-10 text-primary" />
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Install NESA-Africa
        </h1>
        <p className="text-muted-foreground mb-8">
          Get the full app experience — instant access, offline support, and faster loading right from your home screen.
        </p>

        {isInstalled ? (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Already installed!</span>
          </div>
        ) : isIOS ? (
          <div className="space-y-4 text-left bg-secondary/50 rounded-xl p-6">
            <h3 className="font-semibold text-foreground text-center mb-4">Install on iPhone / iPad</h3>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Share className="h-4 w-4 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">Tap the <strong className="text-foreground">Share</strong> button in Safari's toolbar</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">Tap <strong className="text-foreground">"Add"</strong> to install</p>
            </div>
          </div>
        ) : deferredPrompt ? (
          <Button
            onClick={handleInstall}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 gap-2 font-bold"
          >
            <Download className="h-5 w-5" />
            Install App
          </Button>
        ) : (
          <div className="space-y-4 text-left bg-secondary/50 rounded-xl p-6">
            <h3 className="font-semibold text-foreground text-center mb-4">Install on Android</h3>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MoreVertical className="h-4 w-4 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">Tap the <strong className="text-foreground">menu (⋮)</strong> in your browser</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">Tap <strong className="text-foreground">"Install app"</strong> or <strong className="text-foreground">"Add to Home Screen"</strong></p>
            </div>
          </div>
        )}

        <p className="text-muted-foreground/60 text-xs mt-8">
          Works offline • No app store needed • Always up to date
        </p>
      </motion.div>
    </div>
  );
}
