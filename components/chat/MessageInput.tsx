'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = content.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setContent('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    setContent(target.value)

    // Auto-resize
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`
  }

  return (
    <div className="border-t border-zinc-800 p-2 md:p-4 bg-zinc-900/80 backdrop-blur pb-safe">
      <div className="flex items-end gap-2 md:gap-3">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-xl px-3 py-2 md:px-4 md:py-3 text-white text-xs md:text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A]/50 resize-none min-h-[40px] md:min-h-[44px] max-h-[100px] md:max-h-[120px]"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          className="p-2.5 md:px-4 md:py-3 rounded-xl bg-gradient-to-r from-[#D1FD0A] via-lime-500 to-[#00FFFF] text-white font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
      {content.length > 0 && (
        <div className="text-[10px] md:text-xs text-zinc-500 mt-1.5 md:mt-2">
          {content.length} / 2000 characters
        </div>
      )}
    </div>
  )
}
