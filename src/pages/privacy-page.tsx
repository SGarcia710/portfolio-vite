import { useTranslation } from 'react-i18next';
import { PageLayout } from '../components/page-layout';
import { useDocumentMeta } from '../lib/use-document-meta';

interface PrivacySection {
  title: string;
  body: string[];
}

export function PrivacyPage() {
  const { t } = useTranslation('ktcodexPrivacy');
  const { t: tp } = useTranslation('projectPages');
  const sections = t('sections', { returnObjects: true }) as PrivacySection[];

  useDocumentMeta({ title: `${t('title')}, KTCodex`, description: t('summary') });

  return (
    <PageLayout
      width="document"
      breadcrumbs={[
        { label: tp('sideProjectsTitle'), href: '/projects' },
        { label: 'KTCodex', href: '/projects/ktcodex' },
        { label: t('title') },
      ]}
    >
      <article>
        <header className="mt-12 border-b border-line pb-10 md:mt-16">
          <p className="text-meta text-brand">KTCodex</p>
          <h1 className="mt-4 text-headline">{t('title')}</h1>
          <p className="mt-6 text-lede text-fg-soft">{t('summary')}</p>
          <p className="mt-4 text-meta text-fg-muted">{t('lastUpdated')}</p>
        </header>
        <div className="mt-12 grid gap-12">
          {sections.map((section) => (
            <section key={section.title} className="grid gap-4 md:grid-cols-[12rem_1fr] md:gap-10">
              <h2 className="text-lg font-semibold tracking-[-0.02em]">{section.title}</h2>
              <div className="grid gap-4 leading-relaxed text-fg-soft">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </article>
    </PageLayout>
  );
}
