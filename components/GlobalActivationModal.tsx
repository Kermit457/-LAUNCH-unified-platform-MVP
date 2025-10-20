"use client"

import { useCurveActivation } from '@/contexts/CurveActivationContext'
import { ActivateCurveModal } from '@/components/onboarding/ActivateCurveModal'
import { useUser } from '@/hooks/useUser'

/**
 * Global activation modal that shows after Twitter login
 * regardless of which page the user is on
 */
export function GlobalActivationModal() {
  const { userId } = useUser()
  const {
    progress,
    showActivationModal,
    setShowActivationModal,
    activateCurve,
  } = useCurveActivation()

  return (
    <ActivateCurveModal
      isOpen={showActivationModal}
      onClose={() => setShowActivationModal(false)}
      onActivate={activateCurve}
      userId={userId || ''}
      progress={progress}
    />
  )
}
