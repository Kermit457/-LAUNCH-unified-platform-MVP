'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPIStatProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  gradient?: string;
  delay?: number;
}

export const KPIStat: React.FC<KPIStatProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  gradient = 'from-green-500 to-emerald-500',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />

      <div className="relative p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-zinc-700 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm text-zinc-400 mb-1">{label}</p>
            <div className={`text-3xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
              {value}
            </div>
          </div>
          {Icon && (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full w-fit ${
            trend.direction === 'up' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            trend.direction === 'down' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
            'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
          }`}>
            <span>{trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
