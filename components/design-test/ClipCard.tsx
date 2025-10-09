'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, DollarSign } from 'lucide-react';
import { Tag } from './Tag';

export interface Clip {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'paid';
  cpm: number;
  views: number;
}

interface ClipCardProps {
  clip: Clip;
  onClick?: (id: string) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({ clip, onClick }) => {
  const statusVariant = {
    pending: 'warning' as const,
    approved: 'success' as const,
    paid: 'info' as const,
  };

  const earnings = (clip.views / 1000) * clip.cpm;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative group cursor-pointer"
      onClick={() => onClick?.(clip.id)}
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-cyan-500/30 transition-all">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-cyan-900/20 via-zinc-900 to-blue-900/20">
          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <Tag variant={statusVariant[clip.status]}>
              {clip.status.toUpperCase()}
            </Tag>
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play className="w-7 h-7 text-white fill-white" />
            </motion.div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
            {clip.title}
          </h4>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-zinc-400">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{clip.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>${clip.cpm} CPM</span>
              </div>
            </div>
            <div className="font-bold text-cyan-400">
              ${earnings.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
