import React, { useState } from 'react';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';
import { Badge } from './ui/badge';
import { IconButton } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  year: string;
  client?: string;
  links?: {
    github?: string;
    demo?: string;
    appStore?: string;
    playStore?: string;
  };
}

const projects: Project[] = [
  {
    id: '1',
    title: 'El Plato',
    description: 'Complete mobile banking solution with eCommerce integration and financial services. Built with React Native featuring advanced security, real-time transactions, and seamless user experience for thousands of daily users.',
    category: 'Fintech Platform',
    year: '2024',
    client: 'BILDIT',
    tags: ['React Native', 'TypeScript', 'Azure DevOps', 'Fastlane', 'Security'],
    image: 'fintech mobile banking app',
    links: {
      appStore: '#',
    },
  },
  {
    id: '2',
    title: 'E-Commerce Mobile',
    description: 'High-performance shopping application with seamless checkout experience, advanced product search, personalized recommendations, and real-time inventory management using GraphQL and Shopify integration.',
    category: 'E-Commerce',
    year: '2023',
    client: 'Astound Commerce',
    tags: ['React Native', 'GraphQL', 'Shopify', 'Redux', 'Performance'],
    image: 'ecommerce shopping mobile app',
    links: {
      demo: '#',
    },
  },
  {
    id: '3',
    title: 'Novasa Financial',
    description: 'Mobile and web platforms for innovative financial services by PayPal co-founder Bill Harris. Features include secure transactions, portfolio management, analytics dashboard, and investment tracking.',
    category: 'Financial Services',
    year: '2021',
    client: 'PALO IT',
    tags: ['React Native', 'MaterialUI', 'Emotion', 'ContextAPI', 'Web'],
    image: 'financial services app dashboard',
  },
  {
    id: '4',
    title: 'Articly Social',
    description: 'Feature-rich social platform with real-time messaging, content sharing, community features, and comprehensive admin dashboard. Built for scale with Firebase real-time database and push notifications.',
    category: 'Social Network',
    year: '2020',
    client: '21unicorns',
    tags: ['React Native', 'Firebase', 'Redux', 'Next.js', 'Real-time'],
    image: 'social media mobile app interface',
    links: {
      github: '#',
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
              src={`https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=1000&fit=crop&q=80`}
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
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            {project.title}
          </h3>

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
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Github className="w-5 h-5" />
                  View Code
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium border border-border hover:bg-secondary/80 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
