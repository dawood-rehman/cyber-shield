'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Clock, Calendar, Shield, ArrowRight, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

type Article = {
  _id: string; slug: string; title: string; excerpt: string; content: string
  category: string; readTime: string; author: string; createdAt: string; tags: string[]
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

function renderContent(text: string) {
  return text.split('\n\n').map((para, i) => {
    if (!para.trim()) return null
    const trimmed = para.trim()
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.slice(2, -2).indexOf('**') === -1) {
      return <h3 key={i} className="font-orbitron font-semibold text-cyan-400 text-lg mt-8 mb-3">{trimmed.slice(2, -2)}</h3>
    }
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-slate-300 leading-relaxed mb-4">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="text-white font-semibold">{p.slice(2, -2)}</strong>
            : p
        )}
      </p>
    )
  })
}

export default function ArticleDetailPage() {
  const toast = useToast()
  const params = useParams()
  const slug = params?.slug as string
  const [article, setArticle] = useState<Article | null>(null)
  const [related, setRelated] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFoundState, setNotFoundState] = useState(false)

  const loadArticle = async (signal?: AbortSignal) => {
    if (!slug) return
    setLoading(true)
    setError('')
    setNotFoundState(false)
    try {
      const [articleRes, listRes] = await Promise.all([
        fetch(`/api/articles?slug=${encodeURIComponent(slug)}`, { signal }),
        fetch('/api/articles', { signal }),
      ])
      const articleData = await articleRes.json().catch(() => ({}))
      if (articleRes.status === 404) { setNotFoundState(true); return }
      if (!articleRes.ok) throw new Error(articleData.message || 'Unable to load this article right now.')

      const found = articleData.article as Article
      setArticle(found)

      if (listRes.ok) {
        const listData = await listRes.json().catch(() => ({}))
        const all: Article[] = listData.articles || []
        setRelated(all.filter(a => a.slug !== slug && a.category === found.category).slice(0, 3))
      } else {
        setRelated([])
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setError(err.message || 'Unable to load this article right now.')
      toast.error('Article unavailable', err.message || 'Unable to load this article right now.')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadArticle(controller.signal)
    return () => controller.abort()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="cyber-spinner" />
    </div>
  )

  if (notFoundState || !article) return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4">
      <div className="text-center">
        {error ? (
          <>
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="font-orbitron text-2xl text-white mb-3">Could not load article</h2>
            <p className="text-slate-400 mb-5 max-w-md">{error}</p>
            <button onClick={() => loadArticle()} className="btn-outline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </>
        ) : (
          <>
            <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="font-orbitron text-2xl text-white mb-3">Article Not Found</h2>
            <Link href="/articles" className="btn-cyber px-6 py-2.5 rounded-lg inline-block">Back to Articles</Link>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/articles" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        <div className="cyber-card rounded-2xl border border-cyan-500/20 overflow-hidden mb-10">
          <div className="p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className={`text-xs px-3 py-1 rounded-full border font-orbitron tracking-wide ${categoryColors[article.category] || categoryColors.Guide}`}>
                {article.category}
              </span>
              <span className="text-slate-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
              <span className="text-slate-500 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className="font-orbitron font-black text-2xl lg:text-4xl text-white mb-4 leading-tight">{article.title}</h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-6 border-l-4 border-cyan-500/50 pl-4">{article.excerpt}</p>
            <div className="text-slate-500 text-sm mb-8">By <span className="text-slate-300">{article.author}</span></div>
            <div className="h-px bg-gradient-to-r from-cyan-500/40 via-orange-500/40 to-transparent mb-8" />
            <div className="prose prose-invert max-w-none">
              {renderContent(article.content)}
            </div>
            {article.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="cyber-card rounded-xl border border-orange-500/20 p-8 text-center mb-10">
          <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h3 className="font-orbitron font-bold text-xl text-white mb-2">Need Immediate Help?</h3>
          <p className="text-slate-400 mb-4">If you're experiencing harassment right now, report it anonymously through our secure portal.</p>
          <Link href="/report" className="btn-cyber inline-flex items-center gap-2 px-8 py-3 rounded-lg">
            🚨 Report Harassment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-orbitron font-bold text-xl text-white mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map(a => (
                <Link key={a.slug} href={`/articles/${a.slug}`}
                  className="cyber-card rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-400/50 group transition-all">
                  <div className={`text-xs px-2 py-0.5 rounded-full border inline-block mb-3 font-orbitron ${categoryColors[a.category] || categoryColors.Guide}`}>{a.category}</div>
                  <h3 className="font-orbitron font-semibold text-white text-sm mb-2 group-hover:text-cyan-400 transition-colors leading-tight">{a.title}</h3>
                  <span className="text-cyan-400 text-xs flex items-center gap-1">Read <ArrowRight className="w-3 h-3" /></span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
