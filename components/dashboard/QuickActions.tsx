'use client'

import { Video, Swords, DollarSign, Settings, BarChart3, Users } from 'lucide-react'

interface QuickActionsProps {
  onCreateCampaign?: () => void
  onCreateRaid?: () => void
  onCreateBounty?: () => void
  onViewAnalytics?: () => void
  onOpenSettings?: () => void
  onInviteTeam?: () => void
}

export function QuickActions({
  onCreateCampaign,
  onCreateRaid,
  onCreateBounty,
  onViewAnalytics,
  onOpenSettings,
  onInviteTeam
}: QuickActionsProps) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Create Clipping Campaign */}
        <button
          onClick={onCreateCampaign}
          className="p-4 rounded-xl bg-gradient-to-r from-lime-500 via-lime-500 to-lime-600 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-lime-400/80"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Clipping</div>
              <div className="text-xs text-white/80">Create campaign</div>
            </div>
          </div>
        </button>

        {/* Create Raid */}
        <button
          onClick={onCreateRaid}
          className="p-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Raid</div>
              <div className="text-xs text-white/80">Launch raid</div>
            </div>
          </div>
        </button>

        {/* Create Bounty */}
        <button
          onClick={onCreateBounty}
          className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-emerald-400/80"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Bounty</div>
              <div className="text-xs text-white/80">Post bounty</div>
            </div>
          </div>
        </button>

        {/* Analytics */}
        <button
          onClick={onViewAnalytics}
          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-lime-400/80"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500/20 via-lime-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-lime-400" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Analytics</div>
              <div className="text-xs text-white/60">View metrics</div>
            </div>
          </div>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-amber-400/80"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500/20 via-lime-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 flex-shrink-0">
              <Settings className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Settings</div>
              <div className="text-xs text-white/60">Configure</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}