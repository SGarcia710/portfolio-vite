export const site = {
  name: 'Sebastián García',
  shortName: 'SG',
  url: 'https://sebastian-garcia.dev',
  email: 'contacto@sebastian-garcia.dev',
  github: 'https://github.com/SGarcia710',
  githubHandle: 'SGarcia710',
} as const;

/**
 * Home sections in scroll order. The Macintosh scene, the header and the
 * progress rail all read from this list, so adding a section is one entry.
 */
export const homeSections = [
  { id: 'top', navKey: null },
  { id: 'manifesto', navKey: null },
  { id: 'experience', navKey: 'nav.work' },
  { id: 'projects', navKey: 'nav.projects' },
  { id: 'lab', navKey: 'nav.lab' },
  { id: 'contact', navKey: 'nav.contact' },
] as const;

export type HomeSectionId = (typeof homeSections)[number]['id'];

export const navSections = homeSections.filter(
  (section): section is Extract<(typeof homeSections)[number], { navKey: string }> => section.navKey !== null,
);
