import type { Metadata } from 'next'
import './globals.css'
import '../styles/tokens.css'
import NavBar from '@/components/NavBar'
import { ToastProvider } from '@/components/ToastProvider'
import { NetworkProvider } from '@/lib/contexts/NetworkContext'
import { NotificationProvider } from '@/lib/contexts/NotificationContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { WalletProvider } from '@/contexts/WalletContext'
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
                    <ToastProvider>
                      <NavBar />
                      <main className="relative">
                        {children}
                      </main>
                      {/* <GlobalNavigation /> */}
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
