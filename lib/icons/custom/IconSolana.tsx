import React from 'react'
import { cn } from '@/lib/utils'

interface IconSolanaProps {
  className?: string
  size?: 16 | 20 | 24 | 32 | 64 | 128
}

export const IconSolana = ({ className, size = 24 }: IconSolanaProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="Solana"
    >
      <path d="M93.94 42.6302H13.78L34.06 22.4102H114.22L93.94 42.6302Z" fill="currentColor"/>
      <path d="M93.94 105.589H13.78L34.06 85.3789H114.22" fill="currentColor"/>
      <path d="M34.06 74.1106H114.22L93.94 53.8906H13.78" fill="currentColor"/>
    </svg>
  )
}
