'use client'

import { Rocket, Sparkles, Trophy } from 'lucide-react'

export function PartnershipCardsBTDemo(): JSX.Element {
  return (
    <div className="glass-premium p-6 rounded-xl border border-zinc-800 space-y-6">
      {/* Incubator */}
      <div className="pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-[#00FF88]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Get Accelerated</h3>
            <p className="text-xs text-zinc-500">Join incubator</p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2 mb-3">
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1" />
            Guidance & mentorship
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1" />
            VC network access
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1" />
            Marketing support
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1" />
            Platform spotlight
          </li>
        </ul>

        <a
          href="mailto:partnerships@icmmotion.com"
          className="btn-secondary w-full text-center py-2 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Apply Now
        </a>
      </div>

      {/* Partner */}
      <div className="pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#D1FD0A]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Become a Partner</h3>
            <p className="text-xs text-zinc-500">Collaborate with us</p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2 mb-3">
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D1FD0A] mt-1" />
            Revenue sharing
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D1FD0A] mt-1" />
            Co-marketing
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D1FD0A] mt-1" />
            White-label solutions
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D1FD0A] mt-1" />
            Technical integration
          </li>
        </ul>

        <a
          href="mailto:partnerships@icmmotion.com"
          className="btn-secondary w-full text-center py-2 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Partner With Us
        </a>
      </div>

      {/* Curator */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Become a Curator</h3>
            <p className="text-xs text-zinc-500">Earn rewards</p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2 mb-3">
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1" />
            Curate projects
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1" />
            Earn platform fees
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1" />
            Build reputation
          </li>
          <li className="flex items-start gap-1.5 text-xs text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1" />
            Influence ecosystem
          </li>
        </ul>

        <a
          href="mailto:partnerships@icmmotion.com"
          className="btn-secondary w-full text-center py-2 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Apply as Curator
        </a>
      </div>
    </div>
  )
}
