import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import { ToastProvider } from '@/components/ToastProvider'

export const metadata: Metadata = {
  title: 'StreamWidgets - Interactive OBS Overlays',
  description: 'Live engagement widgets for predictions, social actions, and ads',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ToastProvider>
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  )
}
