export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Article from '@/lib/models/Article'

export const revalidate = 60

const listFields = 'slug title excerpt category readTime createdAt published'
const detailFields = 'slug title excerpt content category readTime author createdAt tags published'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    await connectDB()
    if (slug) {
      const article = await Article.findOne({ slug, published: true })
        .select(detailFields)
        .lean()
        .maxTimeMS(5000)
      if (!article) return NextResponse.json({ message: 'Article not found' }, { status: 404 })
      return NextResponse.json({ article })
    }

    const articles = await Article.find({ published: true })
      .select(listFields)
      .sort({ createdAt: -1 })
      .lean()
      .maxTimeMS(5000)
    return NextResponse.json({ articles })
  } catch (err) {
    console.error('GET /api/articles error:', err)
    return NextResponse.json(
      { message: 'Articles are temporarily unavailable. Please try again.' },
      { status: 500 }
    )
  }
}
