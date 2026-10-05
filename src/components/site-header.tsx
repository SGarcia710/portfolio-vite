import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { List, X } from '@phosphor-icons/react';
import { navSections, site } from '../content/site';
import { useActiveSection } from '../lib/section-tracker';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { setScrollLocked } from '../lib/smooth-scroll';
import { cn } from '../lib/cn';
import { Logo } from './logo';
import { LanguageToggle } from './language-toggle';
import { SectionLink } from './section-link';

const linkSections = navSections.filter((section) => section.id !== 'contact');

export function SiteHeader() {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // Hide on scroll down, reveal on scroll up.
  useGSAP(() => {
    const el = header.current;
    if (!el) return;
    const show = gsap.quickTo(el, 'yPercent', { duration: 0.6, ease: 'expo.out' });
    ScrollTrigger.create({
      start: 120,
      end: 'max',
      onUpdate: (self) => show(self.direction === 1 && !menuOpen ? -110 : 0),
      onLeaveBack: () => show(0),
    });
  }, { dependencies: [menuOpen, pathname], revertOnUpdate: true });

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    setScrollLocked(menuOpen);
    if (!menuOpen) return undefined;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      setScrollLocked(false);
    };
  }, [menuOpen]);

  useGSAP(() => {
    if (!menuOpen || !menu.current) return;
    gsap.fromTo(menu.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' });
    gsap.from('[data-menu-item]', { yPercent: 120, duration: 1, stagger: 0.06, delay: 0.3 });
  }, { scope: menu, dependencies: [menuOpen] });

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        ref={header}
        className="fixed inset-x-0 top-0 z-[var(--z-header)] h-[var(--header-height)] bg-gradient-to-b from-bg/85 to-transparent"
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Link to="/" aria-label={t('a11y.home')} className="group flex items-center gap-3" onClick={closeMenu}>
            <Logo className="h-8 w-auto text-fg transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-6" />
            <span className="hidden text-meta text-fg-soft sm:block">{site.name}</span>
          </Link>

          <nav aria-label={t('a11y.primaryNav')} className="hidden items-center gap-1 md:flex">
            {linkSections.map((section) => {
              const isActive = pathname === '/' && active === section.id;
              return (
                <SectionLink
                  key={section.id}
                  section={section.id}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative px-3 py-2 text-sm transition-colors duration-300',
                    isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {t(section.navKey)}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-3 bottom-1 h-px origin-left bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)]',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </SectionLink>
              );
            })}
            <LanguageToggle className="ml-3" />
            <SectionLink section="contact" className="btn btn-primary ml-3 h-9 px-4 text-sm">
              <span>{t('nav.contact')}</span>
            </SectionLink>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <button
              type="button"
              className="icon-btn h-9 w-9"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t(menuOpen ? 'nav.close' : 'nav.menu')}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          ref={menu}
          id="mobile-menu"
          className="fixed inset-0 z-[calc(var(--z-header)-1)] flex flex-col justify-between bg-ink-925 px-[var(--gutter)] pt-28 pb-10 md:hidden"
        >
          <nav aria-label={t('a11y.primaryNav')} className="flex flex-col">
            {navSections.map((section) => (
              <div key={section.id} className="overflow-hidden border-b border-line">
                <SectionLink
                  data-menu-item
                  section={section.id}
                  onClick={closeMenu}
                  className="block py-4 text-[clamp(2.5rem,12vw,4rem)] leading-none font-semibold tracking-[-0.05em]"
                >
                  {t(section.navKey)}
                </SectionLink>
              </div>
            ))}
          </nav>
          <a href={`mailto:${site.email}`} className="text-meta text-fg-soft">{site.email}</a>
        </div>
      )}
    </>
  );
}
