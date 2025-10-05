"use client"

import { ActionCard, type ActionCardProps } from './ActionCard'

type BountyCardProps = Omit<ActionCardProps, 'kind' | 'typeLabel'> & {
  payPerTask?: number
}

export function BountyCard({ payPerTask, rateLabel, subtitle, ...props }: BountyCardProps) {
  const computedRateLabel = rateLabel ?? (payPerTask ? `$${payPerTask} / task` : undefined)
  const computedSubtitle = subtitle ?? "Complete tasks. Get paid per action."

  return (
    <ActionCard
      kind="bounty"
      typeLabel="Bounty"
      rateLabel={computedRateLabel}
      subtitle={computedSubtitle}
      {...props}
    />
  )
}