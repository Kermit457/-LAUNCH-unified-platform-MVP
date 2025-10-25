'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconClose, IconUser, IconMotion, IconCopy, IconVerified } from '@/lib/icons'
import { usePrivy } from '@privy-io/react-auth'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { useMotionScore } from '@/hooks/blast/useMotionScore'

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const TIMEZONES = [
  'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6',
  'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1',
  'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8',
  'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12',
]

const SKILLS = [
  'Solana', 'Rust', 'TypeScript', 'React', 'Next.js', 'Web3',
  'DeFi', 'NFTs', 'Smart Contracts', 'Frontend', 'Backend',
  'UI/UX', 'Marketing', 'Community', 'Writing', 'Design',
]

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { user } = usePrivy()
  const { keyBalance } = useKeyGate()
  const { data: motionScore } = useMotionScore(user?.id)

  const [bio, setBio] = useState('')
  const [timezone, setTimezone] = useState('UTC+0')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [twitter, setTwitter] = useState('')
  const [github, setGithub] = useState('')
  const [telegram, setTelegram] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [copied, setCopied] = useState(false)

  const referralCode = user?.id ? `BLAST-${user.id.slice(0, 8).toUpperCase()}` : 'BLAST-XXXXXX'
  const referralLink = `https://blast.app/invite/${referralCode}`

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill))
    } else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    setIsPending(true)
    // TODO: Save profile mutation
    setTimeout(() => {
      setIsPending(false)
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

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
                  <IconUser className="icon-primary" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Profile</h2>
                    <p className="text-sm text-zinc-400">Edit your BLAST profile</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <IconClose size={24} className="text-zinc-400" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-premium p-4 rounded-2xl border-2 border-primary/50">
                  <div className="text-xs text-zinc-400 mb-1">Keys</div>
                  <div className="font-led-dot text-3xl text-primary">{keyBalance}</div>
                </div>
                <div className="glass-premium p-4 rounded-2xl border-2 border-primary/50">
                  <div className="text-xs text-zinc-400 mb-1">Motion Score</div>
                  <div className="font-led-dot text-3xl text-primary">{motionScore?.currentScore || 0}</div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full h-24 p-4 glass-interactive rounded-xl border-2 border-primary/50 focus:border-primary bg-transparent text-white placeholder:text-zinc-600 outline-none resize-none"
                  maxLength={200}
                />
                <div className="text-xs text-zinc-400 mt-1 px-2">
                  {bio.length}/200 characters
                </div>
              </div>

              {/* Timezone */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-4 glass-interactive rounded-xl border-2 border-primary/50 focus:border-primary bg-transparent text-white outline-none"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz} className="bg-zinc-900">
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">
                  Skills (max 5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill)
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        disabled={!isSelected && selectedSkills.length >= 5}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-primary text-black'
                            : 'glass-interactive text-zinc-400 hover:text-white hover:bg-white/10'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
                <div className="text-xs text-zinc-400 mt-2 px-2">
                  {selectedSkills.length}/5 skills selected
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-3">
                  Social Links
                </label>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 px-2">Twitter</div>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@username"
                      className="w-full p-4 glass-interactive rounded-xl border-2 border-primary/50 focus:border-primary bg-transparent text-white placeholder:text-zinc-600 outline-none"
                    />
                  </div>

                  <div>
                    <div className="text-xs text-zinc-500 mb-1 px-2">GitHub</div>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="username"
                      className="w-full p-4 glass-interactive rounded-xl border-2 border-primary/50 focus:border-primary bg-transparent text-white placeholder:text-zinc-600 outline-none"
                    />
                  </div>

                  <div>
                    <div className="text-xs text-zinc-500 mb-1 px-2">Telegram</div>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full p-4 glass-interactive rounded-xl border-2 border-primary/50 focus:border-primary bg-transparent text-white placeholder:text-zinc-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">
                  Your Referral Code
                </label>
                <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-led-dot text-2xl text-primary">{referralCode}</div>
                    <button
                      onClick={handleCopyReferral}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <IconVerified size={20} className="text-primary" />
                      ) : (
                        <IconCopy size={20} className="text-zinc-400" />
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-zinc-400 break-all">
                    {referralLink}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 glass-interactive rounded-xl font-bold text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex-1 px-6 py-4 bg-[#D1FD0A] hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 glass-interactive rounded-2xl">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-white">Public visibility:</strong> Your bio, skills, and timezone
                  are visible to other users. Social links are optional and help with credibility.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
