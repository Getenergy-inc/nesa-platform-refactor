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
import frPages from './fr/pages.json';
import frNomination from './fr/nomination.json';
import frDashboard from './fr/dashboard.json';

// Arabic
import arCommon from './ar/common.json';
import arPages from './ar/pages.json';
import arNomination from './ar/nomination.json';
import arDashboard from './ar/dashboard.json';

// Portuguese
import ptCommon from './pt/common.json';
import ptPages from './pt/pages.json';
import ptNomination from './pt/nomination.json';
import ptDashboard from './pt/dashboard.json';

// Swahili
import swCommon from './sw/common.json';
import swPages from './sw/pages.json';
import swNomination from './sw/nomination.json';
import swDashboard from './sw/dashboard.json';

// Hausa
import haCommon from './ha/common.json';
import haPages from './ha/pages.json';
import haNomination from './ha/nomination.json';
import haDashboard from './ha/dashboard.json';

// Yoruba
import yoCommon from './yo/common.json';
import yoPages from './yo/pages.json';
import yoNomination from './yo/nomination.json';
import yoDashboard from './yo/dashboard.json';

// Amharic
import amCommon from './am/common.json';
import amPages from './am/pages.json';
import amNomination from './am/nomination.json';
import amDashboard from './am/dashboard.json';

// Zulu
import zuCommon from './zu/common.json';
import zuPages from './zu/pages.json';
import zuNomination from './zu/nomination.json';
import zuDashboard from './zu/dashboard.json';

// Chinese
import zhCommon from './zh/common.json';
import zhPages from './zh/pages.json';
import zhNomination from './zh/nomination.json';
import zhDashboard from './zh/dashboard.json';

// Hindi
import hiCommon from './hi/common.json';
import hiPages from './hi/pages.json';
import hiNomination from './hi/nomination.json';
import hiDashboard from './hi/dashboard.json';

export const resources = {
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

export type LocaleNamespace = 'common' | 'pages' | 'nomination' | 'dashboard';
