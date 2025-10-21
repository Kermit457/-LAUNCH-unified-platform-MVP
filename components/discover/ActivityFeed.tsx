"use client"

import { motion } from 'framer-motion'

const mockEvents = [
  { id: 1, icon: '🔥', text: '12 buys on $DOGECEO', meta: '+24%', color: 'text-red-400' },
  { id: 2, icon: '💬', text: '@crypto_mike joined RubyCoin', meta: null, color: 'text-blue-400' },
  { id: 3, icon: '🚀', text: '$RUBY reached 32 SOL – Launch Ready!', meta: null, color: 'text-green-400' },
  { id: 4, icon: '⚡', text: '$DEGEN frozen – Going to Pump.fun!', meta: null, color: 'text-yellow-400' },
  { id: 5, icon: '🔥', text: '8 buys on Pepe Lambo', meta: '+18%', color: 'text-red-400' },
  { id: 6, icon: '💬', text: '@sarah_dev joined $RUBY', meta: null, color: 'text-blue-400' },
  { id: 7, icon: '🎯', text: '$BONK hit 85% motion score', meta: null, color: 'text-purple-400' },
  { id: 8, icon: '🚀', text: '$TRUMP reached launch threshold', meta: null, color: 'text-green-400' },
]

export function ActivityFeed() {
  // Duplicate events for seamless loop
  const duplicatedEvents = [...mockEvents, ...mockEvents]

  return (
    <div className="overflow-hidden bg-gradient-to-r from-zinc-900/30 via-zinc-900/50 to-zinc-900/30 border-y border-zinc-800/50 py-3 md:py-4 backdrop-blur-sm">
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Scrolling feed */}
        <motion.div
          className="flex gap-6 md:gap-12"
          animate={{
            x: [0, -1920], // Adjust based on content width
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {duplicatedEvents.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="flex items-center gap-2 md:gap-3 whitespace-nowrap cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-lg md:text-xl">{event.icon}</span>
              <span className="text-xs md:text-sm text-zinc-300 font-medium">{event.text}</span>
              {event.meta && (
                <span className={`text-xs md:text-sm font-bold ${event.color}`}>
                  {event.meta}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
