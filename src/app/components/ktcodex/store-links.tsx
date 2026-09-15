import { Apple, Play } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const appStoreUrl = import.meta.env.VITE_KTCODEX_APP_STORE_URL as string | undefined;
const playStoreUrl = import.meta.env.VITE_KTCODEX_PLAY_STORE_URL as string | undefined;
const appStoreId = import.meta.env.VITE_KTCODEX_APP_STORE_ID as string | undefined;

interface StoreLinkProps {
  kind: 'apple' | 'play';
  eyebrow: string;
  title: string;
  label: string;
  href?: string;
  comingSoon: string;
}

function StoreLink({ kind, eyebrow, title, label, href, comingSoon }: StoreLinkProps) {
  const content = (
    <>
      {kind === 'apple'
        ? <Apple aria-hidden="true" className="h-7 w-7 shrink-0" />
        : <Play aria-hidden="true" className="h-6 w-6 shrink-0 fill-current" />}
      <span className="min-w-0 text-left leading-none">
        <span className="block text-[0.62rem] font-medium tracking-wide text-white/70">{eyebrow}</span>
        <span className="mt-1 block whitespace-nowrap text-base font-semibold text-white">{title}</span>
      </span>
      {!href && <span className="ktc-store-soon">{comingSoon}</span>}
    </>
  );

  const className = 'ktc-store-link';
  if (!href) {
    return <span className={className} aria-label={`${label}. ${comingSoon}`} aria-disabled="true">{content}</span>;
  }

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {content}
    </a>
  );
}

export function StoreLinks() {
  const { t } = useTranslation('ktcodex');

  useEffect(() => {
    let manifest: HTMLLinkElement | undefined;
    if (playStoreUrl) {
      manifest = document.createElement('link');
      manifest.rel = 'manifest';
      manifest.href = '/ktcodex.webmanifest';
      document.head.appendChild(manifest);
    }

    let smartBanner: HTMLMetaElement | undefined;
    if (appStoreId) {
      smartBanner = document.createElement('meta');
      smartBanner.name = 'apple-itunes-app';
      smartBanner.content = `app-id=${appStoreId}, app-argument=ktcodex://`;
      document.head.appendChild(smartBanner);
    }

    return () => {
      manifest?.remove();
      smartBanner?.remove();
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <StoreLink
        kind="apple"
        eyebrow={t('stores.downloadOn')}
        title={t('stores.appStore')}
        label={t('stores.appStoreLabel')}
        href={appStoreUrl}
        comingSoon={t('stores.comingSoon')}
      />
      <StoreLink
        kind="play"
        eyebrow={t('stores.getItOn')}
        title={t('stores.playStore')}
        label={t('stores.playStoreLabel')}
        href={playStoreUrl}
        comingSoon={t('stores.comingSoon')}
      />
    </div>
  );
}
