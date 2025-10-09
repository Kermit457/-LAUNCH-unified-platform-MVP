'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Play, ExternalLink } from 'lucide-react';
import { Tag } from './Tag';

export interface LiveStream {
  id: string;
  title: string;
  viewers: number;
  tags: string[];
  thumbnail: string;
}

interface LiveStreamCardProps {
  stream: LiveStream;
  onOpen?: (id: string) => void;
}

export const LiveStreamCard: React.FC<LiveStreamCardProps> = ({ stream, onOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative group cursor-pointer"
      onClick={() => onOpen?.(stream.id)}
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/30 to-orange-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-red-500/30 transition-all">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-red-900/20 via-zinc-900 to-orange-900/20">
          {/* LIVE badge */}
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full shadow-lg">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
              <span className="text-xs font-bold text-white uppercase tracking-wider">LIVE</span>
            </div>
          </div>

          {/* Viewers */}
          <div className="absolute top-3 right-3 px-2.5 py-1.5 bg-zinc-900/80 backdrop-blur-sm rounded-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-bold text-white">{stream.viewers.toLocaleString()}</span>
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-2xl"
            >
              <Play className="w-8 h-8 text-white fill-white" />
            </motion.div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h4 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-red-300 transition-colors">
            {stream.title}
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {stream.tags.slice(0, 2).map((tag) => (
                <Tag key={tag} variant="default" size="sm">
                  {tag}
                </Tag>
              ))}
            </div>

            <button
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onOpen?.(stream.id);
              }}
              aria-label={`Open overlay for ${stream.title}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
