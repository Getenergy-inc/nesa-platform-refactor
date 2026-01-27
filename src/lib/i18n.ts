/**
 * i18n initialization and configuration
 * Sets up i18next with all 11 supported languages
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
import frPages from '@/locales/fr/pages.json';
import arCommon from '@/locales/ar/common.json';
import arPages from '@/locales/ar/pages.json';
import ptCommon from '@/locales/pt/common.json';
import ptPages from '@/locales/pt/pages.json';
import swCommon from '@/locales/sw/common.json';
import swPages from '@/locales/sw/pages.json';
import haCommon from '@/locales/ha/common.json';
import haPages from '@/locales/ha/pages.json';
import yoCommon from '@/locales/yo/common.json';
import yoPages from '@/locales/yo/pages.json';
import amCommon from '@/locales/am/common.json';
import amPages from '@/locales/am/pages.json';
import zuCommon from '@/locales/zu/common.json';
import zuPages from '@/locales/zu/pages.json';
import zhCommon from '@/locales/zh/common.json';
import zhPages from '@/locales/zh/pages.json';
import hiCommon from '@/locales/hi/common.json';
import hiPages from '@/locales/hi/pages.json';

// Build resources object with all translations
const resources = {
  en: {
    common: enCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  fr: {
    common: frCommon,
    pages: frPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  ar: {
    common: arCommon,
    pages: arPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  pt: {
    common: ptCommon,
    pages: ptPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  sw: {
    common: swCommon,
    pages: swPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  ha: {
    common: haCommon,
    pages: haPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  yo: {
    common: yoCommon,
    pages: yoPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  am: {
    common: amCommon,
    pages: amPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  zu: {
    common: zuCommon,
    pages: zuPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  zh: {
    common: zhCommon,
    pages: zhPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  hi: {
    common: hiCommon,
    pages: hiPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
};

// Get stored language or default
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.some(l => l.code === stored)) {
      return stored;
    }
  }
  return DEFAULT_LOCALE;
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES.map(l => l.code),
    
    // Namespace configuration
    ns: ['common', 'pages', 'nomination', 'dashboard'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;

/**
 * Change the current language
 */
export async function changeLanguage(locale: SupportedLocale): Promise<void> {
  // Store in localStorage
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  
  // Update document direction for RTL languages
  const config = SUPPORTED_LOCALES.find(l => l.code === locale);
  if (config) {
    document.documentElement.dir = config.dir;
    document.documentElement.lang = locale;
  }
  
  // Change the i18n language
  await i18n.changeLanguage(locale);
}

/**
 * Get current language
 */
export function getCurrentLanguage(): SupportedLocale {
  return (i18n.language as SupportedLocale) || DEFAULT_LOCALE;
}
