import type { Metadata } from 'next'
import './globals.css'
import '../styles/tokens.css'
import NavBar from '@/components/NavBar'
import { ToastProvider } from '@/components/ToastProvider'
import { NetworkProvider } from '@/lib/contexts/NetworkContext'
import { NotificationProvider } from '@/lib/contexts/NotificationContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { DevModeBanner, DevModeIndicator } from '@/components/DevModeBanner'
import { PrivyProviderWrapper } from '@/contexts/PrivyProviderWrapper'
import { PrivySyncWrapper } from '@/components/PrivySyncWrapper'

export const metadata: Metadata = {
  title: 'LaunchOS - The Engine of the Internet Capital Market',
  description: 'Launch. Engage. Earn. The viral launchpad for builders, creators, and degens.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <PrivyProviderWrapper>
          <PrivySyncWrapper>
            <AuthProvider>
              <WalletProvider>
                <NotificationProvider>
                  <NetworkProvider>
                    <ToastProvider>
                      <DevModeBanner />
                      <NavBar />
                      <main className="container mx-auto px-4 py-8">
                        {children}
                      </main>
                      <DevModeIndicator />
                    </ToastProvider>
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
