'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Gift, Zap, Target } from 'lucide-react';
import { PremiumButton } from '../design-system/DesignSystemShowcase';

// Unified types for all earn opportunities
export type OpportunityType = 'campaign' | 'bounty' | 'raid';

export interface EarnOpportunity {
  id: string;
  type: OpportunityType;
  title: string;
  description: string;
  reward: number;
  deadline: string;
  participants: number;
  progress: number; // 0-100
  icon?: React.ReactNode;
}

interface EarnOpportunityCardProps {
  opportunity: EarnOpportunity;
  onJoin?: (id: string) => void;
}

// Type-specific configurations
const typeConfig: Record<OpportunityType, {
  gradient: string;
  glowColor: string;
  accentColor: string;
  defaultIcon: React.ReactNode;
}> = {
  campaign: {
    gradient: 'from-green-500 to-emerald-500',
    glowColor: 'from-green-500/20 to-emerald-500/20',
    accentColor: 'text-green-400',
    defaultIcon: <Gift className="w-6 h-6" />,
  },
  bounty: {
    gradient: 'from-cyan-500 to-blue-500',
    glowColor: 'from-cyan-500/20 to-blue-500/20',
    accentColor: 'text-cyan-400',
    defaultIcon: <Target className="w-6 h-6" />,
  },
  raid: {
    gradient: 'from-violet-500 to-lime-500',
    glowColor: 'from-violet-500/20 to-lime-500/20',
    accentColor: 'text-violet-400',
    defaultIcon: <Zap className="w-6 h-6" />,
  },
};

export const EarnOpportunityCard: React.FC<EarnOpportunityCardProps> = ({
  opportunity,
  onJoin,
}) => {
  const config = typeConfig[opportunity.type];
  const icon = opportunity.icon || config.defaultIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.glowColor} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-zinc-700 transition-all duration-300 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${config.gradient}`}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative p-6">
          {/* Icon */}
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
            >
              <div className="text-white">{icon}</div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-white/90 transition-colors">
                {opportunity.title}
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-2">
                {opportunity.description}
              </p>
            </div>
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-4 mb-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{opportunity.deadline}</span>
            </div>
            <div className="h-3 w-px bg-zinc-700" />
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{opportunity.participants} joined</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-500">Progress</span>
              <span className={`font-bold ${config.accentColor}`}>{opportunity.progress}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${opportunity.progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                className={`h-full bg-gradient-to-r ${config.gradient} rounded-full relative`}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className={`text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              ${opportunity.reward}
            </div>

            <PremiumButton
              variant="secondary"
              className={`px-6 py-2.5 bg-gradient-to-r ${config.gradient} bg-opacity-10 hover:bg-opacity-20 border-0 text-white font-semibold`}
              onClick={() => onJoin?.(opportunity.id)}
              aria-label={`Join ${opportunity.type}: ${opportunity.title}`}
            >
              Join Now
            </PremiumButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
