import { Flame, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BuybackEntry {
  timestamp: number
  amount: number // SOL burned
  txSignature: string
}

interface BuybackLogProps {
  entries: BuybackEntry[]
  className?: string
}

export function BuybackLog({ entries, className }: BuybackLogProps) {
  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const formatAmount = (amount: number) => {
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K SOL`
    if (amount >= 1) return `${amount.toFixed(2)} SOL`
    return `${(amount * 1000).toFixed(0)}m SOL`
  }

  const shortenTx = (signature: string) => {
    return `${signature.slice(0, 4)}...${signature.slice(-4)}`
  }

  const getTxUrl = (signature: string) => {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
    return `https://explorer.solana.com/tx/${signature}?cluster=${network}`
  }

  if (entries.length === 0) {
    return (
      <div className={cn('glass-premium p-6 rounded-2xl text-center', className)}>
        <Flame className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
        <div className="text-sm text-zinc-500">No buybacks yet</div>
      </div>
    )
  }

  const totalBurned = entries.reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <div className={cn('glass-premium p-6 rounded-2xl border border-zinc-800', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold">Buyback & Burn</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-400">Total Burned</div>
          <div className="text-lg font-bold text-red-400">{formatAmount(totalBurned)}</div>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-2">
        {entries.slice(0, 5).map((entry, index) => (
          <div
            key={entry.txSignature}
            className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                'bg-red-400/10 text-red-400'
              )}>
                #{index + 1}
              </div>
              <div>
                <div className="font-bold text-red-400">{formatAmount(entry.amount)}</div>
                <div className="text-xs text-zinc-500">{formatTime(entry.timestamp)}</div>
              </div>
            </div>

            <a
              href={getTxUrl(entry.txSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-medium"
            >
              <span className="font-mono">{shortenTx(entry.txSignature)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>

      {entries.length > 5 && (
        <button className="w-full mt-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
          View all {entries.length} burns →
        </button>
      )}
    </div>
  )
}
