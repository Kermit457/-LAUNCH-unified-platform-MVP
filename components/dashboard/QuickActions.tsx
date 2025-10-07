'use client'

import { Video, Swords, DollarSign, Wrench, Users, Wallet, Settings, BarChart3 } from 'lucide-react'

export type DashboardMode = 'user' | 'project'

interface QuickActionsProps {
  mode: DashboardMode
  onCreateCampaign?: () => void
  onCreateRaid?: () => void
  onCreateBounty?: () => void
  onManageTreasury?: () => void
  onConfigureProject?: () => void
  onViewAnalytics?: () => void
}

export function QuickActions({
  mode,
  onCreateCampaign,
  onCreateRaid,
  onCreateBounty,
  onManageTreasury,
  onConfigureProject,
  onViewAnalytics
}: QuickActionsProps) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>

      {mode === 'user' ? (
        /* User Mode Actions */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Create Clipping Campaign */}
        <button
          onClick={onCreateCampaign}
          className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-600 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
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
          className="p-4 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-red-400/80"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Raid</div>
              <div className="text-xs text-white/80">Create raid</div>
            </div>
          </div>
        </button>

        {/* Create Bounty */}
        <button
          onClick={onCreateBounty}
          className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-emerald-400/80"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base mb-0.5">Bounty</div>
              <div className="text-xs text-white/80">Create bounty</div>
            </div>
          </div>
        </button>

        {/* Configure Widgets */}
        <button
          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
          data-cta="dashboard-configure-widgets"
          disabled={true}
          title="Feature coming soon"
        >
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
        <button
          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
          data-cta="dashboard-invite-team"
          disabled={true}
          title="Feature coming soon"
        >
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
      ) : (
        /* Project Mode Actions */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Manage Treasury */}
          <button
            onClick={onManageTreasury}
            className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-emerald-400/80"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base mb-0.5">Treasury</div>
                <div className="text-xs text-white/80">Manage funds</div>
              </div>
            </div>
          </button>

          {/* View Analytics */}
          <button
            onClick={onViewAnalytics}
            className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base mb-0.5">Analytics</div>
                <div className="text-xs text-white/80">View metrics</div>
              </div>
            </div>
          </button>

          {/* Project Settings */}
          <button
            onClick={onConfigureProject}
            className="p-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-90 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-amber-400/80"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base mb-0.5">Settings</div>
                <div className="text-xs text-white/80">Configure project</div>
              </div>
            </div>
          </button>

          {/* Create Raid (also for project) */}
          <button
            onClick={onCreateRaid}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 flex-shrink-0">
                <Swords className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base mb-0.5">Create Raid</div>
                <div className="text-xs text-white/60">Boost engagement</div>
              </div>
            </div>
          </button>

          {/* Invite Contributors */}
          <button
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-purple-400/80"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 flex-shrink-0">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base mb-0.5">Contributors</div>
                <div className="text-xs text-white/60">Invite team members</div>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
