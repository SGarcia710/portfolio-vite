import castAndCrewImage from './assets/cast-and-crew.webp';

export type ProjectPlatform = 'mobile' | 'web';

export interface ProjectLinks {
  website?: string;
  appStore?: string;
  playStore?: string;
}

export interface ClientProject {
  /** Matches `projects:items.<id>` in the locale files. */
  id: string;
  platform: ProjectPlatform;
  year: number;
  client: string;
  tags: string[];
  image: string;
  links: ProjectLinks;
}

export const clientProjects: ClientProject[] = [
  {
    id: '9',
    platform: 'mobile',
    year: 2026,
    client: 'Cast & Crew',
    tags: ['React Native', 'TypeScript', 'OKTA', 'Expo', 'Fastlane', 'Figma', 'Claude Code', 'iOS', 'Android', 'Push Notifications'],
    image: castAndCrewImage,
    links: { website: 'https://www.castandcrew.com/' },
  },
  {
    id: '1',
    platform: 'mobile',
    year: 2025,
    client: 'El Palacio de Hierro',
    tags: ['React Native', 'TypeScript', 'SFCC', 'E-Commerce', 'Payments', 'Push Notifications', 'iOS', 'Android'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Palacio_de_Hierro_Mexico.jpg/1280px-Palacio_de_Hierro_Mexico.jpg',
    links: {
      website: 'https://www.elpalaciodehierro.com/',
      appStore: 'https://apps.apple.com/co/app/el-palacio-de-hierro/id6449685817',
      playStore: 'https://play.google.com/store/apps/details?id=com.eph.superapp',
    },
  },
  {
    id: '2',
    platform: 'mobile',
    year: 2024,
    client: 'FlyGuys',
    tags: ['React Native', 'TypeScript', 'Maps', 'Real-time', 'GPS', 'iOS', 'Android', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=900&fit=crop&q=75&auto=format',
    links: {
      website: 'https://flyguys.com/',
      appStore: 'https://apps.apple.com/co/app/flyguys-pilots/id6474402860',
      playStore: 'https://play.google.com/store/apps/details?id=com.flyguys_pilotsapp',
    },
  },
  {
    id: '3',
    platform: 'mobile',
    year: 2023,
    client: 'Slab Dream Lab',
    tags: ['React Native', 'AI/ML', 'Image Processing', 'E-Commerce', 'Android', 'iOS', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=1200&h=900&fit=crop&q=75&auto=format',
    links: {
      website: 'https://slabdreamlab.com/',
      playStore: 'https://play.google.com/store/apps/details?id=com.slabmobile',
    },
  },
  {
    id: '4',
    platform: 'web',
    year: 2022,
    client: 'Aritzia',
    tags: ['React', 'TypeScript', 'SFCC', 'E-Commerce', 'Performance', 'Web'],
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=900&fit=crop&q=75&auto=format',
    links: { website: 'https://www.aritzia.com/intl/en' },
  },
  {
    id: '5',
    platform: 'mobile',
    year: 2022,
    client: 'PayIT',
    tags: ['React Native', 'TypeScript', 'Payments', 'Government', 'Licensing', 'iOS', 'Android', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=900&fit=crop&q=75&auto=format',
    links: { website: 'https://payitgov.com/outdoors/' },
  },
  {
    id: '10',
    platform: 'web',
    year: 2022,
    client: 'TECHO',
    tags: ['React', 'TypeScript', 'Node.js', 'Data Visualization', 'Web'],
    image: 'https://mexico.techo.org/wp-content/uploads/sites/16/2021/11/Thumbnail-1024x538.png',
    links: { website: 'https://mexico.techo.org/' },
  },
  {
    id: '11',
    platform: 'mobile',
    year: 2021,
    client: 'Movistar',
    tags: ['React Native', 'TypeScript', 'Telecom', 'iOS', 'Android', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=900&fit=crop&q=75&auto=format',
    links: {
      website: 'https://www.movistar.com.uy/home/',
      appStore: 'https://apps.apple.com/mx/app/mi-movistar-uruguay/id785193700',
      playStore: 'https://play.google.com/store/apps/details?id=com.movistar.mimovistar',
    },
  },
  {
    id: '6',
    platform: 'mobile',
    year: 2021,
    client: 'Metal-Era',
    tags: ['React Native', 'Voice Control', 'CAD', 'API Integration', 'iOS', 'Android', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=900&fit=crop&q=75&auto=format',
    links: {
      website: 'https://www.metalera.com/',
      appStore: 'https://apps.apple.com/es/app/mtl-falcon/id1565388274',
    },
  },
  {
    id: '7',
    platform: 'web',
    year: 2020,
    client: 'StageKeep',
    tags: ['React', 'Next.js', 'TypeScript', 'Real-time', 'Web App'],
    image: 'https://www.billboard.com/wp-content/uploads/2025/05/Jennifer-Lopez-03-ama-show-2025-billboard-1548.jpg?w=942&h=628&crop=1',
    links: { website: 'https://stagekeep.com/' },
  },
  {
    id: '8',
    platform: 'web',
    year: 2019,
    client: 'USC',
    tags: ['React', 'Next.js', 'CMS', 'SEO', 'Web'],
    image: 'https://cloudfront-us-east-1.images.arcpublishing.com/semana/QX5NFBSHIJBDPJWLPZ7D4T5QGQ.jpeg',
    links: { website: 'https://www.usc.edu.co/' },
  },
];
