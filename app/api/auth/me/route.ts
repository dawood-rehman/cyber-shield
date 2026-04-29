export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    if (!token) return NextResponse.json({ user: null })

    const decoded = jwt.verify(token, JWT_SECRET) as any
    return NextResponse.json({
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        phone: decoded.phone,
      }
    })
  } catch {
    const response = NextResponse.json({ user: null })
    response.cookies.set('auth-token', '', { httpOnly: true, maxAge: 0, path: '/' })
    return response
  }
}
