import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { AuthProvider } from '@/providers/AuthProvider'
import { SocketProvider } from '@/providers/SocketProvider'
import { AuthModal } from '@/components/modals/AuthModal'
import { Toaster } from '@/components/ui/Toaster'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            <Navbar />
            <main>{children}</main>
            <AuthModal />
            <Toaster />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
