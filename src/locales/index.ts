/**
 * Locale resources loader
 * Imports all translation files for supported locales
 */

// English (default)
import enCommon from './en/common.json';
import enPages from './en/pages.json';
import enNomination from './en/nomination.json';
import enDashboard from './en/dashboard.json';

// French
import frCommon from './fr/common.json';

// Arabic
import arCommon from './ar/common.json';

// Chinese
import zhCommon from './zh/common.json';

// Hindi
import hiCommon from './hi/common.json';

// For languages without full translations, we'll fall back to English
// These will be auto-translated via the translation job system

export const resources = {
  en: {
    common: enCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  fr: {
    common: frCommon,
    pages: enPages, // Fallback to English until translated
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
    common: enCommon, // Will be auto-translated
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  sw: {
    common: enCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  ha: {
    common: enCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  yo: {
    common: enCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  am: {
    common: enCommon,
    pages: enPages,
    nomination: enNomination,
    dashboard: enDashboard,
  },
  zu: {
    common: enCommon,
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

export type LocaleNamespace = 'common' | 'pages' | 'nomination' | 'dashboard';
