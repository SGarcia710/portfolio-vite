/** Month precision is enough for a career timeline: `YYYY-MM`. */
export type YearMonth = `${number}-${number}`;

export interface Experience {
  /** Matches `timeline:experiences.<id>` in the locale files. */
  id: string;
  company: string;
  start: YearMonth;
  /** `null` means the role is ongoing. */
  end: YearMonth | null;
  skills: string[];
}

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Perficient',
    start: '2025-10',
    end: null,
    skills: ['React Native', 'TypeScript', 'Swift', 'Kotlin', 'TanStack Query', 'Zustand', 'Tailwind', 'Fastlane', 'Azure DevOps', 'GitHub', 'Claude'],
  },
  {
    id: '2',
    company: 'BILDIT',
    start: '2024-10',
    end: '2025-10',
    skills: ['React Native', 'TypeScript', 'Kotlin', 'Swift', 'TanStack Query', 'Tailwind', 'Azure DevOps', 'Fastlane', 'CircleCI', 'Expo Updates and Notifications', 'Firebase', 'SFCC', 'Reanimated', 'Zustand', 'ContextAPI'],
  },
  {
    id: '3',
    company: 'Astound Digital',
    start: '2021-10',
    end: '2024-10',
    skills: ['React Native', 'TypeScript', 'Kotlin', 'Swift', 'TanStack Query', 'Tailwind', 'Azure DevOps', 'Fastlane', 'Expo Updates and Notifications', 'Firebase', 'SFCC', 'Reanimated', 'Zustand', 'ContextAPI', 'Redux', 'Redux Sagas', 'Java', 'Objective-C'],
  },
  {
    id: '4',
    company: 'PaloIT',
    start: '2021-01',
    end: '2021-10',
    skills: ['React Native'],
  },
  {
    id: '5',
    company: '21unicorns',
    start: '2020-06',
    end: '2021-01',
    skills: ['React Native', 'Next.js'],
  },
  {
    id: '6',
    company: 'We Are Angular',
    start: '2019-10',
    end: '2020-06',
    skills: ['React', 'React Native', 'Three.js', 'Bootstrap', 'Material UI', 'Redux', 'Redux Thunk', 'SCSS', 'Node.js', 'Express.js', 'TypeScript'],
  },
  {
    id: '7',
    company: 'Santiago de Cali University',
    start: '2018-06',
    end: '2019-10',
    skills: ['React.js', 'WordPress', 'Joomla', 'Node.js', 'PHP', 'React Native'],
  },
];

/** Fractional year, e.g. `2021-10` → 2021.75. */
export function toYearFraction(value: YearMonth | Date): number {
  if (value instanceof Date) return value.getFullYear() + value.getMonth() / 12 + (value.getDate() - 1) / 365;
  const [year, month] = value.split('-').map(Number);
  return year + (month - 1) / 12;
}

export function formatYearMonth(value: YearMonth, locale: string): string {
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(year, month - 1, 1));
}
