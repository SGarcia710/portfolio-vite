import { useTranslation } from 'react-i18next';
import { ProjectPageLayout } from '../components/project-page-layout';

interface PrivacySection {
  title: string;
  body: string[];
}

export function PrivacyPage() {
  const { t } = useTranslation('ktcodexPrivacy');
  const { t: tp } = useTranslation('projectPages');
  const sections = t<'sections', { returnObjects: true }, PrivacySection[]>('sections', { returnObjects: true });

  return (
    <ProjectPageLayout
      title={`${t('title')} — KTCodex`}
      breadcrumbs={[
        { label: tp('projects'), href: '/projects' },
        { label: 'KTCodex', href: '/projects/ktcodex' },
        { label: t('title') },
      ]}
    >
      <article>
        <header className="mt-12 mb-12 border-b border-border pb-10 md:mt-16">
          <p className="mb-4 font-mono text-sm font-medium tracking-wider text-accent">KTCodex</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">{t('title')}</h1>
          <p className="mb-5 text-lg leading-relaxed text-foreground-secondary md:text-xl">{t('summary')}</p>
          <p className="text-sm text-foreground-secondary">{t('lastUpdated')}</p>
        </header>
        <div className="space-y-10 md:space-y-12">
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="mb-4 text-xl font-semibold tracking-tight md:text-2xl">{section.title}</h2>
              <div className="space-y-4 text-base leading-relaxed text-foreground-secondary md:text-lg">
                {section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </article>
    </ProjectPageLayout>
  );
}
