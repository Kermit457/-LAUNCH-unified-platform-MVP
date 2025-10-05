'use client'

import { useState } from 'react'
import { X, Hash, AtSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagTokenInputProps {
  tokens: string[]
  onChange: (tokens: string[]) => void
  placeholder?: string
}

export function TagTokenInput({
  tokens,
  onChange,
  placeholder = "Add tags like #LaunchOS or @YourHandle"
}: TagTokenInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addToken = (value: string) => {
    const trimmed = value.trim()
    if (trimmed && !tokens.includes(trimmed)) {
      onChange([...tokens, trimmed])
      setInputValue('')
    }
  }

  const removeToken = (index: number) => {
    onChange(tokens.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (inputValue.trim()) {
        addToken(inputValue)
      }
    } else if (e.key === 'Backspace' && inputValue === '' && tokens.length > 0) {
      removeToken(tokens.length - 1)
    }
  }

  const getTokenIcon = (token: string) => {
    if (token.startsWith('#')) return <Hash className="w-3 h-3" />
    if (token.startsWith('@')) return <AtSign className="w-3 h-3" />
    return null
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        Required Tags/Mentions
      </label>

      <div className="min-h-[48px] p-2 rounded-xl bg-white/5 border border-white/10 focus-within:ring-2 focus-within:ring-fuchsia-400/80 transition-all">
        <div className="flex flex-wrap gap-2">
          {tokens.map((token, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm"
            >
              {getTokenIcon(token)}
              <span>{token}</span>
              <button
                type="button"
                onClick={() => removeToken(index)}
                className="ml-0.5 hover:text-purple-100 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) {
                addToken(inputValue)
              }
            }}
            placeholder={tokens.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder:text-white/40 text-sm"
          />
        </div>
      </div>

      <p className="text-xs text-white/60">
        Press Enter or Space to add a tag. Use # for hashtags and @ for mentions.
      </p>
    </div>
  )
}
