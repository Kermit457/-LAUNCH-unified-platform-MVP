'use client'

import { Coins } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Mint } from '@/types/quest'

interface TokenInputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  mint: Mint
  placeholder?: string
  required?: boolean
  min?: number
}

export function TokenInput({
  label,
  value,
  onChange,
  mint,
  placeholder = "0.00",
  required = false,
  min = 0
}: TokenInputProps) {
  const decimals = mint === "USDC" ? 2 : 3

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Allow empty or valid number with correct decimals
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      // Check decimal places
      const parts = newValue.split('.')
      if (parts[1] && parts[1].length > decimals) {
        return // Don't update if too many decimals
      }
      onChange(newValue)
    }
  }

  const formatDisplay = () => {
    if (!value || value === '') return placeholder
    const num = parseFloat(value)
    if (isNaN(num)) return placeholder
    return num.toFixed(decimals)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-lime-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
          <Coins className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={cn(
            "w-full h-12 pl-12 pr-20 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40",
            "focus:outline-none focus:ring-2 focus:ring-lime-400/80 transition-all"
          )}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-bold text-white">
            {mint}
          </div>
        </div>
      </div>
      {value && parseFloat(value) > 0 && (
        <p className="text-xs text-white/60">
          ≈ {formatDisplay()} {mint}
        </p>
      )}
    </div>
  )
}
