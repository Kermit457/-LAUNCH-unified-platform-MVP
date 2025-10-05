"use client"

import { ActionCard, type ActionCardProps } from './ActionCard'

type RaidCardProps = Omit<ActionCardProps, 'kind' | 'typeLabel'> & {
  poolAmount?: number
}

export function RaidCard({ poolAmount, rateLabel, subtitle, ...props }: RaidCardProps) {
  const computedRateLabel = rateLabel ?? (poolAmount ? `Pool: $${poolAmount.toLocaleString('en-US')}` : undefined)
  const computedSubtitle = subtitle ?? "Join the raid. Complete targets for rewards."

  return (
    <ActionCard
      kind="raid"
      typeLabel="Raid"
      rateLabel={computedRateLabel}
      subtitle={computedSubtitle}
      {...props}
    />
  )
}