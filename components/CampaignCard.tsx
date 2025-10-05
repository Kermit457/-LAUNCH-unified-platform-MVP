"use client"

import { ActionCard, type ActionCardProps } from './ActionCard'

type CampaignCardProps = Omit<ActionCardProps, 'kind' | 'typeLabel'> & {
  ratePerThousand?: number
}

export function CampaignCard({ ratePerThousand, rateLabel, subtitle, ...props }: CampaignCardProps) {
  const computedRateLabel = rateLabel ?? (ratePerThousand ? `$${ratePerThousand} / 1000` : undefined)
  const computedSubtitle = subtitle ?? (ratePerThousand ? `Earn $${ratePerThousand} per 1,000 views` : undefined)

  return (
    <ActionCard
      kind="campaign"
      typeLabel="Clipping"
      rateLabel={computedRateLabel}
      subtitle={computedSubtitle}
      {...props}
    />
  )
}