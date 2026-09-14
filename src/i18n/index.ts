import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enHero from './locales/en/hero.json';
import enTextReveal from './locales/en/textReveal.json';
import enTimeline from './locales/en/timeline.json';
import enProjects from './locales/en/projects.json';
import enFooter from './locales/en/footer.json';
import enProjectPages from './locales/en/projectPages.json';
import enKtcodexPrivacy from './locales/en/ktcodexPrivacy.json';

import esCommon from './locales/es/common.json';
import esHero from './locales/es/hero.json';
import esTextReveal from './locales/es/textReveal.json';
import esTimeline from './locales/es/timeline.json';
import esProjects from './locales/es/projects.json';
import esFooter from './locales/es/footer.json';
import esProjectPages from './locales/es/projectPages.json';
import esKtcodexPrivacy from './locales/es/ktcodexPrivacy.json';

function getInitialLanguage(): string {
  const stored = localStorage.getItem('language');
  if (stored === 'en' || stored === 'es') return stored;
  const browser = navigator.language.toLowerCase();
  return browser.startsWith('es') ? 'es' : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      hero: enHero,
      textReveal: enTextReveal,
      timeline: enTimeline,
      projects: enProjects,
      footer: enFooter,
      projectPages: enProjectPages,
      ktcodexPrivacy: enKtcodexPrivacy,
    },
    es: {
      common: esCommon,
      hero: esHero,
      textReveal: esTextReveal,
      timeline: esTimeline,
      projects: esProjects,
      footer: esFooter,
      projectPages: esProjectPages,
      ktcodexPrivacy: esKtcodexPrivacy,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

document.documentElement.lang = i18n.resolvedLanguage || 'en';

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
});

export default i18n;
