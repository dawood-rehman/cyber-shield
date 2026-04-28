'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ToastProvider'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading, refresh } = useAuth()
  const toast = useToast()
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading || !user) return
    router.replace(user.role === 'admin' ? '/admin' : '/')
  }, [authLoading, router, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      toast.success('Login successful', 'Welcome back to CyberShield.')
      await refresh()
      router.refresh()
      if (data.role === 'admin') { router.replace('/admin'); return }
      const redirect = new URLSearchParams(window.location.search).get('redirect') || '/'
      router.replace(redirect)
    } catch (err: any) {
      setError(err.message)
      toast.error('Login failed', err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 hex-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-md">
        <div className="cyber-card rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <Shield className="w-16 h-16 text-cyan-400 mx-auto" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full" />
            </div>
            <div className="font-orbitron font-bold text-2xl mb-1">
              <span className="text-cyan-400">CYBER</span><span className="text-orange-400"> SECURITY</span>
            </div>
            <div className="text-slate-400 text-sm">Harassment Response &amp; Digital Safety Portal</div>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          </div>

          <h2 className="font-orbitron font-bold text-xl text-white text-center mb-1">Welcome Back!</h2>
          <p className="text-slate-400 text-sm text-center mb-6">Sign in to continue to your account</p>

          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium tracking-wide">EMAIL ADDRESS</label>
              <input type="email" placeholder="you@example.com" required className="cyber-input"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium tracking-wide">PASSWORD</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} placeholder="Enter your password" required className="cyber-input pr-12"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors p-1">
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500 rounded"
                  checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} />
                <span className="text-slate-400 text-sm">Remember Me</span>
              </label>
              <Link href="#" className="text-cyan-400 text-sm hover:text-orange-400 transition-colors">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="btn-cyber w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 rounded-lg">
              {loading ? <div className="cyber-spinner w-5 h-5" /> : 'Sign In'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 border border-slate-600 rounded-lg text-slate-300 hover:border-cyan-500/40 hover:text-white transition-all text-sm font-medium">
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-black text-gray-800">G</span>
            Continue with Google
          </button>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">Request Access</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
