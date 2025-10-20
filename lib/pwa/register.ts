/**
 * PWA Service Worker Registration
 * Handles SW lifecycle: install, activate, update
 */

export interface PWARegistration {
  registration: ServiceWorkerRegistration | null
  isUpdateAvailable: boolean
  updateServiceWorker: () => Promise<void>
}

let registration: ServiceWorkerRegistration | null = null

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('PWA: Service workers not supported')
    return null
  }

  // Only register in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('PWA: Service worker disabled in development')
    return null
  }

  try {
    registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none' // Always check for SW updates
    })

    console.log('PWA: Service worker registered', registration.scope)

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration?.update()
    }, 60 * 60 * 1000)

    // Listen for SW updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration?.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New SW is installed but waiting
            console.log('PWA: New service worker available')
            window.dispatchEvent(new CustomEvent('swUpdateAvailable', { detail: registration }))
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error('PWA: Service worker registration failed', error)
    return null
  }
}

/**
 * Unregister service worker (for debugging)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!registration) return false

  try {
    const success = await registration.unregister()
    console.log('PWA: Service worker unregistered', success)
    return success
  } catch (error) {
    console.error('PWA: Failed to unregister service worker', error)
    return false
  }
}

/**
 * Skip waiting and activate new SW immediately
 */
export async function skipWaitingAndReload(): Promise<void> {
  if (!registration?.waiting) return

  // Tell waiting SW to skip waiting
  registration.waiting.postMessage({ type: 'SKIP_WAITING' })

  // Reload page when new SW activates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}

/**
 * Check if update is available
 */
export function checkForUpdate(): void {
  registration?.update()
}
