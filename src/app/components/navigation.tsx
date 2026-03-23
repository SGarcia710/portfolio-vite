import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { IconButton } from './ui/button';
import logoWhite from '../../../assets/LogoSG-IconWhite.svg';
import logoBlack from '../../../assets/LogoSG-IconBlack.svg';

export interface NavigationProps {
  logo?: string;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

const navLinks = [
  { labelKey: 'nav.work', href: '#experience' },
  { labelKey: 'nav.projects', href: '#projects' },
];

const ctaLink = { labelKey: 'nav.contact', href: '#contact' };

export function Navigation({ logo = 'SG', isDark = false, onThemeToggle }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuId = 'mobile-site-navigation';
  const { t, i18n } = useTranslation('common');

  const toggleLanguage = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <div
          className={`
            pointer-events-auto
            mt-4 mx-4 px-5 py-2.5
            rounded-full
            transition-all duration-500
            flex items-center gap-6
            max-w-3xl w-full
            ${isScrolled
              ? 'bg-background/70 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5'
              : 'bg-background/50 backdrop-blur-md border border-border/30'}
          `}
        >
          {/* Logo */}
          <a
            href="#"
            className="flex items-center shrink-0"
          >
            <img
              src={isDark ? logoWhite : logoBlack}
              alt="SG Logo"
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 text-sm text-foreground-secondary hover:text-foreground transition-colors duration-200 font-medium rounded-full hover:bg-foreground/5"
              >
                {t(link.labelKey)}
              </a>
            ))}

            <button
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-foreground-secondary hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="px-3 py-1.5 text-xs font-bold rounded-full text-foreground-secondary hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
            >
              {t('language.switchTo')}
            </button>

            <a
              href={ctaLink.href}
              className="ml-2 px-5 py-1.5 text-sm font-medium rounded-full bg-foreground text-background hover:opacity-90 transition-opacity duration-200"
            >
              {t(ctaLink.labelKey)}
            </a>
          </div>

          {/* Mobile: Theme Toggle + Language + Menu Button */}
          <div className="md:hidden flex items-center gap-1 ml-auto">
            <button
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-foreground-secondary hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="px-3 py-1.5 text-xs font-bold rounded-full text-foreground-secondary hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
            >
              {t('language.switchTo')}
            </button>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id={mobileMenuId}
          className="fixed top-[72px] left-4 right-4 z-40 md:hidden bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                >
                  {t(link.labelKey)}
                </a>
              ))}
              <a
                href={ctaLink.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-accent hover:text-accent/80 transition-colors"
              >
                {t(ctaLink.labelKey)}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
