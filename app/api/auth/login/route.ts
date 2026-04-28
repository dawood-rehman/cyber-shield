import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin123@gmail.com'
const ADMIN_PASSWORD = '87654321'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    // Check hardcoded admin first
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { userId: 'admin-hardcoded', email: ADMIN_EMAIL, role: 'admin', name: 'Administrator' },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      const response = NextResponse.json({ message: 'Login successful', role: 'admin', name: 'Administrator' })
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      return response
    }

    // Regular user from DB
    await connectDB()
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role, name: user.name, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({ message: 'Login successful', role: user.role, name: user.name })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 })
  }
}
