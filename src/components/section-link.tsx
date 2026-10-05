import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router';
import { scrollToTarget } from '../lib/smooth-scroll';

interface SectionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Home section id, e.g. `experience`. */
  section: string;
}

/** Smooth-scrolls on the home page; navigates home and then scrolls everywhere else. */
export function SectionLink({ section, onClick, children, ...props }: SectionLinkProps) {
  const { pathname } = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (pathname !== '/' || event.defaultPrevented || event.metaKey || event.ctrlKey) return;
    const target = document.getElementById(section);
    if (!target) return;
    event.preventDefault();
    window.history.replaceState(null, '', section === 'top' ? '/' : `/#${section}`);
    scrollToTarget(section === 'top' ? 0 : target);
  };

  return (
    <Link to={section === 'top' ? '/' : `/#${section}`} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
