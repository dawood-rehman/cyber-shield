import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Contact from '@/lib/models/Contact'

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
    await connectDB()
    const messages = await Contact.find().sort({ createdAt: -1 }).lean().maxTimeMS(5000)
    return NextResponse.json({ messages })
  } catch (err) {
    console.error('GET /api/contact error:', err)
    return NextResponse.json({ message: 'Could not load messages. Please try again.' }, { status: 500 })
  }
}
