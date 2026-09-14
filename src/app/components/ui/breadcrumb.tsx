import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  ariaLabel?: string;
}

export function Breadcrumb({ items, separator, ariaLabel = 'Breadcrumb' }: BreadcrumbProps) {
  const defaultSeparator = <ChevronRight className="w-4 h-4 text-muted-foreground" />;

  return (
    <nav aria-label={ariaLabel} className="flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {item.label}
              </span>
            )}
            {!isLast && (separator || defaultSeparator)}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
