import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { CaretRight } from '@phosphor-icons/react';
import { cn } from '../lib/cn';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t } = useTranslation('projectPages');
  const all = [{ label: t('home'), href: '/' }, ...items];

  return (
    <nav aria-label={t('breadcrumbs')}>
      <ol className="flex flex-wrap items-center gap-1.5 text-meta text-fg-muted">
        {all.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <CaretRight size={10} aria-hidden="true" />}
            {item.href && index < all.length - 1
              ? <Link to={item.href} className="link-draw hover:text-fg">{item.label}</Link>
              : <span aria-current="page" className="text-fg-soft">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface PageLayoutProps {
  breadcrumbs: Crumb[];
  children: ReactNode;
  width?: 'document' | 'wide';
  className?: string;
}

export function PageLayout({ breadcrumbs, children, width = 'wide', className }: PageLayoutProps) {
  return (
    <div className={cn('shell pt-[calc(var(--header-height)+3rem)] pb-24 md:pt-[calc(var(--header-height)+4.5rem)] md:pb-32', className)}>
      <div className={width === 'document' ? 'mx-auto max-w-3xl' : ''}>
        <Breadcrumbs items={breadcrumbs} />
        {children}
      </div>
    </div>
  );
}
