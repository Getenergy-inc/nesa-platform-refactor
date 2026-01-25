import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Award, ZoomIn, Shield, Clock, Star } from "lucide-react";

import platinumCertificate from "@/assets/certificates/platinum-certificate.jpeg";
import goldCertificate from "@/assets/certificates/gold-certificate.jpeg";
import blueGarnetCertificate from "@/assets/certificates/blue-garnet-certificate.jpeg";
import iconCertificate from "@/assets/certificates/icon-certificate.jpeg";

interface CertificateInfo {
  id: string;
  name: string;
  image: string;
  tier: "platinum" | "gold" | "blue-garnet" | "icon";
  validity: string;
  description: string;
  features: string[];
}

const certificates: CertificateInfo[] = [
  {
    id: "platinum",
    name: "Platinum Certificate",
    image: platinumCertificate,
    tier: "platinum",
    validity: "1 Year",
    description: "Awarded for Excellence in Advancing Education Across Africa",
    features: [
      "Baseline recognition tier",
      "Non-competitive achievement",
      "Annual renewal required",
      "QR verification enabled"
    ]
  },
  {
    id: "gold",
    name: "Gold Certificate",
    image: goldCertificate,
    tier: "gold",
    validity: "Annual",
    description: "Blue Garnet Award Category Winner recognition",
    features: [
      "Competitive 100% public voting",
      "Qualifies for Blue Garnet",
      "Regional representation",
      "QR verification enabled"
    ]
  },
  {
    id: "blue-garnet",
    name: "Blue Garnet Certificate",
    image: blueGarnetCertificate,
    tier: "blue-garnet",
    validity: "Lifetime",
    description: "For Achieving Education Excellence Across Africa",
    features: [
      "Highest competitive honor",
      "60% Jury / 40% Public scoring",
      "9 continental winners",
      "QR verification enabled"
    ]
  },
  {
    id: "icon",
    name: "Africa Education Icon",
    image: iconCertificate,
    tier: "icon",
    validity: "Lifetime",
    description: "For Lifetime Achievement in Education Across Africa",
    features: [
      "Highest lifetime honor",
      "Jury-selected recognition",
      "Permanent legacy status",
      "Global authentication"
    ]
  }
];

const tierStyles = {
  platinum: {
    bg: "bg-gradient-to-br from-slate-100 to-slate-300",
    border: "border-slate-400/50",
    badge: "bg-slate-600 text-white",
    text: "text-slate-700"
  },
  gold: {
    bg: "bg-gradient-to-br from-amber-100 to-yellow-200",
    border: "border-gold/50",
    badge: "bg-gold text-charcoal",
    text: "text-amber-800"
  },
  "blue-garnet": {
    bg: "bg-gradient-to-br from-blue-200 to-slate-300",
    border: "border-blue-500/50",
    badge: "bg-blue-700 text-white",
    text: "text-blue-800"
  },
  icon: {
    bg: "bg-gradient-to-br from-indigo-100 to-blue-200",
    border: "border-indigo-400/50",
    badge: "bg-indigo-700 text-white",
    text: "text-indigo-800"
  }
};

function CertificateCard({ cert }: { cert: CertificateInfo }) {
  const style = tierStyles[cert.tier];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${style.bg} ${style.border} border-2`}
        >
          {/* Certificate Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={cert.image} 
              alt={cert.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-white">
                <ZoomIn className="h-5 w-5" />
                <span className="text-sm font-medium">Click to view full certificate</span>
              </div>
            </div>
          </div>

          {/* Certificate Info */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Badge className={style.badge}>
                {cert.tier === "icon" ? "Icon Award" : `${cert.tier.charAt(0).toUpperCase() + cert.tier.slice(1)} Tier`}
              </Badge>
              <div className={`flex items-center gap-1 text-sm ${style.text}`}>
                <Clock className="h-3.5 w-3.5" />
                <span>{cert.validity}</span>
              </div>
            </div>
            
            <h3 className={`font-display text-xl font-bold mb-2 ${style.text}`}>
              {cert.name}
            </h3>
            <p className={`text-sm ${style.text} opacity-80 mb-4`}>
              {cert.description}
            </p>

            <div className="space-y-2">
              {cert.features.slice(0, 2).map((feature, idx) => (
                <div key={idx} className={`flex items-center gap-2 text-xs ${style.text}`}>
                  <Star className="h-3 w-3 fill-current" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-charcoal border-gold/20">
        <div className="relative">
          <img 
            src={cert.image} 
            alt={cert.name}
            className="w-full h-auto"
          />
        </div>
        <div className="p-6 bg-charcoal">
          <div className="flex items-center gap-3 mb-3">
            <Award className="h-6 w-6 text-gold" />
            <h3 className="font-display text-2xl font-bold text-white">{cert.name}</h3>
          </div>
          <p className="text-white/70 mb-4">{cert.description}</p>
          <div className="grid grid-cols-2 gap-3">
            {cert.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                <Shield className="h-4 w-4 text-gold" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CertificateGallery() {
  return (
    <section className="bg-charcoal py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-gold/30 text-gold mb-4">
            <Award className="h-3.5 w-3.5 mr-1.5" />
            Official Certificates
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Award Certificate Designs
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Each certificate tier represents a distinct level of recognition in African education excellence, 
            featuring QR-code verification and official authentication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-white/50 text-sm">
            All certificates include global QR authentication • Verify at{" "}
            <span className="text-gold">verify.nesa.africa</span>
          </p>
        </div>
      </div>
    </section>
  );
}
