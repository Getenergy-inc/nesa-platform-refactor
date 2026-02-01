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
import frNomination from '@/locales/fr/nomination.json';
import frDashboard from '@/locales/fr/dashboard.json';

import arCommon from '@/locales/ar/common.json';
import arPages from '@/locales/ar/pages.json';
import arNomination from '@/locales/ar/nomination.json';
import arDashboard from '@/locales/ar/dashboard.json';

import ptCommon from '@/locales/pt/common.json';
import ptPages from '@/locales/pt/pages.json';
import ptNomination from '@/locales/pt/nomination.json';
import ptDashboard from '@/locales/pt/dashboard.json';

import swCommon from '@/locales/sw/common.json';
import swPages from '@/locales/sw/pages.json';
import swNomination from '@/locales/sw/nomination.json';
import swDashboard from '@/locales/sw/dashboard.json';

import haCommon from '@/locales/ha/common.json';
import haPages from '@/locales/ha/pages.json';
import haNomination from '@/locales/ha/nomination.json';
import haDashboard from '@/locales/ha/dashboard.json';

import yoCommon from '@/locales/yo/common.json';
import yoPages from '@/locales/yo/pages.json';
import yoNomination from '@/locales/yo/nomination.json';
import yoDashboard from '@/locales/yo/dashboard.json';

import amCommon from '@/locales/am/common.json';
import amPages from '@/locales/am/pages.json';
import amNomination from '@/locales/am/nomination.json';
import amDashboard from '@/locales/am/dashboard.json';

import zuCommon from '@/locales/zu/common.json';
import zuPages from '@/locales/zu/pages.json';
import zuNomination from '@/locales/zu/nomination.json';
import zuDashboard from '@/locales/zu/dashboard.json';

import zhCommon from '@/locales/zh/common.json';
import zhPages from '@/locales/zh/pages.json';
import zhNomination from '@/locales/zh/nomination.json';
import zhDashboard from '@/locales/zh/dashboard.json';

import hiCommon from '@/locales/hi/common.json';
import hiPages from '@/locales/hi/pages.json';
import hiNomination from '@/locales/hi/nomination.json';
import hiDashboard from '@/locales/hi/dashboard.json';

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
    nomination: frNomination,
    dashboard: frDashboard,
  },
  ar: {
    common: arCommon,
    pages: arPages,
    nomination: arNomination,
    dashboard: arDashboard,
  },
  pt: {
    common: ptCommon,
    pages: ptPages,
    nomination: ptNomination,
    dashboard: ptDashboard,
  },
  sw: {
    common: swCommon,
    pages: swPages,
    nomination: swNomination,
    dashboard: swDashboard,
  },
  ha: {
    common: haCommon,
    pages: haPages,
    nomination: haNomination,
    dashboard: haDashboard,
  },
  yo: {
    common: yoCommon,
    pages: yoPages,
    nomination: yoNomination,
    dashboard: yoDashboard,
  },
  am: {
    common: amCommon,
    pages: amPages,
    nomination: amNomination,
    dashboard: amDashboard,
  },
  zu: {
    common: zuCommon,
    pages: zuPages,
    nomination: zuNomination,
    dashboard: zuDashboard,
  },
  zh: {
    common: zhCommon,
    pages: zhPages,
    nomination: zhNomination,
    dashboard: zhDashboard,
  },
  hi: {
    common: hiCommon,
    pages: hiPages,
    nomination: hiNomination,
    dashboard: hiDashboard,
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
