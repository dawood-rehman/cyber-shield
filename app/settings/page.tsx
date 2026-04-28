'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Save, Settings, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ToastProvider'

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading, refresh } = useAuth()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?redirect=/settings')
      return
    }

    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }))
    }
  }, [loading, router, user])

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match')
      toast.error('Password mismatch', 'New password and confirm password do not match.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update settings')

      setMessage('Settings updated successfully')
      toast.success('Settings updated', 'Your profile changes have been saved.')
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      await refresh()
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      toast.error('Update failed', err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="cyber-spinner" />
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4 text-xs font-orbitron text-cyan-400 tracking-wider">
            <Settings className="w-4 h-4" /> ACCOUNT SETTINGS
          </div>
          <h1 className="font-orbitron font-black text-3xl lg:text-5xl text-white mb-4">
            MANAGE <span className="text-cyan-400">PROFILE</span>
          </h1>
          <p className="text-slate-400">
            Update your account details and password from one secure place.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="cyber-card rounded-2xl border border-cyan-500/20 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-white">Account Details</h2>
              <p className="text-slate-500 text-sm capitalize">{user.role} account</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {message && <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">{message}</div>}
            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-medium tracking-wide">FULL NAME</label>
                <input required className="cyber-input" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-medium tracking-wide">EMAIL ADDRESS</label>
                <input required type="email" className="cyber-input" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-medium tracking-wide">PHONE</label>
              <input type="tel" className="cyber-input" placeholder="+92 300 0000000" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <h3 className="font-orbitron font-semibold text-white mb-2">Password</h3>
              <p className="text-slate-500 text-sm mb-5">
                Current password is required when changing your email or password.
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-medium tracking-wide">CURRENT PASSWORD</label>
                  <input type="password" className="cyber-input" value={form.currentPassword} onChange={e => update('currentPassword', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-medium tracking-wide">NEW PASSWORD</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} minLength={8} className="cyber-input pr-12" value={form.newPassword} onChange={e => update('newPassword', e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors p-1">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-5">
                <label className="text-slate-400 text-xs font-medium tracking-wide">CONFIRM NEW PASSWORD</label>
                <input type={showPassword ? 'text' : 'password'} minLength={8} className="cyber-input" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-700/50">
            <button type="submit" disabled={saving}
              className="btn-cyber w-full sm:w-auto px-8 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <div className="cyber-spinner w-5 h-5" /> : <><Save className="w-4 h-4" /> Save Settings</>}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
