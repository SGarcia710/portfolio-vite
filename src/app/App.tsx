import { lazy, Suspense, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { RouteScroll } from '../components/route-scroll';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { Preloader } from '../features/preloader/preloader';
import { SmoothScroll } from '../lib/smooth-scroll';
import { HomePage } from '../pages/home-page';

const named = <T extends Record<string, ComponentType>>(loader: () => Promise<T>, name: keyof T) =>
  lazy(() => loader().then((module) => ({ default: module[name] })));

const SideProjectsPage = named(() => import('../pages/side-projects-page'), 'SideProjectsPage');
const KTCodexPage = named(() => import('../pages/ktcodex-page'), 'KTCodexPage');
const PrivacyPage = named(() => import('../pages/privacy-page'), 'PrivacyPage');
const NotFoundPage = named(() => import('../pages/not-found-page'), 'NotFoundPage');

export default function App() {
  const { t } = useTranslation('common');

  return (
    <SmoothScroll>
      <a href="#main" className="skip-link">{t('a11y.skip')}</a>
      <Preloader />
      <RouteScroll />
      <SiteHeader />

      <main id="main" tabIndex={-1} className="relative outline-none">
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<SideProjectsPage />} />
            <Route path="/projects/ktcodex" element={<KTCodexPage />} />
            <Route path="/projects/ktcodex/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <SiteFooter />
      <div className="grain" aria-hidden="true" />
      <Analytics />
    </SmoothScroll>
  );
}
