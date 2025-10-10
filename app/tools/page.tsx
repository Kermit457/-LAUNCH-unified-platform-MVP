"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wrench, Gift, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TOOL_CARDS, GROUPS, type ToolCard } from '@/lib/toolsConfig'
import { cn } from '@/lib/cn'
import { GlassCard } from '@/components/design-system'
import { CreateQuestDrawer } from '@/components/quests/CreateQuestDrawer'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { CampaignType } from '@/types/quest'

// Category colors mapping
const getCategoryColor = (category: string): string => {
  switch(category) {
    case 'OBS Widgets':
      return 'from-blue-500 to-cyan-500'
    case 'Growth & Campaigns':
      return 'from-purple-500 to-fuchsia-500'
    case 'Launch':
      return 'from-orange-500 to-red-500'
    case 'Creator Ops':
      return 'from-green-500 to-emerald-500'
    case 'Integrations':
      return 'from-indigo-500 to-purple-500'
    default:
      return 'from-zinc-500 to-zinc-600'
  }
}

export default function ToolsPage() {
  const router = useRouter()
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false)
  const [initialQuestType, setInitialQuestType] = useState<CampaignType>('raid')
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)

  const groupedCards = GROUPS.map(group => ({
    name: group,
    cards: TOOL_CARDS.filter(card => card.group === group)
  }))

  const handleToolAction = (cardId: string) => {
    switch (cardId) {
      case 'clipping':
        setIsCreateCampaignOpen(true)
        break
      case 'raid-campaign':
        setInitialQuestType('raid')
        setIsCreateQuestOpen(true)
        break
      case 'bounty':
        setInitialQuestType('bounty')
        setIsCreateQuestOpen(true)
        break
      default:
        // For other tools, do nothing (Link will handle navigation)
        break
    }
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/15 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
            >
              <Wrench className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Creator Tools
            </h1>
          </div>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Widgets, campaigns, launches, and monetization tools for streamers & creators
          </p>
        </motion.div>

        {/* Tool Categories */}
        <div className="space-y-16">
          {groupedCards.map(({ name, cards }, catIndex) => {
            const categoryColor = getCategoryColor(name)

            return (
              <motion.section
                key={name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${categoryColor}`} />
                  <h2 className={`text-3xl font-bold bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent`}>
                    {name}
                  </h2>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <Sparkles className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-500">{cards.length} tools</span>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card, toolIndex) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: toolIndex * 0.1 }}
                    >
                      <ToolCardComponent
                        card={card}
                        onAction={handleToolAction}
                        categoryColor={categoryColor}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )
          })}
        </div>

        {/* Rewards & Earnings Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 blur-3xl" />

            <GlassCard className="relative p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    Rewards & Payouts
                  </h2>
                  <p className="text-zinc-400">
                    Manage your earnings, claim rewards, and track payouts
                  </p>
                </div>
                <Link href="/earnings">
                  <Button variant="secondary">View Earnings</Button>
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Pending', value: '$234.50', color: 'from-yellow-500 to-orange-500' },
                  { label: 'Claimable', value: '$567.80', color: 'from-green-500 to-emerald-500' },
                  { label: 'Total Earned', value: '$12,430', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Points', value: '1,840', color: 'from-purple-500 to-fuchsia-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="relative group cursor-pointer"
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur transition-opacity`} />
                    <div className="relative p-4 rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800">
                      <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className={`text-2xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.section>
      </div>

      {/* Create Quest Drawer */}
      <CreateQuestDrawer
        isOpen={isCreateQuestOpen}
        initialType={initialQuestType}
        onClose={() => setIsCreateQuestOpen(false)}
        onSubmit={(data) => {
          // Store quest with key: `${data.type}:${data.id}` to prevent collisions
          // TODO: Replace with Supabase insert
          console.log(`${data.type}:${data.id}`, 'Quest created:', data)

          // Navigate to correct route based on type
          const route = data.type === 'raid' ? `/raids/${data.id}` : `/bounties/${data.id}`
          router.push(route)

          setIsCreateQuestOpen(false)
        }}
      />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onSubmit={(data) => {
          console.log('Campaign created:', data)
          setIsCreateCampaignOpen(false)
        }}
      />
    </div>
  )
}

// Enhanced Tool Card Component
function ToolCardComponent({
  card,
  onAction,
  categoryColor
}: {
  card: ToolCard
  onAction: (id: string) => void
  categoryColor: string
}) {
  const Icon = card.icon
  const isCreateOrStart = card.actionLabel === 'Create' || card.actionLabel === 'Start'
  const isModalCard = ['clipping', 'raid-campaign', 'bounty'].includes(card.id)
  const isDisabled = card.enabled === false

  // Use div wrapper for modal cards or disabled cards, Link for others
  const CardWrapper = (isDisabled || isModalCard) ? 'div' : Link
  const cardWrapperProps = (!isDisabled && !isModalCard) ? { href: card.href } : {}

  return (
    <CardWrapper {...cardWrapperProps as any} className={isDisabled ? 'cursor-not-allowed' : ''}>
      <motion.div
        whileHover={!isDisabled ? { scale: 1.02, y: -4 } : {}}
        className="relative group h-full"
      >
        {/* Glow effect */}
        {!isDisabled && (
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${categoryColor} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity`} />
        )}

        <GlassCard className={`relative p-6 h-full min-h-[220px] ${isDisabled ? 'opacity-50' : ''}`}>
          {/* Badge */}
          {card.badges && card.badges.length > 0 && (
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r ${categoryColor} text-white`}>
                {card.badges[0]}
              </span>
            </div>
          )}

          {/* Coming Soon Badge */}
          {isDisabled && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full shadow-lg">
              Coming Soon
            </div>
          )}

          {/* Icon */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg transition-transform bg-gradient-to-br",
            categoryColor,
            !isDisabled && "group-hover:scale-110 group-hover:rotate-3"
          )}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          {/* Content */}
          <h3 className={cn(
            "text-lg font-bold text-white mb-2 transition-all",
            !isDisabled && "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-zinc-400"
          )}>
            {card.title}
          </h3>
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
            {card.desc}
          </p>

          {/* Button */}
          <button
            disabled={isDisabled}
            onClick={(e) => {
              if (isModalCard && !isDisabled) {
                e.preventDefault()
                e.stopPropagation()
                onAction(card.id)
              }
            }}
            className={cn(
              "w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2",
              isCreateOrStart && !isDisabled
                ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25"
                : isDisabled
                ? "bg-zinc-900 text-zinc-600 cursor-not-allowed"
                : "bg-zinc-800 hover:bg-zinc-700 text-white"
            )}
          >
            {isDisabled ? 'Coming Soon' : card.actionLabel}
            {!isDisabled && <ChevronRight className="w-4 h-4" />}
          </button>
        </GlassCard>
      </motion.div>
    </CardWrapper>
  )
}