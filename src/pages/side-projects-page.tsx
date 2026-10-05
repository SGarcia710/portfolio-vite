import { useTranslation } from 'react-i18next';
import { PageLayout } from '../components/page-layout';
import { sideProjects } from '../content/side-projects';
import { Reveal } from '../features/home/reveal';
import { SideProjectCard, UpcomingProjectCard } from '../features/side-projects/side-project-card';
import { useDocumentMeta } from '../lib/use-document-meta';

export function SideProjectsPage() {
  const { t } = useTranslation('projectPages');
  useDocumentMeta({ title: t('sideProjectsTitle'), description: t('metaDescription') });

  return (
    <PageLayout breadcrumbs={[{ label: t('sideProjectsTitle') }]}>
      <header className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-12">
        <h1 className="text-display lg:col-span-8">{t('sideProjectsTitle')}</h1>
        <p className="max-w-[44ch] text-lede text-fg-muted lg:col-span-4 lg:self-end">{t('sideProjectsDescription')}</p>
      </header>

      <Reveal stagger className="mt-16 grid gap-5 md:mt-24 lg:grid-cols-12">
        {sideProjects.map((project) => (
          <SideProjectCard key={project.id} project={project} className="lg:col-span-8" />
        ))}
        <UpcomingProjectCard className="lg:col-span-4" />
      </Reveal>
    </PageLayout>
  );
}
