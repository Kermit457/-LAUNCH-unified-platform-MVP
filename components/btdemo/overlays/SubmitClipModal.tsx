'use client'

import { useState } from 'react'
import { X, Link as LinkIcon, Film, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SubmitClipModalProps {
  open: boolean
  onClose: () => void
  project?: any
  onSubmit: (data: {
    clipUrl: string
    title: string
    description?: string
    projectId: string
  }) => void
}

export function SubmitClipModal({
  open,
  onClose,
  project,
  onSubmit
}: SubmitClipModalProps) {
  const [clipUrl, setClipUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!clipUrl || !title) return

    setIsSubmitting(true)

    await onSubmit({
      clipUrl,
      title,
      description,
      projectId: project?.id || ''
    })

    // Reset form
    setClipUrl('')
    setTitle('')
    setDescription('')
    setIsSubmitting(false)
    onClose()
  }

  const handleClose = () => {
    setClipUrl('')
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[50%] -translate-y-[50%] max-w-lg mx-auto z-[101]"
          >
            <div className="relative bg-black border-2 border-[#D1FD0A]/30 rounded-2xl overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D1FD0A]/10 via-transparent to-[#D1FD0A]/5 pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D1FD0A]/20 flex items-center justify-center">
                    <Film className="w-5 h-5 text-[#D1FD0A]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Submit Clip</h2>
                    {project && (
                      <p className="text-xs text-zinc-400">for {project.title}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Content */}
              <div className="relative p-6 space-y-4">
                {/* Project Info */}
                {project && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <img
                      src={project.logoUrl}
                      alt={project.title}
                      className="w-10 h-10 rounded-lg"
                    />
                    <div>
                      <div className="font-bold text-white">{project.title}</div>
                      <div className="text-xs text-[#D1FD0A] font-mono">{project.ticker}</div>
                    </div>
                  </div>
                )}

                {/* Clip URL Input */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                    Clip URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="url"
                      value={clipUrl}
                      onChange={(e) => setClipUrl(e.target.value)}
                      placeholder="Twitter, TikTok, YouTube, Instagram..."
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#D1FD0A]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                    Clip Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your clip a catchy title"
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#D1FD0A]/50 transition-colors"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add context or highlights..."
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#D1FD0A]/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="relative p-6 border-t border-zinc-800">
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!clipUrl || !title || isSubmitting}
                    className={`
                      flex-1 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2
                      ${(!clipUrl || !title || isSubmitting)
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#D1FD0A] to-[#B8E309] text-black hover:shadow-[0_0_30px_rgba(209,253,10,0.5)] hover:scale-105'
                      }
                    `}
                  >
                    <Zap className="w-4 h-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Clip'}
                  </button>
                </div>

                <p className="text-center text-xs text-zinc-500 mt-4">
                  Earn rewards for quality clips that showcase this project
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}