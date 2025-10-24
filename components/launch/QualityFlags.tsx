import { Shield, FileText, Users, Code, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QualityFlagsProps {
  kyc?: boolean
  docs?: boolean
  team?: boolean
  code?: boolean
  className?: string
  variant?: 'inline' | 'stacked'
}

export function QualityFlags({
  kyc = false,
  docs = false,
  team = false,
  code = false,
  className,
  variant = 'inline'
}: QualityFlagsProps) {
  const flags = [
    { id: 'kyc', label: 'KYC', icon: Shield, verified: kyc, color: 'text-[#00FF88]' },
    { id: 'docs', label: 'Docs', icon: FileText, verified: docs, color: 'text-[#00FFFF]' },
    { id: 'team', label: 'Team', icon: Users, verified: team, color: 'text-yellow-400' },
    { id: 'code', label: 'Code', icon: Code, verified: code, color: 'text-[#D1FD0A]' }
  ]

  const verifiedCount = [kyc, docs, team, code].filter(Boolean).length

  if (variant === 'stacked') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
          <span className="text-sm font-medium">
            {verifiedCount}/4 Verified
          </span>
        </div>
        {flags.map((flag) => {
          const Icon = flag.icon
          return (
            <div
              key={flag.id}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                flag.verified
                  ? 'bg-zinc-900/50 border border-zinc-800'
                  : 'bg-zinc-900/20 border border-zinc-900 opacity-50'
              )}
            >
              <Icon className={cn('w-4 h-4', flag.verified ? flag.color : 'text-zinc-600')} />
              <span className={cn(
                'text-sm font-medium',
                flag.verified ? 'text-white' : 'text-zinc-600'
              )}>
                {flag.label}
              </span>
              {flag.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88] ml-auto" />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {flags.map((flag) => {
        const Icon = flag.icon
        return (
          <div
            key={flag.id}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
              flag.verified
                ? 'bg-zinc-900/50 border-zinc-700 text-white'
                : 'bg-zinc-900/20 border-zinc-900 text-zinc-600 line-through'
            )}
            title={flag.verified ? `${flag.label} verified` : `${flag.label} not verified`}
          >
            <Icon className={cn('w-3 h-3', flag.verified ? flag.color : 'text-zinc-600')} />
            {flag.label}
            {flag.verified && <CheckCircle2 className="w-3 h-3 text-[#00FF88]" />}
          </div>
        )
      })}
    </div>
  )
}
