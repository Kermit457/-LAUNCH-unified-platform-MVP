// LaunchOS Enhanced Hero Section - Ultimate Native App Feel
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import {
  Rocket, Gift, PlaySquare, Users, Wallet, LineChart,
  Zap, BarChart3, Megaphone, Radio, Network, Cpu,
  Bell, Battery, Wifi, Signal, Search, Home, Grid
} from 'lucide-react';

// Haptic feedback with sound
const useEnhancedHaptic = () => {
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContext.current?.close();
    };
  }, []);

  const triggerHaptic = (type: 'tap' | 'press' | 'success' | 'error' = 'tap') => {
    // Visual ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'haptic-ripple';
    const style = document.createElement('style');
    style.textContent = `
      .haptic-ripple {
        position: fixed;
        pointer-events: none;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.3), transparent);
        animation: ripple-effect 0.6s ease-out;
        z-index: 9999;
      }
      @keyframes ripple-effect {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      ripple.style.left = `${e.clientX - 40}px`;
      ripple.style.top = `${e.clientY - 40}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    handleMouseMove(new MouseEvent('mousemove'));
    document.body.appendChild(ripple);

    // Sound effect
    if (audioContext.current) {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);

      switch(type) {
        case 'tap':
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.05;
          break;
        case 'press':
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.08;
          break;
        case 'success':
          oscillator.frequency.value = 1200;
          gainNode.gain.value = 0.06;
          break;
        case 'error':
          oscillator.frequency.value = 300;
          gainNode.gain.value = 0.07;
          break;
      }

      oscillator.start();
      oscillator.stop(audioContext.current.currentTime + 0.05);
    }

    setTimeout(() => {
      ripple.remove();
      style.remove();
      document.removeEventListener('mousemove', handleMouseMove);
    }, 600);

    // Physical shake for strong feedback
    if (type === 'press' || type === 'error') {
      document.body.style.transform = 'translateX(2px)';
      setTimeout(() => {
        document.body.style.transform = 'translateX(-2px)';
        setTimeout(() => {
          document.body.style.transform = 'translateX(0)';
        }, 50);
      }, 50);
    }
  };

  return { triggerHaptic };
};

// Status bar component (like iOS/Android)
const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/50 backdrop-blur-xl z-50 flex items-center justify-between px-6 text-xs text-white/80">
      <div className="flex items-center gap-1">
        <span className="font-medium">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="w-40 h-5 bg-black rounded-full px-2 flex items-center">
          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-3.5 h-3.5" />
        <span className="font-medium">100%</span>
      </div>
    </div>
  );
};

