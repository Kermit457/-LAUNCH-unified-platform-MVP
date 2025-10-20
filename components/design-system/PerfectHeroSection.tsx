// LaunchOS Perfect Hero Section - Exactly Matching Your Design
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Gift, PlaySquare, Users, LineChart,
  Zap, BarChart3, Megaphone, Radio,
  Bell, User, TrendingUp, MessageCircle, Wallet
} from 'lucide-react';

// Perfect App Icon Component - iOS Style
const AppIcon = ({
  app,
  onClick
}: {
  app: {
    id: string;
    icon: any;
    label: string;
    color: string;
    notifications?: number;
    isNew?: boolean;
  };
  onClick: () => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer select-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* Icon Container */}
      <div className="relative">
        {/* Main App Icon */}
        <div
          className="w-[74px] h-[74px] rounded-[18px] flex items-center justify-center relative overflow-hidden"
          style={{
            background: app.color,
            boxShadow: isPressed
              ? 'inset 0 2px 8px rgba(0,0,0,0.4)'
              : '0 2px 12px rgba(0,0,0,0.5)',
            transform: isPressed ? 'translateY(1px)' : 'translateY(0)',
            transition: 'all 0.2s ease'
          }}
        >
          {/* Gradient Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Icon */}
          <app.icon className="h-8 w-8 text-white relative z-10" />

          {/* Glass shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        </div>

        {/* Notification Badge */}
        {app.notifications && app.notifications > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5 text-xs font-semibold shadow-md">
            {app.notifications > 99 ? '99+' : app.notifications}
          </div>
        )}

        {/* New Indicator */}
        {app.isNew && !app.notifications && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-md" />
        )}
      </div>

      {/* Label */}
      <span className="text-[13px] text-white/90 font-medium">
        {app.label}
      </span>
    </motion.div>
  );
};

export default function PerfectHeroSection({ onLaunchApp }: { onLaunchApp?: () => void }) {

  // Apps configuration - 4x4 grid (16 apps)
  const apps = [
    {
      id: 'launch',
      icon: Rocket,
      label: 'Launch',
      color: 'linear-gradient(135deg, #9333EA, #C084FC)',
      notifications: 3,
      isNew: true
    },
    {
      id: 'earn',
      icon: LineChart,
      label: 'Earn',
      color: 'linear-gradient(135deg, #EA580C, #FB923C)',
      notifications: 12
    },
    {
      id: 'network',
      icon: Users,
      label: 'Network',
      color: 'linear-gradient(135deg, #0891B2, #06B6D4)',
      notifications: 5
    },
    {
      id: 'twitter',
      icon: () => <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      label: 'X',
      color: '#000000'
    },
    {
      id: 'bounty',
      icon: Gift,
      label: 'Bounty',
      color: 'linear-gradient(135deg, #DC2626, #F87171)'
    },
    {
      id: 'clips',
      icon: PlaySquare,
      label: 'Clips',
      color: 'linear-gradient(135deg, #2563EB, #60A5FA)',
      isNew: true
    },
    {
      id: 'campaigns',
      icon: Megaphone,
      label: 'Campaigns',
      color: 'linear-gradient(135deg, #DB2777, #F472B6)'
    },
    {
      id: 'bluesky',
      icon: User,
      label: 'Bluesky',
      color: 'linear-gradient(135deg, #4A9EFF, #1D4ED8)'
    },
    {
      id: 'predictions',
      icon: BarChart3,
      label: 'Predictions',
      color: 'linear-gradient(135deg, #0D9488, #5EEAD4)'
    },
    {
      id: 'obs',
      icon: Radio,
      label: 'OBS',
      color: 'linear-gradient(135deg, #7C3AED, #A78BFA)'
    },
    {
      id: 'meteora',
      icon: () => <span className="text-white font-bold text-2xl">M</span>,
      label: 'Meteora',
      color: '#2D3FE7'
    },
    {
      id: 'farcaster',
      icon: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 8h6M9 12h6" stroke="black" strokeWidth="2"/></svg>,
      label: 'Farcaster',
      color: 'linear-gradient(135deg, #8A63D2, #5B21B6)'
    },
    {
      id: 'trending',
      icon: TrendingUp,
      label: 'Trending',
      color: 'linear-gradient(135deg, #F59E0B, #FBBF24)'
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'Chat',
      color: 'linear-gradient(135deg, #10B981, #34D399)',
      notifications: 8
    },
    {
      id: 'wallet',
      icon: Wallet,
      label: 'Wallet',
      color: 'linear-gradient(135deg, #059669, #34D399)',
      notifications: 1
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      color: 'linear-gradient(135deg, #6366F1, #818CF8)'
    }
  ];

  const stats = [
    { label: 'Total Contributions', value: '$1.4M', color: '#A78BFA' },
    { label: 'Launches', value: '1,287', color: '#5EEAD4' },
    { label: 'Bounties', value: '643', color: '#FB923C' },
    { label: 'Earnings Paid', value: '$325K', color: '#34D399' }
  ];

  return (
    <section className="relative bg-black overflow-hidden pb-12">
      {/* Background Gradient - Subtle Purple Mesh */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top right, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(217, 70, 239, 0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Content */}
          <div className="space-y-6 pt-12">
            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-sm text-gray-400"
            >
              <Zap className="h-4 w-4" />
              <span>Live OS</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Solana • OBS • Agents</span>
            </motion.div>

            {/* Main Heading with Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <img
                src="/icm-motion-logo.svg"
                alt="ICM Motion"
                className="h-20 w-auto"
              />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-400 leading-relaxed max-w-xl"
            >
              <span className="font-bold text-white">The Engine of the Internet Capital Market</span>. Launch, earn, and collaborate in one place. Instant access to campaigns, bounties, predictions, widgets, and analytics powered by Solana.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLaunchApp}
                className="px-7 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Launch App
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-3.5 border border-gray-700 text-white font-semibold rounded-full hover:bg-white/5 transition-colors"
              >
                Explore Launches
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div
                    className="text-3xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - App Grid */}
          <div className="relative lg:pl-8">
            {/* Notification Bell */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -top-2 right-0 p-2.5 bg-white/5 backdrop-blur-xl rounded-full hover:bg-white/10 transition-colors"
            >
              <Bell className="h-5 w-5 text-white" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            {/* Applications Label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-0 left-8"
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Our Applications
              </p>
            </motion.div>

            {/* App Grid Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="pt-12"
            >
              {/* Apps Grid - 4 columns */}
              <div className="grid grid-cols-4 gap-x-6 gap-y-6">
                {apps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.03,
                      type: "spring",
                      stiffness: 300,
                      damping: 24
                    }}
                  >
                    <AppIcon
                      app={app}
                      onClick={() => {
                        console.log(`Opening ${app.label}`);
                        if (app.id === 'launch') {
                          onLaunchApp?.();
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Page Indicator Dots */}
              <div className="flex justify-center gap-2 mt-8">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Optional: Dock at bottom (minimal version) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-6">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      </div>
    </section>
  );
}