/**
 * i18n initialization and configuration
 * Sets up i18next with all 11 supported languages
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/config/i18n.config';

// Import all locale resources
import enCommon from '@/locales/en/common.json';
import enPages from '@/locales/en/pages.json';
import enNomination from '@/locales/en/nomination.json';
import enDashboard from '@/locales/en/dashboard.json';

import frCommon from '@/locales/fr/common.json';
import arCommon from '@/locales/ar/common.json';
import ptCommon from '@/locales/pt/common.json';
import swCommon from '@/locales/sw/common.json';
import haCommon from '@/locales/ha/common.json';
import yoCommon from '@/locales/yo/common.json';
import amCommon from '@/locales/am/common.json';
import zuCommon from '@/locales/zu/common.json';
import zhCommon from '@/locales/zh/common.json';
import hiCommon from '@/locales/hi/common.json';

// Build resources object
const resources = {
  en: {
    common: enCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  fr: {
    common: frCommon,
    pages: enPages, // Fallback to English
    nomination: enNomination,
    dashboard: enDashboard,
  },
  ar: {
    common: arCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  pt: {
    common: ptCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  sw: {
    common: swCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  ha: {
    common: haCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  yo: {
    common: yoCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  am: {
    common: amCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  zu: {
    common: zuCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  zh: {
    common: zhCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  hi: {
    common: hiCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
};

// Custom language detector that respects our locale priority
const customDetector = {
  name: 'nesaLocaleDetector',
  lookup() {
    // 1. Check localStorage
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.some(l => l.code === stored)) {
      return stored;
    }
    return null;
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem(LOCALE_STORAGE_KEY, lng);
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem(LOCALE_STORAGE_KEY) || DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES.map(l => l.code),
    
    // Namespace configuration
    ns: ['common', 'pages', 'nomination', 'dashboard'],
    defaultNS: 'common',
    
    // Detection options
    detection: {
      order: ['localStorage', 'querystring', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
      bindI18n: 'languageChanged loaded', // Re-render on language change
      bindI18nStore: 'added removed',
    },
  });

// Add custom detector
const languageDetector = new LanguageDetector();
languageDetector.addDetector(customDetector);

export default i18n;

/**
 * Change the current language
 */
export async function changeLanguage(locale: SupportedLocale): Promise<void> {
  // Store in localStorage first
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  
  // Update document direction for RTL languages
  const config = SUPPORTED_LOCALES.find(l => l.code === locale);
  if (config) {
    document.documentElement.dir = config.dir;
    document.documentElement.lang = locale;
  }
  
  // Change the i18n language (this triggers re-render)
  await i18n.changeLanguage(locale);
}

/**
 * Get current language
 */
export function getCurrentLanguage(): SupportedLocale {
  return (i18n.language as SupportedLocale) || DEFAULT_LOCALE;
}
