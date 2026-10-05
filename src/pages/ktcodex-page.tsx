import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowUpRight, Database, ShieldCheck, Translate } from '@phosphor-icons/react';
import { Breadcrumbs } from '../components/page-layout';
import { StoreLinks } from '../features/ktcodex/store-links';
import appIconMark from '../features/ktcodex/assets/app-icon-mark.webp';
import teamDetail from '../features/ktcodex/assets/team-detail.webp';
import { useDocumentMeta } from '../lib/use-document-meta';

const KTCodexPhone = lazy(() => import('../features/ktcodex/ktcodex-phone').then((module) => ({ default: module.KTCodexPhone })));
const KTCodexAtmosphere = lazy(() => import('../features/ktcodex/ktcodex-atmosphere').then((module) => ({ default: module.KTCodexAtmosphere })));
const KTCodexScrollStory = lazy(() => import('../features/ktcodex/ktcodex-scroll-story').then((module) => ({ default: module.KTCodexScrollStory })));

interface SystemFeature {
  title: string;
  body: string;
}

export function KTCodexPage() {
  const { t } = useTranslation('ktcodex');
  const { t: tp } = useTranslation('projectPages');
  const stack = t('system.stack', { returnObjects: true }) as string[];
  const features = t('system.features', { returnObjects: true }) as SystemFeature[];

  useDocumentMeta({ title: t('metaTitle'), description: t('metaDescription'), image: '/ktcodex/icon-512.png' });

  const proof = [
    { icon: Database, title: t('proof.local'), detail: t('proof.localDetail') },
    { icon: Translate, title: t('proof.languages'), detail: t('proof.languagesDetail') },
    { icon: ShieldCheck, title: t('proof.platforms'), detail: t('proof.platformsDetail') },
  ];

  return (
    <div className="ktcodex-page">
      <Suspense fallback={null}>
        <KTCodexAtmosphere />
      </Suspense>

      <div className="shell pt-[calc(var(--header-height)+2.5rem)]">
        <Breadcrumbs items={[{ label: tp('sideProjectsTitle'), href: '/projects' }, { label: t('breadcrumb') }]} />

        <section className="ktc-hero" aria-labelledby="ktc-hero-title">
          <div className="ktc-hero-copy">
            <div className="ktc-brand-lockup">
              <img src={appIconMark} alt="" width={56} height={56} />
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
          {proof.map(({ icon: Icon, title, detail }) => (
            <div key={title}>
              <Icon aria-hidden="true" />
              <strong>{title}</strong>
              <span>{detail}</span>
            </div>
          ))}
        </section>
      </div>

      <Suspense fallback={null}>
        <KTCodexScrollStory />
      </Suspense>

      <section className="shell ktc-system" aria-labelledby="ktc-system-title">
        <div className="ktc-system-intro">
          <img src={appIconMark} alt="" width={64} height={64} loading="lazy" />
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
              {stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </aside>
        </div>
      </section>

      <section className="shell ktc-closing" aria-labelledby="ktc-closing-title">
        <img src={appIconMark} alt="" width={72} height={72} loading="lazy" />
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
