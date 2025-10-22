import type { Metadata } from 'next'
import './globals.css'
import '../styles/tokens.css'
import { TopNav } from '@/components/TopNav'
import { ToastProvider } from '@/components/ToastProvider'
import { NetworkProvider } from '@/lib/contexts/NetworkContext'
import { NotificationProvider } from '@/lib/contexts/NotificationContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { PrivyProviderWrapper } from '@/contexts/PrivyProviderWrapper'
import { PrivySyncWrapper } from '@/components/PrivySyncWrapper'
import { ReferralTracker } from '@/components/ReferralTracker'
import { GlobalActivationModal } from '@/components/GlobalActivationModal'
import { DebugPanel } from '@/components/DebugPanel'
import { CurveActivationProvider } from '@/contexts/CurveActivationContext'
import { PWAInitializer } from '@/components/PWAInitializer'
import MobileTabBar from '@/components/MobileTabBar'
import { BRAND } from '@/lib/brand'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: `${BRAND.name} - ${BRAND.tagline}`,
  description: BRAND.description,
  manifest: '/manifest.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#00FFFF' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: BRAND.name,
    startupImage: '/icons/icon-512.svg',
  },
  applicationName: BRAND.name,
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: BRAND.assets.favicon,
        type: 'image/svg+xml',
      },
      {
        url: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        url: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: BRAND.description,
    images: [
      {
        url: BRAND.assets.ogImage,
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: BRAND.description,
    images: [BRAND.assets.ogImage],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="smooth-scroll">
      <body className="antialiased bg-black">
        <PrivyProviderWrapper>
          <PrivySyncWrapper>
            <AuthProvider>
              <WalletProvider>
                <NotificationProvider>
                  <NetworkProvider>
                    <CurveActivationProvider>
                      <ToastProvider>
                        <Toaster position="top-center" theme="dark" richColors />
                        <PWAInitializer />
                        <ReferralTracker />
                        <GlobalActivationModal />
                        <DebugPanel />
                        <TopNav />
                        <main className="text-white pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
                          {children}
                        </main>
                        <MobileTabBar />
                      </ToastProvider>
                    </CurveActivationProvider>
                  </NetworkProvider>
                </NotificationProvider>
              </WalletProvider>
            </AuthProvider>
          </PrivySyncWrapper>
        </PrivyProviderWrapper>
      </body>
    </html>
  )
}
