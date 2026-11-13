// About NESA-Africa 2026 — 2026–2027 Content Framework, section 10.
import { AboutSeo } from "@/pages/about/AboutSeo";
import { ABOUT_2026, CERTIFICATE_NOTICE } from "@/config/contentFramework2026";
import { FwCtas, FwList, FwSection } from "@/components/framework2026/FwBlocks";

export default function AboutCycle2026() {
  return (
    <>
      <AboutSeo
        title="NESA-Africa 2026 · Four Tiers, 22 Awards, 90 Subcategories"
        description="Four tiers, 22 awards and 90 subcategories. Online programme, up to nine Africa Education Icons, nine Icon NRC members, nine independent Icon judges, no public voting."
        path="/about/nesa-africa-2026"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "NESA-Africa 2026", path: "/about/nesa-africa-2026" }]}
      />
      <section className="bg-charcoal text-ivory">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <h1 className="font-display text-4xl md:text-6xl font-bold">{ABOUT_2026.title}</h1>
          <FwList items={ABOUT_2026.points} />
          <FwCtas ctas={ABOUT_2026.ctas} />
        </div>
      </section>
      <FwSection title="Certificates of Recognition" light>
        <p className="mt-4 max-w-3xl">{CERTIFICATE_NOTICE}</p>
      </FwSection>
    </>
  );
}
