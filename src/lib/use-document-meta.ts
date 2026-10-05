import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { site } from '../content/site';

interface DocumentMeta {
  title: string;
  description: string;
  /** Absolute or root-relative path to a 1200x630 share image. */
  image?: string;
  noindex?: boolean;
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

/** Keeps title, description, canonical and social tags in sync per route and language. */
export function useDocumentMeta({ title, description, image = '/brand/og-card.png', noindex = false }: DocumentMeta) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
    const url = `${site.url}${pathname === '/' ? '' : pathname}`;
    const imageUrl = image.startsWith('http') ? image : `${site.url}${image}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow');
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:locale', i18n.resolvedLanguage === 'es' ? 'es_ES' : 'en_US');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
    upsertLink('canonical', url);
  }, [title, description, image, noindex, pathname, i18n.resolvedLanguage]);
}
