/**
 * Job Room Creation Form
 */

'use client'

import { useState } from 'react'
import { Zap, Users, Clock, Lock, Info } from 'lucide-react'

interface JobFormProps {
  onSubmit: (data: any) => void
  isPending: boolean
}

export function JobForm({ onSubmit, isPending }: JobFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState<'24h' | '48h' | '72h'>('72h')
  const [maxSlots, setMaxSlots] = useState(20)
  const [minKeys, setMinKeys] = useState(1)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Job-specific metadata
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState<'full-time' | 'part-time' | 'contract' | 'freelance'>('full-time')
  const [salary, setSalary] = useState('')
  const [equity, setEquity] = useState('')
  const [remote, setRemote] = useState(true)

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
        location: location || undefined,
        jobType,
        salary: salary || undefined,
        equity: equity || undefined,
        remote,
      },
    })
  }

  const isValid = title.trim().length >= 10 && description.trim().length >= 20

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Job Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Senior Solana Engineer - Remote"
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
          Job Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity unique..."
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

      {/* Job Type */}
      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Job Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['full-time', 'part-time', 'contract', 'freelance'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setJobType(type)}
              className={`py-3 px-3 rounded-lg text-sm font-bold transition-all capitalize ${
                jobType === type
                  ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]'
                  : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {type.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Job Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., San Francisco, CA"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
            Remote
            <input
              type="checkbox"
              checked={remote}
              onChange={(e) => setRemote(e.target.checked)}
              className="w-5 h-5 rounded bg-zinc-900/50 border-zinc-800 text-[#00FF88] focus:ring-[#00FF88]"
            />
          </label>
          <div className="text-sm text-zinc-500">
            {remote ? 'Remote work available' : 'On-site only'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Salary Range
          </label>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g., $120K-$180K"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Equity
          </label>
          <input
            type="text"
            value={equity}
            onChange={(e) => setEquity(e.target.value)}
            placeholder="e.g., 0.1-0.5%"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none"
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
            max={100}
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
            placeholder="Add tags (e.g., Rust, Web3, DeFi)..."
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
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-zinc-400">
          Your job posting will be open for {duration}. Candidates can apply with their profile and Motion Score.
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
            Posting Job...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Post Job Opening
          </span>
        )}
      </button>
    </form>
  )
}
