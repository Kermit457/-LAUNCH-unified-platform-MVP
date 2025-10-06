"use client"

import { useEffect, useState, useRef } from 'react'

interface CounterCardProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  icon: React.ReactNode
}

export function CounterCard({ value, label, prefix = '', suffix = '', icon }: CounterCardProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString('en-US')
  }

  return (
    <div
      ref={ref}
      className="relative rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl hover:border-fuchsia-500/50 transition-all group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-fuchsia-500/10 group-hover:via-purple-500/10 group-hover:to-cyan-500/10 transition-all" />

      <div className="relative">
        {/* Icon */}
        <div className="mb-4 text-fuchsia-400">
          {icon}
        </div>

        {/* Counter */}
        <div className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          {prefix}{formatNumber(count)}{suffix}
        </div>

        {/* Label */}
        <div className="text-sm text-zinc-400 uppercase tracking-wide">
          {label}
        </div>

        {/* Pulse indicator */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
