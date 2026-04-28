import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import Article from '@/lib/models/Article'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

function isAdmin(token?: string) {
  if (!token) return false
  try { const d = jwt.verify(token, JWT_SECRET) as any; return d.role === 'admin' } catch { return false }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const article = await Article.findById(params.id).lean().maxTimeMS(5000)
    if (!article) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ article })
  } catch { return NextResponse.json({ message: 'Could not load article. Please try again.' }, { status: 500 }) }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    if (!isAdmin(cookieStore.get('auth-token')?.value))
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    await connectDB()
    const body = await req.json()
    const article = await Article.findByIdAndUpdate(params.id, body, { new: true }).lean().maxTimeMS(5000)
    if (!article) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ message: 'Article updated', article })
  } catch { return NextResponse.json({ message: 'Could not update article. Please try again.' }, { status: 500 }) }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    if (!isAdmin(cookieStore.get('auth-token')?.value))
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    await connectDB()
    await Article.findByIdAndDelete(params.id).maxTimeMS(5000)
    return NextResponse.json({ message: 'Article deleted' })
  } catch { return NextResponse.json({ message: 'Could not delete article. Please try again.' }, { status: 500 }) }
}
