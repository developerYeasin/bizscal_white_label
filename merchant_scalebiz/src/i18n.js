import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en.json';
import bnTranslation from './locales/bn.json';

// console.log("i18n: enTranslation loaded:", enTranslation);
// console.log("i18n: bnTranslation loaded:", bnTranslation);

i18n
  .use(LanguageDetector) // Use the language detector
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      bn: {
        translation: bnTranslation,
      },
    },
    fallbackLng: 'en', // fallback language if translation is not found
    detection: {
      order: ['localStorage', 'navigator'], // Prioritize localStorage, then browser language
      caches: ['localStorage'], // Cache user language in localStorage
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  }, (err, t) => {
    if (err) return // console.log('i18n: Something went wrong loading translations', err);
    // console.log('i18n: Initialized and ready. Current language:', i18n.language);
    // console.log('i18n: Test translation for product_landing_page_not_found:', t('product_landing_page_not_found'));
  });

export default i18n;