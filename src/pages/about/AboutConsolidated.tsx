// About NESA-Africa — 2026–2027 Content Framework, section 10 (/about, #scef, #governance).
import { useEffect } from "react";
import { AboutSeo } from "@/pages/about/AboutSeo";
import { ABOUT, CORE_PROMISE, HOME, INTEGRITY } from "@/config/contentFramework2026";
import { FwCtas, FwList, FwSection } from "@/components/framework2026/FwBlocks";

export default function AboutConsolidated() {
  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    const el = hash ? document.getElementById(hash) : null;
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
  }, []);

  return (
    <>
      <AboutSeo
        title="About NESA-Africa · The African Blue-Garnet Awards for Education"
        description="NESA-Africa is a pan-African education-recognition and documentation programme hosted by Santos Creations Educational Foundation."
        path="/about"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
      />
      <section className="bg-charcoal text-ivory">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <h1 className="font-display text-4xl md:text-6xl font-bold">{ABOUT.title}</h1>
          {ABOUT.intro.map((p) => <p key={p} className="mt-5 max-w-3xl text-lg text-ivory/80">{p}</p>)}
          <FwCtas ctas={ABOUT.ctas} />
        </div>
      </section>

      <FwSection id="identity" eyebrow="Public identity" title="NESA-Africa" light>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {ABOUT.identity.map(([k, v]) => (
            <div key={k}><dt className="text-xs uppercase tracking-wider text-charcoal/60">{k}</dt><dd className="mt-1 font-semibold">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-6 text-sm">The programme serves: {ABOUT.serves.join(" · ")}</p>
        <blockquote className="mt-6 border-l-4 border-gold pl-4 font-display text-lg">{CORE_PROMISE}</blockquote>
      </FwSection>

      <FwSection id="how-it-works" eyebrow="Recognition journey" title="How Recognition Works">
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME.steps.map((s) => (
            <li key={s.title} className="rounded-lg border border-gold/20 p-5">
              <h3 className="font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-ivory/80">{s.body}</p>
            </li>
          ))}
        </ol>
      </FwSection>

      <FwSection id="scef" title={ABOUT.scef.title} light>
        <p className="mt-4">SCEF is the:</p>
        <FwList items={ABOUT.scef.points} light />
        <FwCtas ctas={ABOUT.scef.ctas} />
      </FwSection>

      <FwSection id="governance" title={ABOUT.governance.title}>
        <FwList items={ABOUT.governance.points} />
        <p className="mt-6 font-display text-lg text-gold">{INTEGRITY.title}</p>
        <p className="mt-2 text-ivory/85">{INTEGRITY.body}</p>
        <FwCtas ctas={ABOUT.governance.ctas} />
      </FwSection>
    </>
  );
}
