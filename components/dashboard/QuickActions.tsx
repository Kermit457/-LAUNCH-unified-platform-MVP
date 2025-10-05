'use client'

import { Megaphone, Wrench, Users } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Create Campaign - Primary */}
        <button className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Create Campaign</div>
              <div className="text-xs text-white/80">Launch a new bounty or raid</div>
            </div>
          </div>
        </button>

        {/* Configure Widgets */}
        <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 flex-shrink-0">
              <Wrench className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Configure Widgets</div>
              <div className="text-xs text-white/60">Set up your launch widgets</div>
            </div>
          </div>
        </button>

        {/* Invite Team */}
        <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 flex-shrink-0">
              <Users className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Invite Team</div>
              <div className="text-xs text-white/60">Add collaborators to your campaigns</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
