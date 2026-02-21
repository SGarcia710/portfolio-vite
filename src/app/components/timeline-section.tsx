import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { Badge } from './ui/badge';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  skills: string[];
  color: string;
}

const experiences: ExperienceItem[] = [
  {
    id: '1',
    role: 'Senior Mobile Developer',
    company: 'BILDIT',
    location: 'Mill Valley, CA',
    period: 'Oct 2024 - Present',
    description: 'Leading React Native development for El Plato (fintech platform). Architecting scalable solutions with high performance and security.',
    skills: ['React Native', 'React Query', 'Azure DevOps', 'Fastlane', 'TypeScript'],
    color: '#339af0',
  },
  {
    id: '2',
    role: 'Senior Mobile Developer',
    company: 'Astound Commerce',
    location: 'Oakland, CA',
    period: 'Oct 2023 - Oct 2024',
    description: 'Built new Mobile Department on the company. Developed React Native e-commerce apps following enterprise standards and guidelines.',
    skills: ['React Native', 'React Query', 'GraphQL', 'Redux', 'Shopify'],
    color: '#845ef7',
  },
  {
    id: '3',
    role: 'Ssr. Mobile Developer',
    company: 'PALO IT',
    location: 'Paris, France',
    period: 'Jan 2021 - Oct 2021',
    description: 'Semi Senior Mobile Developer for Novasa by Bill Harris (PayPal co-founder). Developed variety of features for the Mobile App and Backoffice.',
    skills: ['React Native', 'MaterialUI', 'Emotion', 'ContextAPI', 'TypeScript'],
    color: '#ff922b',
  },
  {
    id: '4',
    role: 'Mid. Frontend Developer',
    company: '21unicorns',
    location: 'Madrid, Spain',
    period: 'Jun 2020 - Jan 2021',
    description: 'Developed main features for Articly mobile app and social network. Built users and push notification management dashboard.',
    skills: ['React Native', 'Next.js', 'TailwindCSS', 'Firebase', 'Redux Thunk'],
    color: '#51cf66',
  },
];

export function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" ref={sectionRef} className="py-20 md:py-32 relative">
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Work Experience
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            7 years of building exceptional mobile applications across fintech, e-commerce, and social platforms
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-ml-px">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-accent via-purple-500 to-orange-500"
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <TimelineItem
                key={exp.id}
                experience={exp}
                index={index}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  experience,
  index,
  isEven,
}: {
  experience: ExperienceItem;
  index: number;
  isEven: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col md:gap-8`}
    >
      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
        className="absolute left-4 md:left-1/2 md:-ml-3 w-6 h-6 rounded-full border-4 border-background z-10"
        style={{ backgroundColor: experience.color }}
      />

      {/* Content Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`w-full md:w-[calc(50%-2rem)] ml-16 md:ml-0 ${
          isEven ? 'md:pr-8' : 'md:pl-8'
        }`}
      >
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          {/* Company & Period */}
          <div className={`flex items-start justify-between mb-3 flex-wrap gap-2 ${
            isEven ? 'md:flex-row-reverse' : ''
          }`}>
            <div className={`flex items-center gap-2`}>
              <Briefcase className="w-5 h-5" style={{ color: experience.color }} />
              <span className="font-semibold text-lg">{experience.company}</span>
            </div>
            <div>
              <div className={`flex items-center gap-2 text-muted-foreground text-sm mb-1 ${
                isEven ? 'md:justify-end' : ''
              }`}>
                <Calendar className="w-4 h-4" />
                <span>{experience.period}</span>
              </div>
              <div className={`flex items-center gap-2 text-muted-foreground text-sm ${
                isEven ? 'md:justify-end' : ''
              }`}>
                <MapPin className="w-4 h-4" />
                <span>{experience.location}</span>
              </div>
            </div>
          </div>

          {/* Role */}
          <h3 className={`text-xl font-bold mb-3 ${isEven ? 'md:text-right' : ''}`}>
            {experience.role}
          </h3>

          {/* Description */}
          <p className={`text-foreground-secondary mb-4 ${isEven ? 'md:text-right' : ''}`}>
            {experience.description}
          </p>

          {/* Skills */}
          <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
            {experience.skills.map((skill) => (
              <Badge key={skill} variant="secondary" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Spacer for desktop layout */}
      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </motion.div>
  );
}