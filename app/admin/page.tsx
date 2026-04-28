'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import {
  Shield, Eye, CheckCircle, Clock, Search, X, RefreshCw,
  FileText, Users, BarChart3, Plus, Edit2, Trash2, Save,
  AlertTriangle, BookOpen, ChevronDown, ChevronUp, LogOut,
  MessageSquare, ToggleLeft, ToggleRight
} from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

type Report = {
  _id: string; reportId: string; harassmentType: string; platform: string
  date?: string; details: string; status: string; createdAt: string
  userName?: string; userEmail?: string; adminNotes?: string
}
type Article = {
  _id: string; slug: string; title: string; excerpt: string; content: string
  category: string; readTime: string; author: string; published: boolean
  tags: string[]; createdAt: string
}

const CATEGORIES = ['Guide','Safety','Privacy','Awareness','Protection','Mental Health','Legal','Tools']

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string,string> = {
    pending: 'badge-pending', reviewing: 'badge-reviewing', resolved: 'badge-resolved'
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-orbitron capitalize ${map[status] || map.pending}`}>
      {status}
    </span>
  )
}

export default function AdminPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [tab, setTab] = useState<'dashboard'|'reports'|'articles'|'contacts'>('dashboard')

  // Reports state
  const [reports, setReports] = useState<Report[]>([])
  const [rLoading, setRLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [rSearch, setRSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState('')

  // Articles state
  const [articles, setArticles] = useState<Article[]>([])
  const [aLoading, setALoading] = useState(false)
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [articleForm, setArticleForm] = useState({
    title:'', excerpt:'', content:'', category:'Guide',
    readTime:'5 min read', author:'CyberShield Team', published:true, tags:''
  })
  const [aSaving, setASaving] = useState(false)

  // Contacts state
  const [contacts, setContacts] = useState<any[]>([])
  const [cLoading, setCLoading] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) { router.push('/login'); return }
    if (user?.role === 'admin') { fetchReports(); fetchArticles() }
  }, [user, loading])

  const fetchReports = useCallback(async () => {
    setRLoading(true)
    try {
      const res = await fetch('/api/reports')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to load reports')
      setReports(data.reports || [])
    } catch (err: any) {
      setReports([])
      toast.error('Reports unavailable', err.message || 'Failed to load reports')
    }
    finally { setRLoading(false) }
  }, [toast])

  const fetchArticles = useCallback(async () => {
    setALoading(true)
    try {
      const res = await fetch('/api/admin/articles')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to load articles')
      setArticles(data.articles || [])
    } catch (err: any) {
      setArticles([])
      toast.error('Articles unavailable', err.message || 'Failed to load articles')
    }
    finally { setALoading(false) }
  }, [toast])

  const fetchContacts = useCallback(async () => {
    setCLoading(true)
    try {
      const res = await fetch('/api/contact')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to load contact messages')
      setContacts(data.messages || [])
    } catch (err: any) {
      setContacts([])
      toast.error('Messages unavailable', err.message || 'Failed to load contact messages')
    }
    finally { setCLoading(false) }
  }, [toast])

  useEffect(() => { if (tab === 'contacts') fetchContacts() }, [tab])

  const handleLogout = async () => {
    await logout()
    toast.info('Logged out', 'You have been signed out.')
  }

  const updateReportStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: noteInput }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to update report')
      setReports(prev => prev.map(r => r._id === id ? { ...r, status, adminNotes: noteInput } : r))
      if (selectedReport?._id === id) setSelectedReport(prev => prev ? { ...prev, status, adminNotes: noteInput } : null)
      toast.success('Report updated', `Status changed to ${status}.`)
    } catch (err: any) {
      toast.error('Update failed', err.message || 'Failed to update report')
    }
    finally { setUpdating(null) }
  }

  const openArticleForm = (a?: Article) => {
    if (a) {
      setEditingArticle(a)
      setArticleForm({
        title: a.title, excerpt: a.excerpt, content: a.content,
        category: a.category, readTime: a.readTime, author: a.author,
        published: a.published, tags: a.tags.join(', ')
      })
    } else {
      setEditingArticle(null)
      setArticleForm({ title:'', excerpt:'', content:'', category:'Guide', readTime:'5 min read', author:'CyberShield Team', published:true, tags:'' })
    }
    setShowArticleForm(true)
  }

  const saveArticle = async () => {
    if (!articleForm.title || !articleForm.excerpt || !articleForm.content) {
      toast.error('Missing article fields', 'Title, excerpt and content are required.')
      return
    }
    setASaving(true)
    try {
      const payload = { ...articleForm, tags: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean) }
      const url = editingArticle ? `/api/admin/articles/${editingArticle._id}` : '/api/admin/articles'
      const method = editingArticle ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to save article')
      await fetchArticles()
      setShowArticleForm(false)
      toast.success(editingArticle ? 'Article updated' : 'Article created', articleForm.published ? 'Published successfully.' : 'Saved as draft.')
    } catch (err: any) {
      toast.error('Save failed', err.message || 'Failed to save article')
    }
    finally { setASaving(false) }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to delete article')
      setArticles(prev => prev.filter(a => a._id !== id))
      toast.success('Article deleted', 'The article has been removed.')
    } catch (err: any) {
      toast.error('Delete failed', err.message || 'Failed to delete article')
    }
  }

  const togglePublish = async (a: Article) => {
    try {
      const res = await fetch(`/api/admin/articles/${a._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !a.published }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to update publish status')
      setArticles(prev => prev.map(x => x._id === a._id ? { ...x, published: !x.published } : x))
      toast.success(!a.published ? 'Article published' : 'Article unpublished')
    } catch (err: any) {
      toast.error('Publish update failed', err.message || 'Failed to update publish status')
    }
  }

  const filteredReports = reports.filter(r => {
    const ms = statusFilter === 'all' || r.status === statusFilter
    const mq = !rSearch || r.harassmentType?.toLowerCase().includes(rSearch.toLowerCase()) ||
      r.platform?.toLowerCase().includes(rSearch.toLowerCase()) ||
      r.reportId?.toLowerCase().includes(rSearch.toLowerCase()) ||
      r.userName?.toLowerCase().includes(rSearch.toLowerCase())
    return ms && mq
  })

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    articles: articles.length,
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="cyber-spinner" />
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-navy-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-navy-900 border-r border-cyan-500/15 flex flex-col fixed top-16 left-0 bottom-0 z-40 overflow-y-auto">
          <div className="p-5 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-orbitron font-bold text-cyan-400">
                A
              </div>
              <div>
                <div className="text-white text-sm font-semibold">Administrator</div>
                <div className="text-slate-500 text-xs">admin123@gmail.com</div>
              </div>
            </div>
          </div>

          <nav className="p-3 flex-1 space-y-1">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'reports', icon: FileText, label: 'Reports', badge: stats.pending },
              { id: 'articles', icon: BookOpen, label: 'Articles', badge: stats.articles },
              { id: 'contacts', icon: MessageSquare, label: 'Contact Messages' },
            ].map(({ id, icon: Icon, label, badge }) => (
              <button key={id} onClick={() => setTab(id as any)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  tab === id ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </div>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-orbitron ${
                    id === 'reports' ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>{badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-slate-700/50">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 flex-1 overflow-y-auto p-6">

          {/* ─── DASHBOARD ─── */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-orbitron font-black text-2xl text-white mb-1">Dashboard</h1>
                <p className="text-slate-400 text-sm">Overview of CyberShield portal activity</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: 'Total Reports', value: stats.total, icon: FileText, color: 'cyan', onClick: () => setTab('reports') },
                  { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'orange', onClick: () => { setTab('reports'); setStatusFilter('pending') } },
                  { label: 'Under Review', value: stats.reviewing, icon: Eye, color: 'blue', onClick: () => { setTab('reports'); setStatusFilter('reviewing') } },
                  { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'green', onClick: () => { setTab('reports'); setStatusFilter('resolved') } },
                ].map(({ label, value, icon: Icon, color, onClick }) => (
                  <button key={label} onClick={onClick}
                    className="cyber-card rounded-xl p-5 border border-cyan-500/15 text-left hover:border-cyan-400/40 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400 text-xs">{label}</span>
                      <Icon className={`w-5 h-5 text-${color}-400 group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className={`font-orbitron font-black text-3xl text-${color}-400`}>{value}</div>
                  </button>
                ))}
              </div>

              {/* Recent reports */}
              <div className="cyber-card rounded-xl border border-cyan-500/15 overflow-hidden">
                <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
                  <h2 className="font-orbitron font-semibold text-white">Recent Reports</h2>
                  <button onClick={() => setTab('reports')} className="text-cyan-400 text-xs hover:underline">View all</button>
                </div>
                <div className="divide-y divide-slate-700/30">
                  {reports.slice(0, 5).map(r => (
                    <div key={r._id} className="flex items-center justify-between p-4 hover:bg-white/2 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-orbitron text-cyan-400 text-xs">{r.reportId}</span>
                          <StatusBadge status={r.status} />
                        </div>
                        <div className="text-white text-sm">{r.harassmentType}</div>
                        <div className="text-slate-500 text-xs">{r.userName || 'Anonymous'} · {r.platform}</div>
                      </div>
                      <div className="text-slate-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {reports.length === 0 && <div className="p-8 text-center text-slate-500">No reports yet</div>}
                </div>
              </div>

              {/* Quick article stats */}
              <div className="cyber-card rounded-xl border border-cyan-500/15 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-orbitron font-semibold text-white">Articles</h2>
                  <button onClick={() => setTab('articles')} className="text-cyan-400 text-xs hover:underline">Manage</button>
                </div>
                <div className="flex gap-6">
                  <div><div className="font-orbitron font-bold text-2xl text-cyan-400">{articles.length}</div><div className="text-slate-400 text-xs">Total</div></div>
                  <div><div className="font-orbitron font-bold text-2xl text-green-400">{articles.filter(a=>a.published).length}</div><div className="text-slate-400 text-xs">Published</div></div>
                  <div><div className="font-orbitron font-bold text-2xl text-orange-400">{articles.filter(a=>!a.published).length}</div><div className="text-slate-400 text-xs">Drafts</div></div>
                </div>
              </div>
            </div>
          )}

          {/* ─── REPORTS ─── */}
          {tab === 'reports' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-orbitron font-black text-2xl text-white mb-1">Harassment Reports</h1>
                  <p className="text-slate-400 text-sm">Review and manage submitted reports</p>
                </div>
                <button onClick={fetchReports} className="btn-outline flex items-center gap-2 px-4 py-2 text-sm rounded-lg">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input placeholder="Search by ID, type, platform, user..." className="cyber-input pl-10 text-sm"
                    value={rSearch} onChange={e => setRSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all','pending','reviewing','resolved'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-orbitron tracking-wide border transition-all capitalize ${
                        statusFilter === s ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-400' : 'border-slate-700 text-slate-400 hover:border-cyan-500/30'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-5">
                {/* Table */}
                <div className="flex-1 cyber-card rounded-xl border border-cyan-500/15 overflow-hidden min-w-0">
                  {rLoading ? (
                    <div className="flex items-center justify-center py-20"><div className="cyber-spinner" /></div>
                  ) : filteredReports.length === 0 ? (
                    <div className="py-16 text-center"><FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" /><p className="text-slate-500">No reports found</p></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full admin-table">
                        <thead>
                          <tr>
                            <th className="text-left">Report ID</th>
                            <th className="text-left">Type</th>
                            <th className="text-left">User</th>
                            <th className="text-left">Platform</th>
                            <th className="text-left">Status</th>
                            <th className="text-left">Date</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReports.map(r => (
                            <tr key={r._id} onClick={() => { setSelectedReport(r); setNoteInput(r.adminNotes || '') }}
                              className={`cursor-pointer transition-colors ${selectedReport?._id === r._id ? 'bg-cyan-500/5' : ''}`}>
                              <td className="font-orbitron text-cyan-400 text-xs">{r.reportId}</td>
                              <td className="text-sm max-w-[140px] truncate">{r.harassmentType}</td>
                              <td className="text-xs text-slate-400 max-w-[100px] truncate">{r.userName || 'Anonymous'}</td>
                              <td className="text-sm">{r.platform}</td>
                              <td><StatusBadge status={r.status} /></td>
                              <td className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                              <td><button className="text-slate-500 hover:text-cyan-400 p-1"><Eye className="w-4 h-4" /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Detail Panel */}
                {selectedReport && (
                  <div className="w-80 shrink-0">
                    <div className="cyber-card rounded-xl border border-cyan-500/15 overflow-hidden sticky top-0">
                      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                        <h3 className="font-orbitron font-semibold text-white text-sm">Report Detail</h3>
                        <button onClick={() => setSelectedReport(null)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
                        <div><div className="text-slate-500 text-xs font-orbitron mb-1">REPORT ID</div><div className="text-cyan-400 font-orbitron text-sm font-bold">{selectedReport.reportId}</div></div>
                        <div><div className="text-slate-500 text-xs font-orbitron mb-1">SUBMITTED BY</div><div className="text-white text-sm">{selectedReport.userName || 'Anonymous'}</div>{selectedReport.userEmail && <div className="text-slate-400 text-xs">{selectedReport.userEmail}</div>}</div>
                        <div><div className="text-slate-500 text-xs font-orbitron mb-1">TYPE</div><div className="text-white text-sm">{selectedReport.harassmentType}</div></div>
                        <div><div className="text-slate-500 text-xs font-orbitron mb-1">PLATFORM</div><div className="text-white text-sm">{selectedReport.platform}</div></div>
                        {selectedReport.date && <div><div className="text-slate-500 text-xs font-orbitron mb-1">INCIDENT DATE</div><div className="text-white text-sm">{selectedReport.date}</div></div>}
                        <div>
                          <div className="text-slate-500 text-xs font-orbitron mb-1">DETAILS</div>
                          <div className="bg-navy-900/80 rounded-lg p-3 text-slate-300 text-xs leading-relaxed max-h-32 overflow-y-auto border border-slate-700/40">{selectedReport.details}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs font-orbitron mb-2">ADMIN NOTES</div>
                          <textarea rows={3} value={noteInput} onChange={e => setNoteInput(e.target.value)}
                            placeholder="Add internal notes..." className="cyber-input text-xs resize-none" />
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs font-orbitron mb-2">UPDATE STATUS</div>
                          <div className="space-y-2">
                            {[
                              { s: 'pending', icon: <Clock className="w-3 h-3" />, label: 'Mark Pending' },
                              { s: 'reviewing', icon: <Eye className="w-3 h-3" />, label: 'Mark Reviewing' },
                              { s: 'resolved', icon: <CheckCircle className="w-3 h-3" />, label: 'Mark Resolved' },
                            ].map(({ s, icon, label }) => (
                              <button key={s} disabled={updating === selectedReport._id}
                                onClick={() => updateReportStatus(selectedReport._id, s)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-orbitron border transition-all ${
                                  selectedReport.status === s
                                    ? s === 'resolved' ? 'badge-resolved' : s === 'reviewing' ? 'badge-reviewing' : 'badge-pending'
                                    : 'border-slate-700 text-slate-400 hover:border-cyan-500/40 hover:text-white'
                                } disabled:opacity-50`}>
                                {icon} {label} {selectedReport.status === s && '✓'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── ARTICLES ─── */}
          {tab === 'articles' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-orbitron font-black text-2xl text-white mb-1">Articles</h1>
                  <p className="text-slate-400 text-sm">Create, edit and manage all portal articles</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={fetchArticles} className="btn-outline flex items-center gap-2 px-4 py-2 text-sm rounded-lg">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button onClick={() => openArticleForm()} className="btn-cyber flex items-center gap-2 px-5 py-2 text-sm rounded-lg">
                    <Plus className="w-4 h-4" /> New Article
                  </button>
                </div>
              </div>

              {aLoading ? (
                <div className="flex items-center justify-center py-20"><div className="cyber-spinner" /></div>
              ) : (
                <div className="space-y-3">
                  {articles.map(a => (
                    <div key={a._id} className="cyber-card rounded-xl border border-cyan-500/15 p-5 flex items-start gap-4 hover:border-cyan-400/30 transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <span className="text-xs px-2.5 py-0.5 rounded-full border border-cyan-500/20 text-cyan-400 font-orbitron">{a.category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-orbitron ${a.published ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-orange-400 bg-orange-500/10 border border-orange-500/20'}`}>
                            {a.published ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-slate-500 text-xs">{a.readTime}</span>
                        </div>
                        <h3 className="font-orbitron font-semibold text-white text-base mb-1">{a.title}</h3>
                        <p className="text-slate-400 text-sm line-clamp-2">{a.excerpt}</p>
                        <div className="text-slate-600 text-xs mt-2">By {a.author} · {new Date(a.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => togglePublish(a)} title={a.published ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-lg border transition-all ${a.published ? 'border-green-500/30 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' : 'border-orange-500/30 text-orange-400 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'}`}>
                          {a.published ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openArticleForm(a)}
                          className="p-2 rounded-lg border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteArticle(a._id)}
                          className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {articles.length === 0 && (
                    <div className="cyber-card rounded-xl border border-cyan-500/15 p-16 text-center">
                      <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 mb-4">No articles yet</p>
                      <button onClick={() => openArticleForm()} className="btn-cyber px-6 py-2 rounded-lg text-sm">Create First Article</button>
                    </div>
                  )}
                </div>
              )}

              {/* Article Form Modal */}
              {showArticleForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
                  <div className="cyber-card w-full max-w-2xl rounded-2xl border border-cyan-500/25 shadow-2xl">
                    <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                      <h2 className="font-orbitron font-bold text-xl text-white">
                        {editingArticle ? 'Edit Article' : 'New Article'}
                      </h2>
                      <button onClick={() => setShowArticleForm(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-xs font-orbitron tracking-wide">TITLE *</label>
                        <input className="cyber-input" placeholder="Article title..." value={articleForm.title}
                          onChange={e => setArticleForm(p => ({ ...p, title: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-slate-400 text-xs font-orbitron tracking-wide">CATEGORY</label>
                          <select className="cyber-input" value={articleForm.category}
                            onChange={e => setArticleForm(p => ({ ...p, category: e.target.value }))}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-slate-400 text-xs font-orbitron tracking-wide">READ TIME</label>
                          <input className="cyber-input" placeholder="5 min read" value={articleForm.readTime}
                            onChange={e => setArticleForm(p => ({ ...p, readTime: e.target.value }))} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-xs font-orbitron tracking-wide">AUTHOR</label>
                        <input className="cyber-input" placeholder="CyberShield Team" value={articleForm.author}
                          onChange={e => setArticleForm(p => ({ ...p, author: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-xs font-orbitron tracking-wide">EXCERPT *</label>
                        <textarea rows={2} className="cyber-input resize-none" placeholder="Short summary..."
                          value={articleForm.excerpt} onChange={e => setArticleForm(p => ({ ...p, excerpt: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-xs font-orbitron tracking-wide">CONTENT * (use **bold** for headings)</label>
                        <textarea rows={10} className="cyber-input resize-none font-mono text-sm" placeholder="Write article content here...&#10;Use **Heading** for bold headings.&#10;Use regular text for paragraphs.&#10;Separate sections with blank lines."
                          value={articleForm.content} onChange={e => setArticleForm(p => ({ ...p, content: e.target.value }))} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-xs font-orbitron tracking-wide">TAGS (comma separated)</label>
                        <input className="cyber-input" placeholder="safety, tips, harassment" value={articleForm.tags}
                          onChange={e => setArticleForm(p => ({ ...p, tags: e.target.value }))} />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" className="w-4 h-4 accent-cyan-500" checked={articleForm.published}
                          onChange={e => setArticleForm(p => ({ ...p, published: e.target.checked }))} />
                        <span className="text-slate-300 text-sm">Publish immediately (uncheck to save as draft)</span>
                      </label>
                    </div>
                    <div className="p-6 border-t border-slate-700/50 flex gap-3">
                      <button onClick={() => setShowArticleForm(false)} className="btn-outline flex-1 py-2.5 rounded-lg text-sm">Cancel</button>
                      <button onClick={saveArticle} disabled={aSaving}
                        className="btn-cyber flex-1 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                        {aSaving ? <div className="cyber-spinner w-4 h-4" /> : <><Save className="w-4 h-4" /> {editingArticle ? 'Save Changes' : 'Publish Article'}</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── CONTACTS ─── */}
          {tab === 'contacts' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-orbitron font-black text-2xl text-white mb-1">Contact Messages</h1>
                  <p className="text-slate-400 text-sm">Messages submitted via the Contact Us page</p>
                </div>
                <button onClick={fetchContacts} className="btn-outline flex items-center gap-2 px-4 py-2 text-sm rounded-lg">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>
              {cLoading ? (
                <div className="flex items-center justify-center py-20"><div className="cyber-spinner" /></div>
              ) : contacts.length === 0 ? (
                <div className="cyber-card rounded-xl border border-cyan-500/15 p-16 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">No contact messages yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((c: any) => (
                    <div key={c._id} className="cyber-card rounded-xl border border-cyan-500/15 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-medium">{c.name}</span>
                            <span className="text-slate-500 text-xs">·</span>
                            <a href={`mailto:${c.email}`} className="text-cyan-400 text-sm hover:underline">{c.email}</a>
                          </div>
                          <div className="text-orange-400 font-semibold text-sm mb-2">{c.subject}</div>
                          <p className="text-slate-300 text-sm leading-relaxed">{c.message}</p>
                        </div>
                        <div className="text-slate-500 text-xs shrink-0">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
