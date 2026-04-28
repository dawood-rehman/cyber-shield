import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

const ADMIN_EMAIL = 'admin123@gmail.com'

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json()
    if (!name || !email || !password)
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 400 })
    if (password.length < 8)
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 })
    if (email.toLowerCase() === ADMIN_EMAIL)
      return NextResponse.json({ message: 'This email is reserved' }, { status: 409 })

    await connectDB()
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing)
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 12)
    await User.create({ name, email: email.toLowerCase(), phone, password: hashed, role: 'user' })
    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 })
  }
}
