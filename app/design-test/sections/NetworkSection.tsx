'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users
} from 'lucide-react';

// Social Graph Visualization Component
const SocialGraph = () => {
  const centerUser = { x: 50, y: 50, label: 'You', color: 'from-violet-500 to-fuchsia-500' };

  const connections = [
    { x: 30, y: 30, label: '@alex', color: 'from-violet-400 to-purple-400' },
    { x: 70, y: 30, label: '@sarah', color: 'from-fuchsia-400 to-pink-400' },
    { x: 20, y: 60, label: '@mike', color: 'from-purple-400 to-violet-400' },
    { x: 80, y: 60, label: '@emma', color: 'from-pink-400 to-rose-400' },
    { x: 35, y: 75, label: '@john', color: 'from-indigo-400 to-violet-400' },
    { x: 65, y: 75, label: '@lisa', color: 'from-fuchsia-400 to-violet-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative h-80 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 overflow-hidden group"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)' }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* SVG Graph */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Connection lines */}
        {connections.map((conn, index) => (
          <motion.line
            key={`line-${index}`}
            x1={`${centerUser.x}%`}
            y1={`${centerUser.y}%`}
            x2={`${conn.x}%`}
            y2={`${conn.y}%`}
            stroke="url(#gradient-line)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Connection nodes */}
      {connections.map((conn, index) => (
        <motion.div
          key={`node-${index}`}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
          whileHover={{ scale: 1.2, zIndex: 10 }}
          className="absolute w-12 h-12 rounded-full cursor-pointer"
          style={{
            left: `${conn.x}%`,
            top: `${conn.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`w-full h-full rounded-full bg-gradient-to-br ${conn.color} flex items-center justify-center shadow-lg border-2 border-zinc-900`}>
            <span className="text-xs text-white font-bold">{conn.label.charAt(1).toUpperCase()}</span>
          </div>
        </motion.div>
      ))}

      {/* Center user node */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="absolute w-16 h-16 rounded-full"
        style={{
          left: `${centerUser.x}%`,
          top: `${centerUser.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${centerUser.color} flex items-center justify-center shadow-xl border-4 border-zinc-900 relative`}>
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-50 blur-lg"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Users className="w-7 h-7 text-white relative z-10" />
        </div>
      </motion.div>

      {/* Hover instruction */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <span className="text-xs text-zinc-500 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-800">
          Hover nodes to explore connections
        </span>
      </div>
    </motion.div>
  );
};

// Simplified NETWORK Section - Bubble Map Only
export const NetworkSection = () => {
  return (
    <div>
      <SocialGraph />
    </div>
  );
};
