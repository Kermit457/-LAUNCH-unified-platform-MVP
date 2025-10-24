"use client"

import { cn } from '@/lib/cn'

/**
 * Base Skeleton component
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-white/10', className)}
      {...props}
    />
  )
}

/**
 * Launch Card Skeleton (for explore page)
 */
export function LaunchCardSkeleton() {
  return (
    <div className="w-full h-[220px] rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
      <div className="flex h-full">
        {/* Left rail */}
        <div className="w-16 p-2 flex flex-col items-center gap-2 bg-neutral-900/60">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 grid grid-cols-[64px_1fr] gap-4">
          {/* Token tile */}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-5 w-10" />
            </div>
          </div>

          {/* Text + controls */}
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            {/* Conviction bar */}
            <div className="mb-3">
              <Skeleton className="h-2 w-full rounded-full" />
            </div>

            {/* Actions */}
            <div className="mt-auto flex items-center gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Launch Detail Header Skeleton
 */
export function LaunchHeaderSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />

        {/* Title & meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64 mb-3" />

          {/* Socials */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Conviction bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  )
}

/**
 * Stats Card Skeleton
 */
export function StatsCardSkeleton() {
  return (
    <div className="glass-card p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Comment Skeleton
 */
export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}

/**
 * Chart Skeleton
 */
export function ChartSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

/**
 * Grid of Launch Card Skeletons
 */
export function LaunchGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {[...Array(count)].map((_, i) => (
        <LaunchCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Page Loading Skeleton (full page)
 */
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Generic List Skeleton
 */
export function ListSkeleton({ count = 5, itemHeight = 'h-16' }: { count?: number, itemHeight?: string }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className={cn('w-full', itemHeight)} />
      ))}
    </div>
  )
}
