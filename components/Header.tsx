'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, ChevronDown, LogOut, LayoutDashboard, FileText, Settings } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  {
    label: 'Resources',
    children: [
      { href: '/resources', label: 'All Resources' },
      { href: '/articles', label: 'Articles' },
      { href: '/digital-safety-tips', label: 'Safety Tips' },
    ],
  },
  { href: '/contact', label: 'Contact Us' },
  { href: '/report', label: 'Report Harassment', highlight: true },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-navy-900/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="w-9 h-9 text-cyan-400 group-hover:text-orange-400 transition-colors duration-300" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl group-hover:bg-orange-400/20 transition-all duration-300 rounded-full" />
            </div>
            <div>
              <span className="font-orbitron font-bold text-lg leading-none">
                <span className="text-cyan-400">CYBER</span><span className="text-orange-400">SHIELD</span>
              </span>
              <div className="text-xs text-slate-400 font-exo tracking-wide">Digital Safety Portal</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}>
                  <button className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors font-medium text-sm">
                    {link.label} <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-navy-900/98 border border-cyan-500/20 rounded-lg shadow-xl shadow-black/50 overflow-hidden backdrop-blur-md">
                      {link.children.map(child => (
                        <Link key={child.href} href={child.href}
                          className="block px-4 py-3 text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors border-b border-cyan-500/10 last:border-0">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.highlight ? (
                <Link key={link.href} href={link.href!}
                  className="ml-2 btn-cyber text-sm px-5 py-2.5 rounded-md flex items-center gap-2">
                  🚨 {link.label}
                </Link>
              ) : (
                <Link key={link.href} href={link.href!}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                    pathname === link.href ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5'
                  }`}>
                  {link.label}
                </Link>
              )
            )}

            {/* Auth area */}
            {user ? (
                <div className="relative ml-2" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-500/20 hover:border-cyan-400/50 transition-all text-sm text-slate-300 hover:text-white">
                    <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center font-orbitron font-bold text-cyan-400 text-xs">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-52 bg-navy-900/98 border border-cyan-500/20 rounded-lg shadow-xl backdrop-blur-md overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-700/50">
                        <div className="text-white text-sm font-medium truncate">{user.name}</div>
                        <div className="text-slate-500 text-xs truncate">{user.email}</div>
                      </div>
                      {user.role === 'admin' ? (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      ) : (
                        <Link href="/my-reports" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors">
                          <FileText className="w-4 h-4" /> My Reports
                        </Link>
                      )}
                      <Link href="/settings" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors border-t border-slate-700/50">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/5 transition-colors border-t border-slate-700/50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : loading ? (
                <div className="ml-2 h-[42px] w-[92px] rounded-md border border-cyan-500/20 bg-cyan-500/5" aria-hidden="true" />
              ) : (
                <Link href="/login" className="ml-2 btn-outline text-sm px-5 py-2.5 rounded-md">LOGIN</Link>
              )}
          </nav>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy-900/98 backdrop-blur-md border-t border-cyan-500/20">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <div className="px-3 py-2 text-slate-400 text-xs uppercase tracking-wider font-orbitron">{link.label}</div>
                  {link.children.map(child => (
                    <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)}
                      className="block px-6 py-2 text-slate-300 hover:text-cyan-400 transition-colors text-sm">
                      → {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href!} onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    link.highlight ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-300 hover:text-cyan-400'
                  }`}>
                  {link.label}
                </Link>
              )
            )}
            {user ? (
              <>
                {user.role === 'admin'
                  ? <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-cyan-400 text-sm">Admin Panel</Link>
                  : <Link href="/my-reports" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-cyan-400 text-sm">My Reports</Link>
                }
                <Link href="/settings" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-cyan-400 text-sm">Settings</Link>
                <button onClick={() => { setMobileOpen(false); logout() }} className="w-full text-left px-3 py-2.5 text-red-400 text-sm">Logout</button>
              </>
            ) : loading ? (
              <div className="mt-3 h-10 rounded-md border border-cyan-500/20 bg-cyan-500/5" aria-hidden="true" />
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="block mt-3 px-3 py-2.5 text-center border border-cyan-500/40 rounded-md text-cyan-400 text-sm font-orbitron">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
