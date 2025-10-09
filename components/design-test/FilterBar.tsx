'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FilterBarProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
  sticky?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  active,
  onChange,
  sticky = true,
}) => {
  return (
    <div className={`${sticky ? 'sticky top-0 z-40' : ''} bg-black/80 backdrop-blur-xl border-b border-zinc-800 py-3 px-4 sm:px-6`}>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {options.map((option) => {
          const isActive = active === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`
                relative px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all
                ${isActive
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
