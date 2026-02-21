import React, { useState } from 'react';
import { ExternalLink, Globe, ChevronLeft, ChevronRight, Smartphone, Monitor } from 'lucide-react';
import { Badge } from './ui/badge';
import { IconButton } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
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
    id: '1',
    title: 'Mi Palacio',
    description: 'Official mobile app for Mexico\'s iconic luxury department store. Features image-based product search, personalized notifications, multiple payment methods including PayPal, loyalty program management, and a seamless shopping experience across fashion, beauty, home, and technology.',
    category: 'E-Commerce',
    type: 'mobile',
    year: '2025',
    client: 'El Palacio de Hierro',
    tags: ['React Native', 'TypeScript', 'SFCC', 'E-Commerce', 'Payments', 'Push Notifications'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://www.elpalaciodehierro.com/',
      appStore: 'https://apps.apple.com/co/app/el-palacio-de-hierro/id6449685817',
      playStore: 'https://play.google.com/store/apps/details?id=com.eph.superapp',
    },
  },
  {
    id: '2',
    title: 'FlyGuys Pilot',
    description: 'Mobile app for FlyGuys\' nationwide network of FAA-compliant drone pilots. Connects certified operators with clients for aerial imaging, LiDAR, surveying, inspections, and data capture missions across multiple industries.',
    category: 'Drone Services',
    type: 'mobile',
    year: '2024',
    client: 'FlyGuys',
    tags: ['React Native', 'TypeScript', 'Maps', 'Real-time', 'GPS'],
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://flyguys.com/',
      appStore: 'https://apps.apple.com/co/app/flyguys-pilots/id6474402860',
      playStore: 'https://play.google.com/store/apps/details?id=com.flyguys_pilotsapp',
    },
  },
  {
    id: '3',
    title: 'Slab Dream Lab Designer',
    description: 'Creative design app that transforms photos into custom baseplates for LEGO, DUPLO, and other brick brands. Features image upload, AI-powered object recognition, customizable sizes, and direct-to-manufacturing order flow.',
    category: 'E-Commerce',
    type: 'mobile',
    year: '2023',
    client: 'Slab Dream Lab',
    tags: ['React Native', 'AI/ML', 'Image Processing', 'E-Commerce', 'Android'],
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://slabdreamlab.com/',
      playStore: 'https://play.google.com/store/apps/details?id=com.slabmobile',
    },
  },
  {
    id: '4',
    title: 'Aritzia eCommerce',
    description: 'High-performance e-commerce website for the Canadian fashion retailer. Built with modern web technologies delivering a fast, responsive shopping experience with product catalog, search, checkout, and international shipping support.',
    category: 'E-Commerce',
    type: 'web',
    year: '2022',
    client: 'Aritzia',
    tags: ['React', 'TypeScript', 'SFCC', 'E-Commerce', 'Performance', 'Web'],
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://www.aritzia.com/intl/en',
    },
  },
  {
    id: '5',
    title: 'PayIT Outdoors',
    description: 'Government digital platform for outdoor recreation licensing and permitting. Enables hunting, fishing, and recreational license purchases, harvest reporting, and event discovery. Serves 100M+ residents across multiple US states and Canadian provinces.',
    category: 'GovTech',
    type: 'mobile',
    year: '2022',
    client: 'PayIT',
    tags: ['React Native', 'TypeScript', 'Payments', 'Government', 'Licensing'],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://payitgov.com/outdoors/',
    },
  },
  {
    id: '6',
    title: 'MTL Falcon',
    description: 'Specialized roof measurement tool for Metal-Era and Hickman Edge Systems. Features voice control, geometry manipulation, custom miter support, PDF generation, and project synchronization via Falcon API for fast and accurate roof edge measurements.',
    category: 'Construction Tech',
    type: 'mobile',
    year: '2021',
    client: 'Metal-Era',
    tags: ['React Native', 'Voice Control', 'CAD', 'API Integration', 'iOS'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://www.metalera.com/',
      appStore: 'https://apps.apple.com/es/app/mtl-falcon/id1565388274',
    },
  },
  {
    id: '7',
    title: 'StageKeep',
    description: 'Web platform for choreographers and production creators. Streamlines formation design, music synchronization, budget optimization, and team collaboration from pre-production through performance. Used by Toronto Raptors\' entertainment crew.',
    category: 'Entertainment Tech',
    type: 'web',
    year: '2020',
    client: 'StageKeep',
    tags: ['React', 'Next.js', 'TypeScript', 'Real-time', 'Web App'],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://stagekeep.com/',
    },
  },
  {
    id: '8',
    title: 'Universidad Santiago de Cali',
    description: 'Institutional website for one of Colombia\'s leading universities. Built major portions of the platform including academic program pages, student services portal, virtual classrooms integration, and faculty directories serving thousands of students.',
    category: 'Education',
    type: 'web',
    year: '2019',
    client: 'USC',
    tags: ['React', 'Next.js', 'CMS', 'SEO', 'Web'],
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=1000&fit=crop&q=80',
    links: {
      website: 'https://www.usc.edu.co/',
    },
  },
];

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(projects.length - 1, prev + 1));
  };

  return (
    <section id="projects" className="relative min-h-screen flex flex-col">
      {/* Section Header */}
      <div className="py-12 md:py-20 bg-background">
        <div className="container-premium">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Featured Work
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              A curated selection of high-impact projects showcasing technical excellence and design quality
            </p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {projects.map((project, index) => (
            <ProjectSlide
              key={project.id}
              project={project}
              onPrev={handlePrev}
              onNext={handleNext}
              canGoPrev={activeIndex > 0}
              canGoNext={activeIndex < projects.length - 1}
            />
          ))}
        </div>

        {/* Project Counter */}
        <div className="absolute top-4 md:top-8 left-1/2 md:left-auto md:right-8 -translate-x-1/2 md:translate-x-0 z-20 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm font-medium">
            <span className="text-2xl font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="text-muted-foreground"> / {String(projects.length).padStart(2, '0')}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function ProjectSlide({
  project,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: {
  project: Project;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}) {
  return (
    <div className="min-w-full h-screen flex items-center justify-center px-6 md:px-8 lg:px-16 pb-8">
      <div className="w-full max-w-7xl h-full md:h-[85vh] flex flex-col md:flex-row gap-6 md:gap-12 items-center pt-12 md:pt-0 md:py-0">
        {/* Image Side */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-full relative">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Floating Category Badge */}
            <div className="absolute top-6 left-6">
              <Badge variant="primary" className="bg-background/90 backdrop-blur-md text-foreground border-0">
                {project.category}
              </Badge>
            </div>

            {/* Year Badge */}
            <div className="absolute top-6 right-6">
              <div className="bg-background/90 backdrop-blur-md px-4 py-2 rounded-full">
                <span className="text-sm font-bold">{project.year}</span>
              </div>
            </div>

            {/* Navigation Arrows at Bottom of Image */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-4 z-30">
              <IconButton
                variant="secondary"
                size="lg"
                onClick={onPrev}
                disabled={!canGoPrev}
                className="bg-background/90 backdrop-blur-md hover:bg-background shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </IconButton>
              <IconButton
                variant="secondary"
                size="lg"
                onClick={onNext}
                disabled={!canGoNext}
                className="bg-background/90 backdrop-blur-md hover:bg-background shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3 md:space-y-6">
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
              {project.title}
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
            {project.description}
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
                  Website
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
                  App Store
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
                  Play Store
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
