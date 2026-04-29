'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Mail, Phone, MessageSquare } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <footer className={`relative border-t border-cyan-500/10 overflow-hidden ${isAdminRoute ? 'lg:ml-64' : ''}`}>
      {/* Background */}
      <div className="absolute inset-0 hex-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800 to-navy-900" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-10 h-10 text-cyan-400" />
              <div>
                <div className="font-orbitron font-bold text-xl">
                  <span className="text-cyan-400">CYBER</span>
                  <span className="text-orange-400">SHIELD</span>
                </div>
                <div className="text-xs text-slate-500">Empowerment Portal</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Harassment Response and Digital Safety Portal — protecting you from online threats, cyberbullying, and digital dangers.
            </p>
            <div className="text-xs text-slate-500">© 2026 CyberShield | All Rights Reserved</div>
            <div className="mt-2 flex gap-3 text-xs">
              <Link href="/privacy" className="text-slate-500 hover:text-cyan-400 transition-colors font-medium">Privacy Policy</Link>
              <span className="text-slate-600">|</span>
              <Link href="/report" className="text-slate-500 hover:text-orange-400 transition-colors">Report Abuse</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-orbitron text-sm font-semibold text-cyan-400 mb-5 uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/resources', label: 'Resources' },
                { href: '/articles', label: 'Articles' },
                { href: '/digital-safety-tips', label: 'Safety Tips' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="text-cyan-600 group-hover:text-cyan-400 transition-colors">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h3 className="font-orbitron text-sm font-semibold text-orange-400 mb-5 uppercase tracking-widest">Get Help</h3>
            <ul className="space-y-3">
              {[
                { href: '/report', label: 'Report Harassment' },
                { href: '/digital-safety-tips', label: 'Digital Safety Tips' },
                { href: '/contact', label: 'Contact Support' },
                { href: '/resources', label: 'Mental Health Resources' },
                { href: '/articles', label: 'Safety Guides' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="text-orange-600 group-hover:text-orange-400 transition-colors">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-orbitron text-sm font-semibold text-slate-300 mb-5 uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:support@cybershield.com" className="hover:text-cyan-400 transition-colors">support@cybershield.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="tel:+18001234567" className="hover:text-cyan-400 transition-colors">+1-800-123-4567</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">Live Chat Support</Link>
              </li>
            </ul>
            <div className="flex gap-3">
              {['𝕏', 'f', 'in', '📷'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-cyan-500/20 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/20 text-sm font-bold">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-cyan-500/10 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600">
          Built with security & privacy in mind | All reports are encrypted and confidential
        </div>
      </div>
    </footer>
  )
}
