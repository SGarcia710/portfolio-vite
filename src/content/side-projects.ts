import ktcodexIcon from '../features/ktcodex/assets/app-icon.webp';
import ktcodexScreen from '../features/ktcodex/assets/team-detail.webp';

export type SideProjectStatus = 'live' | 'beta' | 'building';

export interface SideProject {
  /** Matches `lab:items.<id>` in the locale files. */
  id: string;
  name: string;
  href: string;
  status: SideProjectStatus;
  year: number;
  platforms: string[];
  stack: string[];
  icon: string;
  screen: string;
  /** Tints the card. Kept per project so each one keeps its own identity. */
  tint: string;
}

export const sideProjects: SideProject[] = [
  {
    id: 'ktcodex',
    name: 'KTCodex',
    href: '/projects/ktcodex',
    status: 'building',
    year: 2026,
    platforms: ['iOS', 'Android'],
    stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'MMKV', 'i18next'],
    icon: ktcodexIcon,
    screen: ktcodexScreen,
    tint: '#d85b12',
  },
];
