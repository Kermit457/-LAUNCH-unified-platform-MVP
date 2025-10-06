"use client"

import { Twitter, Radio } from 'lucide-react'
import { ContributorRow, Contributor } from '@/components/ContributorRow'

// Social icon components
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627c-.168.9-.5 1.201-.82 1.23c-.697.064-1.226-.461-1.901-.903c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.781-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345c-.479.329-.913.489-1.302.481c-.428-.009-1.252-.242-1.865-.442c-.751-.244-1.349-.374-1.297-.789c.027-.216.324-.437.893-.663c3.498-1.524 5.831-2.529 6.998-3.015c3.333-1.386 4.025-1.627 4.476-1.635c.099-.002.321.023.465.14c.121.099.155.232.171.325c.016.093.036.305.02.469z"/>
  </svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

interface Socials {
  twitter?: string
  discord?: string
  telegram?: string
  website?: string
}

interface LaunchHeaderCompactProps {
  logoUrl?: string
  title: string
  subtitle?: string
  status: "LIVE" | "UPCOMING"
  scope: "ICM" | "CCM"
  convictionPct: number
  socials?: Socials
  team?: Contributor[] // Core team members
  contributors?: Contributor[] // Additional contributors
  className?: string
}

export function LaunchHeaderCompact({
  logoUrl,
  title,
  subtitle,
  status,
  scope,
  convictionPct,
  socials,
  team,
  contributors,
  className = "",
}: LaunchHeaderCompactProps) {
  const isLive = status === "LIVE"

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02]
                  border p-6 ${className}
                  ${isLive ? 'border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] animate-glow' : 'border-white/10'}`}
      data-live={isLive}
    >
      {/* Top Row: Logo + Meta + Badges */}
      <div className="flex items-start gap-4 mb-4">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl ring-2 ring-white/10 overflow-hidden flex-shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
              {title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Title + Subtitle */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-white/50 line-clamp-1 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-shrink-0">
          <span
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1
              ${isLive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
          >
            {isLive && <Radio className="w-3 h-3 fill-emerald-300" />}
            {status}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold
              ${scope === 'ICM'
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
          >
            {scope}
          </span>
        </div>
      </div>

      {/* Social Icons Row */}
      {socials && (
        <div className="flex gap-1.5 mb-4">
          {socials.twitter && (
            <a
              href={`https://twitter.com/${socials.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/50
                         flex items-center justify-center transition-all group"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-white/60 group-hover:text-sky-400" />
            </a>
          )}
          {socials.discord && (
            <a
              href={`https://${socials.discord}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50
                         flex items-center justify-center transition-all group"
              aria-label="Discord"
            >
              <DiscordIcon className="w-4 h-4 text-white/60 group-hover:text-indigo-400" />
            </a>
          )}
          {socials.telegram && (
            <a
              href={`https://${socials.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50
                         flex items-center justify-center transition-all group"
              aria-label="Telegram"
            >
              <TelegramIcon className="w-4 h-4 text-white/60 group-hover:text-blue-400" />
            </a>
          )}
          {socials.website && (
            <a
              href={`https://${socials.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/50
                         flex items-center justify-center transition-all group"
              aria-label="Website"
            >
              <GlobeIcon className="w-4 h-4 text-white/60 group-hover:text-white" />
            </a>
          )}
        </div>
      )}

      {/* Team & Contributors Row - Combined on same line */}
      {(team && team.length > 0) || (contributors && contributors.length > 0) ? (
        <div className="flex items-center gap-6 mb-4">
          {team && team.length > 0 && (
            <ContributorRow contributors={team} label="Team" />
          )}
          {contributors && contributors.length > 0 && (
            <ContributorRow
              contributors={contributors}
              label={`${contributors.length} contributor${contributors.length === 1 ? "" : "s"}`}
            />
          )}
        </div>
      ) : null}

      {/* Conviction Bar - Slim */}
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${convictionPct}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/40 uppercase tracking-wide font-semibold">Conviction</span>
          <span className="text-sm font-bold text-white">{convictionPct}%</span>
        </div>
      </div>
    </div>
  )
}
