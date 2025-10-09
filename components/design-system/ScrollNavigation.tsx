'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Network, Radio, Sparkles } from 'lucide-react';

interface ScrollNavigationProps {
  sections: Array<{
    id: string;
    label: string;
    icon: any;
    gradient: string;
  }>;
}

export const ScrollNavigation = ({ sections }: ScrollNavigationProps) => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === index;

          return (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              whileHover={{ scale: 1.2, x: -8 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
            >
              {/* Glow effect when active */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 blur-lg"
                  style={{ background: section.gradient }}
                />
              )}

              {/* Dot */}
              <div
                className={`
                  relative w-3 h-3 rounded-full transition-all duration-300
                  ${isActive
                    ? 'scale-150'
                    : 'bg-zinc-700 hover:bg-zinc-600'
                  }
                `}
                style={isActive ? { background: section.gradient } : {}}
              />

              {/* Tooltip */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: isActive ? '#fff' : '#a1a1aa' }} />
                  <span className="text-sm font-medium text-white">{section.label}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
