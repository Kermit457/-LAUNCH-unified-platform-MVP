"use client"

interface PriceSparkProps {
  data?: Array<{ ts: number; price: number }>
  className?: string
}

export function PriceSpark({ data, className = '' }: PriceSparkProps) {
  if (!data || data.length === 0) return null

  // Calculate dimensions
  const width = 80
  const height = 24
  const padding = 2

  // Find min/max for scaling
  const prices = data.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1 // Avoid division by zero

  // Generate path
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
    const y = height - padding - ((d.price - minPrice) / priceRange) * (height - 2 * padding)
    return `${x},${y}`
  })

  const pathData = `M ${points.join(' L ')}`

  // Determine color based on trend
  const isPositive = data[data.length - 1].price >= data[0].price
  const strokeColor = isPositive ? '#10b981' : '#ef4444' // green-500 : red-500

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`inline-block ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
