"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'

export function LandingFooter() {
  const [onlineCount, setOnlineCount] = useState(2847)

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 10) - 5)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const footerLinks = {
    product: [
      { label: 'Launch', href: '/create' },
      { label: 'Engage', href: '/engage' },
      { label: 'Earn', href: '/earn' },
      { label: 'Network', href: '/network' },
      { label: 'Tools', href: '/tools' }
    ],
    resources: [
      { label: 'Docs', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'API', href: '/api' },
      { label: 'Support', href: '/support' }
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Terms', href: '/terms' }
    ],
    social: [
      { label: 'Twitter', href: 'https://twitter.com/launchos' },
      { label: 'Discord', href: 'https://discord.gg/launchos' },
      { label: 'Telegram', href: 'https://t.me/launchos' }
    ]
  }

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-zinc-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-zinc-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-zinc-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Social</h3>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              LaunchOS
            </div>
            <span className="text-zinc-500 text-sm">© 2025 Built on Solana.</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-zinc-400 text-sm">
              {onlineCount.toLocaleString('en-US')} online now
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
