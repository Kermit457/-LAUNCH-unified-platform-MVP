"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Wrench, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TOOL_CARDS, GROUPS, type ToolCard } from '@/lib/toolsConfig'
import { cn } from '@/lib/cn'
import { CreateQuestDrawer } from '@/components/quests/CreateQuestDrawer'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { CampaignType } from '@/types/quest'

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
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Wrench className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold gradient-text">Creator Tools</h1>
        </div>
        <p className="text-white/60 text-lg">
          Widgets, campaigns, launches, and monetization tools for streamers & creators.
        </p>
      </div>

      {/* Tool Groups */}
      <div className="space-y-12">
        {groupedCards.map(({ name, cards }) => (
          <section key={name}>
            <h2 className="text-2xl font-bold text-white mb-6">{name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map(card => (
                <ToolCardComponent key={card.id} card={card} onAction={handleToolAction} />
              ))}
            </div>
          </section>
        ))}
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

      {/* Rewards & Payouts Strip */}
      <div className="mt-16 rounded-2xl bg-neutral-900/70 border border-white/10 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Gift className="w-6 h-6 text-green-400" />
              Rewards & Payouts
            </h2>
            <p className="text-white/60">
              Manage your earnings, claim rewards, and track payouts.
            </p>
          </div>
          <Link href="/earnings">
            <Button variant="outline">View Earnings</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-xs text-white/60 mb-1">Pending</div>
            <div className="text-xl font-bold text-yellow-400">$234.50</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-xs text-white/60 mb-1">Claimable</div>
            <div className="text-xl font-bold text-green-400">$567.80</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-xs text-white/60 mb-1">Total Earned</div>
            <div className="text-xl font-bold text-white">$12,430</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-xs text-white/60 mb-1">Points</div>
            <div className="text-xl font-bold text-purple-400">1,840</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolCardComponent({ card, onAction }: { card: ToolCard; onAction: (cardId: string) => void }) {
  const Icon = card.icon
  const isCreateOrStart = card.actionLabel === 'Create' || card.actionLabel === 'Start'

  // Cards that trigger modals instead of navigation
  const isModalCard = ['clipping', 'raid-campaign', 'bounty'].includes(card.id)

  // Different color themes for each group
  const getCardTheme = () => {
    switch (card.group) {
      case 'OBS Widgets':
        return {
          border: 'border-blue-500/20 hover:border-blue-400/50',
          bg: 'bg-gradient-to-br from-blue-950/40 to-neutral-900/70',
          icon: 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/50',
          accent: 'group-hover:text-blue-300'
        }
      case 'Growth & Campaigns':
        return {
          border: 'border-purple-500/20 hover:border-purple-400/50',
          bg: 'bg-gradient-to-br from-purple-950/40 to-neutral-900/70',
          icon: 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/50',
          accent: 'group-hover:text-purple-300'
        }
      case 'Launch':
        return {
          border: 'border-orange-500/20 hover:border-orange-400/50',
          bg: 'bg-gradient-to-br from-orange-950/40 to-neutral-900/70',
          icon: 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/50',
          accent: 'group-hover:text-orange-300'
        }
      case 'Creator Ops':
        return {
          border: 'border-green-500/20 hover:border-green-400/50',
          bg: 'bg-gradient-to-br from-green-950/40 to-neutral-900/70',
          icon: 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/50',
          accent: 'group-hover:text-green-300'
        }
      case 'Integrations':
        return {
          border: 'border-cyan-500/20 hover:border-cyan-400/50',
          bg: 'bg-gradient-to-br from-cyan-950/40 to-neutral-900/70',
          icon: 'bg-gradient-to-br from-cyan-500 to-teal-600 shadow-cyan-500/50',
          accent: 'group-hover:text-cyan-300'
        }
      default:
        return {
          border: 'border-white/10 hover:border-white/30',
          bg: 'bg-neutral-900/70',
          icon: 'bg-gradient-to-br from-white/15 to-white/5 shadow-black/20',
          accent: 'group-hover:text-white'
        }
    }
  }

  const theme = getCardTheme()
  const isDisabled = card.enabled === false

  // Use div wrapper for modal cards or disabled cards, Link for others
  const CardWrapper = (isDisabled || isModalCard) ? 'div' : Link
  const cardWrapperProps = (!isDisabled && !isModalCard) ? { href: card.href } : {}

  return (
    <CardWrapper {...cardWrapperProps as any} className={isDisabled ? 'cursor-not-allowed' : ''}>
      <div className={cn(
        "rounded-2xl border p-6 flex flex-col gap-4 transition-all group h-full min-h-[220px] relative overflow-hidden",
        theme.border,
        theme.bg,
        isDisabled && "blur-sm opacity-60 hover:opacity-70"
      )}>
        {/* Coming Soon Badge */}
        {isDisabled && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full shadow-lg">
            Coming Soon
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity pointer-events-none",
          !isDisabled && "group-hover:opacity-100"
        )} />

        {/* Icon Container */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg relative z-10",
          !isDisabled && "group-hover:scale-110 group-hover:rotate-3",
          isCreateOrStart ? theme.icon : theme.icon
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2 relative z-10">
          <h3 className={cn(
            "font-bold text-white text-lg leading-tight transition-colors",
            !isDisabled && theme.accent
          )}>{card.title}</h3>
          <p className="text-sm text-white/70 leading-relaxed">{card.desc}</p>
        </div>

        {/* Action Button */}
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
            "w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 relative z-10",
            isCreateOrStart
              ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105"
              : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40",
            isDisabled && "cursor-not-allowed"
          )}
        >
          {card.actionLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </CardWrapper>
  )
}
