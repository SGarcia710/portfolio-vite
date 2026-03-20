import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { Badge } from './ui/badge';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  type: string;
  period: string;
  description: string;
  skills: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: '1',
    role: 'Lead Mobile Engineer',
    company: 'Perficient',
    type: 'Full-time',
    period: 'Oct 2025 – Present',
    description:
      "Tech Lead and principal mobile engineer for Cast & Crew, leading the React Native app across iOS and Android. I drive architecture, delivery, and release strategy while partnering across product and engineering to build reliable mobile experiences for a company that supports payroll, finance, and production workflows in the entertainment industry.",
    skills: ['React Native', 'TypeScript', 'Swift', 'Kotlin', 'TanStack Query', 'Zustand', 'Tailwind', 'Fastlane', 'Azure DevOps', 'GitHub', 'Claude'],
  },
  {
    id: '2',
    role: 'Senior Mobile Engineer',
    company: 'BILDIT',
    type: 'Full-time',
    period: 'Oct 2024 – Oct 2025',
    description:
      "As the main React Native developer for El Palacio de Hierro's mobile app, I led the development of a unified platform combining eCommerce and financial services. I designed and implemented robust integrations across multiple systems, ensuring high performance, security, and a seamless user experience in close coordination with cross-functional teams.",
    skills: ['React Native', 'TypeScript', 'Kotlin', 'Swift', 'TanStack Query', 'Tailwind', 'Azure DevOps', 'Fastlane', 'CircleCI', 'Expo Updates and Notifications', 'Firebase', 'SFCC', 'Reanimated', 'Zustand', 'ContextAPI'],
  },
  {
    id: '3',
    role: 'Senior Mobile Engineer',
    company: 'Astound Digital',
    type: 'Full-time',
    period: 'Oct 2021 – Oct 2024',
    description:
      "Senior Mobile Engineer in the company's new Mobile Department, building React Native e-commerce projects for enterprise clients. I also helped establish the standards, tooling, and engineering guidelines the team followed when developing scalable mobile apps with React Native.",
    skills: ['React Native', 'TypeScript', 'Kotlin', 'Swift', 'TanStack Query', 'Tailwind', 'Azure DevOps', 'Fastlane', 'Expo Updates and Notifications', 'Firebase', 'SFCC', 'Reanimated', 'Zustand', 'ContextAPI', 'Redux', 'Redux Sagas', 'Java', 'Objective-C'],
  },
  {
    id: '4',
    role: 'Ssr. React Native Engineer',
    company: 'PaloIT',
    type: 'Full-time',
    period: 'Jan 2021 – Oct 2021',
    description:
      'Semi Senior Mobile Engineer for Nirvana, the new neobank by Bill Harris (PayPal co-founder). Different fixes and development of a variety of features for the Mobile App and Backoffice for Movistar Uruguay.',
    skills: ['React Native'],
  },
  {
    id: '5',
    role: 'Mid. Frontend Engineer',
    company: '21unicorns',
    type: 'Full-time',
    period: 'Jun 2020 – Jan 2021',
    description:
      'Developed many features for Adictic mobile app, a fashion social network. Developed the entire users and push notification management dashboard. Developed the web version for the social network.',
    skills: ['React Native', 'Next.js'],
  },
  {
    id: '6',
    role: 'Jr. Fullstack Engineer',
    company: 'Santiago de Cali University',
    type: 'Full-time',
    period: 'Jun 2018 – Oct 2019',
    description:
      "Developed different websites and web apps, managed different platforms for the university's Library, Editorial, and Research area.",
    skills: ['React.js', 'WordPress', 'Joomla', 'Node.js', 'PHP', 'React Native'],
  },
];

function ResumeRow({ experience, index }: { experience: ExperienceItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Row */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group cursor-pointer"
      >
        {/* Desktop layout */}
        <div className="hidden md:flex items-center gap-6 py-8">
          <span className="text-base text-foreground-tertiary whitespace-nowrap min-w-[180px] text-left">
            {experience.period}
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold flex-1 text-left">
            {experience.role}
          </h3>
          <span className="text-base text-foreground-secondary whitespace-nowrap">
            {experience.type} at {experience.company}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground-tertiary group-hover:text-foreground transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Mobile layout - stacked */}
        <div className="flex md:hidden flex-col gap-1 py-6">
          <span className="text-sm text-foreground-tertiary text-left">
            {experience.period}
          </span>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-left">
              {experience.role}
            </h3>
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground-tertiary group-hover:text-foreground transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.div>
          </div>
          <span className="text-sm text-foreground-secondary text-left">
            {experience.type} at {experience.company}
          </span>
        </div>
      </button>

      {/* Expandable Details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 md:pb-8 pl-0 md:pl-[196px]">
              <p className="text-foreground-secondary leading-relaxed mb-4 max-w-2xl">
                {experience.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Separator */}
      <div className="h-px bg-border" />
    </motion.div>
  );
}

export function TimelineSection() {
  return (
    <section id="experience" className="py-20 md:py-32 relative">
      <div className="container-premium">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-start gap-2">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              Resume
            </h2>
            <span className="text-lg md:text-xl text-foreground-secondary mt-1">
              (From 2017)
            </span>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column - Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-[280px] flex-shrink-0"
          >
            <span className="text-sm text-foreground-tertiary mb-4 block">
              ( My Career )
            </span>
            <p className="text-foreground-secondary leading-relaxed">
              8 years of building exceptional mobile applications across fintech, e-commerce, and entertainment. Focused on React Native, leading teams, and delivering products that scale.
            </p>
          </motion.div>

          {/* Right Column - Experience Rows */}
          <div className="flex-1">
            {/* Top separator */}
            <div className="h-px bg-border" />

            {experiences.map((exp, index) => (
              <ResumeRow key={exp.id} experience={exp} index={index} />
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
