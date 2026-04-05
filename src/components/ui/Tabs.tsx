import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => {
  return (
    <div className={cn('flex space-x-1 rounded-lg bg-slate-100 p-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            activeTab === tab.id ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 rounded-md bg-white shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center space-x-2">
            {tab.icon}
            <span>{tab.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
};
