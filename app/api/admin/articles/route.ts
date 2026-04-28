import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import Article from '@/lib/models/Article'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

function isAdmin(token?: string) {
  if (!token) return false
  try {
    const d = jwt.verify(token, JWT_SECRET) as any
    return d.role === 'admin'
  } catch { return false }
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET() {
  try {
    await connectDB()
    const articles = await Article.find().sort({ createdAt: -1 }).lean().maxTimeMS(5000)
    return NextResponse.json({ articles })
  } catch { return NextResponse.json({ message: 'Could not load articles. Please try again.' }, { status: 500 }) }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    if (!isAdmin(cookieStore.get('auth-token')?.value)) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }
    await connectDB()
    const body = await req.json()
    const { title, excerpt, content, category, readTime, author, published, tags, featuredImage } = body
    if (!title || !excerpt || !content) {
      return NextResponse.json({ message: 'Title, excerpt and content are required' }, { status: 400 })
    }
    let slug = slugify(title)
    const exists = await Article.findOne({ slug }).select('_id').lean().maxTimeMS(5000)
    if (exists) slug = `${slug}-${Date.now().toString(36)}`
    const article = await Article.create({ slug, title, excerpt, content, category, readTime, author, published, tags: tags || [], featuredImage })
    return NextResponse.json({ message: 'Article created', article }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Could not create article. Please try again.' }, { status: 500 })
  }
}
