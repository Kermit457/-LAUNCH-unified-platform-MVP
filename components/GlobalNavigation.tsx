'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Search, Plus, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Global Navigation Component - Compact Bottom Nav Bar
 * Matches the design with labels always visible inside buttons
 */
export function GlobalNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (!pathname) return 'home';
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/discover') || pathname.startsWith('/search')) return 'discover';
    if (pathname.startsWith('/notifications')) return 'notifications';
    if (pathname.startsWith('/profile') || pathname.startsWith('/dashboard')) return 'profile';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [hasNotifications] = useState(true); // Show notification badge

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [pathname]);

  const navItems = [
    { id: 'home', icon: Home, label: '', path: '/', iconOnly: true },
    { id: 'discover', icon: Search, label: 'Discover', path: '/discover', iconOnly: false },
    { id: 'create', icon: Plus, label: '', path: '/launch/create', iconOnly: true },
    { id: 'notifications', icon: Bell, label: '', path: '/notifications', iconOnly: true },
    { id: 'profile', icon: User, label: '', path: '/profile', iconOnly: true },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveTab(item.id);
    router.push(item.path);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      {/* Main Navigation Container */}
      <div className="relative">
        {/* Glassmorphic Background */}
        <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-2xl rounded-full border border-zinc-800/60 shadow-2xl" />

        {/* Navigation Items */}
        <div className="relative flex items-center gap-2 px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`
                  relative flex items-center justify-center gap-2 rounded-full transition-all
                  ${item.iconOnly ? 'w-10 h-10' : 'px-5 py-2.5'}
                  ${isActive
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active Background - Purple/Violet Gradient */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Icon and Label */}
                <div className="relative z-10 flex items-center gap-2">
                  <Icon className="w-5 h-5" strokeWidth={2} />

                  {/* Label - Always visible for Discover */}
                  {!item.iconOnly && (
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Notification Badge */}
                {item.id === 'notifications' && hasNotifications && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
