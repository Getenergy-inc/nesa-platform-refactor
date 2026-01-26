/**
 * NESA-Africa i18n Configuration
 * Single source of truth for all 11 supported languages
 */

export type SupportedLocale = 
  | 'en' | 'fr' | 'ar' | 'pt' | 'sw' 
  | 'ha' | 'yo' | 'am' | 'zu' | 'zh' | 'hi';

export interface LocaleConfig {
  code: SupportedLocale;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
  flag: string; // Emoji flag for UI
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', dir: 'ltr', flag: '🇵🇹' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili', dir: 'ltr', flag: '🇰🇪' },
  { code: 'ha', label: 'Hausa', nativeLabel: 'Hausa', dir: 'ltr', flag: '🇳🇬' },
  { code: 'yo', label: 'Yoruba', nativeLabel: 'Yorùbá', dir: 'ltr', flag: '🇳🇬' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', dir: 'ltr', flag: '🇪🇹' },
  { code: 'zu', label: 'Zulu', nativeLabel: 'isiZulu', dir: 'ltr', flag: '🇿🇦' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const LOCALE_STORAGE_KEY = 'nesa_locale';

/**
 * Country to locale mapping for geo-detection
 * Maps ISO 3166-1 alpha-2 country codes to preferred locales (ordered by preference)
 */
export const GEO_LOCALE_MAP: Record<string, SupportedLocale[]> = {
  // India
  IN: ['hi', 'en'],
  
  // China
  CN: ['zh', 'en'],
  HK: ['zh', 'en'],
  TW: ['zh', 'en'],
  
  // Nigeria (English + local languages)
  NG: ['en', 'yo', 'ha'],
  
  // East Africa (Swahili belt)
  KE: ['sw', 'en'],
  TZ: ['sw', 'en'],
  UG: ['sw', 'en'],
  RW: ['sw', 'fr', 'en'],
  
  // North Africa (Arabic + French)
  DZ: ['ar', 'fr', 'en'],
  MA: ['ar', 'fr', 'en'],
  TN: ['ar', 'fr', 'en'],
  EG: ['ar', 'en'],
  LY: ['ar', 'en'],
  SD: ['ar', 'en'],
  
  // Portuguese-speaking Africa
  AO: ['pt', 'en'],
  MZ: ['pt', 'en'],
  CV: ['pt', 'en'],
  GW: ['pt', 'en'],
  ST: ['pt', 'en'],
  
  // Southern Africa
  ZA: ['zu', 'en'],
  ZW: ['en'],
  BW: ['en'],
  NA: ['en'],
  LS: ['en'],
  SZ: ['en'],
  
  // Ethiopia
  ET: ['am', 'en'],
  
  // Francophone Africa
  SN: ['fr', 'en'],
  CI: ['fr', 'en'],
  ML: ['fr', 'en'],
  BF: ['fr', 'en'],
  NE: ['fr', 'ha', 'en'],
  TD: ['fr', 'ar', 'en'],
  CM: ['fr', 'en'],
  CG: ['fr', 'en'],
  CD: ['fr', 'sw', 'en'],
  GA: ['fr', 'en'],
  BJ: ['fr', 'yo', 'en'],
  TG: ['fr', 'en'],
  GN: ['fr', 'en'],
  MG: ['fr', 'en'],
  
  // West Africa English
  GH: ['en'],
  GM: ['en'],
  SL: ['en'],
  LR: ['en'],
  
  // Europe/Americas (for diaspora)
  GB: ['en'],
  US: ['en'],
  CA: ['en', 'fr'],
  FR: ['fr', 'en'],
  DE: ['en'],
  ES: ['en'],
  BR: ['pt', 'en'],
  PT: ['pt', 'en'],
  
  // Middle East
  SA: ['ar', 'en'],
  AE: ['ar', 'en'],
  QA: ['ar', 'en'],
  KW: ['ar', 'en'],
};

// Default fallback for Africa if country not in map
export const AFRICA_DEFAULT_LOCALES: SupportedLocale[] = ['en', 'fr', 'ar', 'pt', 'sw'];

/**
 * Get locale config by code
 */
export function getLocaleConfig(code: SupportedLocale): LocaleConfig {
  return SUPPORTED_LOCALES.find(l => l.code === code) || SUPPORTED_LOCALES[0];
}

/**
 * Check if a string is a valid supported locale
 */
export function isValidLocale(code: string): code is SupportedLocale {
  return SUPPORTED_LOCALES.some(l => l.code === code);
}

/**
 * Get preferred locales for a country code
 */
export function getLocalesForCountry(countryCode: string): SupportedLocale[] {
  const normalized = countryCode.toUpperCase();
  return GEO_LOCALE_MAP[normalized] || AFRICA_DEFAULT_LOCALES;
}

/**
 * Parse Accept-Language header and return best matching locale
 */
export function parseAcceptLanguage(acceptLanguage: string): SupportedLocale | null {
  if (!acceptLanguage) return null;
  
  // Parse "en-US,en;q=0.9,fr;q=0.8" format
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0].toLowerCase(),
        q: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.q - a.q);
  
  for (const lang of languages) {
    if (isValidLocale(lang.code)) {
      return lang.code;
    }
  }
  
  return null;
}
