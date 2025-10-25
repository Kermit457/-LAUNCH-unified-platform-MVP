/**
 * Airdrop Room Creation Form
 */

'use client'

import { useState } from 'react'
import { Zap, Users, Clock, Lock, Info } from 'lucide-react'

interface AirdropFormProps {
  onSubmit: (data: any) => void
  isPending: boolean
}

export function AirdropForm({ onSubmit, isPending }: AirdropFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState<'24h' | '48h' | '72h'>('72h')
  const [maxSlots, setMaxSlots] = useState(50)
  const [minKeys, setMinKeys] = useState(1)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Airdrop-specific metadata
  const [network, setNetwork] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [totalReward, setTotalReward] = useState('')
  const [participants, setParticipants] = useState('')
  const [claimDeadline, setClaimDeadline] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      duration,
      maxSlots,
      minKeys,
      tags: tags.length > 0 ? tags : undefined,
      metadata: {
        network: network || undefined,
        tokenSymbol: tokenSymbol || undefined,
        totalReward: totalReward || undefined,
        participants: participants ? parseInt(participants) : undefined,
        claimDeadline: claimDeadline || undefined,
      },
    })
  }

  const isValid = title.trim().length >= 10 && description.trim().length >= 20

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Airdrop Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., $TOKEN Community Airdrop - 10K USDC Pool"
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          maxLength={100}
        />
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-zinc-500">Min 10 characters</span>
          <span className={title.length > 90 ? 'text-orange-400' : 'text-zinc-500'}>
            {title.length}/100
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the airdrop requirements, eligibility, and reward distribution..."
          className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none resize-none"
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-zinc-500">Min 20 characters</span>
          <span className={description.length > 450 ? 'text-orange-400' : 'text-zinc-500'}>
            {description.length}/500
          </span>
        </div>
      </div>

      {/* Airdrop Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Network
          </label>
          <input
            type="text"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            placeholder="e.g., Solana, Ethereum"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Token Symbol
          </label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            placeholder="e.g., SOL, USDC"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Total Reward
          </label>
          <input
            type="text"
            value={totalReward}
            onChange={(e) => setTotalReward(e.target.value)}
            placeholder="e.g., 10,000 USDC"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Max Participants
          </label>
          <input
            type="number"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="e.g., 1000"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-white mb-2">
            Claim Deadline
          </label>
          <input
            type="date"
            value={claimDeadline}
            onChange={(e) => setClaimDeadline(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#00FF88] focus:outline-none"
          />
        </div>
      </div>

      {/* Room Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Duration
          </label>
          <div className="flex gap-2">
            {(['24h', '48h', '72h'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`flex-1 py-3 px-3 rounded-lg text-sm font-bold transition-all ${
                  duration === d
                    ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]'
                    : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Max Slots
          </label>
          <input
            type="number"
            min={1}
            max={1000}
            value={maxSlots}
            onChange={(e) => setMaxSlots(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white text-center font-bold focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Min Keys
          </label>
          <input
            type="number"
            min={0}
            max={25}
            value={minKeys}
            onChange={(e) => setMinKeys(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white text-center font-bold focus:border-[#00FF88] focus:outline-none"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Tags (max 5)
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add tags..."
            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
            disabled={tags.length >= 5}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || tags.length >= 5}
            className="btdemo-btn-glass px-6 py-3 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm flex items-center gap-2"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="text-zinc-500 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="btdemo-glass-subtle rounded-xl p-4 flex items-start gap-3 text-sm">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="text-zinc-400">
          Your airdrop room will be open for {duration}. Eligible users can apply to claim their rewards.
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !isValid}
        className="w-full btdemo-btn-glow py-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Creating Airdrop...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Create Airdrop Room
          </span>
        )}
      </button>
    </form>
  )
}
