import { useMemo, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Award, Printer, ArrowLeft, MapPin, Calendar, Sparkles, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NomineeImage } from "@/components/shared/NomineeImage";
import { SocialShareBar } from "@/components/shared/SocialShareBar";
import {
  buildDefaultRecommendation,
  getContributorRefCode,
} from "@/data/contributors";
import { useContributors } from "@/hooks/useContributors";

export default function ContributorProfile() {
  const { id } = useParams<{ id: string }>();
  const { contributors } = useContributors();
  const contributor = useMemo(
    () => contributors.find((c) => c.id === id),
    [contributors, id],
  );
  const printRef = useRef<HTMLDivElement>(null);

  if (!contributor) return <Navigate to="/contributors" replace />;

  const resolvedImage = contributor.imageUrl;
  const refCode = getContributorRefCode(contributor);
  const tenure =
    contributor.yearEnd && contributor.yearEnd !== contributor.yearStart
      ? `${contributor.yearStart} – ${contributor.yearEnd}`
      : `${contributor.yearStart} – Present`;
  const recommendation = contributor.recommendation || buildDefaultRecommendation(contributor);
  const appreciation =
    contributor.appreciation ||
    `On behalf of the NESA-Africa community, we extend our sincere appreciation to ${contributor.name} for their steadfast service and the lasting imprint they have made on our mission.`;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/contributors/${contributor.id}`
      : `https://www.nesa.africa/contributors/${contributor.id}`;
  const shareTitle = `Honouring ${contributor.name} — ${contributor.role} at NESA-Africa (${tenure})`;
  const shareText = contributor.highlight || appreciation;

  const handlePrint = () => window.print();

  return (
    <>
      <Helmet>
        <title>{`${contributor.name} | NESA-Africa Contributor`}</title>
        <meta name="description" content={shareText} />
        <link rel="canonical" href={shareUrl} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareText} />
        <meta property="og:url" content={shareUrl} />
        {resolvedImage && <meta property="og:image" content={resolvedImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #letter-print, #letter-print * { visibility: visible !important; }
          #letter-print { position: absolute; inset: 0; padding: 24px; background: white !important; color: #111 !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="bg-charcoal min-h-screen">
        <div className="container mx-auto px-4 py-10 md:py-14 max-w-5xl">
          {/* Back */}
          <Button asChild variant="ghost" className="text-gold hover:bg-gold/10 mb-6 no-print">
            <Link to="/contributors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hall of Fame
            </Link>
          </Button>

          {/* Header card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal-light/40 to-transparent p-6 md:p-8 flex flex-col md:flex-row gap-6"
          >
            <NomineeImage
              src={resolvedImage}
              alt={contributor.name}
              name={contributor.name}
              size="xl"
              type={contributor.role === "BOA" ? "logo" : "photo"}
              showBorder
            />
            <div className="flex-1">
              <p className="text-gold text-xs uppercase tracking-[0.25em] font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> NESA-Africa Hall of Fame
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight">
                {contributor.name}
              </h1>
              {contributor.title && <p className="text-gold/90 mt-1">{contributor.title}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/70 text-sm mt-3">
                <span className="inline-flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-gold" /> {contributor.role}
                </span>
                {contributor.country && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gold" /> {contributor.country}
                    {contributor.region ? ` · ${contributor.region}` : ""}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gold" /> {tenure}
                </span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-gold/30 bg-charcoal/60 px-3 py-1.5">
                <span className="text-white/50 text-xs uppercase tracking-wider">Reference</span>
                <code className="text-gold font-mono text-sm">{refCode}</code>
              </div>
            </div>
          </motion.div>

          {/* Bio + Contribution */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="md:col-span-2 space-y-6">
              {contributor.bio && (
                <section className="rounded-xl border border-gold/15 bg-charcoal-light/40 p-5">
                  <h2 className="text-gold text-sm uppercase tracking-wider mb-2">Biography</h2>
                  <p className="text-white/85 leading-relaxed whitespace-pre-line">{contributor.bio}</p>
                </section>
              )}

              <section className="rounded-xl border border-gold/15 bg-charcoal-light/40 p-5">
                <h2 className="text-gold text-sm uppercase tracking-wider mb-2">Contribution to NESA-Africa</h2>
                <p className="text-white/85 leading-relaxed whitespace-pre-line">
                  {contributor.contributionDescription ||
                    contributor.highlight ||
                    `Served NESA-Africa as ${contributor.role} (${tenure}).`}
                </p>
                {contributor.contributions && contributor.contributions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {contributor.contributions.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 rounded-full text-[11px] bg-gold/15 text-gold border border-gold/30"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Appreciation */}
              <section className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/15 to-transparent p-5">
                <h2 className="text-gold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Quote className="h-4 w-4" /> Appreciation
                </h2>
                <p className="text-white/90 italic leading-relaxed">"{appreciation}"</p>
                <p className="text-white/60 text-xs mt-3">— The NESA-Africa Convener & Board</p>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-xl border border-gold/15 bg-charcoal-light/40 p-5">
                <h3 className="text-gold text-sm uppercase tracking-wider mb-3">Verify & Track</h3>
                <p className="text-white/70 text-sm">
                  This recognition is tracked under reference code:
                </p>
                <code className="block mt-2 text-gold font-mono text-base">{refCode}</code>
                <p className="text-white/50 text-xs mt-3">
                  Anyone can verify this contributor record by quoting the reference code at
                  contact@nesa.africa.
                </p>
              </div>

              <div className="rounded-xl border border-gold/15 bg-charcoal-light/40 p-5 no-print">
                <SocialShareBar
                  url={shareUrl}
                  title={shareTitle}
                  text={shareText}
                  hashtags={["NESAAfrica", "EducationAwards", "Africa", contributor.role.replace(/\s+/g, "")]}
                />
              </div>

              <div className="no-print">
                <Button onClick={handlePrint} className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                  <Printer className="mr-2 h-4 w-4" /> Print / Download Letter
                </Button>
              </div>
            </aside>
          </div>

          {/* Recommendation Letter (printable) */}
          <section
            id="letter-print"
            ref={printRef}
            className="mt-10 rounded-2xl border border-gold/20 bg-white text-charcoal p-8 md:p-12 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 pb-6 mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
                  NESA-Africa — The African Blue-Garnet Awards for Education
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-charcoal mt-1">
                  Letter of Recommendation
                </h2>
                <p className="text-charcoal/70 text-sm mt-1">
                  Issued to <span className="font-semibold">{contributor.name}</span> · {tenure}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="uppercase tracking-wider text-charcoal/50">Reference</p>
                <code className="font-mono text-sm text-charcoal">{refCode}</code>
                <p className="text-charcoal/50 mt-1">Issued: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="prose prose-sm md:prose-base max-w-none text-charcoal whitespace-pre-line leading-relaxed">
              {recommendation}
            </div>

            <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-charcoal/10 pt-6">
              <div>
                <div className="h-12 w-40 border-b-2 border-charcoal/40 mb-1" />
                <p className="text-xs text-charcoal/70">Convener, NESA-Africa</p>
              </div>
              <div className="text-right text-[10px] text-charcoal/50 max-w-xs">
                Verify this letter by quoting the reference code <strong>{refCode}</strong> to
                contact@nesa.africa or via www.nesa.africa/verify.
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
