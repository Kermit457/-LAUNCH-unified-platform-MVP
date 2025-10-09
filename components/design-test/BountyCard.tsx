'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign } from 'lucide-react';
import { PremiumButton } from '../design-system/DesignSystemShowcase';
import { Tag } from './Tag';

export interface Bounty {
  id: string;
  task: string;
  payout: number;
  difficulty: 'easy' | 'medium' | 'hard';
  expiresAt: string;
  tags: string[];
}

interface BountyCardProps {
  bounty: Bounty;
  onAccept?: (id: string) => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({ bounty, onAccept }) => {
  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      <div className="relative p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 group-hover:border-violet-500/30 transition-all">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
              {bounty.task}
            </h4>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Tag variant={difficultyColors[bounty.difficulty]}>
                {bounty.difficulty}
              </Tag>
              {bounty.tags.map((tag) => (
                <Tag key={tag} variant="default">
                  {tag}
                </Tag>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{bounty.expiresAt}</span>
                </div>
                <div className="text-lg font-bold text-green-400">
                  ${bounty.payout}
                </div>
              </div>

              <PremiumButton
                variant="ghost"
                className="text-sm px-3 py-1.5"
                onClick={() => onAccept?.(bounty.id)}
                aria-label={`Accept bounty: ${bounty.task}`}
              >
                Accept
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
