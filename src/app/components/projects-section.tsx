import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Globe, ChevronLeft, ChevronRight, Smartphone, Monitor } from 'lucide-react';
import { Badge } from './ui/badge';
import { IconButton } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Project {
  id: string;
  type: 'mobile' | 'web';
  tags: string[];
  image: string;
  year: string;
  client?: string;
  links?: {
    website?: string;
    appStore?: string;
    playStore?: string;
  };
}

const projects: Project[] = [
  {
    id: '9',
    type: 'mobile',
    year: '2026',
    client: 'Cast & Crew',
    tags: ['React Native', 'TypeScript', 'OKTA', 'Expo', 'Fastlane', 'Figma', 'Claude Code', 'iOS', 'Android', 'Push Notifications'],
    image: 'https://www.castandcrew.com/wp-content/uploads/2024/01/HeroImage03New_1800px-1-1.webp',
    links: { website: 'https://www.castandcrew.com/' },
  },
  {
    id: '1',
    type: 'mobile',
    year: '2025',
    client: 'El Palacio de Hierro',
    tags: ['React Native', 'TypeScript', 'SFCC', 'E-Commerce', 'Payments', 'Push Notifications', 'iOS', 'Android'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Palacio_de_Hierro_Mexico.jpg',
    links: {
      website: 'https://www.elpalaciodehierro.com/',
      appStore: 'https://apps.apple.com/co/app/el-palacio-de-hierro/id6449685817',
      playStore: 'https://play.google.com/store/apps/details?id=com.eph.superapp',
    },
  },
  {
    id: '2',
    type: 'mobile',
    year: '2024',
    client: 'FlyGuys',
    tags: ['React Native', 'TypeScript', 'Maps', 'Real-time', 'GPS', 'iOS', 'Android', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://flyguys.com/',
      appStore: 'https://apps.apple.com/co/app/flyguys-pilots/id6474402860',
      playStore: 'https://play.google.com/store/apps/details?id=com.flyguys_pilotsapp',
    },
  },
  {
    id: '3',
    type: 'mobile',
    year: '2023',
    client: 'Slab Dream Lab',
    tags: ['React Native', 'AI/ML', 'Image Processing', 'E-Commerce', 'Android', 'iOS', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://slabdreamlab.com/',
      playStore: 'https://play.google.com/store/apps/details?id=com.slabmobile',
    },
  },
  {
    id: '4',
    type: 'web',
    year: '2022',
    client: 'Aritzia',
    tags: ['React', 'TypeScript', 'SFCC', 'E-Commerce', 'Performance', 'Web'],
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop&q=80',
    links: { website: 'https://www.aritzia.com/intl/en' },
  },
  {
    id: '5',
    type: 'mobile',
    year: '2022',
    client: 'PayIT',
    tags: ['React Native', 'TypeScript', 'Payments', 'Government', 'Licensing', 'iOS', 'Android', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=1000&fit=crop&q=80',
    links: { website: 'https://payitgov.com/outdoors/' },
  },
  {
    id: '6',
    type: 'mobile',
    year: '2021',
    client: 'Metal-Era',
    tags: ['React Native', 'Voice Control', 'CAD', 'API Integration', 'iOS', 'Android', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://www.metalera.com/',
      appStore: 'https://apps.apple.com/es/app/mtl-falcon/id1565388274',
    },
  },
  {
    id: '7',
    type: 'web',
    year: '2020',
    client: 'StageKeep',
    tags: ['React', 'Next.js', 'TypeScript', 'Real-time', 'Web App'],
    image: 'https://www.billboard.com/wp-content/uploads/2025/05/Jennifer-Lopez-03-ama-show-2025-billboard-1548.jpg?w=942&h=628&crop=1',
    links: { website: 'https://stagekeep.com/' },
  },
  {
    id: '8',
    type: 'web',
    year: '2019',
    client: 'USC',
    tags: ['React', 'Next.js', 'CMS', 'SEO', 'Web'],
    image: 'https://cloudfront-us-east-1.images.arcpublishing.com/semana/QX5NFBSHIJBDPJWLPZ7D4T5QGQ.jpeg',
    links: { website: 'https://www.usc.edu.co/' },
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -48 : 48,
  }),
};

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { t } = useTranslation('projects');

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => Math.min(projects.length - 1, prev + 1));
  };

  const activeProject = projects[activeIndex];

  return (
    <section id="projects" className="relative py-12 md:py-20 bg-background">
      {/* Section Header */}
      <div className="pb-12 md:pb-20">
        <div className="container-premium">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('sectionTitle')}
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              {t('sectionDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="container-premium relative">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeProject.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <ProjectSlide
                project={activeProject}
                activeIndex={activeIndex}
                totalProjects={projects.length}
                onPrev={handlePrev}
                onNext={handleNext}
                canGoPrev={activeIndex > 0}
                canGoNext={activeIndex < projects.length - 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ProjectSlide({
  project,
  activeIndex,
  totalProjects,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: {
  project: Project;
  activeIndex: number;
  totalProjects: number;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}) {
  const { t } = useTranslation('projects');
  const { t: tc } = useTranslation('common');

  const title = t(`items.${project.id}.title`);
  const category = t(`items.${project.id}.category`);
  const description = t(`items.${project.id}.description`);

  return (
    <div className="relative mx-auto w-full max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
        {/* Image Side */}
        <FloatingImage project={project} title={title} category={category} />

        {/* Content Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-start space-y-3 md:space-y-6">
          {/* Counter & Navigation Row */}
          <div className="flex items-center justify-between">
            <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-border">
              <span className="text-sm font-medium">
                <span className="text-2xl font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="text-muted-foreground"> / {String(totalProjects).padStart(2, '0')}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                type="button"
                variant="secondary"
                size="lg"
                onClick={onPrev}
                disabled={!canGoPrev}
                aria-label="Previous project"
                className="bg-background/90 backdrop-blur-md hover:bg-background shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </IconButton>
              <IconButton
                type="button"
                variant="secondary"
                size="lg"
                onClick={onNext}
                disabled={!canGoNext}
                aria-label="Next project"
                className="bg-background/90 backdrop-blur-md hover:bg-background shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </IconButton>
            </div>
          </div>

          {/* Client */}
          {project.client && (
            <div className="flex items-center gap-2 text-accent font-medium">
              <div className="w-8 h-0.5 bg-accent" />
              <span>{project.client}</span>
            </div>
          )}

          {/* Title */}
          <div className="flex items-center gap-3 md:gap-4">
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold">
              {title}
            </h3>
            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              {project.type === 'mobile'
                ? <Smartphone className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                : <Monitor className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              }
            </div>
          </div>

          {/* Description */}
          <p className="text-base md:text-xl text-foreground-secondary leading-relaxed">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" size="md">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Links */}
          {project.links && (
            <div className="flex flex-wrap gap-3 pt-2">
              {project.links.website && (
                <a
                  href={project.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Globe className="w-5 h-5" />
                  {tc('buttons.website')}
                </a>
              )}
              {project.links.appStore && (
                <a
                  href={project.links.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium border border-border hover:bg-secondary/80 transition-colors"
                >
                  <Smartphone className="w-5 h-5" />
                  {tc('buttons.appStore')}
                </a>
              )}
              {project.links.playStore && (
                <a
                  href={project.links.playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium border border-border hover:bg-secondary/80 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  {tc('buttons.playStore')}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FloatingImage({
  project,
  title,
  category,
}: {
  project: Project;
  title: string;
  category: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageTransform, setImageTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // Normalize mouse position to -1 to 1
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Move image in opposite direction for parallax feel (max ~15px shift)
    setImageTransform({ x: -x * 15, y: -y * 15 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setImageTransform({ x: 0, y: 0 });
  }, []);

  return (
    <div className="w-full md:w-1/2 self-start">
      <div
        ref={containerRef}
        className="relative w-full aspect-[5/4] md:aspect-[5/6] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl cursor-grab"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `scale(1.15) translate(${imageTransform.x}px, ${imageTransform.y}px)`,
          }}
        >
          <ImageWithFallback
            src={project.image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Floating Category Badge */}
        <div className="absolute top-6 left-6">
          <Badge variant="primary" className="bg-background/90 backdrop-blur-md text-foreground border-0">
            {category}
          </Badge>
        </div>

        {/* Year Badge */}
        <div className="absolute top-6 right-6">
          <div className="bg-background/90 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="text-sm font-bold">{project.year}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
