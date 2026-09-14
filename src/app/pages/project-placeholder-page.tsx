import { ArrowRight, Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ProjectPageLayout } from '../components/project-page-layout';

export function ProjectPlaceholderPage({ project }: { project?: 'ktcodex' }) {
  const { t } = useTranslation('projectPages');
  const isKTCodex = project === 'ktcodex';
  const title = isKTCodex ? 'KTCodex' : t('projects');
  const breadcrumbs = isKTCodex
    ? [{ label: t('projects'), href: '/projects' }, { label: 'KTCodex' }]
    : [{ label: t('projects') }];

  return (
    <ProjectPageLayout title={title} breadcrumbs={breadcrumbs}>
      <section className="py-20 md:py-28">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-foreground-secondary">
          <Construction aria-hidden="true" className="h-4 w-4" />
          {t('underDevelopment')}
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">{title}</h1>
        <p className="max-w-xl text-lg leading-relaxed text-foreground-secondary md:text-xl">
          {t(isKTCodex ? 'ktcodexDescription' : 'projectsDescription')}
        </p>
        <Link
          to={isKTCodex ? '/projects/ktcodex/privacy' : '/projects/ktcodex'}
          className="mt-10 inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {t(isKTCodex ? 'viewPrivacy' : 'viewKTCodex')}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </ProjectPageLayout>
  );
}
