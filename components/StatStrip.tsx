import { DollarSign, CheckCircle, Eye, Clock, Users, TrendingUp, Target, Repeat } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CreatorStatsProps {
  variant: 'creator'
  earnUsd: number
  approvedSubs: number
  views: number
  liveHours: number
}

interface ProjectStatsProps {
  variant: 'project'
  feesUsd: number
  contributors: number
  completionRate: number
  buybacksUsd: number
}

interface AgencyStatsProps {
  variant: 'agency'
  campaigns: number
  successRate: number
  spendUsd: number
  creators: number
}

type StatStripProps = (CreatorStatsProps | ProjectStatsProps | AgencyStatsProps) & {
  className?: string
}

export function StatStrip(props: StatStripProps) {
  const { className } = props

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toLocaleString('en-US')
  }

  const formatUsd = (num: number) => {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
    return `$${num.toLocaleString('en-US')}`
  }

  if (props.variant === 'creator') {
    return (
      <div className={cn('grid grid-cols-4 gap-3', className)}>
        <StatItem
          icon={<DollarSign className="w-3.5 h-3.5" />}
          label="Earnings"
          value={formatUsd(props.earnUsd)}
          color="text-green-400"
        />
        <StatItem
          icon={<CheckCircle className="w-3.5 h-3.5" />}
          label="Approved"
          value={formatNumber(props.approvedSubs)}
          color="text-cyan-400"
        />
        <StatItem
          icon={<Eye className="w-3.5 h-3.5" />}
          label="Views"
          value={formatNumber(props.views)}
          color="text-lime-400"
        />
        <StatItem
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Live Hrs"
          value={`${props.liveHours}h`}
          color="text-yellow-400"
        />
      </div>
    )
  }

  if (props.variant === 'project') {
    return (
      <div className={cn('grid grid-cols-4 gap-3', className)}>
        <StatItem
          icon={<DollarSign className="w-3.5 h-3.5" />}
          label="Fees"
          value={formatUsd(props.feesUsd)}
          color="text-green-400"
        />
        <StatItem
          icon={<Users className="w-3.5 h-3.5" />}
          label="Contributors"
          value={formatNumber(props.contributors)}
          color="text-cyan-400"
        />
        <StatItem
          icon={<Target className="w-3.5 h-3.5" />}
          label="Completion"
          value={`${(props.completionRate * 100).toFixed(0)}%`}
          color="text-lime-400"
        />
        <StatItem
          icon={<Repeat className="w-3.5 h-3.5" />}
          label="Buybacks"
          value={formatUsd(props.buybacksUsd)}
          color="text-yellow-400"
        />
      </div>
    )
  }

  // Agency variant
  return (
    <div className={cn('grid grid-cols-4 gap-3', className)}>
      <StatItem
        icon={<Target className="w-3.5 h-3.5" />}
        label="Campaigns"
        value={formatNumber(props.campaigns)}
        color="text-green-400"
      />
      <StatItem
        icon={<TrendingUp className="w-3.5 h-3.5" />}
        label="Success"
        value={`${(props.successRate * 100).toFixed(0)}%`}
        color="text-cyan-400"
      />
      <StatItem
        icon={<DollarSign className="w-3.5 h-3.5" />}
        label="Spend"
        value={formatUsd(props.spendUsd)}
        color="text-lime-400"
      />
      <StatItem
        icon={<Users className="w-3.5 h-3.5" />}
        label="Creators"
        value={formatNumber(props.creators)}
        color="text-yellow-400"
      />
    </div>
  )
}

function StatItem({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 text-white/40 mb-0.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <span className={cn('text-sm font-bold', color)}>{value}</span>
    </div>
  )
}