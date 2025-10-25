/**
 * BLAST DM Inbox - View and manage DM requests
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Inbox,
  Send,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDMRequests } from '@/hooks/blast/useDMRequests'
import { DMRequestCard } from '@/components/blast/dm/DMRequestCard'

export default function BLASTInboxPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming')

  const { data: incomingRequests = [], isLoading: incomingLoading } = useDMRequests('incoming')
  const { data: outgoingRequests = [], isLoading: outgoingLoading } = useDMRequests('outgoing')

  const pendingIncoming = incomingRequests.filter(r => r.status === 'pending').length
  const pendingOutgoing = outgoingRequests.filter(r => r.status === 'pending').length

  const isLoading = incomingLoading || outgoingLoading

  return (
    <div className="min-h-screen bg-btdemo-canvas">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/BLAST')}
              className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-2xl font-black text-white btdemo-text-glow flex items-center gap-3">
              <MessageSquare className="w-6 h-6" />
              DM Inbox
            </h1>

            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all relative ${
                activeTab === 'incoming'
                  ? 'bg-[#00FF88]/20 text-[#00FF88]'
                  : 'btdemo-btn-glass text-zinc-400 hover:text-white'
              }`}
            >
              <Inbox className="w-5 h-5 inline mr-2" />
              Incoming
              {pendingIncoming > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-[#00FF88] text-black text-xs font-bold">
                  {pendingIncoming}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'outgoing'
                  ? 'bg-[#00FF88]/20 text-[#00FF88]'
                  : 'btdemo-btn-glass text-zinc-400 hover:text-white'
              }`}
            >
              <Send className="w-5 h-5 inline mr-2" />
              Sent
              {pendingOutgoing > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-400 text-black text-xs font-bold">
                  {pendingOutgoing}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#00FF88]" />
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'incoming' ? (
              <>
                {incomingRequests.length === 0 ? (
                  <div className="btdemo-glass rounded-xl p-12 border border-zinc-800 text-center">
                    <Inbox className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-white mb-2">
                      No Incoming Requests
                    </h3>
                    <p className="text-zinc-400">
                      When people offer keys to DM you, they'll appear here
                    </p>
                  </div>
                ) : (
                  incomingRequests.map((request) => (
                    <DMRequestCard
                      key={request.$id}
                      request={request}
                      direction="incoming"
                    />
                  ))
                )}
              </>
            ) : (
              <>
                {outgoingRequests.length === 0 ? (
                  <div className="btdemo-glass rounded-xl p-12 border border-zinc-800 text-center">
                    <Send className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-white mb-2">
                      No Sent Requests
                    </h3>
                    <p className="text-zinc-400 mb-6">
                      You haven't sent any DM requests yet
                    </p>
                    <button
                      onClick={() => router.push('/BLAST')}
                      className="btdemo-btn-glow px-6 py-3"
                    >
                      Browse Rooms
                    </button>
                  </div>
                ) : (
                  outgoingRequests.map((request) => (
                    <DMRequestCard
                      key={request.$id}
                      request={request}
                      direction="outgoing"
                    />
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
