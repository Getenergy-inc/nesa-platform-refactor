import { AboutSeo } from "@/pages/about/AboutSeo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Building, GraduationCap, Heart, Library } from "lucide-react";

const PLATFORMS = [
  { icon: Award, title: "NESA-Africa", description: "Education recognition, documentation, research and responsible storytelling." },
  { icon: Heart, title: "EduAid-Africa", description: "Practical education support, including Rebuild My School Africa, Support a Special-Needs School and Afri-EduTourism." },
  { icon: BookOpen, title: "SCEF Media", description: "NESA-Africa TV, It’s In Me Radio, webinars, podcasts, documentaries and the E-Journal." },
  { icon: GraduationCap, title: "EduAid-Africa Academy", description: "Training and learning for Africa’s education enablers." },
];

export default function SCEF() {
  return (
    <>
      <AboutSeo title="About SCEF | Santos Creations Educational Foundation" description="SCEF is the host and governance organisation behind NESA-Africa, EduAid-Africa, SCEF Media and EduAid-Africa Academy." path="/about/scef" breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "SCEF", path: "/about/scef" }]} />
      <div className="min-h-screen bg-charcoal">
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4"><div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2"><Building className="h-6 w-6 text-primary" /><span className="text-sm font-medium uppercase tracking-wider text-primary">Santos Creations Educational Foundation</span></div>
            <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">Education for All Through Recognition, Support and Collaboration</h1>
            <p className="mb-8 text-lg text-white/70">Santos Creations Educational Foundation is the host and governance organisation behind NESA-Africa, EduAid-Africa, SCEF Media and EduAid-Africa Academy.</p>
            <div className="flex flex-wrap gap-3"><Button asChild className="bg-primary text-primary-foreground"><a href="#programmes">Explore Our Programmes</a></Button><Button asChild variant="outline" className="border-primary/50 text-primary"><Link to="/partners">Partner With SCEF</Link></Button></div>
          </div></div>
        </section>
        <section className="bg-charcoal/95 py-16 lg:py-24"><div className="container mx-auto px-4"><div className="mx-auto max-w-3xl text-center">
          <Library className="mx-auto mb-6 h-12 w-12 text-primary" />
          <h2 className="mb-6 font-display text-3xl font-bold text-white">One host, distinct responsibilities</h2>
          <p className="text-lg leading-relaxed text-white/80">SCEF provides organisational oversight and governance. Its education vision began in 1997, and its work supports SDG 4. Taking part in one programme does not guarantee recognition in another. Commercial support and recognition decisions remain separate.</p>
        </div></div></section>
        <section id="programmes" className="bg-charcoal py-16 lg:py-24"><div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">Four platforms</h2>
          <div className="grid gap-6 md:grid-cols-2">{PLATFORMS.map((platform) => <Card key={platform.title} className="border-white/10 bg-white/5"><CardHeader><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><platform.icon className="h-5 w-5 text-primary" /></div><CardTitle className="text-white">{platform.title}</CardTitle><CardDescription className="text-white/60">{platform.description}</CardDescription></CardHeader></Card>)}</div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-white/65">Rebuild My School Africa, Support a Special-Needs School and Afri-EduTourism are EduAid-Africa services, not separate SCEF platforms.</p>
        </div></section>
      </div>
    </>
  );
}
