"use client"

import { ActionCard, ActionCardKind, Platform as ActionPlatform } from '@/components/ActionCard'
import { CreateQuestInput, Platform, MissionType } from '@/types/quest'

interface PreviewCardProps {
  formData: Partial<CreateQuestInput>
}

// Map quest platforms to ActionCard platforms
const platformMap: Record<Platform, ActionPlatform> = {
  x: 'x',
  youtube: 'youtube',
  twitch: 'twitch',
  tiktok: 'tiktok',
}

// Mission type display labels
const missionLabels: Record<MissionType, string> = {
  mission: 'Mission',
  takeover: 'Takeover',
  support: 'Support',
}

export function PreviewCard({ formData }: PreviewCardProps) {
  const {
    type = 'raid',
    title = 'Untitled Quest',
    mission,
    funding,
    rules,
  } = formData

  // Map type to ActionCard kind
  const kind: ActionCardKind = type === 'raid' ? 'raid' : 'bounty'

  // Generate rate label
  let rateLabel: string | undefined
  if (funding?.kind === 'paid' && funding.model) {
    const { kind: modelKind, amount, cap } = funding.model
    const mint = funding.mint || 'USDC'

    if (modelKind === 'pool') {
      // Raid: show pool amount
      rateLabel = `${amount.toLocaleString('en-US')} ${mint} pool`
    } else {
      // Bounty: show per-task rate
      rateLabel = `${amount.toLocaleString('en-US')} ${mint}/task`
    }
  } else if (funding?.kind === 'free') {
    rateLabel = 'Free'
  }

  // Type label: mission type for raids, "Bounty" for bounties
  const typeLabel = type === 'raid' && mission ? missionLabels[mission] : 'Bounty'

  // Map platforms
  const mappedPlatforms: ActionPlatform[] = (rules?.platforms || []).map(p => platformMap[p])

  // Budget preview (showing 0 of total for preview)
  const budgetTotal = funding?.kind === 'paid' && funding.model
    ? (funding.model.kind === 'pool' ? funding.model.amount : (funding.model.cap || funding.model.amount))
    : 0

  // Generate avatar text from title
  const avatarText = title
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || '??'

  return (
    <div className="relative">
      <ActionCard
        kind={kind}
        title={title}
        avatarText={avatarText}
        rateLabel={rateLabel}
        budgetPaid={0}
        budgetTotal={budgetTotal}
        progressPct={0}
        typeLabel={typeLabel}
        platforms={mappedPlatforms}
        views={0}
        isFav={false}
        onShare={() => {}}
        onJoin={() => {}}
        onView={() => {}}
        onToggleFav={undefined}
      />

      {/* Disabled overlay with tooltip */}
      <div className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium">
          Preview only
        </div>
      </div>
    </div>
  )
}
