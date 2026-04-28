'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

export default function SignupPage() {
  const toast = useToast()
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', agree: false })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const update = (field: string, val: any) => setForm(p => ({ ...p, [field]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      toast.error('Password mismatch', 'Please confirm both passwords are the same.')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      setSuccess(true)
      toast.success('Account created', 'You can now sign in.')
    } catch (err: any) {
      setError(err.message)
      toast.error('Registration failed', err.message)
    }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 hex-pattern opacity-30" />
      <div className="absolute inset-0 bg-navy-900" />
      <div className="relative cyber-card rounded-2xl p-12 border border-cyan-500/20 text-center max-w-md w-full">
        <Shield className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
        <h2 className="font-orbitron font-bold text-2xl text-white mb-3">Account Created!</h2>
        <p className="text-slate-400 mb-6">Your account has been created successfully. You can now sign in.</p>
        <Link href="/login" className="btn-cyber block text-center py-3 rounded-lg">Go to Login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 hex-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative w-full max-w-md">
        <div className="cyber-card rounded-2xl p-8 border border-cyan-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <Shield className="w-14 h-14 text-cyan-400 mx-auto mb-4" />
            <div className="font-orbitron font-bold text-2xl mb-1">
              <span className="text-cyan-400">CYBER</span><span className="text-orange-400"> SECURITY</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mt-4" />
          </div>

          <h2 className="font-orbitron font-bold text-xl text-white text-center mb-1">Create Account</h2>
          <p className="text-slate-400 text-sm text-center mb-6">Join the digital safety community</p>

          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium tracking-wide">FULL NAME</label>
              <input type="text" placeholder="Enter your full name" required className="cyber-input"
                value={form.name} onChange={e => update('name', e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium tracking-wide">EMAIL ADDRESS</label>
              <input type="email" placeholder="you@example.com" required className="cyber-input"
                value={form.email} onChange={e => update('email', e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium tracking-wide">PHONE (OPTIONAL)</label>
              <input type="tel" placeholder="+92 300 0000000" className="cyber-input"
                value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium tracking-wide">PASSWORD</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} placeholder="Minimum 8 characters" required minLength={8} className="cyber-input pr-12"
                  value={form.password} onChange={e => update('password', e.target.value)} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors p-1">
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium tracking-wide">CONFIRM PASSWORD</label>
              <input type="password" placeholder="Re-enter your password" required className="cyber-input"
                value={form.confirm} onChange={e => update('confirm', e.target.value)} />
            </div>

            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-cyan-500 shrink-0"
                checked={form.agree} onChange={e => update('agree', e.target.checked)} />
              <span className="text-slate-400 text-sm leading-relaxed">
                I agree to the{' '}
                <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>
                {' '}and understand my reports are confidential.
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="btn-cyber w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 rounded-lg">
              {loading ? <div className="cyber-spinner w-5 h-5" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
