import type { Metadata } from 'next'
import { Orbitron, Exo_2 } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatbotWidget from '@/components/ChatbotWidget'
import ParticleBackground from '@/components/ParticleBackground'
import BackToTop from '@/components/BackToTop'
import { ToastProvider } from '@/components/ToastProvider'
import { AuthProvider } from '@/lib/auth-context'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['400','500','600','700','800','900'] })
const exo2 = Exo_2({ subsets: ['latin'], variable: '--font-exo', weight: ['300','400','500','600','700'] })

export const metadata: Metadata = {
  title: 'CyberShield — Harassment Response & Digital Safety Portal',
  description: 'Report cyber harassment anonymously. Get digital safety resources, guidance, and AI-powered support.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo2.variable}`}>
      <body className="bg-navy-800 text-slate-200 font-exo antialiased">
        <ToastProvider>
          <AuthProvider>
            <ParticleBackground />
            <div className="relative z-10">
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </div>
            <BackToTop />
            <ChatbotWidget />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
