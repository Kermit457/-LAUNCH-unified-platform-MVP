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
import { BRAND } from '@/lib/brand'

export const metadata: Metadata = {
  title: `${BRAND.name} - ${BRAND.tagline}`,
  description: BRAND.description,
  icons: {
    icon: [
      {
        url: BRAND.assets.favicon,
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="smooth-scroll">
      <body className="min-h-screen bg-black text-white antialiased">
        {/* Premium background gradient */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black"></div>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <PrivyProviderWrapper>
          <PrivySyncWrapper>
            <AuthProvider>
              <WalletProvider>
                <NotificationProvider>
                  <NetworkProvider>
                    <CurveActivationProvider>
                      <ToastProvider>
                        <ReferralTracker />
                        <GlobalActivationModal />
                        <DebugPanel />
                        <TopNav />
                        <main className="relative">
                          {children}
                        </main>
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
