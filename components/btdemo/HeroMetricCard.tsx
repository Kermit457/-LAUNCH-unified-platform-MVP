'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface HeroMetricCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  change?: {
    value: number
    direction: 'up' | 'down'
  }
  currencyIcon?: LucideIcon
  index: number
}

/**
 * Easing function for counter animation
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Format number with commas for display
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function HeroMetricCard({
  icon: Icon,
  label,
  value,
  change,
  currencyIcon: CurrencyIcon,
  index
}: HeroMetricCardProps): JSX.Element {
  const [displayValue, setDisplayValue] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(true)

  // Determine icon hover animation based on type
  const getIconAnimation = (): object => {
    // Activity/Motion icon - pulse
    if (label.toLowerCase().includes('project') || label.toLowerCase().includes('motion')) {
      return {
        scale: [1, 1.1, 1],
        filter: [
          'drop-shadow(0 0 0px rgba(209, 253, 10, 0.4))',
          'drop-shadow(0 0 12px rgba(209, 253, 10, 0.8))',
          'drop-shadow(0 0 0px rgba(209, 253, 10, 0.4))'
        ]
      }
    }

    // Rocket icon - bounce up
    if (label.toLowerCase().includes('launch')) {
      return {
        y: [0, -4, 0],
        rotate: [0, -5, 0]
      }
    }

    // Cash/Volume icon - scale pulse
    if (label.toLowerCase().includes('volume')) {
      return {
        scale: [1, 1.15, 1]
      }
    }

    // Market Cap icon - rotate
    if (label.toLowerCase().includes('cap') || label.toLowerCase().includes('market')) {
      return {
        rotate: [0, 12, 0]
      }
    }

    // Default - scale
    return {
      scale: [1, 1.1, 1]
    }
  }

  // Counter animation effect - run only once
  useEffect(() => {
    if (typeof value === 'number') {
      setDisplayValue(value)
      setIsAnimating(false)
    }
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="glass-premium p-4 md:p-6 rounded-xl md:rounded-2xl group cursor-default
        border-2 border-zinc-800 hover:border-[#D1FD0A]
        hover:shadow-[0_0_24px_rgba(209,253,10,0.3)]
        transition-all duration-200 bg-black/60 backdrop-blur-md"
    >
      {/* LED Numeral Display */}
      <div className="font-led-dot text-3xl md:text-5xl text-[#D1FD0A] mb-3 md:mb-4 leading-none">
        {typeof value === 'number' ? formatNumber(displayValue) : value}
      </div>

      {/* Label with Icon */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <motion.div
          whileHover={getIconAnimation()}
          transition={{
            duration: 0.6,
            ease: 'easeInOut'
          }}
        >
          <Icon className="icon-muted" size={14} />
        </motion.div>

        <div className="text-xs md:text-sm text-zinc-400 font-medium">
          {label}
        </div>

        {CurrencyIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="ml-auto"
          >
            <CurrencyIcon className="icon-muted" size={16} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
