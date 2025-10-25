/**
 * BLAST Layout
 * Error boundary and loading states
 */

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export default function BlastLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-btdemo-canvas">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#00FF88] mx-auto" />
            <p className="text-zinc-400">Loading BLAST...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
