import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import jwt from 'jsonwebtoken'
import { authOptions, findOrCreateGoogleUser } from '@/lib/auth-options'

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield-secret-key-2026'

function getSafeRedirect(req: NextRequest) {
  const fallback = new URL('/', req.url)
  const redirect = req.nextUrl.searchParams.get('redirect')
  if (!redirect) return fallback

  try {
    const target = new URL(redirect, req.url)
    return target.origin === fallback.origin ? target : fallback
  } catch {
    return fallback
  }
}

export async function GET(req: NextRequest) {
  const redirectUrl = getSafeRedirect(req)
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('error', 'GoogleAuth')
    return NextResponse.redirect(loginUrl)
  }

  try {
    const user = await findOrCreateGoogleUser(session.user.email, session.user.name)
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

    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('Google session bridge error:', err)
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('error', 'GoogleAuth')
    return NextResponse.redirect(loginUrl)
  }
}
