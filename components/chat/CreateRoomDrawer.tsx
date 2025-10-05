'use client'

import { useState } from 'react'
import { X, Hash, Users } from 'lucide-react'
import { Connection } from '@/lib/types'

interface CreateRoomDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedConnections: Connection[]
  onCreateRoom: (data: { name: string; projectId?: string; campaignId?: string }) => void
}

export function CreateRoomDrawer({
  isOpen,
  onClose,
  selectedConnections,
  onCreateRoom
}: CreateRoomDrawerProps) {
  const [roomName, setRoomName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [campaignId, setCampaignId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateRoom({
      name: roomName,
      projectId: projectId || undefined,
      campaignId: campaignId || undefined
    })
    setRoomName('')
    setProjectId('')
    setCampaignId('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B0F1A] border border-white/10 rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create Room
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected participants */}
        <div className="mb-6">
          <label className="text-sm text-white/60 mb-2 block">
            Participants ({selectedConnections.length})
          </label>
          <div className="flex items-center gap-2 flex-wrap p-3 bg-white/5 rounded-lg border border-white/10">
            {selectedConnections.map(conn => (
              <div
                key={conn.userId}
                className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs flex items-center gap-1"
              >
                {conn.handle}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Room name */}
          <div className="mb-4">
            <label className="text-sm text-white/60 mb-2 block">
              Room Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                required
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g., Solana Builders"
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
              />
            </div>
          </div>

          {/* Optional: Link to project */}
          <div className="mb-4">
            <label className="text-sm text-white/60 mb-2 block">
              Link to Project (optional)
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
            >
              <option value="">None</option>
              <option value="proj_1">NFT Launch</option>
              <option value="proj_2">DeFi Protocol</option>
            </select>
          </div>

          {/* Optional: Link to campaign */}
          <div className="mb-6">
            <label className="text-sm text-white/60 mb-2 block">
              Link to Campaign (optional)
            </label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
            >
              <option value="">None</option>
              <option value="camp_1">Solana Summer Clips</option>
              <option value="camp_2">Holiday Raid</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
