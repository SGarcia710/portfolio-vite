import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowUpRight, Database, Languages, ShieldCheck } from 'lucide-react';
import { ProjectPageLayout } from '../components/project-page-layout';
import { StoreLinks } from '../components/ktcodex/store-links';
import appIconMark from '../../assets/ktcodex/app-icon-mark.png';
import teamDetail from '../../assets/ktcodex/team-detail.png';

const KTCodexPhone = lazy(() => import('../components/ktcodex/ktcodex-phone').then(module => ({ default: module.KTCodexPhone })));
const KTCodexAtmosphere = lazy(() => import('../components/ktcodex/ktcodex-atmosphere').then(module => ({ default: module.KTCodexAtmosphere })));
const KTCodexScrollStory = lazy(() => import('../components/ktcodex/ktcodex-scroll-story').then(module => ({ default: module.KTCodexScrollStory })));

interface SystemFeature {
  title: string;
  body: string;
}

export function KTCodexPage() {
  const { t } = useTranslation('ktcodex');
  const { t: tp } = useTranslation('projectPages');
  const stack = t<'system.stack', { returnObjects: true }, string[]>('system.stack', { returnObjects: true });
  const features = t<'system.features', { returnObjects: true }, SystemFeature[]>('system.features', { returnObjects: true });

  useEffect(() => {
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    if (description) description.content = t('metaDescription');
    return () => {
      if (description && previousDescription) description.content = previousDescription;
    };
  }, [t]);

  return (
    <div className="ktcodex-page">
      <Suspense fallback={null}>
        <KTCodexAtmosphere />
      </Suspense>

      <ProjectPageLayout
        title={t('metaTitle')}
        width="wide"
        breadcrumbs={[
          { label: tp('projects'), href: '/projects' },
          { label: t('breadcrumb') },
        ]}
      >
        <section className="ktc-hero" aria-labelledby="ktc-hero-title">
          <div className="ktc-hero-copy">
            <div className="ktc-brand-lockup">
              <img src={appIconMark} alt="" />
              <span>KTCodex</span>
            </div>
            <h1 id="ktc-hero-title">{t('hero.title')}</h1>
            <p className="ktc-hero-description">{t('hero.description')}</p>
            <StoreLinks />
          </div>

          <div className="ktc-hero-phone">
            <div className="ktc-orbit ktc-orbit-outer" aria-hidden="true" />
            <div className="ktc-orbit ktc-orbit-inner" aria-hidden="true" />
            <Suspense fallback={<div className="ktc-phone-skeleton" aria-hidden="true" />}>
              <KTCodexPhone alt={t('phoneFallback')} screenSrc={teamDetail} />
            </Suspense>
          </div>
        </section>

        <section className="ktc-proof" aria-label={t('proof.label')}>
          <div>
            <Database aria-hidden="true" />
            <strong>{t('proof.local')}</strong>
            <span>{t('proof.localDetail')}</span>
          </div>
          <div>
            <Languages aria-hidden="true" />
            <strong>{t('proof.languages')}</strong>
            <span>{t('proof.languagesDetail')}</span>
          </div>
          <div>
            <ShieldCheck aria-hidden="true" />
            <strong>{t('proof.platforms')}</strong>
            <span>{t('proof.platformsDetail')}</span>
          </div>
        </section>
      </ProjectPageLayout>

      <Suspense fallback={null}>
        <KTCodexScrollStory />
      </Suspense>

      <section className="container-premium ktc-system" aria-labelledby="ktc-system-title">
        <div className="ktc-system-intro">
          <img src={appIconMark} alt="" />
          <div>
            <h2 id="ktc-system-title">{t('system.title')}</h2>
            <p>{t('system.body')}</p>
          </div>
        </div>

        <div className="ktc-system-grid">
          {features.map((feature, index) => (
            <article className={`ktc-system-cell ktc-system-cell-${index + 1}`} key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
          <aside className="ktc-stack-cell">
            <h3>{t('system.stackTitle')}</h3>
            <div className="ktc-stack-list">
              {stack.map(item => <span key={item}>{item}</span>)}
            </div>
          </aside>
        </div>
      </section>

      <section className="container-premium ktc-closing" aria-labelledby="ktc-closing-title">
        <img src={appIconMark} alt="" />
        <h2 id="ktc-closing-title">{t('closing.title')}</h2>
        <p>{t('closing.body')}</p>
        <Link to="/projects/ktcodex/privacy" className="ktc-privacy-link">
          {t('closing.privacy')}
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
