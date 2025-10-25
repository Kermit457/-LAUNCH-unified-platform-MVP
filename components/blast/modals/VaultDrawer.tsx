'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { IconClose, IconLock, IconUnlock, IconClock } from '@/lib/icons'
import { useVault } from '@/hooks/blast/useVault'
import { usePrivy } from '@privy-io/react-auth'
import { formatDistanceToNow } from 'date-fns'

interface VaultDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function VaultDrawer({ isOpen, onClose }: VaultDrawerProps) {
  const { user } = usePrivy()
  const { data: vault, isLoading } = useVault(user?.id)

  if (!isOpen) return null

  const locks = vault?.locks || []
  const activeLocks = locks.filter(l => l.status === 'locked')
  const completedLocks = locks.filter(l => l.status === 'refunded' || l.status === 'forfeited')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-black border-l-2 border-primary/50 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <IconLock className="icon-primary" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Key Vault</h2>
                    <p className="text-sm text-zinc-400">Manage locked keys</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <IconClose size={24} className="text-zinc-400" />
                </button>
              </div>

              {/* Summary Stats */}
              {!isLoading && vault && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass-premium p-4 rounded-2xl border-2 border-primary/50">
                    <div className="text-xs text-zinc-400 mb-1">Total Locked</div>
                    <div className="font-led-dot text-3xl text-primary">
                      {vault.totalLocked || 0}
                    </div>
                  </div>
                  <div className="glass-premium p-4 rounded-2xl border-2 border-primary/50">
                    <div className="text-xs text-zinc-400 mb-1">Active Rooms</div>
                    <div className="font-led-dot text-3xl text-primary">
                      {vault.activeRooms || 0}
                    </div>
                  </div>
                  <div className="glass-interactive p-4 rounded-2xl">
                    <div className="text-xs text-zinc-400 mb-1">Total Earned</div>
                    <div className="font-led-dot text-xl text-[#4ADE80]">
                      {vault.totalEarned || 0}
                    </div>
                  </div>
                  <div className="glass-interactive p-4 rounded-2xl">
                    <div className="text-xs text-zinc-400 mb-1">Lifetime Rooms</div>
                    <div className="font-led-dot text-xl text-white">
                      {vault.lifetimeRooms || 0}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Locks */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <IconLock size={16} className="text-primary" />
                  Active Locks ({activeLocks.length})
                </h3>

                {activeLocks.length === 0 ? (
                  <div className="glass-interactive p-6 rounded-2xl text-center">
                    <IconUnlock size={32} className="text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">No active locks</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeLocks.map((lock) => (
                      <div
                        key={lock.$id}
                        className="glass-premium p-4 rounded-2xl border-2 border-primary/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm text-white font-medium mb-1">
                              Room Application
                            </div>
                            <div className="text-xs text-zinc-400">
                              Room ID: {lock.roomId.slice(0, 8)}...
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-led-dot text-xl text-primary">
                              {lock.keysLocked}
                            </div>
                            <div className="text-xs text-zinc-400">keys</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <IconClock size={14} />
                          <span>
                            Locked {formatDistanceToNow(new Date(lock.lockedAt), { addSuffix: true })}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-zinc-700">
                          <div className="badge-primary inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#D1FD0A] animate-pulse" />
                            Active
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Locks */}
              {completedLocks.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <IconUnlock size={16} className="text-zinc-400" />
                    History ({completedLocks.length})
                  </h3>

                  <div className="space-y-3">
                    {completedLocks.slice(0, 5).map((lock) => (
                      <div
                        key={lock.$id}
                        className="glass-interactive p-4 rounded-2xl"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm text-zinc-300 font-medium mb-1">
                              {lock.status === 'refunded' ? 'Refunded' : 'Forfeited'}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {lock.roomId.slice(0, 8)}...
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-led-dot text-xl ${
                              lock.status === 'refunded' ? 'text-[#4ADE80]' : 'text-[#FF6B6B]'
                            }`}>
                              {lock.status === 'refunded' ? '+' : '-'}{lock.keysLocked}
                            </div>
                            <div className="text-xs text-zinc-400">keys</div>
                          </div>
                        </div>

                        {lock.releasedAt && (
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <IconClock size={14} />
                            <span>
                              {formatDistanceToNow(new Date(lock.releasedAt), { addSuffix: true })}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 pt-3 border-t border-zinc-700">
                          <div className={lock.status === 'refunded' ? 'badge-success' : 'badge-warning'}>
                            {lock.status === 'refunded' ? '✓ Refunded' : '✗ Forfeited'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {completedLocks.length > 5 && (
                    <button className="w-full mt-3 p-3 glass-interactive rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                      View all {completedLocks.length} completed locks
                    </button>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="glass-interactive p-12 rounded-2xl text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-sm text-zinc-400">Loading vault...</p>
                </div>
              )}

              {/* Info */}
              <div className="mt-6 p-4 glass-interactive rounded-2xl">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-white">How refunds work:</strong> Keys are automatically
                  refunded if you have 2+ activities in the room (messages, reactions, etc.).
                  Otherwise, deposits are forfeited to the vault.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
