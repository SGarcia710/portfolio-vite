import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { Badge } from './ui/badge';

interface ExperienceItem {
  id: string;
  company: string;
  period: string;
  skills: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: '1',
    company: 'Perficient',
    period: 'Oct 2025 – Present',
    skills: ['React Native', 'TypeScript', 'Swift', 'Kotlin', 'TanStack Query', 'Zustand', 'Tailwind', 'Fastlane', 'Azure DevOps', 'GitHub', 'Claude'],
  },
  {
    id: '2',
    company: 'BILDIT',
    period: 'Oct 2024 – Oct 2025',
    skills: ['React Native', 'TypeScript', 'Kotlin', 'Swift', 'TanStack Query', 'Tailwind', 'Azure DevOps', 'Fastlane', 'CircleCI', 'Expo Updates and Notifications', 'Firebase', 'SFCC', 'Reanimated', 'Zustand', 'ContextAPI'],
  },
  {
    id: '3',
    company: 'Astound Digital',
    period: 'Oct 2021 – Oct 2024',
    skills: ['React Native', 'TypeScript', 'Kotlin', 'Swift', 'TanStack Query', 'Tailwind', 'Azure DevOps', 'Fastlane', 'Expo Updates and Notifications', 'Firebase', 'SFCC', 'Reanimated', 'Zustand', 'ContextAPI', 'Redux', 'Redux Sagas', 'Java', 'Objective-C'],
  },
  {
    id: '4',
    company: 'PaloIT',
    period: 'Jan 2021 – Oct 2021',
    skills: ['React Native'],
  },
  {
    id: '5',
    company: '21unicorns',
    period: 'Jun 2020 – Jan 2021',
    skills: ['React Native', 'Next.js'],
  },
  {
    id: '6',
    company: 'We Are Angular',
    period: 'Oct 2019 – Jun 2020',
    skills: ['React', 'React Native', 'Three.js', 'Bootstrap', 'Material UI', 'Redux', 'Redux Thunk', 'SCSS', 'Node.js', 'Express.js', 'TypeScript'],
  },
  {
    id: '7',
    company: 'Santiago de Cali University',
    period: 'Jun 2018 – Oct 2019',
    skills: ['React.js', 'WordPress', 'Joomla', 'Node.js', 'PHP', 'React Native'],
  },
];

function ResumeRow({ experience, index }: { experience: ExperienceItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('timeline');

  const role = t(`experiences.${experience.id}.role`);
  const description = t(`experiences.${experience.id}.description`);
  const type = t('typeFullTime');
  const at = t('at');

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
            {role}
          </h3>
          <span className="text-base text-foreground-secondary whitespace-nowrap">
            {type} {at} {experience.company}
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
              {role}
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
            {type} {at} {experience.company}
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
                {description}
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
  const { t } = useTranslation('timeline');

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
              {t('sectionTitle')}
            </h2>
            <span className="text-lg md:text-xl text-foreground-secondary mt-1">
              {t('sectionSubtitle')}
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
              {t('sectionLabel')}
            </span>
            <p className="text-foreground-secondary leading-relaxed">
              {t('sectionDescription')}
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