// Enhanced App Icon Component
const EnhancedAppIcon = ({
  app,
  onOpen,
  isPressed: externalPressed
}: {
  app: {
    id: string;
    icon: any;
    label: string;
    gradient: string;
    borderColor: string;
    notifications?: number;
    isNew?: boolean;
  };
  onOpen: (app: any) => void;
  isPressed?: boolean;
}) => {
  const { triggerHaptic } = useEnhancedHaptic();
  const [isPressed, setIsPressed] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const scale = useSpring(1);
  const rotate = useSpring(0);

  // Long press to wiggle (edit mode)
  const longPressTimer = useRef<NodeJS.Timeout>();

  const handleMouseDown = () => {
    setIsPressed(true);
    scale.set(0.9);
    triggerHaptic('tap');

    longPressTimer.current = setTimeout(() => {
      setIsWiggling(true);
      triggerHaptic('press');
    }, 500);
  };

  const handleMouseUp = () => {
    clearTimeout(longPressTimer.current);
    setIsPressed(false);
    scale.set(1);

    if (!isWiggling) {
      onOpen(app);
      triggerHaptic('success');
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(longPressTimer.current);
    setIsPressed(false);
    scale.set(1);
  };

  return (
    <motion.div
      className="relative select-none cursor-pointer"
      style={{ scale }}
      animate={isWiggling ? {
        rotate: [0, -2, 2, -2, 2, 0],
        transition: { repeat: Infinity, duration: 0.5 }
      } : {}}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
    >
      {/* Delete button (when wiggling) */}
      {isWiggling && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center z-10"
          onClick={(e) => {
            e.stopPropagation();
            setIsWiggling(false);
            triggerHaptic('tap');
          }}
        >
          <span className="text-white text-xs font-bold">×</span>
        </motion.button>
      )}

      {/* App icon container */}
      <div className="relative">
        <div
          className="relative w-20 h-20 rounded-[22px] p-[2px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${app.borderColor}, transparent)`,
            boxShadow: isPressed ? 'inset 0 2px 10px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <div
            className="w-full h-full rounded-[20px] flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.95))',
            }}
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

            {/* Icon */}
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${app.gradient}`}>
              <app.icon className="h-7 w-7 text-white" />
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
              initial={{ opacity: 0, x: -100, y: -100 }}
              animate={isPressed ? { opacity: 1, x: 100, y: 100 } : {}}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Label */}
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-white/90 drop-shadow-lg">
            {app.label}
          </span>
        </div>

        {/* Notification badge */}
        {app.notifications && app.notifications > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-lg"
          >
            <span className="text-[10px] text-white font-bold">
              {app.notifications > 99 ? '99+' : app.notifications}
            </span>
          </motion.div>
        )}

        {/* New indicator dot */}
        {app.isNew && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full shadow-lg animate-pulse" />
        )}
      </div>
    </motion.div>
  );
};

// Dock component (bottom app bar)
const Dock = ({ apps, onAppOpen }: { apps: any[], onAppOpen: (app: any) => void }) => {
  const { triggerHaptic } = useEnhancedHaptic();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-black/30 backdrop-blur-2xl rounded-3xl p-3 border border-white/10 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          {apps.map((app) => (
            <motion.button
              key={app.id}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                triggerHaptic('tap');
                onAppOpen(app);
              }}
              className="relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-2 border border-white/10">
                <app.icon className="w-full h-full text-white" />
              </div>
              {app.isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Main Enhanced Hero Section
export default function EnhancedHeroSection({ onLaunchApp }: { onLaunchApp?: () => void }) {
  const { triggerHaptic } = useEnhancedHaptic();
  const [openingApp, setOpeningApp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Main apps configuration
  const apps = [
    {
      id: 'launch',
      icon: Rocket,
      label: 'Launch',
      gradient: 'from-violet-500 to-purple-600',
      borderColor: 'rgb(139, 92, 246)',
      notifications: 3,
      isNew: true
    },
    {
      id: 'earn',
      icon: LineChart,
      label: 'Earn',
      gradient: 'from-orange-500 to-amber-600',
      borderColor: 'rgb(251, 146, 60)',
      notifications: 12
    },
    {
      id: 'network',
      icon: Users,
      label: 'Network',
      gradient: 'from-cyan-500 to-blue-600',
      borderColor: 'rgb(6, 182, 212)',
      notifications: 5
    },
    {
      id: 'bounty',
      icon: Gift,
      label: 'Bounty',
      gradient: 'from-red-500 to-pink-600',
      borderColor: 'rgb(239, 68, 68)'
    },
    {
      id: 'clips',
      icon: PlaySquare,
      label: 'Clips',
      gradient: 'from-blue-500 to-indigo-600',
      borderColor: 'rgb(59, 130, 246)',
      isNew: true
    },
    {
      id: 'wallet',
      icon: Wallet,
      label: 'Wallet',
      gradient: 'from-emerald-500 to-green-600',
      borderColor: 'rgb(16, 185, 129)',
      notifications: 1
    },
    {
      id: 'campaigns',
      icon: Megaphone,
      label: 'Campaigns',
      gradient: 'from-pink-500 to-rose-600',
      borderColor: 'rgb(236, 72, 153)'
    },
    {
      id: 'predictions',
      icon: BarChart3,
      label: 'Predictions',
      gradient: 'from-teal-500 to-emerald-600',
      borderColor: 'rgb(20, 184, 166)'
    },
    {
      id: 'agents',
      icon: Cpu,
      label: 'Agents',
      gradient: 'from-slate-500 to-zinc-600',
      borderColor: 'rgb(148, 163, 184)'
    },
    {
      id: 'obs',
      icon: Radio,
      label: 'OBS',
      gradient: 'from-indigo-500 to-purple-600',
      borderColor: 'rgb(99, 102, 241)'
    },
    {
      id: 'frenwork',
      icon: Network,
      label: 'Frenwork',
      gradient: 'from-lime-500 to-green-600',
      borderColor: 'rgb(132, 204, 22)'
    }
  ];

  // Dock apps (favorites)
  const dockApps = [
    { id: 'home', icon: Home, isActive: true },
    { id: 'launch-dock', icon: Rocket },
    { id: 'wallet-dock', icon: Wallet },
    { id: 'network-dock', icon: Users },
    { id: 'grid', icon: Grid },
  ];

  const stats = [
    { label: 'Total Contributions', value: '$1.4M', color: 'text-violet-400' },
    { label: 'Launches', value: '1,287', color: 'text-cyan-400' },
    { label: 'Bounties', value: '643', color: 'text-orange-400' },
    { label: 'Earnings Paid', value: '$325K', color: 'text-emerald-400' },
  ];

  const handleAppOpen = (app: any) => {
    setOpeningApp(app);
    setTimeout(() => {
      onLaunchApp?.();
      setOpeningApp(null);
    }, 800);
  };

  return (
    <>
      {/* Status Bar */}
      <StatusBar />

      <section className="relative min-h-screen bg-black pt-8">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/30 rounded-full blur-[200px]"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px]"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Search Bar (iOS style) */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div
                  onClick={() => setShowSearch(true)}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <Search className="w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search apps and features..."
                    className="bg-transparent text-white placeholder-white/50 outline-none flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearch(true)}
                  />
                </div>
              </motion.div>

              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 text-sm text-zinc-400"
              >
                <Zap className="h-4 w-4" />
                <span>Live OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Solana • OBS • Agents</span>
              </motion.div>

              {/* Main heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  The Creator's<br />
                  Operating System
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-zinc-400 max-w-xl"
              >
                Launch, earn, and collaborate in one place. Instant access to campaigns, bounties, predictions, widgets, and analytics.
              </motion.p>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerHaptic('success');
                    onLaunchApp?.();
                  }}
                  className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-100 transition-colors shadow-xl"
                >
                  Launch App
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => triggerHaptic('tap')}
                  className="px-8 py-4 border border-zinc-700 text-white font-semibold rounded-full hover:bg-zinc-900/50 transition-colors backdrop-blur-xl"
                >
                  Explore Launches
                </motion.button>
              </motion.div>

              {/* Stats with animated counters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                  >
                    <motion.div
                      className={`text-3xl font-bold ${stat.color}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-zinc-500 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Content - App Grid */}
            <div className="relative">
              {/* Notification Center Button */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => triggerHaptic('tap')}
                className="absolute -top-12 right-0 p-3 bg-white/5 backdrop-blur-xl rounded-2xl hover:bg-white/10 transition-colors"
              >
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </motion.button>

              {/* App Grid with SpringBoard layout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="grid grid-cols-3 gap-6 p-8 bg-black/20 backdrop-blur-xl rounded-[40px] border border-white/5"
              >
                {apps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <EnhancedAppIcon
                      app={app}
                      onOpen={handleAppOpen}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Page dots indicator */}
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Dock */}
        <Dock apps={dockApps} onAppOpen={(app) => triggerHaptic('tap')} />

        {/* App Opening Animation Overlay */}
        <AnimatePresence>
          {openingApp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className={`p-8 rounded-3xl bg-gradient-to-br ${openingApp.gradient}`}
              >
                <openingApp.icon className="w-24 h-24 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-1/3 text-3xl font-bold text-white"
              >
                Opening {openingApp.label}...
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}