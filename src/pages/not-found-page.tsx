import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowLeft } from '@phosphor-icons/react';
import { useDocumentMeta } from '../lib/use-document-meta';

export function NotFoundPage() {
  const { t } = useTranslation('projectPages');
  useDocumentMeta({ title: t('notFound.title'), description: t('notFound.body'), noindex: true });

  return (
    <section className="shell flex min-h-[100svh] flex-col justify-center pt-[var(--header-height)]">
      <p aria-hidden="true" className="text-pixel text-[clamp(7rem,28vw,22rem)] leading-[0.8] text-ink-800">404</p>
      <h1 className="mt-8 text-headline">{t('notFound.title')}</h1>
      <p className="mt-5 max-w-[42ch] text-lede text-fg-muted">{t('notFound.body')}</p>
      <Link to="/" className="btn btn-primary mt-10 self-start">
        <ArrowLeft size={16} aria-hidden="true" />
        <span>{t('notFound.cta')}</span>
      </Link>
    </section>
  );
}
