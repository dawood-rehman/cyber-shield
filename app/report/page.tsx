'use client'
import { useState, useEffect } from 'react'
import { Shield, Upload, AlertCircle, CheckCircle, X, Lock } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastProvider'

const harassmentTypes = [
  'Cyberbullying','Online Stalking','Identity Theft','Phishing Attack',
  'Sexual Harassment','Doxxing (Privacy Violation)','Hate Speech',
  'Account Hacking','Impersonation','Revenge Porn','Ransomware',
  'Blackmail/Extortion','Misinformation Spreading','Other',
]

export default function ReportPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reportId, setReportId] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({ harassmentType: '', platform: '', date: '', details: '' })
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="cyber-spinner" />
    </div>
  )

  if (!user) return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4">
      <div className="cyber-card rounded-2xl p-12 border border-orange-500/20 text-center max-w-lg w-full">
        <Lock className="w-20 h-20 text-orange-400 mx-auto mb-6" />
        <h2 className="font-orbitron font-bold text-2xl text-white mb-3">Login Required</h2>
        <p className="text-slate-400 mb-6 leading-relaxed">
          You need to be logged in to submit a harassment report. Login lets you track your report status and receive updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login?redirect=/report" className="btn-cyber px-8 py-3 rounded-lg text-center">Login to Report</Link>
          <Link href="/signup" className="btn-outline px-8 py-3 rounded-lg text-center">Create Account</Link>
        </div>
        <p className="text-slate-500 text-sm mt-6">You can still browse all resources without an account.</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4">
      <div className="cyber-card rounded-2xl p-12 border border-green-500/30 text-center max-w-lg w-full">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h2 className="font-orbitron font-bold text-2xl text-white mb-3">Report Submitted!</h2>
        <p className="text-slate-300 mb-3">Your report has been received and encrypted. Our team will review it shortly.</p>
        {reportId && (
          <div className="bg-navy-900 rounded-lg p-4 mb-6 border border-cyan-500/20">
            <div className="text-slate-400 text-xs mb-1">Your Report ID (save this)</div>
            <div className="font-orbitron text-cyan-400 text-lg font-bold">{reportId}</div>
          </div>
        )}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mb-6 text-sm text-slate-300">
          <Shield className="w-5 h-5 text-cyan-400 inline mr-2" />
          You can track this report's status in your account dashboard.
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/my-reports" className="btn-cyber px-6 py-3 rounded-lg text-center">Track My Reports</Link>
          <button onClick={() => { setSubmitted(false); setStep(1); setForm({ harassmentType:'', platform:'', date:'', details:'' }); setFiles([]) }}
            className="btn-outline px-6 py-3 rounded-lg">Submit Another</button>
        </div>
      </div>
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      files.forEach(f => fd.append('evidence', f))
      const res = await fetch('/api/reports', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to submit report. Please try again.')
      setReportId(data.reportId)
      setSubmitted(true)
      toast.success('Report submitted', data.reportId ? `Report ID: ${data.reportId}` : 'Your report has been received.')
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit report. Please try again.')
      toast.error('Submission failed', err.message || 'Failed to submit report. Please try again.')
    }
    finally { setSubmitting(false) }
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4 text-xs font-orbitron text-orange-400 tracking-wider">
            <AlertCircle className="w-4 h-4" /> SECURE REPORTING
          </div>
          <h1 className="font-orbitron font-black text-3xl lg:text-5xl text-white mb-4">
            HARASSMENT <span className="text-orange-400">REPORT FORM</span>
          </h1>
          <p className="text-slate-400">
            Logged in as <span className="text-cyan-400 font-medium">{user.name}</span> — your report is encrypted and protected.
          </p>
        </div>
      </section>

      <section className="py-10 max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mb-8 text-sm text-slate-300">
          <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
          <div><strong className="text-cyan-400">Your privacy is protected.</strong> All reports are encrypted and reviewed only by trained support staff. You can track this report in your account.</div>
        </div>

        {/* Progress */}
        <div className="flex gap-3 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-orange-400' : 'bg-slate-700'}`} />
              <div className={`text-xs mt-1 font-orbitron ${step >= s ? 'text-orange-400' : 'text-slate-600'}`}>
                {s === 1 ? 'Incident Info' : s === 2 ? 'Details' : 'Evidence'}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="cyber-card rounded-2xl border border-cyan-500/20 overflow-hidden">
          {submitError && (
            <div className="m-6 mb-0 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <div>
                <div className="font-semibold text-red-100">Submission failed</div>
                <div className="text-red-200/90">{submitError}</div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center font-orbitron font-bold text-orange-400 text-sm">1</div>
                <h2 className="font-orbitron font-semibold text-white text-lg">Incident Information</h2>
              </div>
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-medium tracking-wide">TYPE OF HARASSMENT *</label>
                  <select required value={form.harassmentType} onChange={e => update('harassmentType', e.target.value)} className="cyber-input">
                    <option value="">Select Harassment Type</option>
                    {harassmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-medium tracking-wide">PLATFORM WHERE IT HAPPENED *</label>
                  <input type="text" required placeholder="e.g., Facebook, Instagram, WhatsApp, Email..." className="cyber-input"
                    value={form.platform} onChange={e => update('platform', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-medium tracking-wide">DATE OF INCIDENT</label>
                  <input type="date" className="cyber-input" value={form.date} onChange={e => update('date', e.target.value)} />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} disabled={!form.harassmentType || !form.platform}
                className="btn-cyber mt-8 w-full py-3 rounded-lg disabled:opacity-40">Continue to Details →</button>
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center font-orbitron font-bold text-orange-400 text-sm">2</div>
                <h2 className="font-orbitron font-semibold text-white text-lg">Describe the Incident</h2>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-medium tracking-wide">INCIDENT DETAILS *</label>
                <textarea required rows={7} placeholder="What happened? How often? Any threats? Who was involved? Please be as detailed as possible..."
                  className="cyber-input resize-none" value={form.details} onChange={e => update('details', e.target.value)} />
                <div className="text-slate-500 text-xs">{form.details.length} characters</div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 py-3 rounded-lg">← Back</button>
                <button type="button" onClick={() => setStep(3)} disabled={form.details.length < 10}
                  className="btn-cyber flex-1 py-3 rounded-lg disabled:opacity-40">Continue to Evidence →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center font-orbitron font-bold text-orange-400 text-sm">3</div>
                <h2 className="font-orbitron font-semibold text-white text-lg">Upload Evidence (Optional)</h2>
              </div>
              <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-400/60 transition-colors mb-5">
                <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                <p className="text-slate-300 mb-2 font-medium">Attach Files</p>
                <p className="text-slate-500 text-xs mb-4">Screenshots, links, files. PNG, JPG, PDF (Max 10MB each)</p>
                <input type="file" multiple accept=".png,.jpg,.jpeg,.pdf,.txt" onChange={e => e.target.files && setFiles(Array.from(e.target.files))} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="btn-outline cursor-pointer px-6 py-2 text-sm inline-block rounded-lg">Choose Files</label>
              </div>
              {files.length > 0 && (
                <div className="space-y-2 mb-5">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-4 py-2">
                      <span className="text-slate-300 text-sm truncate">{f.name}</span>
                      <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 ml-2">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1 py-3 rounded-lg">← Back</button>
                <button type="submit" disabled={submitting}
                  className="btn-cyber flex-1 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting ? <><div className="cyber-spinner w-5 h-5" /> Submitting...</> : '🛡️ Submit Report'}
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </div>
  )
}
