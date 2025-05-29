import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';
import { storageService, STORAGE_KEYS } from '@/services/storageService';

// Import all translation files
import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enPokemon from './en/pokemon.json';
import viCommon from './vi/common.json';
import viAuth from './vi/auth.json';
import viPokemon from './vi/pokemon.json';

const LANGUAGES = {
  en: 'en',
  vi: 'vi',
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = storageService.getString(STORAGE_KEYS.LANGUAGE);
      if (savedLanguage) {
        return callback(savedLanguage);
      }

      const bestLanguage = RNLocalize.findBestAvailableLanguage(LANG_CODES);
      callback(bestLanguage?.languageTag || LANGUAGES.en);
    } catch (error) {
      console.log('Error reading language', error);
      callback(LANGUAGES.en);
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      storageService.setString(STORAGE_KEYS.LANGUAGE, lng);
    } catch (error) {
      console.log('Error saving language', error);
    }
  },
};

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    pokemon: enPokemon,
  },
  vi: {
    common: viCommon,
    auth: viAuth,
    pokemon: viPokemon,
  },
};

i18next
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: LANGUAGES.en,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: ['common', 'auth', 'pokemon'],
  });

// Handle RTL languages
const isRTL = i18next.dir() === 'rtl';
I18nManager.allowRTL(true);
I18nManager.forceRTL(isRTL);

export default i18next;
