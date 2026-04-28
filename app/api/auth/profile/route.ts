export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'
const ADMIN_EMAIL = 'admin123@gmail.com'
const ADMIN_PASSWORD = '87654321'

function decodeAuth() {
  const token = cookies().get('auth-token')?.value
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) as any } catch { return null }
}

function setAuthCookie(response: NextResponse, user: any) {
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

async function findCurrentUser(decoded: any) {
  if (decoded.userId && decoded.userId !== 'admin-hardcoded') {
    return User.findById(decoded.userId)
  }

  if (decoded.role === 'admin') {
    return User.findOne({ email: decoded.email?.toLowerCase() || ADMIN_EMAIL })
  }

  return null
}

export async function GET() {
  try {
    const decoded = decodeAuth()
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const user = await findCurrentUser(decoded)
    if (user) {
      return NextResponse.json({
        user: {
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
        },
      })
    }

    if (decoded.role === 'admin') {
      return NextResponse.json({
        user: {
          userId: decoded.userId,
          name: decoded.name || 'Administrator',
          email: decoded.email || ADMIN_EMAIL,
          phone: '',
          role: 'admin',
        },
      })
    }

    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  } catch (err) {
    console.error('GET /api/auth/profile error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const decoded = decodeAuth()
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { name, email, phone, currentPassword, newPassword } = await req.json()
    const nextName = String(name || '').trim()
    const nextEmail = String(email || '').trim().toLowerCase()
    const nextPhone = String(phone || '').trim()

    if (!nextName || !nextEmail) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 })
    }
    if (newPassword && String(newPassword).length < 8) {
      return NextResponse.json({ message: 'New password must be at least 8 characters' }, { status: 400 })
    }

    await connectDB()
    let user = await findCurrentUser(decoded)

    if (!user && decoded.role === 'admin') {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12)
      user = await User.create({
        name: decoded.name || 'Administrator',
        email: (decoded.email || ADMIN_EMAIL).toLowerCase(),
        password: hashed,
        role: 'admin',
      })
    }

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    const changingEmail = nextEmail !== user.email
    const changingPassword = Boolean(newPassword)
    if (changingEmail || changingPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Current password is required to change email or password' }, { status: 400 })
      }
      const validPassword = await bcrypt.compare(String(currentPassword), user.password)
      if (!validPassword) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 })
      }
    }

    if (changingEmail) {
      const existing = await User.findOne({ email: nextEmail, _id: { $ne: user._id } })
      if (existing) {
        return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 })
      }
    }

    user.name = nextName
    user.email = nextEmail
    user.phone = nextPhone || undefined
    if (newPassword) user.password = await bcrypt.hash(String(newPassword), 12)
    await user.save()

    const response = NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
      },
    })
    setAuthCookie(response, user)
    return response
  } catch (err) {
    console.error('PATCH /api/auth/profile error:', err)
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 })
  }
}
