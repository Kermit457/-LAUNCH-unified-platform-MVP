/**
 * BLAST Composer - Create new rooms
 * Multi-step form for all 5 room types
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { useCreateRoom } from '@/hooks/blast/useCreateRoom'
import {
  IconClose,
  IconCash,
  IconGem,
  IconComputer,
  IconNetwork,
  IconRocket,
  IconLightning,
  IconNavArrowRight,
  IconNavArrowLeft,
} from '@/lib/icons'
import { DealForm } from './forms/DealForm'
import { AirdropForm } from './forms/AirdropForm'
import { JobForm } from './forms/JobForm'
import { CollabForm } from './forms/CollabForm'
import { FundingForm } from './forms/FundingForm'
import type { RoomType } from '@/lib/types/blast'

interface BlastComposerProps {
  isOpen: boolean
  onClose: () => void
}

const ROOM_TYPES: Array<{
  type: RoomType
  icon: any
  label: string
  color: string
  gradient: string
  description: string
}> = [
  {
    type: 'deal',
    icon: IconCash,
    label: 'Deal',
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Intros, partnerships, funding asks',
  },
  {
    type: 'airdrop',
    icon: IconGem,
    label: 'Airdrop',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Token airdrops, NFT drops, rewards',
  },
  {
    type: 'job',
    icon: IconComputer,
    label: 'Job',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Full-time, contract, freelance roles',
  },
  {
    type: 'collab',
    icon: IconNetwork,
    label: 'Collab',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-teal-500',
    description: 'Co-founder search, partnerships',
  },
  {
    type: 'funding',
    icon: IconRocket,
    label: 'Funding',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Seed, Series A, venture rounds',
  },
]

export function BlastComposer({ isOpen, onClose }: BlastComposerProps) {
  const [step, setStep] = useState<'type' | 'form'>('type')
  const [selectedType, setSelectedType] = useState<RoomType | null>(null)

  const { canPost } = useKeyGate()
  const { mutate: createRoom, isPending } = useCreateRoom()

  const handleTypeSelect = (type: RoomType) => {
    setSelectedType(type)
    setStep('form')
  }

  const handleBack = () => {
    setStep('type')
    setSelectedType(null)
  }

  const handleSubmit = (formData: any) => {
    if (!selectedType) return

    createRoom(
      {
        type: selectedType,
        ...formData,
      },
      {
        onSuccess: () => {
          onClose()
          setStep('type')
          setSelectedType(null)
        },
      }
    )
  }

  const handleClose = () => {
    onClose()
    // Reset after animation completes
    setTimeout(() => {
      setStep('type')
      setSelectedType(null)
    }, 300)
  }

  const selectedRoomConfig = ROOM_TYPES.find((r) => r.type === selectedType)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative btdemo-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  {step === 'type' ? (
                    <>
                      <h2 className="text-3xl font-black text-white mb-1">
                        Create Room
                      </h2>
                      <p className="text-zinc-400">Choose a room type to get started</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-1">
                        <button
                          onClick={handleBack}
                          className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
                        >
                          <IconNavArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-3xl font-black text-white">
                          {selectedRoomConfig?.label} Room
                        </h2>
                      </div>
                      <p className="text-zinc-400 ml-13">
                        {selectedRoomConfig?.description}
                      </p>
                    </>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 'type' && (
                  <motion.div
                    key="type-selection"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Access Gate */}
                    {!canPost && (
                      <div className="btdemo-glass-subtle rounded-xl p-6 border border-orange-500/20 mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap className="w-6 h-6 text-orange-400" />
                          <h3 className="text-xl font-black text-white">
                            1 Key Required
                          </h3>
                        </div>
                        <p className="text-zinc-400 mb-4">
                          You need at least 1 key to create rooms on BLAST.
                        </p>
                        <button
                          onClick={() => (window.location.href = '/')}
                          className="btdemo-btn-glow px-6 py-3 font-bold"
                        >
                          Buy Keys
                        </button>
                      </div>
                    )}

                    {/* Room Type Cards */}
                    {ROOM_TYPES.map((roomType) => {
                      const Icon = roomType.icon
                      return (
                        <motion.button
                          key={roomType.type}
                          onClick={() => canPost && handleTypeSelect(roomType.type)}
                          disabled={!canPost}
                          whileHover={canPost ? { x: 8 } : {}}
                          className={`w-full text-left btdemo-glass rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all ${
                            !canPost ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${roomType.gradient} flex items-center justify-center`}
                            >
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className={`text-2xl font-black ${roomType.color} mb-1`}>
                                {roomType.label}
                              </h3>
                              <p className="text-zinc-400">{roomType.description}</p>
                            </div>
                            {canPost && (
                              <IconNavArrowRight className="w-6 h-6 text-zinc-600" />
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}

                {step === 'form' && selectedType === 'deal' && (
                  <motion.div
                    key="deal-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <DealForm onSubmit={handleSubmit} isPending={isPending} />
                  </motion.div>
                )}

                {step === 'form' && selectedType === 'airdrop' && (
                  <motion.div
                    key="airdrop-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <AirdropForm onSubmit={handleSubmit} isPending={isPending} />
                  </motion.div>
                )}

                {step === 'form' && selectedType === 'job' && (
                  <motion.div
                    key="job-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <JobForm onSubmit={handleSubmit} isPending={isPending} />
                  </motion.div>
                )}

                {step === 'form' && selectedType === 'collab' && (
                  <motion.div
                    key="collab-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <CollabForm onSubmit={handleSubmit} isPending={isPending} />
                  </motion.div>
                )}

                {step === 'form' && selectedType === 'funding' && (
                  <motion.div
                    key="funding-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <FundingForm onSubmit={handleSubmit} isPending={isPending} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
