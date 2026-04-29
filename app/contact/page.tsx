'use client'
import { useState } from 'react'
import { Mail, Phone, MessageSquare, Send, CheckCircle, MapPin, Clock } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

export default function ContactPage() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const update = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))
  const openChat = () => {
    window.dispatchEvent(new CustomEvent('cybershield:open-chat'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to send. Please try again.')
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      toast.success('Message sent', "We'll respond as soon as possible.")
    } catch (err: any) {
      toast.error('Message failed', err.message || 'Failed to send. Please try again.')
    }
    finally { setLoading(false) }
  }

  const channels = [
    { icon: Mail, title: 'Email Us', value: 'Support@cybershield.com', sub: "Send us an email and we'll respond as soon as possible.", action: 'Send Email', href: 'mailto:support@cybershield.com', color: 'cyan' },
    { icon: Phone, title: 'Call Us', value: '+1-800-123-4567', sub: 'Reach our 24/7 help line for immediate assistance.', action: 'Call Now', href: 'tel:+18001234567', color: 'orange' },
    { icon: MessageSquare, title: 'Live Chat', value: 'Available 24/7', sub: 'Chat with CyberShield AI in real time for quick help.', action: 'Start Chat', color: 'purple' },
  ]

  const colorMap: Record<string, string> = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400/60 text-cyan-400',
    orange: 'border-orange-500/30 hover:border-orange-400/60 text-orange-400',
    purple: 'border-purple-500/30 hover:border-purple-400/60 text-purple-400',
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-orbitron font-black text-4xl lg:text-5xl text-white mb-4">
            CONTACT <span className="text-cyan-400">US</span>
          </h1>
          <p className="text-slate-400 text-lg">We're here to help. Reach out through any of our support channels.</p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {channels.map(({ icon: Icon, title, value, sub, action, href, color }) => (
            <div key={title} className={`cyber-card rounded-xl p-8 border ${colorMap[color]} transition-all text-center`}>
              <div className="w-20 h-20 bg-current/10 rounded-2xl flex items-center justify-center mx-auto mb-5 opacity-80">
                <Icon className="w-10 h-10" />
              </div>
              <h3 className="font-orbitron font-semibold text-white text-lg mb-2">{title}</h3>
              <div className="font-bold text-base mb-2">{value}</div>
              <p className="text-slate-400 text-sm mb-5">{sub}</p>
              {href ? (
                <a href={href}
                  className={`inline-block px-6 py-2.5 rounded-md text-sm font-orbitron font-semibold border transition-all hover:opacity-80 ${colorMap[color].split(' ')[2]} border-current bg-current/10`}>
                  {action}
                </a>
              ) : (
                <button type="button" onClick={openChat}
                  className={`inline-block px-6 py-2.5 rounded-md text-sm font-orbitron font-semibold border transition-all hover:opacity-80 ${colorMap[color].split(' ')[2]} border-current bg-current/10`}>
                  {action}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 hex-pattern opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
          <div className="relative p-10 md:p-16">
            <div className="text-center mb-10">
              <h2 className="font-orbitron font-bold text-3xl text-white mb-2">SEND US MESSAGE</h2>
              <p className="text-slate-400">Fill out the form below to contact our team. We'll get back to you as soon as possible.</p>
            </div>

            {success && (
              <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-green-400 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Message sent! We'll respond shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Full Name *</label>
                <input type="text" required placeholder="Full Name" className="cyber-input"
                  value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Email Address *</label>
                <input type="email" required placeholder="john.doe@email.com" className="cyber-input"
                  value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-2">Subject *</label>
                <input type="text" required placeholder="Subject" className="cyber-input"
                  value={form.subject} onChange={e => update('subject', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-2">Message *</label>
                <textarea required rows={5} placeholder="Tell us how we can help you..." className="cyber-input resize-none"
                  value={form.message} onChange={e => update('message', e.target.value)} />
              </div>
              <div className="md:col-span-2 text-center">
                <button type="submit" disabled={loading}
                  className="btn-cyber px-10 py-4 text-base inline-flex items-center gap-2 disabled:opacity-50">
                  {loading ? <div className="cyber-spinner w-5 h-5" /> : <><Send className="w-4 h-4" /> Send Message →</>}
                </button>
                <p className="text-slate-500 text-sm mt-3">We'll respond as soon as possible.</p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
