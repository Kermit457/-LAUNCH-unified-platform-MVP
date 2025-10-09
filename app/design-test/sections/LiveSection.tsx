'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Users, Play
} from 'lucide-react';
import { GlassCard } from '@/components/design-system/DesignSystemShowcase';

// LIVE Badge Component
const LiveBadge = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full shadow-lg">
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-2 h-2 bg-white rounded-full"
    />
    <span className="text-xs font-bold text-white uppercase tracking-wider">LIVE</span>
  </div>
);

// Featured Stream Component
const FeaturedStream = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group cursor-pointer"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/30 via-orange-500/30 to-red-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <GlassCard className="relative p-0 overflow-hidden">
        {/* Video Preview */}
        <div className="relative aspect-video bg-zinc-900">
          {/* Thumbnail placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-zinc-900 to-orange-900/20" />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

          {/* LIVE badge */}
          <div className="absolute top-4 left-4 z-10">
            <LiveBadge />
          </div>

          {/* Stats overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-300 transition-colors">
                Trading Session: Meme Coins Only 🚀
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-red-400">
                  <Eye className="w-4 h-4" />
                  <span className="font-bold">1,247</span>
                </div>
                <div className="h-3 w-px bg-zinc-700" />
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Users className="w-4 h-4" />
                  <span>@crypto_king</span>
                </div>
              </div>
            </div>

            {/* Play button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg"
            >
              <Play className="w-6 h-6 text-white fill-white" />
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Simplified LIVE Section - Stream Window Only
export const LiveSection = () => {
  return (
    <div>
      <FeaturedStream />
    </div>
  );
};
