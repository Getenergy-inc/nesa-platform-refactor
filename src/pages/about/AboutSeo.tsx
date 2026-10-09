import { Helmet } from "react-helmet-async";

const SITE_URL = "https://nesaafrica.lovable.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface AboutSeoProps {
  title: string;
  description: string;
  path: string; // e.g. "/about/nesa-africa-2026"
  image?: string; // absolute URL preferred
  breadcrumbs?: Array<{ name: string; path: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  type?: "website" | "article";
}

/**
 * Shared SEO block for every About page:
 * - Canonical title + meta description
 * - Open Graph + Twitter card
 * - JSON-LD: WebPage + BreadcrumbList (+ optional FAQPage)
 */
export function AboutSeo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  breadcrumbs,
  faqs,
  type = "website",
}: AboutSeoProps) {
  const url = `${SITE_URL}${path}`;

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "NESA-Africa",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "New Education Standard Award Africa",
      url: SITE_URL,
    },
  };

  const breadcrumbLd = breadcrumbs && breadcrumbs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${b.path}`,
        })),
      }
    : null;

  const faqLd = faqs && faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="NESA-Africa" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(webPageLd)}</script>
      {breadcrumbLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      )}
      {faqLd && (
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      )}
    </Helmet>
  );
}

export default AboutSeo;
