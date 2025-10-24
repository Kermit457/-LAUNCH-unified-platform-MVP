'use client'

import { Rocket, DollarSign, Users, Video, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

interface CommunityStats {
  builders: number
  investors: number
  communities: number
  clippers: number
  traders: number
}

interface CommunityCompositionBTDemoProps {
  stats: CommunityStats
}

export function CommunityCompositionBTDemo({ stats }: CommunityCompositionBTDemoProps): JSX.Element {
  const roles = [
    {
      icon: Rocket,
      label: 'Builders',
      count: stats.builders,
      color: 'text-[#00FF88]',
      bgColor: 'bg-[#00FF88]/10',
      borderColor: 'border-[#00FF88]/30'
    },
    {
      icon: DollarSign,
      label: 'Investors',
      count: stats.investors,
      color: 'text-[#00FFFF]',
      bgColor: 'bg-[#00FFFF]/10',
      borderColor: 'border-[#00FFFF]/30'
    },
    {
      icon: Users,
      label: 'Communities',
      count: stats.communities,
      color: 'text-[#D1FD0A]',
      bgColor: 'bg-[#D1FD0A]/10',
      borderColor: 'border-[#D1FD0A]/30'
    },
    {
      icon: Video,
      label: 'Clippers',
      count: stats.clippers,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10',
      borderColor: 'border-pink-400/30'
    },
    {
      icon: Activity,
      label: 'Traders',
      count: stats.traders,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30'
    }
  ]

  const total = stats.builders + stats.investors + stats.communities + stats.clippers + stats.traders

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {roles.map((role, index) => {
        const Icon = role.icon
        const percentage = total > 0 ? (role.count / total) * 100 : 0

        return (
          <motion.div
            key={role.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ x: 4 }}
            className={`glass-interactive p-4 rounded-xl border-l-0 hover:border-l-4 hover:${role.borderColor} transition-all cursor-pointer group`}
          >
            {/* Icon + Label */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${role.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${role.color}`} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-500 mb-1">{role.label}</div>
                <div className={`font-led-16 ${role.color}`}>
                  {role.count.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                  className={`h-full ${role.bgColor.replace('/10', '')} rounded-full`}
                  style={{ backgroundColor: role.color.replace('text-', '') }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600">of network</span>
                <span className={`font-medium ${role.color}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
