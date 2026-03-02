import { Helmet } from "react-helmet-async";
import { GoldSpecialRecognitionSection } from "@/components/nesa/GoldSpecialRecognitionSection";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";

export default function GoldSpecialRecognition() {
  return (
    <>
      <Helmet>
        <title>{`Gold Special Recognition — 2025 Edition | NESA-Africa`}</title>
        <meta
          name="description"
          content="Cultural Impact Recognition: Celebrating sports icons, music artists, and digital voices using their influence to advance education across Africa and the Diaspora."
        />
        <meta property="og:title" content="Gold Special Recognition — 2025 Edition | NESA-Africa" />
        <meta property="og:description" content="Celebrating cultural leaders championing education advocacy across Africa." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nesa.africa/awards/gold-special-recognition" />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />
        <GoldSpecialRecognitionSection />
        <NESAFooter />
      </div>
    </>
  );
}
