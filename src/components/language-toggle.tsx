import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';
import { cn } from '../lib/cn';

export function LanguageToggle({ className }: { className?: string }) {
  const { t, i18n } = useTranslation('common');
  const current = i18n.resolvedLanguage === 'es' ? 'es' : 'en';
  const next = current === 'es' ? 'en' : 'es';

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      aria-label={t('language.label')}
      className={cn(
        'group relative inline-flex h-9 items-center rounded-full border border-line-strong p-0.5 text-meta uppercase',
        className,
      )}
    >
      {languages.map((language) => (
        <span
          key={language}
          aria-hidden="true"
          className={cn(
            'relative z-10 grid h-full w-9 place-items-center rounded-full transition-colors duration-500',
            language === current ? 'text-ink-950' : 'text-fg-muted group-hover:text-fg',
          )}
        >
          {language}
        </span>
      ))}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-0.5 bottom-0.5 left-0.5 w-9 rounded-full bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]',
          current === 'es' && 'translate-x-9',
        )}
      />
    </button>
  );
}
