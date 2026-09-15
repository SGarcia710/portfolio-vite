import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb, type BreadcrumbItem } from './ui/breadcrumb';

interface ProjectPageLayoutProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
  width?: 'document' | 'wide';
}

export function ProjectPageLayout({ title, breadcrumbs, children, width = 'document' }: ProjectPageLayoutProps) {
  const { t } = useTranslation('projectPages');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Sebastián García`;
    return () => { document.title = previousTitle; };
  }, [title]);

  return (
    <div className="container-premium pt-28 pb-20 md:pt-36 md:pb-28">
      <div className={width === 'wide' ? 'mx-auto max-w-7xl' : 'mx-auto max-w-3xl'}>
        <Breadcrumb
          ariaLabel={t('breadcrumbs')}
          items={[{ label: t('home'), href: '/' }, ...breadcrumbs]}
        />
        {children}
      </div>
    </div>
  );
}
