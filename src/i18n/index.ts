import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const modules = import.meta.glob<{ default: Record<string, unknown> }>('./locales/*/*.json', { eager: true });

export const languages = ['en', 'es'] as const;
export type Language = (typeof languages)[number];

const resources: Record<string, Record<string, Record<string, unknown>>> = {};
for (const [path, module] of Object.entries(modules)) {
  const [, language, namespace] = path.match(/\.\/locales\/(\w+)\/(\w+)\.json$/) ?? [];
  if (!language || !namespace) continue;
  resources[language] ??= {};
  resources[language][namespace] = module.default;
}

function getInitialLanguage(): Language {
  const stored = localStorage.getItem('language');
  if (stored === 'en' || stored === 'es') return stored;
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  returnNull: false,
});

document.documentElement.lang = i18n.resolvedLanguage ?? 'en';

i18n.on('languageChanged', (language) => {
  localStorage.setItem('language', language);
  document.documentElement.lang = language;
});

export default i18n;
