'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, TrendingUp } from 'lucide-react';
import { PremiumButton } from '../design-system/DesignSystemShowcase';
import { BudgetBar } from './BudgetBar';
import { Tag } from './Tag';

export interface Campaign {
  id: string;
  title: string;
  rewardPerK: number;
  budgetTotal: number;
  budgetUsed: number;
  socials: string[];
  endsAt: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  onJoin?: (id: string) => void;
}

const socialIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onJoin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-green-500/30 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-white text-lg flex-1 group-hover:text-green-300 transition-colors">
            {campaign.title}
          </h3>
          <Tag variant="success" size="sm">
            <TrendingUp className="w-3 h-3" />
            Active
          </Tag>
        </div>

        {/* Reward */}
        <div className="mb-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            ${campaign.rewardPerK}
          </div>
          <div className="text-xs text-zinc-500">per 1,000 views</div>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-2 mb-4">
          {campaign.socials.map((social) => (
            <div
              key={social}
              className="w-8 h-8 rounded-lg bg-zinc-800/50 border border-zinc-700 flex items-center justify-center text-zinc-400"
              title={social}
            >
              {socialIcons[social.toLowerCase()]}
            </div>
          ))}
        </div>

        {/* Budget */}
        <div className="mb-4">
          <BudgetBar
            total={campaign.budgetTotal}
            used={campaign.budgetUsed}
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Ends {campaign.endsAt}</span>
          <PremiumButton
            variant="secondary"
            className="text-sm px-4 py-2"
            onClick={() => onJoin?.(campaign.id)}
            aria-label={`Join campaign: ${campaign.title}`}
          >
            Join Campaign
          </PremiumButton>
        </div>
      </div>
    </motion.div>
  );
};
