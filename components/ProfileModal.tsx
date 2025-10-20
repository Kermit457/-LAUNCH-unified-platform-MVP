"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Calendar, Twitter, Globe, Send, Rocket, Image as ImageIcon, Hash, Type } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/cn'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user: privyUser } = usePrivy()
  const { user, username, avatar } = useUser()

  // Profile fields
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')

  // Token/Curve launch fields
  const [tokenName, setTokenName] = useState('')
  const [tokenTicker, setTokenTicker] = useState('')
  const [tokenLogo, setTokenLogo] = useState<File | null>(null)
  const [tokenLogoPreview, setTokenLogoPreview] = useState<string | null>(null)
  const [twitterLink, setTwitterLink] = useState('')
  const [websiteLink, setWebsiteLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')

  // Load Twitter data from Privy
  useEffect(() => {
    if (username) {
      setDisplayName(username)
    }
    if (user?.twitter?.username) {
      setTwitterLink(`https://twitter.com/${user.twitter.username}`)
    }
  }, [username, user])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTokenLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setTokenLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    // TODO: Save to backend
    console.log('Saving profile:', {
      displayName,
      bio,
      tokenName,
      tokenTicker,
      tokenLogo,
      twitterLink,
      websiteLink,
      telegramLink
    })
    onClose()
  }

  if (!isOpen) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl my-8 bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-900/20 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-900 to-violet-900/20 border-b border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Profile Picture from Twitter */}
                <div className="relative">
                  <img
                    src={avatar || '/default-avatar.png'}
                    alt={displayName}
                    className="w-16 h-16 rounded-full border-2 border-[#00FFFF]"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00FFFF] rounded-full flex items-center justify-center">
                    <Twitter className="w-3 h-3 text-black" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">My Profile</h2>
                  <p className="text-sm text-zinc-400">@{username}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Basic Profile Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#00FFFF]" />
                Account Information
              </h3>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00FFFF] transition-colors"
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00FFFF] transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-700/50 text-zinc-500">
                    <Mail className="w-4 h-4" />
                    <span>{privyUser?.email?.address || 'No email connected'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Token/Curve Launch Section */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFC700] flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Curve/Token Launch Details
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Complete this to launch your personal bonding curve
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#00FFFF]" />
                    Token Name *
                  </label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    placeholder="e.g., Mirko Token"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#00FFFF]" />
                    Token Ticker *
                  </label>
                  <input
                    type="text"
                    value={tokenTicker}
                    onChange={(e) => setTokenTicker(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    placeholder="e.g., MIRKO"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00FFFF]" />
                  Token Logo *
                </label>
                <div className="flex items-center gap-4">
                  {tokenLogoPreview && (
                    <img
                      src={tokenLogoPreview}
                      alt="Token logo preview"
                      className="w-20 h-20 rounded-xl border-2 border-zinc-700 object-cover"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-3 rounded-xl bg-zinc-800/50 border-2 border-dashed border-zinc-700 hover:border-[#FFD700] text-zinc-400 hover:text-white transition-all text-center">
                      <ImageIcon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        {tokenLogo ? tokenLogo.name : 'Click to upload logo'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WebP (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={twitterLink}
                    onChange={(e) => setTwitterLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1DA1F2] transition-colors"
                    placeholder="https://twitter.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#00FFFF]" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00FFFF] transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#0088CC]" />
                    Telegram
                  </label>
                  <input
                    type="url"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#0088CC] transition-colors"
                    placeholder="https://t.me/..."
                  />
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="pt-6 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Account Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-[#00FFFF]" />
                    <span className="text-xs text-zinc-500">Member Since</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {new Date(privyUser?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-[#00FFFF]" />
                    <span className="text-xs text-zinc-500">User ID</span>
                  </div>
                  <p className="text-xs font-mono text-white truncate">
                    {privyUser?.id?.slice(0, 12)}...
                  </p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Rocket className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-xs text-zinc-500">Curve Status</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-400">Not Created</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-t from-zinc-900 to-transparent border-t border-zinc-800 p-6">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00FFFF] to-[#0088FF] hover:from-[#00FFFF]/90 hover:to-[#0088FF]/90 text-black font-bold transition-all flex items-center gap-2"
              >
                Save Profile
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  // Render modal using Portal to escape nav container
  if (typeof window === 'undefined') return null
  return createPortal(modalContent, document.body)
}
