'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Clock, Eye, CheckCircle, AlertCircle, Lock, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

type Report = {
  _id: string; reportId: string; harassmentType: string; platform: string
  date?: string; details: string; status: string; createdAt: string; adminNotes?: string
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
    pending: { cls: 'badge-pending', icon: <Clock className="w-3 h-3" />, label: 'Pending Review' },
    reviewing: { cls: 'badge-reviewing', icon: <Eye className="w-3 h-3" />, label: 'Under Review' },
    resolved: { cls: 'badge-resolved', icon: <CheckCircle className="w-3 h-3" />, label: 'Resolved' },
  }
  const s = map[status] || map.pending
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-orbitron font-medium ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  )
}

export default function MyReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) { router.push('/login?redirect=/my-reports'); return }
    if (!loading && user?.role === 'admin') { router.push('/admin'); return }
    if (user) fetchMyReports()
  }, [user, loading])

  const fetchMyReports = async () => {
    setFetching(true)
    setError('')
    try {
      const res = await fetch('/api/reports/my')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Could not load your reports.')
      setReports(data.reports || [])
    } catch (err: any) {
      setReports([])
      setError(err.message || 'Could not load your reports.')
      toast.error('Reports unavailable', err.message || 'Could not load your reports.')
    }
    finally { setFetching(false) }
  }

  if (loading || fetching) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="cyber-spinner" />
    </div>
  )

  return (
    <div className="pt-20 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-orbitron font-black text-3xl lg:text-4xl text-white mb-2">
                MY <span className="text-cyan-400">REPORTS</span>
              </h1>
              <p className="text-slate-400">Track all your submitted harassment reports and their status.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={fetchMyReports} className="btn-outline flex items-center gap-2 px-4 py-2 text-sm rounded-lg">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <Link href="/report" className="btn-cyber flex items-center gap-2 px-4 py-2 text-sm rounded-lg">
                + New Report
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error ? (
          <div className="cyber-card rounded-2xl border border-red-500/30 p-10 text-center">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h3 className="font-orbitron font-bold text-xl text-white mb-2">Could not load reports</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <button onClick={fetchMyReports} className="btn-outline inline-flex items-center gap-2 px-6 py-3 rounded-lg">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="cyber-card rounded-2xl border border-cyan-500/20 p-16 text-center">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="font-orbitron font-bold text-xl text-white mb-2">No Reports Yet</h3>
            <p className="text-slate-400 mb-6">You haven't submitted any harassment reports. If you're experiencing harassment, report it now.</p>
            <Link href="/report" className="btn-cyber px-8 py-3 rounded-lg inline-block">Submit Your First Report</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Submitted', value: reports.length, color: 'cyan' },
                { label: 'Under Review', value: reports.filter(r => r.status === 'reviewing').length, color: 'blue' },
                { label: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, color: 'green' },
              ].map(({ label, value, color }) => (
                <div key={label} className="cyber-card rounded-xl p-5 border border-cyan-500/20 text-center">
                  <div className={`font-orbitron font-black text-3xl text-${color}-400 mb-1`}>{value}</div>
                  <div className="text-slate-400 text-sm">{label}</div>
                </div>
              ))}
            </div>

            {/* Report cards */}
            {reports.map(r => (
              <div key={r._id} className="cyber-card rounded-xl border border-cyan-500/20 overflow-hidden transition-all">
                <div className="p-5 flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === r._id ? null : r._id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-orbitron text-cyan-400 text-sm font-bold">{r.reportId}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="text-white font-medium">{r.harassmentType}</div>
                    <div className="text-slate-400 text-sm mt-1">Platform: {r.platform} • Submitted: {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button className="text-slate-500 hover:text-cyan-400 transition-colors shrink-0 mt-1">
                    {expanded === r._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {expanded === r._id && (
                  <div className="px-5 pb-5 border-t border-slate-700/50 pt-4">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-slate-500 text-xs font-orbitron mb-1">INCIDENT DATE</div>
                        <div className="text-slate-300 text-sm">{r.date || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs font-orbitron mb-1">CURRENT STATUS</div>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs font-orbitron mb-2">INCIDENT DETAILS</div>
                      <div className="bg-navy-900/60 rounded-lg p-4 text-slate-300 text-sm leading-relaxed border border-slate-700/50 max-h-36 overflow-y-auto">
                        {r.details}
                      </div>
                    </div>
                    {r.adminNotes?.trim() && (
                      <div className="mt-4">
                        <div className="text-slate-500 text-xs font-orbitron mb-2">ADMIN NOTE</div>
                        <div className="bg-cyan-500/10 rounded-lg p-4 text-slate-200 text-sm leading-relaxed border border-cyan-500/30">
                          {r.adminNotes}
                        </div>
                      </div>
                    )}

                    {/* Status timeline */}
                    <div className="mt-4 pt-4 border-t border-slate-700/30">
                      <div className="text-slate-500 text-xs font-orbitron mb-3">STATUS TIMELINE</div>
                      <div className="flex items-center gap-2">
                        {['pending','reviewing','resolved'].map((s, i) => (
                          <div key={s} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              r.status === 'resolved' ? 'bg-green-400' :
                              r.status === 'reviewing' && i <= 1 ? 'bg-blue-400' :
                              r.status === 'pending' && i === 0 ? 'bg-orange-400' : 'bg-slate-700'
                            }`} />
                            <span className={`text-xs capitalize ${
                              (r.status === 'resolved') || (r.status === 'reviewing' && i <= 1) || (r.status === 'pending' && i === 0)
                                ? 'text-slate-300' : 'text-slate-600'
                            }`}>{s}</span>
                            {i < 2 && <div className={`w-8 h-px ${
                              (r.status === 'resolved') || (r.status === 'reviewing' && i < 1) ? 'bg-blue-400' : 'bg-slate-700'
                            }`} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
