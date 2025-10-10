"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Twitter, Copy, Code, Check } from 'lucide-react'

interface ShareButtonProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function ShareButton({ url, title, description, className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShareTwitter = () => {
    const text = description ? `${title} - ${description}` : title
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const handleCopyEmbed = async () => {
    const embedCode = `<iframe src="${url}" width="600" height="400" frameborder="0" allowfullscreen></iframe>`
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy embed code:', err)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-all"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 z-50 w-64 p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl"
            >
              {/* Twitter Share */}
              <button
                onClick={handleShareTwitter}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Twitter className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Share on Twitter</div>
                  <div className="text-xs text-zinc-500">Post to your timeline</div>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {copied ? 'Link copied!' : 'Copy link'}
                  </div>
                  <div className="text-xs text-zinc-500">Share anywhere</div>
                </div>
              </button>

              {/* Copy Embed Code */}
              <button
                onClick={handleCopyEmbed}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                  <Code className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Embed code</div>
                  <div className="text-xs text-zinc-500">Add to your site</div>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
