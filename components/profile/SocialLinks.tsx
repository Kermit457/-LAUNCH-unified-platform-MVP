"use client"

import { Globe, MessageCircle } from 'lucide-react'
import { SocialLinks as SocialLinksType } from '@/types/profile'

interface SocialLinksProps {
  socials: SocialLinksType
}

export function SocialLinks({ socials }: SocialLinksProps) {
  const links = [
    {
      type: 'twitter',
      url: socials.twitter,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      label: 'X (Twitter)'
    },
    {
      type: 'discord',
      url: socials.discord,
      icon: <MessageCircle className="w-4 h-4" />,
      label: 'Discord'
    },
    {
      type: 'website',
      url: socials.website,
      icon: <Globe className="w-4 h-4" />,
      label: 'Website'
    }
  ]

  const activeLinks = links.filter(link => link.url)

  if (activeLinks.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      {activeLinks.map((link) => (
        <a
          key={link.type}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-fuchsia-500/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all group"
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}
