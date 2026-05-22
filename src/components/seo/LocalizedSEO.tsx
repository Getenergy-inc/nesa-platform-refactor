import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES } from "@/config/i18n.config";

const SITE = "https://nesaafrica.lovable.app";

interface LocalizedSEOProps {
  /** Localized page title (single string). */
  title: string;
  /** Localized meta description. */
  description: string;
  /** Optional Open Graph title (defaults to title). */
  ogTitle?: string;
  /** Optional Open Graph description (defaults to description). */
  ogDescription?: string;
  /** Optional keywords meta. */
  keywords?: string;
  /**
   * Pathname for canonical + hreflang alternates.
   * Defaults to the current route's pathname.
   * Always pass the language-agnostic path (no ?lang= query).
   */
  pathname?: string;
}

/**
 * LocalizedSEO — single source of truth for per-route i18n SEO.
 *
 * Emits:
 *  - <html lang> + <html dir>
 *  - <title>, <meta name="description">
 *  - Open Graph + Twitter localized tags
 *  - <link rel="canonical">
 *  - hreflang alternates for ALL 12 supported locales + x-default
 *
 * Use on every public route. Igbo (`ig`) and every other supported locale
 * receive a matching `<link rel="alternate" hreflang="..">` automatically,
 * so search engines can serve the right language variant.
 */
export function LocalizedSEO({
  title,
  description,
  ogTitle,
  ogDescription,
  keywords,
  pathname,
}: LocalizedSEOProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = (i18n.language || "en").split("-")[0];
  const dir =
    SUPPORTED_LOCALES.find((l) => l.code === lang)?.dir ?? "ltr";

  // Strip any existing ?lang= query and trailing slash duplication
  const path = (pathname ?? location.pathname) || "/";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE}${cleanPath}${cleanPath === "/" ? "" : ""}?lang=${lang}`;
  const xDefault = `${SITE}${cleanPath}`;

  return (
    <Helmet>
      <html lang={lang} dir={dir} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle ?? title} />
      <meta property="og:description" content={ogDescription ?? description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={lang} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:title" content={ogTitle ?? title} />
      <meta name="twitter:description" content={ogDescription ?? description} />

      {/* Canonical (per-locale) */}
      <link rel="canonical" href={canonical} />

      {/* hreflang alternates — covers Igbo (ig) and every supported locale */}
      <link rel="alternate" hrefLang="x-default" href={xDefault} />
      {SUPPORTED_LOCALES.map((l) => (
        <link
          key={l.code}
          rel="alternate"
          hrefLang={l.code}
          href={`${SITE}${cleanPath}?lang=${l.code}`}
        />
      ))}
    </Helmet>
  );
}

export default LocalizedSEO;
