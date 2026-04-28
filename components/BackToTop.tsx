'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 420)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-24 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/40 bg-navy-900/90 text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur transition-all duration-300 hover:border-orange-400/70 hover:text-orange-300 hover:shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
