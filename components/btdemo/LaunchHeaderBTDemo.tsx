'use client'

import { Search, Wallet, Bell, Rocket, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconSearch, IconWallet, IconNotification, IconRocket, IconMenu } from '@/lib/icons'

interface LaunchHeaderProps {
  onSearch?: (query: string) => void
  onLaunchClick?: () => void
  notificationCount?: number
}

export function LaunchHeaderBTDemo({
  onSearch,
  onLaunchClick,
  notificationCount = 0
}: LaunchHeaderProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchFocused, setSearchFocused] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleLaunchClick = (): void => {
    onLaunchClick?.()
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden icon-interactive-primary transition-transform duration-200 hover:scale-110"
            aria-label="Toggle menu"
          >
            <IconMenu size={24} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <IconRocket className="icon-primary" size={28} />
            </motion.div>
            <span className="hidden sm:block text-xl font-bold tracking-tight">
              Launch
            </span>
          </div>

          {/* Search Bar */}
          <motion.div
            className="flex-1 max-w-md mx-4 relative"
            animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={searchFocused ? {
                filter: 'drop-shadow(0 0 8px rgba(209, 253, 10, 0.4))',
                scale: 1.1
              } : {
                filter: 'drop-shadow(0 0 0px rgba(209, 253, 10, 0))',
                scale: 1
              }}
              transition={{ duration: 0.3 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <IconSearch
                className={searchFocused ? 'icon-primary' : 'icon-muted'}
                size={20}
              />
            </motion.div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl
                focus:border-[#D1FD0A]/40 focus:bg-white/10
                transition-all duration-200 outline-none
                text-sm placeholder:text-zinc-500"
            />
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative icon-interactive transition-colors"
              aria-label="Notifications"
            >
              <IconNotification size={24} />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white font-led-16
                    text-[10px] w-5 h-5 rounded-full flex items-center justify-center
                    border-2 border-black"
                >
                  {notificationCount}
                </motion.span>
              )}
            </motion.button>

            {/* Wallet Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px rgba(209, 253, 10, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2
                bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D1FD0A]/40
                rounded-xl transition-all duration-200"
            >
              <IconWallet className="icon-interactive" size={20} />
              <span className="text-sm font-medium">Connect</span>
            </motion.button>

            {/* Launch Token Button */}
            <motion.button
              onClick={handleLaunchClick}
              whileHover={{
                y: -2,
                boxShadow: '0 8px 24px rgba(209, 253, 10, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2
                bg-[#D1FD0A] hover:bg-[#E0FF1A] text-black font-semibold
                rounded-xl transition-all duration-200 shadow-lg"
            >
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <IconRocket size={20} />
              </motion.div>
              <span className="hidden md:block text-sm">Launch</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <button
                className="w-full flex items-center gap-3 px-4 py-3
                  bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <IconWallet className="icon-primary" size={20} />
                <span className="text-sm">Connect Wallet</span>
              </button>

              <button
                onClick={handleLaunchClick}
                className="w-full flex items-center gap-3 px-4 py-3
                  bg-[#D1FD0A] hover:bg-[#E0FF1A] text-black font-semibold
                  rounded-xl transition-colors"
              >
                <IconRocket size={20} />
                <span className="text-sm">Launch Token</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
