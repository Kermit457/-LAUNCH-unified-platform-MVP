"use client"

interface RoleChipProps {
  role: string
}

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  Streamer: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
  },
  Degen: {
    bg: 'bg-red-500/15',
    text: 'text-red-300',
    border: 'border-red-500/30',
  },
  Trader: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
  },
  Developer: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
  },
  Creator: {
    bg: 'bg-pink-500/15',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
  },
  Investor: {
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-300',
    border: 'border-yellow-500/30',
  },
}

export function RoleChip({ role }: RoleChipProps) {
  const colors = roleColors[role] || {
    bg: 'bg-white/10',
    text: 'text-white/70',
    border: 'border-white/20',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {role}
    </span>
  )
}
