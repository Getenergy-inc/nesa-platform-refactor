import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  ShieldCheck,
  Sparkles,
  QrCode,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { celebrateStars } from "@/lib/celebrate";

const STEPS = [
  {
    icon: Award,
    title: "Sign in to your NESA-Africa account",
    body: "Use the email you nominated, judged, or were honoured with. Your certificates are linked to your verified profile.",
  },
  {
    icon: Sparkles,
    title: "Open My Certificates",
    body: "Go to /my-certificates from the user menu. Every Platinum, Gold-Blue Garnet, Africa Education Icon, judge, and participation certificate appears here.",
  },
  {
    icon: Download,
    title: "Tap Download to receive your landscape PDF",
    body: "Each certificate is generated on demand with your name, category, season, EDI Matrix snapshot, QR verification code, and SHA256 integrity hash.",
  },
  {
    icon: Share2,
    title: "Share your moment of pride",
    body: "Use the Share button to send your verification link to LinkedIn, WhatsApp, or email. Anyone can verify authenticity on /verify.",
  },
  {
    icon: ShieldCheck,
    title: "Verify any certificate, anytime",
    body: "Open /certificates/verify or scan the certificate QR. The Gold-Blue Garnet Awards governance trail confirms issuance, season, and tier.",
  },
];

export default function CertificateGuide() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Helmet>
        <title>How to Download Your Certificate — NESA-Africa</title>
        <meta
          name="description"
          content="A joyful, step-by-step guide to downloading, sharing, and verifying your NESA-Africa Gold-Blue Garnet Awards certificate."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-charcoal-dark via-charcoal to-charcoal py-16 px-4">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" aria-hidden />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl mx-auto text-center space-y-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Your moment, your proof
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            How to Download Your{" "}
            <span className="text-gold">Certificate</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            A joyful, 5-step walkthrough to claim, share, and verify your NESA-Africa
            Gold-Blue Garnet Awards certificate — designed to celebrate the work that
            earned it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              asChild
              size="lg"
              className="bg-gold text-charcoal hover:bg-gold-dark"
              onClick={() => celebrateStars()}
            >
              <Link to="/my-certificates">
                <Download className="mr-2 h-4 w-4" />
                Open My Certificates
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-white hover:bg-gold/10">
              <Link to="/certificates/verify">
                <QrCode className="mr-2 h-4 w-4" />
                Verify a Certificate
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <ol className="space-y-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative rounded-2xl border border-white/10 bg-charcoal-light/40 p-5 md:p-6 hover:border-gold/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold/80">
                        Step {i + 1}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-gold/60" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm md:text-[15px] text-white/65 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* Trust strip */}
        <div className="mt-10 rounded-2xl border border-gold/25 bg-gold/5 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="text-sm text-white/75 leading-relaxed">
              <p className="font-semibold text-white mb-1">Every certificate is governed.</p>
              Every NESA-Africa certificate carries a QR verification code, a unique
              verification ID, and a SHA256 integrity hash. Sponsorship, donation, ticket,
              merchandise, partnership, or AGC Voting Coin participation does not influence
              certificate issuance — recognition follows strict Automated NRC verification,
              EDI Matrix scoring, and Gold-Blue Garnet Awards governance.
            </div>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            className="bg-gold text-charcoal hover:bg-gold-dark"
            onClick={() => celebrateStars()}
          >
            <Link to="/my-certificates">
              Go to My Certificates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
