import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import Contact from '@/lib/models/Contact'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

function getAuth(token?: string) {
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) as any } catch { return null }
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject) {
      return NextResponse.json({ message: 'Name, email and subject are required' }, { status: 400 })
    }

    await connectDB()
    await Contact.create({ name, email, subject, message: message || '' })

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/contact error:', err)
    return NextResponse.json({ message: 'Message could not be sent right now. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const decoded = getAuth(cookieStore.get('auth-token')?.value)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    await connectDB()
    const messages = await Contact.find().sort({ createdAt: -1 }).lean().maxTimeMS(5000)
    return NextResponse.json({ messages })
  } catch (err) {
    console.error('GET /api/contact error:', err)
    return NextResponse.json({ message: 'Could not load messages. Please try again.' }, { status: 500 })
  }
}
