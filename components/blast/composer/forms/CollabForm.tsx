/**
 * Collaboration Room Creation Form
 */

'use client'

import { useState } from 'react'
import { Zap, Users, Clock, Lock, Info, Plus, X } from 'lucide-react'

interface CollabFormProps {
  onSubmit: (data: any) => void
  isPending: boolean
}

export function CollabForm({ onSubmit, isPending }: CollabFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState<'24h' | '48h' | '72h'>('72h')
  const [maxSlots, setMaxSlots] = useState(5)
  const [minKeys, setMinKeys] = useState(5)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Collab-specific metadata
  const [collaborationType, setCollaborationType] = useState('')
  const [commitment, setCommitment] = useState('')
  const [equity, setEquity] = useState(false)
  const [skillsNeeded, setSkillsNeeded] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [durationCollab, setDurationCollab] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && skillsNeeded.length < 10) {
      setSkillsNeeded([...skillsNeeded, skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (index: number) => {
    setSkillsNeeded(skillsNeeded.filter((_, i) => i !== index))
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
        collaborationType: collaborationType || undefined,
        commitment: commitment || undefined,
        equity,
        skillsNeeded: skillsNeeded.length > 0 ? skillsNeeded : undefined,
        duration: durationCollab || undefined,
      },
    })
  }

  const isValid = title.trim().length >= 10 && description.trim().length >= 20

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Collaboration Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Looking for technical co-founder for DeFi protocol"
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
          placeholder="Describe what you're building, what you're looking for, and why this is an exciting opportunity..."
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

      {/* Collab Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Collaboration Type
          </label>
          <input
            type="text"
            value={collaborationType}
            onChange={(e) => setCollaborationType(e.target.value)}
            placeholder="e.g., Co-founder, Advisor, Partner"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Time Commitment
          </label>
          <input
            type="text"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            placeholder="e.g., Full-time, 10hrs/week"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Project Duration
          </label>
          <input
            type="text"
            value={durationCollab}
            onChange={(e) => setDurationCollab(e.target.value)}
            placeholder="e.g., 3-6 months, Ongoing"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
            Equity Available
            <input
              type="checkbox"
              checked={equity}
              onChange={(e) => setEquity(e.target.checked)}
              className="w-5 h-5 rounded bg-zinc-900/50 border-zinc-800 text-[#00FF88] focus:ring-[#00FF88]"
            />
          </label>
          <div className="text-sm text-zinc-500">
            {equity ? 'Equity share offered' : 'No equity offered'}
          </div>
        </div>
      </div>

      {/* Skills Needed */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Skills Needed (max 10)
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            placeholder="e.g., Solidity, Product Design, Marketing..."
            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
            disabled={skillsNeeded.length >= 10}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={!skillInput.trim() || skillsNeeded.length >= 10}
            className="btdemo-btn-glass px-6 py-3 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {skillsNeeded.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillsNeeded.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-300 rounded-full text-sm flex items-center gap-2 border border-cyan-500/20"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
                  className="text-cyan-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
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
            max={20}
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
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-zinc-400">
          Your collaboration room will be open for {duration}. Interested collaborators can apply with their skills and experience.
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
            Creating Collab...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Create Collab Room
          </span>
        )}
      </button>
    </form>
  )
}
