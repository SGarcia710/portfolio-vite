import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, variant = 'default', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className={`flex gap-2 ${variant === 'underline' ? 'border-b border-border' : ''}`}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
            variant={variant}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeContent}
        </motion.div>
      </div>
    </div>
  );
}

function TabButton({
  tab,
  isActive,
  onClick,
  variant,
}: {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  variant: 'default' | 'pills' | 'underline';
}) {
  const baseClasses = 'relative px-4 py-2 font-medium transition-colors duration-200';
  
  const variantClasses = {
    default: isActive
      ? 'bg-primary text-primary-foreground rounded-lg'
      : 'text-foreground-secondary hover:text-foreground hover:bg-secondary rounded-lg',
    pills: isActive
      ? 'bg-accent text-accent-foreground rounded-full'
      : 'text-foreground-secondary hover:text-foreground hover:bg-secondary rounded-full',
    underline: isActive
      ? 'text-foreground border-b-2 border-accent'
      : 'text-foreground-secondary hover:text-foreground border-b-2 border-transparent',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} flex items-center gap-2`}
    >
      {tab.icon}
      {tab.label}
    </button>
  );
}
