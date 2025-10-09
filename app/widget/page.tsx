'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import PredictionWidget from '@/components/PredictionWidget'
import SocialWidget from '@/components/SocialWidget'

function WidgetContent() {
  const searchParams = useSearchParams()

  if (!searchParams) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="text-red-500 font-semibold">
          Error: Invalid request
        </div>
      </div>
    )
  }

  const mode = searchParams.get('mode')
  const streamer = searchParams.get('streamer')

  if (!streamer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="text-red-500 font-semibold">
          Error: streamer parameter required
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-4">
      {mode === 'prediction' && <PredictionWidget streamer={streamer} />}
      {mode === 'social' && <SocialWidget streamer={streamer} />}
      {!mode && (
        <div className="text-red-500 font-semibold">
          Error: mode parameter required (prediction or social)
        </div>
      )}
    </div>
  )
}

export default function WidgetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
      <WidgetContent />
    </Suspense>
  )
}
