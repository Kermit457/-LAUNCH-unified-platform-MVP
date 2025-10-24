"use client"

import { Globe, Youtube, Twitch, MessageCircle } from 'lucide-react'
import { SocialLinks } from '@/types/network'

interface LinkPillsProps {
  links?: SocialLinks
}

export function LinkPills({ links }: LinkPillsProps) {
  if (!links) return null

  const socialIcons = [
    {
      key: 'x' as const,
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      label: 'X',
    },
    {
      key: 'youtube' as const,
      icon: <Youtube className="w-3.5 h-3.5" />,
      label: 'YouTube',
    },
    {
      key: 'twitch' as const,
      icon: <Twitch className="w-3.5 h-3.5" />,
      label: 'Twitch',
    },
    {
      key: 'discord' as const,
      icon: <MessageCircle className="w-3.5 h-3.5" />,
      label: 'Discord',
    },
    {
      key: 'web' as const,
      icon: <Globe className="w-3.5 h-3.5" />,
      label: 'Website',
    },
  ]

  const availableLinks = socialIcons.filter((social) => links[social.key])

  if (availableLinks.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {availableLinks.map((social) => (
        <a
          key={social.key}
          href={links[social.key]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50"
          aria-label={`Visit ${social.label}`}
        >
          {social.icon}
          <span className="text-xs">{social.label}</span>
        </a>
      ))}
    </div>
  )
}
