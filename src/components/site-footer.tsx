import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowUp, GithubLogo } from '@phosphor-icons/react';
import { navSections, site } from '../content/site';
import { scrollToTarget } from '../lib/smooth-scroll';
import { Logo } from './logo';
import { SectionLink } from './section-link';

export function SiteFooter() {
  const { t } = useTranslation('footer');
  const { t: tc } = useTranslation('common');
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[var(--z-content)] border-t border-line bg-bg">
      <div className="shell grid gap-12 py-14 md:grid-cols-12 md:gap-6 md:py-16">
        <div className="md:col-span-5">
          <Link to="/" aria-label={tc('a11y.home')} className="inline-flex">
            <Logo className="h-10 w-auto text-fg" />
          </Link>
          <p className="mt-5 max-w-[34ch] text-fg-muted">{t('branding')}</p>
        </div>

        <nav aria-label={tc('a11y.sections')} className="md:col-span-3">
          <ul className="grid gap-2.5">
            {navSections.map((section) => (
              <li key={section.id}>
                <SectionLink section={section.id} className="link-draw text-fg-soft hover:text-fg">
                  {tc(section.navKey)}
                </SectionLink>
              </li>
            ))}
            <li>
              <Link to="/projects" className="link-draw text-fg-soft hover:text-fg">{tc('nav.lab')} / KTCodex</Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col items-start gap-2.5 md:col-span-4 md:items-end">
          <a href={`mailto:${site.email}`} className="link-draw text-fg-soft hover:text-fg">{site.email}</a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-2 text-fg-soft hover:text-fg">
            <GithubLogo size={16} aria-hidden="true" />
            github.com/{site.githubHandle}
            <span className="sr-only">({tc('a11y.external')})</span>
          </a>
        </div>
      </div>

      <div className="shell flex flex-col gap-4 border-t border-line py-6 text-meta text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p>{t('copyright', { year })}. {t('copyrightTech')}.</p>
          <a href="https://sketchfab.com/3d-models/macintosh-128k-896ea439b67b4606a23fb8b93be6af6d" target="_blank" rel="noopener noreferrer" className="link-draw self-start hover:text-fg-soft">
            {t('modelCredit')}
            <span className="sr-only"> ({tc('a11y.external')})</span>
          </a>
        </div>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="inline-flex items-center gap-2 self-start text-fg-soft transition-colors hover:text-fg sm:self-auto"
        >
          {t('backToTop')}
          <ArrowUp size={14} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
