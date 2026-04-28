'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, BookOpen, Clock, RefreshCw, Search } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

type Article = {
  _id: string; slug: string; title: string; excerpt: string
  category: string; readTime: string; createdAt: string; published: boolean
}

const categoryColors: Record<string, string> = {
  Guide: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Safety: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Privacy: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Awareness: 'bg-green-500/10 text-green-400 border-green-500/20',
  Protection: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Mental Health': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Legal: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Tools: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
}

const CATEGORIES = ['All', 'Guide', 'Safety', 'Privacy', 'Awareness', 'Protection', 'Mental Health', 'Legal', 'Tools']

export default function ArticlesPage() {
  const toast = useToast()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const loadArticles = async (signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/articles', { signal })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Unable to load articles right now.')
      setArticles(data.articles || [])
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setArticles([])
      setError(err.message || 'Unable to load articles right now.')
      toast.error('Articles unavailable', err.message || 'Unable to load articles right now.')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadArticles(controller.signal)
    return () => controller.abort()
  }, [])

  const filtered = useMemo(() => articles.filter(a => {
    const q = search.trim().toLowerCase()
    const matchCat = activeCategory === 'All' || a.category === activeCategory
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    return matchCat && matchSearch
  }), [activeCategory, articles, search])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-5 text-xs font-orbitron text-cyan-400 tracking-wider">
            <BookOpen className="w-4 h-4" /> KNOWLEDGE BASE
          </div>
          <h1 className="font-orbitron font-black text-4xl lg:text-5xl text-white mb-4">
            CYBER SAFETY <span className="text-orange-400">GUIDES & ARTICLES</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
            Expert-written articles on digital safety, harassment response, and online protection.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input cyber-input-with-icon py-3 text-base"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-400'
                  : 'border-slate-700 text-slate-400 hover:border-cyan-500/30 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="cyber-spinner" />
          </div>
        ) : error ? (
          <div className="mx-auto max-w-lg rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
            <h3 className="font-orbitron text-lg text-white mb-2">Could not load articles</h3>
            <p className="text-slate-300 text-sm mb-4">{error}</p>
            <button onClick={() => loadArticles()} className="btn-outline inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm">
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="font-orbitron text-xl text-white mb-2">No articles found</h3>
            <p className="text-slate-400">
              {search ? `No results for "${search}"` : 'No articles in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(a => (
              <Link
                key={a._id}
                href={`/articles/${a.slug}`}
                className="cyber-card rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-400/50 group transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-orbitron tracking-wide ${categoryColors[a.category] || categoryColors.Guide}`}>
                    {a.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock className="w-3 h-3" /> {a.readTime}
                  </div>
                </div>
                <BookOpen className="w-10 h-10 text-cyan-400/40 mb-4" />
                <h3 className="font-orbitron font-semibold text-white text-base mb-3 group-hover:text-cyan-400 transition-colors leading-tight">
                  {a.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">{a.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                  <span className="text-slate-500 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
                  <span className="text-cyan-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
