import { jsPDF } from "jspdf";

interface CertificateData {
  nomineeName: string;
  nomineeTitle: string | null;
  nomineeOrganization: string | null;
  tier: "platinum" | "gold" | "blue_garnet" | "icon";
  verificationCode: string;
  seasonName: string;
  seasonYear: number;
  issuedAt: string;
  expiresAt: string | null;
  isLifetime: boolean;
}

const tierConfig = {
  platinum: {
    label: "Platinum Certificate",
    color: "#64748b",
    accent: "#94a3b8",
    tagline: "For Excellence in African Education",
  },
  gold: {
    label: "Gold Award",
    color: "#d97706",
    accent: "#fbbf24",
    tagline: "Recognized for Outstanding Contribution to Education",
  },
  blue_garnet: {
    label: "Blue Garnet Award",
    color: "#1d4ed8",
    accent: "#3b82f6",
    tagline: "Africa's Highest Education Excellence Honour",
  },
  icon: {
    label: "Africa Education Icon",
    color: "#4f46e5",
    accent: "#6366f1",
    tagline: "Lifetime Achievement in African Education",
  },
};

export async function generateCertificatePDF(data: CertificateData): Promise<Blob> {
  const config = tierConfig[data.tier];
  
  // Create landscape A4 PDF
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(252, 251, 250);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative border
  doc.setDrawColor(config.color);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Corner decorations
  const cornerSize = 20;
  doc.setFillColor(config.color);
  
  // Top-left corner
  doc.triangle(10, 10, 10 + cornerSize, 10, 10, 10 + cornerSize, "F");
  // Top-right corner
  doc.triangle(pageWidth - 10, 10, pageWidth - 10 - cornerSize, 10, pageWidth - 10, 10 + cornerSize, "F");
  // Bottom-left corner
  doc.triangle(10, pageHeight - 10, 10 + cornerSize, pageHeight - 10, 10, pageHeight - 10 - cornerSize, "F");
  // Bottom-right corner
  doc.triangle(pageWidth - 10, pageHeight - 10, pageWidth - 10 - cornerSize, pageHeight - 10, pageWidth - 10, pageHeight - 10 - cornerSize, "F");

  // Header - NESA-Africa
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("NESA-AFRICA", pageWidth / 2, 35, { align: "center" });

  // Main Title
  doc.setFontSize(32);
  doc.setTextColor(config.color);
  doc.text(config.label.toUpperCase(), pageWidth / 2, 55, { align: "center" });

  // Decorative line
  doc.setDrawColor(config.accent);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 60, 62, pageWidth / 2 + 60, 62);

  // "Presented to" text
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("This certifies that", pageWidth / 2, 80, { align: "center" });

  // Nominee Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(30, 30, 30);
  doc.text(data.nomineeName.toUpperCase(), pageWidth / 2, 95, { align: "center" });

  // Title & Organization
  if (data.nomineeTitle || data.nomineeOrganization) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    const subtitle = [data.nomineeTitle, data.nomineeOrganization].filter(Boolean).join(" • ");
    doc.text(subtitle, pageWidth / 2, 105, { align: "center" });
  }

  // Tagline
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.setTextColor(config.color);
  doc.text(config.tagline, pageWidth / 2, 125, { align: "center" });

  // Season
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(`${data.seasonName} Edition`, pageWidth / 2, 140, { align: "center" });

  // Issue Date
  const issuedDate = new Date(data.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Issued: ${issuedDate}`, pageWidth / 2, 150, { align: "center" });

  // Validity
  if (data.isLifetime) {
    doc.setTextColor(config.color);
    doc.text("Valid for Lifetime", pageWidth / 2, 158, { align: "center" });
  } else if (data.expiresAt) {
    const expiresDate = new Date(data.expiresAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Valid until: ${expiresDate}`, pageWidth / 2, 158, { align: "center" });
  }

  // Verification Code
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Verification Code: ${data.verificationCode}`, pageWidth / 2, 175, { align: "center" });

  // Verification URL
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Verify at: nesa-africa.org/certificates/verify?code=${data.verificationCode}`,
    pageWidth / 2,
    182,
    { align: "center" }
  );

  // QR Code placeholder note
  doc.setFontSize(7);
  doc.text("Scan QR code on digital version to verify authenticity", pageWidth / 2, 188, { align: "center" });

  // Return as blob
  return doc.output("blob");
}

export function downloadCertificatePDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
