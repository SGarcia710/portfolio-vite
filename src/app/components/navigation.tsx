import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  { label: 'Work', href: '#experience' },
  { label: 'Projects', href: '#projects' },
];

const ctaLink = { label: 'Contact', href: '#contact' };

export function Navigation({ logo = 'SG', isDark = false, onThemeToggle }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
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
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            className="flex items-center shrink-0"
          >
            <img
              src={isDark ? logoWhite : logoBlack}
              alt="SG Logo"
              className="h-8 w-auto"
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-1.5 text-sm text-foreground-secondary hover:text-foreground transition-colors duration-200 font-medium rounded-full hover:bg-foreground/5"
              >
                {link.label}
              </motion.a>
            ))}

            <button
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-foreground-secondary hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <motion.a
              href={ctaLink.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.1 }}
              className="ml-2 px-5 py-1.5 text-sm font-medium rounded-full bg-foreground text-background hover:opacity-90 transition-opacity duration-200"
            >
              {ctaLink.label}
            </motion.a>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-1 ml-auto">
            <button
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-foreground-secondary hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </IconButton>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-4 right-4 z-40 md:hidden bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href={ctaLink.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  {ctaLink.label}
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
