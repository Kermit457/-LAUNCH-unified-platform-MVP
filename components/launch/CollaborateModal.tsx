'use client'

import { useState } from 'react'
import { X, Users, Send } from 'lucide-react'

interface CollaborateModalProps {
  open: boolean
  onClose: () => void
  launchId: string
  launchTitle: string
  creatorName?: string
  creatorAvatar?: string
  onSendInvite: (message: string) => Promise<void>
}

export function CollaborateModal({
  open,
  onClose,
  launchTitle,
  creatorName,
  creatorAvatar,
  onSendInvite
}: CollaborateModalProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSending(true)
      setError('')

      await onSendInvite(message)

      setSuccess(true)
      setMessage('')

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to send collaboration request')
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[rgba(255,255,255,0.06)] backdrop-blur-[8px] rounded-2xl ring-1 ring-[rgba(255,255,255,0.10)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Invite to Collaborate</h2>
              <p className="text-xs text-white/50">{launchTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Creator Info */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/50 mb-3">Requesting to collaborate with:</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {creatorAvatar ? (
                  <img src={creatorAvatar} alt={creatorName || 'Creator'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {(creatorName || 'C').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {creatorName || 'Project Creator'}
                </p>
                <p className="text-xs text-white/50">Project Owner</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey! I'd love for you to join our project..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-xl resize-none"
              disabled={sending}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 text-sm flex items-center gap-2">
              <Send className="w-4 h-4" />
              Invite sent successfully!
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <p className="text-xs text-white/50">
            💡 Your collaboration request will be sent to the project owner. If accepted, you'll appear in the team section.
          </p>
        </div>
      </div>
    </div>
  )
}