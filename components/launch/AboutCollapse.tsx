"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AboutCollapseProps {
  content: string | React.ReactNode
  previewLines?: number
  className?: string
}

export function AboutCollapse({
  content,
  previewLines = 3,
  className = '',
}: AboutCollapseProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`border-t border-white/10 pt-4 ${className}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left group mb-3"
      >
        <span className="text-[11px] text-white/50 uppercase font-semibold tracking-wide">
          About
        </span>
        <ChevronDown
          className={`w-4 h-4 text-white/50 group-hover:text-white transition-all duration-300
                     ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`text-sm text-white/70 leading-relaxed transition-all duration-300 overflow-hidden
                   ${expanded ? 'max-h-[1000px]' : 'max-h-[4.5rem]'}`}
        style={{ lineClamp: expanded ? 'unset' : previewLines }}
      >
        <div className={expanded ? '' : 'line-clamp-3'}>
          {content}
        </div>
      </div>

      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Read more →
        </button>
      )}
    </div>
  )
}
