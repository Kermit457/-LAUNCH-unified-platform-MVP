/**
 * TierGate - Show locked content with key requirement
 */

'use client'

import { useState } from 'react'
import { Lock, Key } from 'lucide-react'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { getTierLabel, getTierColor } from '@/lib/constants/blast'
import { cn } from '@/lib/utils'
import { BuyKeyModal } from '@/components/blast/modals/BuyKeyModal'

interface TierGateProps {
  requiredKeys: number
  action: string
  children: React.ReactNode
  className?: string
  showBlur?: boolean
}

export function TierGate({
  requiredKeys,
  action,
  children,
  className,
  showBlur = true
}: TierGateProps) {
  const { keyBalance } = useKeyGate()
  const [showBuyModal, setShowBuyModal] = useState(false)
  const hasAccess = keyBalance >= requiredKeys

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <div className={cn('relative', className)}>
      {/* Blurred content */}
      {showBlur && (
        <div className="blur-sm pointer-events-none opacity-50">
          {children}
        </div>
      )}

      {/* Unlock overlay */}
      <div className={cn(
        'absolute inset-0 flex flex-col items-center justify-center',
        'bg-black/80 backdrop-blur-sm rounded-lg border border-zinc-800',
        !showBlur && 'relative'
      )}>
        <div className="text-center space-y-4 p-6">
          <Lock className="w-12 h-12 mx-auto text-zinc-600" />

          <div>
            <p className="text-sm font-bold text-white mb-1">
              {requiredKeys} {requiredKeys === 1 ? 'Key' : 'Keys'} Required
            </p>
            <p className="text-xs text-zinc-400">
              To {action}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Key className="w-3 h-3" />
            <span>You have {keyBalance} keys</span>
          </div>

          <button
            onClick={() => setShowBuyModal(true)}
            className="btdemo-btn-glass px-4 py-2 text-sm"
          >
            Buy {requiredKeys - keyBalance} More Keys
          </button>
        </div>
      </div>

      {/* Buy Keys Modal */}
      <BuyKeyModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        minKeys={requiredKeys}
        currentKeys={keyBalance}
      />
    </div>
  )
}

/**
 * Inline tier gate (for buttons/actions)
 */
export function InlineTierGate({
  requiredKeys,
  children,
  fallback
}: {
  requiredKeys: number
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { keyBalance } = useKeyGate()
  const hasAccess = keyBalance >= requiredKeys

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500">
      <Lock className="w-3 h-3" />
      <span>Requires {requiredKeys} keys</span>
    </div>
  )
}
